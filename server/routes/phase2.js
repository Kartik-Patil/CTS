const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const Examination = require('../models/Examination');
const Hostel = require('../models/Hostel');
const Placement = require('../models/Placement');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

router.use(protect);
router.use(authorize('student'));

// ── EXAMINATION ────────────────────────────────────────────────────────────────

// GET all exams for student
router.get('/examination', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { examType, semester } = req.query;
    const filter = { student: student._id };
    if (examType) filter.examType = examType;
    if (semester) filter.semester = parseInt(semester);
    else filter.semester = student.semester;

    const exams = await Examination.find(filter).sort({ examType: 1 });
    res.json({ success: true, data: exams });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET specific exam (timetable detail)
router.get('/examination/:id', async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── HOSTEL ─────────────────────────────────────────────────────────────────────

router.get('/hostel', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (!student.hostelResident) {
      return res.json({ success: true, data: null, message: 'Not a hostel resident' });
    }

    const hostel = await Hostel.findOne({ student: student._id });
    res.json({ success: true, data: hostel || null });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── PLACEMENT ──────────────────────────────────────────────────────────────────

router.get('/placement', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const placements = await Placement.find({ student: student._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: placements });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── ANALYTICS ──────────────────────────────────────────────────────────────────

// Full analytics: attendance history + marks history + risk assessment
router.get('/analytics', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // All attendance records
    const attendanceRecords = await Attendance.find({ student: student._id })
      .sort({ semester: 1 })
      .select('semester academicYear overallPercentage subjects');

    // All marks records
    const marksRecords = await Marks.find({ student: student._id, resultPublished: true })
      .sort({ semester: 1 })
      .select('semester academicYear sgpa cgpa backlogs totalCredits earnedCredits');

    // Current attendance for risk analysis
    const currentAttendance = attendanceRecords.find(a => a.semester === student.semester);

    // Risk flags
    const risks = [];
    if (currentAttendance) {
      if (currentAttendance.overallPercentage < 75) {
        risks.push({ type: 'attendance', severity: 'high', message: `Overall attendance at ${currentAttendance.overallPercentage}% — below 75% threshold` });
      }
      const lowSubjects = currentAttendance.subjects?.filter(s => s.percentage < 75) || [];
      lowSubjects.forEach(s => {
        risks.push({ type: 'subject_attendance', severity: s.percentage < 65 ? 'critical' : 'medium', message: `${s.subjectName} attendance at ${s.percentage}%` });
      });
    }
    if (student.backlogs > 0) {
      risks.push({ type: 'backlogs', severity: 'high', message: `${student.backlogs} active backlog(s) pending clearance` });
    }
    if (marksRecords.length >= 2) {
      const last = marksRecords[marksRecords.length - 1];
      const prev = marksRecords[marksRecords.length - 2];
      if (last.sgpa < prev.sgpa - 0.5) {
        risks.push({ type: 'performance_drop', severity: 'medium', message: `SGPA dropped from ${prev.sgpa} to ${last.sgpa} — declining trend` });
      }
    }

    // Attendance trend data
    const attendanceTrend = attendanceRecords.map(a => ({
      semester: `Sem ${a.semester}`,
      overall: a.overallPercentage,
    }));

    // Academic trend data
    const academicTrend = marksRecords.map(m => ({
      semester: `Sem ${m.semester}`,
      sgpa: m.sgpa,
      cgpa: m.cgpa,
      backlogs: m.backlogs,
    }));

    // Subject attendance breakdown (current sem)
    const subjectBreakdown = currentAttendance?.subjects?.map(s => ({
      subject: s.subjectCode,
      name: s.subjectName,
      percentage: s.percentage,
    })) || [];

    res.json({
      success: true,
      data: {
        student: { name: student.name, rollNumber: student.rollNumber, cgpa: student.cgpa, backlogs: student.backlogs },
        risks,
        attendanceTrend,
        academicTrend,
        subjectBreakdown,
        summary: {
          totalSemesters: marksRecords.length,
          bestSgpa: marksRecords.length ? Math.max(...marksRecords.map(m => m.sgpa)) : 0,
          worstSgpa: marksRecords.length ? Math.min(...marksRecords.map(m => m.sgpa)) : 0,
          currentAttendance: currentAttendance?.overallPercentage || 0,
          riskLevel: risks.some(r => r.severity === 'critical') ? 'critical' : risks.some(r => r.severity === 'high') ? 'high' : risks.length > 0 ? 'medium' : 'low',
        },
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
