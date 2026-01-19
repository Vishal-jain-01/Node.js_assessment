import express from 'express';
import { Account } from '../../models/Account.js';
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

    const account = new Account(req.body);
    await account.save();

    return res.status(201).json({
      status_code: 201,
      message: 'Account created successfully',
      data: account
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating account',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {
      ...buildSearchFilter(req.query.search, ['name', 'industry', 'website'])
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const [accounts, total] = await Promise.all([
      Account.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Account.countDocuments(filter)
    ]);

    return res.status(200).json({
      status_code: 200,
      message: 'Accounts retrieved successfully',
      data: {
        items: accounts,
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
      message: 'Error retrieving accounts',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        status_code: 404,
        message: 'Account not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Account retrieved successfully',
      data: account
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error retrieving account',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!account) {
      return res.status(404).json({
        status_code: 404,
        message: 'Account not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Account updated successfully',
      data: account
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error updating account',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).json({
        status_code: 404,
        message: 'Account not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

export default router;
