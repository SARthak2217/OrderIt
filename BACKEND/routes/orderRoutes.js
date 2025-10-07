import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getOrderStats,
  testOrderProgression,
  getProgressionStatus
} from '../controllers/orderController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for testing
router.get('/progression-status', getProgressionStatus);

// Protected routes
router.use(isAuthenticated);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);
router.delete('/:id', isAdmin, deleteOrder);
router.get('/admin/stats', isAdmin, getOrderStats);

// Test route for manual progression (development only)
router.post('/:id/test-progress', isAdmin, testOrderProgression);

export default router;
