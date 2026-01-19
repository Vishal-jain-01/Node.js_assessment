import express from 'express';
import { Lead } from '../../models/Lead.js';
import { buildSearchFilter, getPagination } from './utils.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({
        status_code: 400,
        message: 'name and createdBy are required'
      });
    }

    const lead = new Lead(req.body);
    await lead.save();

    return res.status(201).json({
      status_code: 201,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating lead',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {
      ...buildSearchFilter(req.query.search, ['name', 'email', 'company'])
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.source) {
      filter.source = req.query.source;
    }

    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter)
    ]);

    return res.status(200).json({
      status_code: 200,
      message: 'Leads retrieved successfully',
      data: {
        items: leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error retrieving leads',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        status_code: 404,
        message: 'Lead not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Lead retrieved successfully',
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error retrieving lead',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      return res.status(404).json({
        status_code: 404,
        message: 'Lead not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error updating lead',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        status_code: 404,
        message: 'Lead not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error deleting lead',
      error: error.message
    });
  }
});

export default router;
