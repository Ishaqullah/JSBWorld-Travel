import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  addToWishlistByEmail,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be valid'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// Routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, updateUserProfile);
router.put('/change-password', authenticate, changePasswordValidation, validate, changePassword);

router.get('/wishlist', authenticate, getUserWishlist);
router.post('/wishlist/:tourId', authenticate, addToWishlist);
router.delete('/wishlist/:tourId', authenticate, removeFromWishlist);
router.post('/wishlist-by-email', addToWishlistByEmail); // Public route for logged-out users

router.get('/notifications', authenticate, getUserNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationAsRead);
router.put('/notifications/read-all', authenticate, markAllNotificationsAsRead);

export default router;
