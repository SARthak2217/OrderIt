import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getRecentOrders,
  getTopProducts,
  getSalesData
} from '../controllers/adminController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(isAuthenticated, isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/orders/recent', getRecentOrders);
router.get('/products/top', getTopProducts);
router.get('/sales', getSalesData);

export default router;
