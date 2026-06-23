const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Notification = require('../models/Notification');

// All admin routes
router.use(protect);
router.use(authorize('admin'));

// ── Students ──────────────────────────────────────────────────────────────────

// GET all students
router.get('/students', async (req, res) => {
  try {
    const { department, semester, section, search } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (section) filter.section = section;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const students = await Student.find(filter)
      .populate('mentor', 'name email')
      .sort({ rollNumber: 1 });

    res.json({ success: true, count: students.length, data: students });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET single student
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('mentor', 'name email mobile');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST create student + user account
router.post('/students', async (req, res) => {
  try {
    const { rollNumber, name, dateOfBirth, branch, department, semester, section, academicYear, admissionYear, batch, parent, hostelResident } = req.body;

    // Default password = DOB in DDMMYYYY
    const dob = new Date(dateOfBirth);
    const dd = String(dob.getDate()).padStart(2, '0');
    const mm = String(dob.getMonth() + 1).padStart(2, '0');
    const yyyy = dob.getFullYear();
    const defaultPassword = `${dd}${mm}${yyyy}`;

    // Create user account
    const user = await User.create({
      username: rollNumber.toUpperCase(),
      password: defaultPassword,
      role: 'student',
      email: parent?.email || '',
      mobile: parent?.mobile || '',
      isFirstLogin: false,
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      rollNumber,
      name,
      dateOfBirth,
      branch,
      department,
      semester,
      section,
      academicYear,
      admissionYear,
      batch,
      parent,
      hostelResident: hostelResident || false,
    });

    res.status(201).json({ success: true, data: student, message: 'Student created successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PUT update student
router.put('/students/:id', async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Sync DOB with User password if updated
    if (req.body.dateOfBirth) {
      const newDob = new Date(req.body.dateOfBirth);
      const currentDob = new Date(student.dateOfBirth);
      if (newDob.getTime() !== currentDob.getTime()) {
        const dd = String(newDob.getDate()).padStart(2, '0');
        const mm = String(newDob.getMonth() + 1).padStart(2, '0');
        const yyyy = newDob.getFullYear();
        const defaultPassword = `${dd}${mm}${yyyy}`;

        const user = await User.findById(student.user);
        if (user) {
          user.password = defaultPassword;
          await user.save();
        }
      }
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: student });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// DELETE (soft delete) student
router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Student deactivated' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Attendance Management ──────────────────────────────────────────────────────

router.post('/attendance', async (req, res) => {
  try {
    const { studentId, semester, academicYear, subjects } = req.body;
    let record = await Attendance.findOne({ student: studentId, semester, academicYear });
    if (record) {
      record.subjects = subjects;
      await record.save();
    } else {
      record = await Attendance.create({ student: studentId, semester, academicYear, subjects });
    }
    res.json({ success: true, data: record });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Marks Management ──────────────────────────────────────────────────────────

router.post('/marks', async (req, res) => {
  try {
    const { studentId, semester, academicYear, subjects, sgpa, cgpa, totalCredits, earnedCredits, backlogs, resultPublished } = req.body;
    let record = await Marks.findOne({ student: studentId, semester, academicYear });
    if (record) {
      Object.assign(record, req.body);
      await record.save();
    } else {
      record = await Marks.create({ student: studentId, semester, academicYear, subjects, sgpa, cgpa, totalCredits, earnedCredits, backlogs, resultPublished });
    }
    res.json({ success: true, data: record });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Notifications ─────────────────────────────────────────────────────────────

router.post('/notifications', async (req, res) => {
  try {
    const notification = await Notification.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: notification });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).populate('createdBy', 'username');
    res.json({ success: true, data: notifications });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Faculty Management ────────────────────────────────────────────────────────

router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: faculty });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/faculty', async (req, res) => {
  try {
    const { employeeId, name, department, designation, email, mobile } = req.body;

    const user = await User.create({
      username: employeeId.toUpperCase(),
      password: employeeId + '@Faculty1',
      role: 'faculty',
      email,
      mobile,
    });

    const faculty = await Faculty.create({ user: user._id, employeeId, name, department, designation, email, mobile });
    res.status(201).json({ success: true, data: faculty });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Analytics ─────────────────────────────────────────────────────────────────

router.get('/analytics/summary', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalFaculty = await Faculty.countDocuments({ isActive: true });

    const attendanceRecords = await Attendance.find().select('overallPercentage');
    const avgAttendance =
      attendanceRecords.length > 0
        ? Math.round(attendanceRecords.reduce((sum, r) => sum + r.overallPercentage, 0) / attendanceRecords.length)
        : 0;

    const atRisk = await Attendance.countDocuments({ overallPercentage: { $lt: 75 } });

    res.json({
      success: true,
      data: { totalStudents, totalFaculty, avgAttendance, atRiskStudents: atRisk },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
