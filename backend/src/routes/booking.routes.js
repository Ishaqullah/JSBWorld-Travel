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
  body('tourDateId').trim().notEmpty().withMessage('Tour date ID is required'),
  body('numberOfTravelers')
    .isInt({ min: 1 })
    .withMessage('Number of travelers must be at least 1'),
  body('travelers').isArray().withMessage('Travelers information is required'),
  body('travelers.*.fullName').trim().notEmpty().withMessage('Traveler full name is required'),
  body('travelers.*.age').isInt({ min: 1 }).withMessage('Traveler age must be valid'),
];

// Routes
router.post('/', authenticate, createBookingValidation, validate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/status', authenticate, authorize('ADMIN'), updateBookingStatus);

export default router;
