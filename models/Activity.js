import mongoose from 'mongoose'

const relatedEntitySchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['lead', 'deal'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'email', 'meeting'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  relatedEntity: {
    type: relatedEntitySchema,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date,
    default: null
  }
});

export const Activity = mongoose.model('Activity', activitySchema);
