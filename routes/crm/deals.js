import express from 'express';
import { Deal } from '../../models/Deal.js';

const router = express.Router();

router.get('/deals', async (req, res) => {
  try {
    const { stage } = req.query;
    const query = {};

    if (stage) {
      query.pipelineStage = stage;
    }

    const deals = await Deal.find(query);

    return res.status(200).json({
      status_code: 200,
      message: 'Deals fetched successfully',
      data: deals
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Error fetching deals',
      error: error.message
    });
  }
});

export default router;
