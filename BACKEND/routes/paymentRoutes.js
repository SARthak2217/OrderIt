import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  checkPaymentConfig
} from '../controllers/paymentController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Debug route (no auth required)
router.get('/config', checkPaymentConfig);

// All payment routes require authentication
router.use(isAuthenticated);

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);
router.get('/:paymentId', getPaymentDetails);

export default router;
