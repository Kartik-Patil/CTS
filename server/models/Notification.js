const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['announcement', 'circular', 'department', 'emergency', 'ptm', 'mentor'],
      default: 'announcement',
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    targetAudience: {
      type: String,
      enum: ['all', 'department', 'semester', 'student'],
      default: 'all',
    },
    department: { type: String, default: null },
    semester: { type: Number, default: null },
    targetStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachmentUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    scheduledAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
