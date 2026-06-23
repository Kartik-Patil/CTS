const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Notification = require('../models/Notification');
const Leave = require('../models/Leave');

// @desc    Get dashboard summary for logged-in student
// @route   GET /api/students/dashboard
// @access  Private (student)
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('mentor', 'name email mobile designation department');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Latest attendance
    const attendance = await Attendance.findOne({
      student: student._id,
      semester: student.semester,
      academicYear: student.academicYear,
    });

    // Latest marks
    const marks = await Marks.findOne({
      student: student._id,
      semester: student.semester,
      academicYear: student.academicYear,
    });

    // Active leave requests
    const activeLeaves = await Leave.countDocuments({
      student: student._id,
      status: { $in: ['pending', 'faculty_approved'] },
    });

    // Recent notifications (last 5)
    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'department', department: student.department },
        { targetAudience: 'semester', semester: student.semester },
        { targetAudience: 'student', targetStudents: student._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type priority createdAt');

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          branch: student.branch,
          department: student.department,
          semester: student.semester,
          section: student.section,
          academicYear: student.academicYear,
          batch: student.batch,
          photograph: student.photograph,
          hostelResident: student.hostelResident,
          cgpa: student.cgpa,
          currentSgpa: student.currentSgpa,
          backlogs: student.backlogs,
          parent: student.parent,
          mentor: student.mentor,
        },
        quickStats: {
          overallAttendance: attendance?.overallPercentage || 0,
          subjectsBelowThreshold: attendance?.subjects?.filter((s) => s.percentage < 75).length || 0,
          currentSgpa: marks?.sgpa || student.currentSgpa || 0,
          cgpa: marks?.cgpa || student.cgpa || 0,
          backlogs: marks?.backlogs || student.backlogs || 0,
          activeLeaves,
          pendingNotifications: notifications.length,
        },
        recentNotifications: notifications,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (student)
const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('mentor', 'name email mobile designation department');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get attendance for student
// @route   GET /api/students/attendance
// @access  Private (student)
const getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { semester, academicYear } = req.query;

    const query = {
      student: student._id,
      semester: semester ? parseInt(semester) : student.semester,
      academicYear: academicYear || student.academicYear,
    };

    const attendance = await Attendance.findOne(query);

    res.status(200).json({ success: true, data: attendance || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get marks for student
// @route   GET /api/students/marks
// @access  Private (student)
const getMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { semester, academicYear } = req.query;

    const query = {
      student: student._id,
      semester: semester ? parseInt(semester) : student.semester,
      academicYear: academicYear || student.academicYear,
    };

    const marks = await Marks.findOne(query);

    res.status(200).json({ success: true, data: marks || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all semesters marks history (for CGPA chart)
// @route   GET /api/students/marks/history
// @access  Private (student)
const getMarksHistory = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const history = await Marks.find({ student: student._id, resultPublished: true })
      .sort({ semester: 1 })
      .select('semester academicYear sgpa cgpa backlogs totalCredits earnedCredits');

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get notifications for student
// @route   GET /api/students/notifications
// @access  Private (student)
const getNotifications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'department', department: student.department },
        { targetAudience: 'semester', semester: student.semester },
        { targetAudience: 'student', targetStudents: student._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('createdBy', 'username');

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get leave history for student
// @route   GET /api/students/leaves
// @access  Private (student)
const getLeaves = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const leaves = await Leave.find({ student: student._id })
      .sort({ createdAt: -1 })
      .populate('facultyApproval.approvedBy', 'username')
      .populate('hodApproval.approvedBy', 'username');

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit leave request
// @route   POST /api/students/leaves
// @access  Private (student)
const submitLeave = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { type, fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      student: student._id,
      type,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({ success: true, data: leave, message: 'Leave request submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get complaints for student
// @route   GET /api/students/complaints
// @access  Private (student)
const getComplaints = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const Complaint = require('../models/Complaint');
    const complaints = await Complaint.find({ student: student._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit complaint
// @route   POST /api/students/complaints
// @access  Private (student)
const submitComplaint = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { category, subject, description } = req.body;
    const Complaint = require('../models/Complaint');

    const complaint = await Complaint.create({
      student: student._id,
      category,
      subject,
      description,
      timeline: [{ status: 'submitted', note: 'Complaint submitted by student' }],
    });

    res.status(201).json({ success: true, data: complaint, message: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  getAttendance,
  getMarks,
  getMarksHistory,
  getNotifications,
  getLeaves,
  submitLeave,
  getComplaints,
  submitComplaint,
};
