import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const createBookingValidation = [
  body('tourId').trim().notEmpty().withMessage('Tour ID is required'),
  body('tourDateId').optional(),
  body('startDate').optional(),
  body('numberOfTravelers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Number of travelers must be at least 1'),
  body('travelers').optional().isArray().withMessage('Travelers must be an array'),
];

// Routes
router.post('/', authenticate, createBookingValidation, validate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/status', authenticate, authorize('ADMIN'), updateBookingStatus);

export default router;
