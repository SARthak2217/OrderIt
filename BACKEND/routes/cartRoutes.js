import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} from '../controllers/cartController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(isAuthenticated);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:productId', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/coupon/apply', applyCoupon);
router.delete('/coupon/remove/:couponId', removeCoupon);

export default router;
