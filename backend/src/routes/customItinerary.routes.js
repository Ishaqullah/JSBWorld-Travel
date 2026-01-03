import express from 'express';
import {
  createCustomItinerary,
  getCustomItineraries,
  getCustomItineraryById,
  updateItineraryStatus,
} from '../controllers/customItineraryController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - create custom itinerary request (no login required)
router.post('/', createCustomItinerary);

// Admin routes - require authentication
router.get('/', authenticate, authorize('ADMIN'), getCustomItineraries);
router.get('/:id', authenticate, authorize('ADMIN'), getCustomItineraryById);
router.put('/:id', authenticate, authorize('ADMIN'), updateItineraryStatus);

export default router;
