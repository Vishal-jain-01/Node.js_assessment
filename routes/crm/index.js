import express from 'express';
import accountRoutes from './accounts.js';
import contactRoutes from './contacts.js';
import dealRoutes from './deals.js';
import leadRoutes from './leads.js';

const router = express.Router();

router.use('/accounts', accountRoutes);
router.use('/contacts', contactRoutes);
router.use('/deals', dealRoutes);
router.use('/leads', leadRoutes);

export default router;
