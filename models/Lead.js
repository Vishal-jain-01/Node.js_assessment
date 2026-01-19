import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'unqualified', 'converted'],
      default: 'new'
    },
    source: {
      type: String,
      enum: ['web', 'referral', 'event', 'cold_call', 'other'],
      default: 'other'
    },
    notes: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ name: 1, email: 1, company: 1 });

export const Lead = mongoose.model('Lead', leadSchema);
