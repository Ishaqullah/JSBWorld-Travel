import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  getAdminTours,
  getAdminTourById,
  createAdminTour,
  updateAdminTour,
  deleteAdminTour,
  getTourDates,
  createTourDate,
  updateTourDate,
  deleteTourDate,
  updateTourItinerary,
  deleteTourItineraryItem,
  updateTourImages,
  updateTourHighlights,
  updateTourInclusions,
  updateTourAddOns,
  updateTourCategories,
  updateTourRoomTypes,
  updateTourAccommodations,
  updateTourNotes,
  updateTourPriceIncludes,
  updateTourActivities,
  getAllBookings,
  getAdminDashboardStats,
  getPendingBankTransfers,
  approveBankTransfer,
  rejectBankTransfer,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard stats
router.get('/dashboard/stats', getAdminDashboardStats);

// ========== Bookings Routes ==========
router.get('/bookings', getAllBookings);

// Tour validation rules
const tourValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('categoryId').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('maxGroupSize').isInt({ min: 1 }).withMessage('Max group size must be at least 1'),
  body('difficulty').isIn(['EASY', 'MODERATE', 'CHALLENGING']).withMessage('Invalid difficulty level'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// Tour date validation
const tourDateValidation = [
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('priceWithoutFlight').isFloat({ min: 0 }).withMessage('Price without flight is required'),
  body('priceWithFlight').isFloat({ min: 0 }).withMessage('Price with flight is required'),
  body('childPriceWithout').isFloat({ min: 0 }).withMessage('Child price without flight is required'),
  body('childPriceWithFlight').isFloat({ min: 0 }).withMessage('Child price with flight is required'),
  body('availableSlots').isInt({ min: 1 }).withMessage('Available slots must be at least 1'),
];

// ========== Tour Routes ==========
router.get('/tours', getAdminTours);
router.get('/tours/:id', getAdminTourById);
router.post('/tours', tourValidation, validate, createAdminTour);
router.put('/tours/:id', updateAdminTour);
router.delete('/tours/:id', deleteAdminTour);

// ========== Tour Dates Routes ==========
router.get('/tours/:tourId/dates', getTourDates);
router.post('/tours/:tourId/dates', tourDateValidation, validate, createTourDate);
router.put('/tour-dates/:id', updateTourDate);
router.delete('/tour-dates/:id', deleteTourDate);

// ========== Tour Itinerary Routes ==========
router.put('/tours/:tourId/itinerary', updateTourItinerary);
router.delete('/tour-itinerary/:id', deleteTourItineraryItem);

// ========== Tour Images Routes ==========
router.put('/tours/:tourId/images', updateTourImages);

// ========== Tour Highlights Routes ==========
router.put('/tours/:tourId/highlights', updateTourHighlights);

// ========== Tour Inclusions Routes ==========
router.put('/tours/:tourId/inclusions', updateTourInclusions);

// ========== Tour Add-ons Routes ==========
router.put('/tours/:tourId/addons', updateTourAddOns);

// ========== Tour Notes, Price Includes & Activities ==========
router.put('/tours/:tourId/notes', updateTourNotes);
router.put('/tours/:tourId/price-includes', updateTourPriceIncludes);
router.put('/tours/:tourId/activities', updateTourActivities);

// ========== Tour Categories & Accommodations ==========
router.put('/tours/:tourId/categories', updateTourCategories);
router.put('/tours/:tourId/room-types', updateTourRoomTypes);
router.put('/tours/:tourId/accommodations', updateTourAccommodations);

// ========== Bank Transfer Payment Management ==========
router.get('/payments/pending-transfers', getPendingBankTransfers);
router.post('/payments/:id/approve', approveBankTransfer);
router.post('/payments/:id/reject', rejectBankTransfer);

export default router;
