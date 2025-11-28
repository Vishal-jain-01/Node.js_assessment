import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  register_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ register_at: 1 });

export const User = mongoose.model("User", userSchema);
