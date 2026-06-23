const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    designation: { type: String },
    email: { type: String, trim: true, lowercase: true },
    mobile: { type: String, trim: true },
    subjects: [{ type: String }], // subject codes they teach
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
