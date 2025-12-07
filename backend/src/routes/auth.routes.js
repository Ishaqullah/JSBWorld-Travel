import express from 'express';
import { body } from 'express-validator';
import {
  signup,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

export default router;
