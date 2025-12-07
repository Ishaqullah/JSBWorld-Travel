import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const createTourValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('categoryId').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('maxGroupSize').isInt({ min: 1 }).withMessage('Max group size must be at least 1'),
  body('difficulty').isIn(['EASY', 'MODERATE', 'CHALLENGING']).withMessage('Invalid difficulty level'),
  body('featuredImage').isURL().withMessage('Featured image must be a valid URL'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// Routes
router.get('/', getAllTours);
router.get('/:identifier', getTourById);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createTourValidation,
  validate,
  createTour
);
router.put('/:id', authenticate, authorize('ADMIN'), updateTour);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTour);

export default router;
