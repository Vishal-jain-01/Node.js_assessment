import mongoose from 'mongoose'

const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pipelineStage: {
    type: String,
    required: true
  },
  expectedCloseDate: {
    type: Date,
    default: null
  },
  amount: {
    type: Number,
    default: 0
  }
});

export const Deal = mongoose.model('Deal', dealSchema);
