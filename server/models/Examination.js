const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    examType: {
      type: String,
      enum: ['internal', 'semester', 'practical', 'supplementary'],
      required: true,
    },
    timetable: [
      {
        subjectCode: String,
        subjectName: String,
        date: Date,
        time: String,
        venue: String,
        duration: String,
      },
    ],
    hallTicketUrl: { type: String, default: null },
    hallTicketIssued: { type: Boolean, default: false },
    revaluation: [
      {
        subjectCode: String,
        applicationDate: Date,
        status: { type: String, enum: ['applied', 'under_review', 'completed'], default: 'applied' },
        originalMarks: Number,
        revisedMarks: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Examination', examinationSchema);
