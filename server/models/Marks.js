const mongoose = require('mongoose');

const subjectMarksSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  credits: { type: Number, default: 0 },
  ia1: { type: Number, default: null },
  ia2: { type: Number, default: null },
  ia3: { type: Number, default: null },
  totalInternal: { type: Number, default: 0 },
  assignment: { type: Number, default: null },
  labMarks: { type: Number, default: null },
  externalMarks: { type: Number, default: null },
  totalMarks: { type: Number, default: null },
  grade: { type: String, default: null },
  gradePoints: { type: Number, default: 0 },
  result: { type: String, enum: ['pass', 'fail', 'pending', 'absent'], default: 'pending' },
  facultyRemarks: { type: String, default: '' },
});

const marksSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    subjects: [subjectMarksSchema],
    sgpa: { type: Number, default: 0 },
    cgpa: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    earnedCredits: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },
    resultPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Marks', marksSchema);
