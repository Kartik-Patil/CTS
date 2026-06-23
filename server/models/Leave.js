const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: {
      type: String,
      enum: ['leave', 'outpass', 'late_arrival', 'event', 'academic'],
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    documentUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'faculty_approved', 'hod_approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    facultyApproval: {
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      approvedAt: { type: Date },
      remarks: { type: String },
    },
    hodApproval: {
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      approvedAt: { type: Date },
      remarks: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
