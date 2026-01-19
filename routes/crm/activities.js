import express from 'express';
import { Activity } from '../../models/Activity.js';

const router = express.Router();

router.post('/activities', async (req, res) => {
  try {
    const { type, dueDate, status, relatedEntity, assignedTo } = req.body;

    if (!type || !dueDate || !relatedEntity || !assignedTo) {
      return res.status(400).json({
        status_code: 400,
        message: 'type, dueDate, relatedEntity, and assignedTo are required'
      });
    }

    const activity = await Activity.create({
      type,
      dueDate,
      status,
      relatedEntity,
      assignedTo
    });

    return res.status(201).json({
      status_code: 201,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating activity',
      error: error.message
    });
  }
});

router.put('/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const activity = await Activity.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!activity) {
      return res.status(404).json({
        status_code: 404,
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error updating activity',
      error: error.message
    });
  }
});

router.post('/activities/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndUpdate(
      id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({
        status_code: 404,
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Activity completed successfully',
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error completing activity',
      error: error.message
    });
  }
});

router.get('/activities', async (req, res) => {
  try {
    const { assignedTo, startDate, endDate } = req.query;
    const query = {};

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) {
        query.dueDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dueDate.$lte = new Date(endDate);
      }
    }

    const activities = await Activity.find(query);

    return res.status(200).json({
      status_code: 200,
      message: 'Activities fetched successfully',
      data: activities
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error fetching activities',
      error: error.message
    });
  }
});

export default router;
