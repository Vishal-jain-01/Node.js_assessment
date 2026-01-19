import express from 'express';
import { Contact } from '../../models/Contact.js';
import { buildSearchFilter, getPagination } from './utils.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, createdBy } = req.body;

    if (!firstName || !lastName || !createdBy) {
      return res.status(400).json({
        status_code: 400,
        message: 'firstName, lastName, and createdBy are required'
      });
    }

    const contact = new Contact(req.body);
    await contact.save();

    return res.status(201).json({
      status_code: 201,
      message: 'Contact created successfully',
      data: contact
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error creating contact',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {
      ...buildSearchFilter(req.query.search, ['firstName', 'lastName', 'email', 'title'])
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.account) {
      filter.account = req.query.account;
    }

    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter)
    ]);

    return res.status(200).json({
      status_code: 200,
      message: 'Contacts retrieved successfully',
      data: {
        items: contacts,
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
      message: 'Error retrieving contacts',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status_code: 404,
        message: 'Contact not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Contact retrieved successfully',
      data: contact
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error retrieving contact',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!contact) {
      return res.status(404).json({
        status_code: 404,
        message: 'Contact not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error updating contact',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status_code: 404,
        message: 'Contact not found'
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

export default router;
