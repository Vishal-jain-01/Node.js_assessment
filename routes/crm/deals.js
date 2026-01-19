import express from 'express';
import { Deal } from '../../models/Deal.js';
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

    const deal = new Deal(req.body);
    await deal.save();

    return res.status(201).json({
      status_code: 201,
      message: 'Deal created successfully',
      data: deal
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating deal',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {
      ...buildSearchFilter(req.query.search, ['name'])
    };

    if (req.query.stage) {
      filter.stage = req.query.stage;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.account) {
      filter.account = req.query.account;
    }

    if (req.query.contact) {
      filter.contact = req.query.contact;
    }

    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const [deals, total] = await Promise.all([
      Deal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Deal.countDocuments(filter)
    ]);

    return res.status(200).json({
      status_code: 200,
      message: 'Deals retrieved successfully',
      data: {
        items: deals,
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
      message: 'Error retrieving deals',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Deal not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Deal retrieved successfully',
      data: deal
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error retrieving deal',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!deal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Deal not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Deal updated successfully',
      data: deal
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error updating deal',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Deal not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error deleting deal',
      error: error.message
    });
  }
});

export default router;
