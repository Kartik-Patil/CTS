const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    category: {
      type: String,
      enum: ['academic', 'hostel', 'technical', 'administrative', 'infrastructure'],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachmentUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'assigned', 'resolved', 'closed'],
      default: 'submitted',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
    },
    escalatedAt: { type: Date, default: null },
    timeline: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate ticket ID
complaintSchema.pre('save', async function () {
  if (!this.ticketId) {
    const count = await mongoose.model('Complaint').countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
