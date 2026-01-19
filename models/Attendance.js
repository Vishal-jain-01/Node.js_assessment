import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema(
  {
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clockInAt: {
    type: Date,
    required: true
  },
  clockOutAt: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: null
  },
  workDate: {
    type: Date,
    required: true
  },
  location: {
    type: locationSchema,
    default: () => ({})
  }
});

attendanceSchema.index({ userId: 1, workDate: 1 });

attendanceSchema.pre('validate', function setWorkDate(next) {
  if (this.clockInAt) {
    const workDate = new Date(this.clockInAt);
    workDate.setHours(0, 0, 0, 0);
    this.workDate = workDate;
  }
  next();
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);
