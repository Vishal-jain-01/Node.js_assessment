import express from 'express';
import authenticate from '../middleware/auth.js';
import { Attendance } from '../models/Attendance.js';

const router = express.Router();

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeStartOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const normalizeEndOfDay = (date) => {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
};

router.post('/clock-in', authenticate, async (req, res) => {
  try {
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      clockOutAt: null
    });

    if (existingAttendance) {
      return res.status(400).json({
        status_code: 400,
        message: 'User is already clocked in'
      });
    }

    const { address, latitude, longitude, metadata } = req.body || {};

    const attendance = new Attendance({
      userId: req.user._id,
      clockInAt: new Date(),
      location: {
        address: address || '',
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        metadata: metadata ?? null
      }
    });

    await attendance.save();

    return res.status(200).json({
      status_code: 200,
      message: 'Clock-in recorded successfully',
      data: {
        id: attendance._id,
        clockInAt: attendance.clockInAt.toISOString(),
        workDate: attendance.workDate.toISOString(),
        location: attendance.location
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error recording clock-in',
      error: error.message
    });
  }
});

router.post('/clock-out', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      clockOutAt: null
    });

    if (!attendance) {
      return res.status(400).json({
        status_code: 400,
        message: 'No active clock-in found'
      });
    }

    const clockOutAt = new Date();
    const durationMinutes = Math.max(
      0,
      Math.round((clockOutAt.getTime() - attendance.clockInAt.getTime()) / 60000)
    );

    attendance.clockOutAt = clockOutAt;
    attendance.duration = durationMinutes;

    await attendance.save();

    return res.status(200).json({
      status_code: 200,
      message: 'Clock-out recorded successfully',
      data: {
        id: attendance._id,
        clockInAt: attendance.clockInAt.toISOString(),
        clockOutAt: attendance.clockOutAt.toISOString(),
        duration: attendance.duration,
        workDate: attendance.workDate.toISOString(),
        location: attendance.location
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error recording clock-out',
      error: error.message
    });
  }
});

router.get('/attendance', authenticate, async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { userId: req.user._id };

    if (from || to) {
      const fromDate = from ? parseDate(from) : null;
      const toDate = to ? parseDate(to) : null;

      if ((from && !fromDate) || (to && !toDate)) {
        return res.status(400).json({
          status_code: 400,
          message: 'Invalid from or to date format'
        });
      }

      query.workDate = {};
      if (fromDate) {
        query.workDate.$gte = normalizeStartOfDay(fromDate);
      }
      if (toDate) {
        query.workDate.$lte = normalizeEndOfDay(toDate);
      }
    }

    const records = await Attendance.find(query)
      .sort({ clockInAt: -1 })
      .lean();

    return res.status(200).json({
      status_code: 200,
      message: 'Attendance records fetched successfully',
      data: records.map((record) => ({
        id: record._id,
        clockInAt: record.clockInAt?.toISOString() || null,
        clockOutAt: record.clockOutAt?.toISOString() || null,
        duration: record.duration,
        workDate: record.workDate?.toISOString() || null,
        location: record.location || {}
      }))
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
});

export default router;
