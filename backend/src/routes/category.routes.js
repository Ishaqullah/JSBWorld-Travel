import express from 'express';
import { body } from 'express-validator';
import {
  getAllCategories,
  createCategory,
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('icon').trim().notEmpty().withMessage('Icon is required'),
];

// Routes
router.get('/', getAllCategories);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createCategoryValidation,
  validate,
  createCategory
);

export default router;
