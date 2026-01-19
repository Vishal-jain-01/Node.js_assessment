import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['prospect', 'active', 'inactive'],
      default: 'prospect'
    },
    description: {
      type: String,
      default: ''
    },
    billingAddress: {
      type: String,
      default: ''
    },
    shippingAddress: {
      type: String,
      default: ''
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

accountSchema.index({ name: 1, industry: 1 });

export const Account = mongoose.model('Account', accountSchema);
