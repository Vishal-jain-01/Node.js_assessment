import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  status: {
    type: String,
    enum: ['received', 'queued', 'sent', 'delivered', 'failed'],
    required: true
  },
  provider: {
    type: String,
    enum: ['cloud', 'twilio'],
    required: true
  },
  providerMessageId: {
    type: String,
    default: ''
  },
  from: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['lead', 'contact']
    },
    entityId: {
      type: String,
      default: ''
    }
  },
  rawPayload: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const Message = mongoose.model('Message', messageSchema);
