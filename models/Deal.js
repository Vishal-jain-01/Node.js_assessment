import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      default: 0
    },
    stage: {
      type: String,
      enum: [
        'prospecting',
        'qualification',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost'
      ],
      default: 'prospecting'
    },
    status: {
      type: String,
      enum: ['open', 'won', 'lost'],
      default: 'open'
    },
    expectedCloseDate: {
      type: Date
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
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

dealSchema.index({ name: 1, stage: 1 });

export const Deal = mongoose.model('Deal', dealSchema);
