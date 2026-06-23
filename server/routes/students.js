const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/studentController');

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/attendance', getAttendance);
router.get('/marks', getMarks);
router.get('/marks/history', getMarksHistory);
router.get('/notifications', getNotifications);
router.get('/leaves', getLeaves);
router.post('/leaves', submitLeave);
router.get('/complaints', getComplaints);
router.post('/complaints', submitComplaint);

module.exports = router;
