import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  addReview,
  getProductReviews,
  deleteReview
} from '../controllers/productController.js';
import { isAuthenticated, isAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', optionalAuth, getProductsByCategory);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.use(isAuthenticated);
router.post('/:id/reviews', addReview);
router.delete('/:productId/reviews/:reviewId', deleteReview);

// Admin routes
router.post('/', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

export default router;
