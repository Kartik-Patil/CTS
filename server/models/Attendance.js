const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'od', 'medical'], default: 'absent' },
  type: { type: String, enum: ['lecture', 'lab', 'tutorial'], default: 'lecture' },
});

const subjectAttendanceSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  records: [attendanceRecordSchema],
});

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    subjects: [subjectAttendanceSchema],
    overallPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate overall percentage
attendanceSchema.pre('save', function () {
  if (this.subjects && this.subjects.length > 0) {
    this.subjects.forEach((sub) => {
      sub.percentage =
        sub.totalClasses > 0
          ? Math.round((sub.attendedClasses / sub.totalClasses) * 100)
          : 0;
    });
    const total = this.subjects.reduce((sum, s) => sum + s.percentage, 0);
    this.overallPercentage = Math.round(total / this.subjects.length);
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
