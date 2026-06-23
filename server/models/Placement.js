const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    type: { type: String, enum: ['placement', 'internship'], default: 'placement' },
    package: { type: String }, // e.g. "6.5 LPA"
    applicationStatus: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'on_hold'],
      default: 'applied',
    },
    interviewDate: { type: Date, default: null },
    interviewVenue: { type: String, default: null },
    interviewRound: { type: String, default: null },
    offerLetterUrl: { type: String, default: null },
    joiningDate: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
