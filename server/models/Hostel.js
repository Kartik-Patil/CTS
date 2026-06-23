const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    hostelName: { type: String, required: true },
    blockName: { type: String },
    roomNumber: { type: String, required: true },
    bedNumber: { type: String },
    messPlan: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'veg' },
    wardenName: { type: String },
    wardenMobile: { type: String },
    allottedFrom: { type: Date },
    allottedTo: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hostel', hostelSchema);
