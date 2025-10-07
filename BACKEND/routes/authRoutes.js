import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile, 
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.use(isAuthenticated);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

export default router;
