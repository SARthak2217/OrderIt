import express from 'express';
import { getProgressionStatus, createTestOrder } from '../controllers/orderController.js';

const router = express.Router();

// Public test routes
router.get('/progression-status', getProgressionStatus);
router.post('/create-test-order', createTestOrder);

export default router;
