import express from "express";
const router = express.Router();
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js'
import authenticate from '../middleware/auth.js'
import calculateDistance from '../utils/distance.js';
import bcrypt from "bcrypt";

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, latitude, longitude } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status_code: 400,
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status_code: 400,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { 
        email: email,
        name: name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address: address || '',
      latitude: latitude || null,
      longitude: longitude || null,
      status: 'active',
      token
    });

    await user.save();

    return res.status(200).json({
      status_code: 200,
      message: 'User created successfully',
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        latitude: user.latitude ? user.latitude.toString() : '',
        longitude: user.longitude ? user.longitude.toString() : '',
        status: user.status,
        register_at: user.register_at.toISOString(),
        token: user.token
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating user',
      error: error.message
    });
  }
});

router.post('/users/toggle-status', authenticate, async (req, res) => {
  try {
    await User.updateMany(
      {},
      [
        {
          $set: {
            status: {
              $cond: {
                if: { $eq: ['$status', 'active'] },
                then: 'inactive',
                else: 'active'
              }
            }
          }
        }
      ]
    );

    return res.status(200).json({
      status_code: 200,
      message: 'All user statuses toggled successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error toggling user statuses',
      error: error.message
    });
  }
});

router.get('/distance', authenticate, async (req, res) => {
  try {
    const { destination_lat, destination_lon } = req.query;

    if (!destination_lat || !destination_lon) {
      return res.status(400).json({
        status_code: 400,
        message: 'destination_lat and destination_lon are required'
      });
    }

    const destLat = parseFloat(destination_lat);
    const destLon = parseFloat(destination_lon);

    if (isNaN(destLat) || isNaN(destLon)) {
      return res.status(400).json({
        status_code: 400,
        message: 'Invalid latitude or longitude format'
      });
    }

    if (!req.user.latitude || !req.user.longitude) {
      return res.status(400).json({
        status_code: 400,
        message: 'User location not set'
      });
    }

    const distance = calculateDistance(
      req.user.latitude,
      req.user.longitude,
      destLat,
      destLon
    );

    return res.status(200).json({
      status_code: 200,
      message: 'Distance calculated successfully',
      distance: `${distance.toFixed(2)}km`
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error calculating distance',
      error: error.message
    });
  }
});

router.get('/users/listing', authenticate, async (req, res) => {
  try {
    const { week_numbers } = req.query;

    if (!week_numbers) {
      return res.status(400).json({
        status_code: 400,
        message: 'week_numbers parameter is required (e.g., 0,1,3)'
      });
    }

    const weekNums = week_numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (weekNums.length === 0) {
      return res.status(400).json({
        status_code: 400,
        message: 'Invalid week_numbers format'
      });
    }

    if (weekNums.some(n => n < 0 || n > 6)) {
      return res.status(400).json({
        status_code: 400,
        message: 'Week numbers must be between 0 (Sunday) and 6 (Saturday)'
      });
    }

    const weekdayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };

    const users = await User.aggregate([
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$register_at' }
        }
      },
      {
        $match: {
          dayOfWeek: { $in: weekNums.map(n => n === 0 ? 1 : n + 1) }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          dayOfWeek: 1
        }
      }
    ]);

    const dataMap = new Map();
    weekNums.forEach(num => {
      dataMap.set(weekdayMap[num], []);
    });

    users.forEach(user => {
      const weekNum = user.dayOfWeek === 1 ? 0 : user.dayOfWeek - 1;
      const dayName = weekdayMap[weekNum];
      
      if (dataMap.has(dayName)) {
        dataMap.get(dayName).push({
          name: user.name,
          email: user.email
        });
      }
    });

    const data = Object.fromEntries(dataMap);

    return res.status(200).json({
      status_code: 200,
      message: 'Users listed by weekdays',
      data
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error fetching user listing',
      error: error.message
    });
  }
});
export default router;
