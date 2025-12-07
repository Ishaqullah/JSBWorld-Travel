import express from 'express';
import { body } from 'express-validator';
import {
  createReview,
  getTourReviews,
  updateReview,
  deleteReview,
  approveReview,
  markReviewHelpful,
} from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const createReviewValidation = [
  body('tourId').trim().notEmpty().withMessage('Tour ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];

const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
];

// Routes
router.post('/', authenticate, createReviewValidation, validate, createReview);
router.get('/tour/:tourId', getTourReviews);
router.put('/:id', authenticate, updateReviewValidation, validate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.put('/:id/approve', authenticate, authorize('ADMIN'), approveReview);
router.post('/:id/helpful', authenticate, markReviewHelpful);

export default router;
