import express from 'express';
import {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons
} from '../controllers/couponController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveCoupons);
router.post('/validate', isAuthenticated, validateCoupon);

// Admin routes
router.use(isAuthenticated, isAdmin);
router.get('/', getAllCoupons);
router.get('/:id', getCoupon);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
