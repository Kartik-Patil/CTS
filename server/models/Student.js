const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rollNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    photograph: { type: String, default: '' }, // URL or base64
    branch: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    section: { type: String, required: true },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    admissionYear: { type: Number, required: true },
    batch: { type: String }, // e.g. "2022-2026"
    hostelResident: { type: Boolean, default: false },

    // Parent Info
    parent: {
      fatherName: { type: String, trim: true },
      motherName: { type: String, trim: true },
      mobile: { type: String, trim: true },
      alternateMobile: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
      occupation: { type: String, trim: true },
    },

    // Mentor
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },

    // Academic summary
    cgpa: { type: Number, default: 0 },
    currentSgpa: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
