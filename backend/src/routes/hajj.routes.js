import express from 'express';
import { createHajjRegistration } from '../controllers/hajjController.js';

const router = express.Router();

// @route   POST /api/hajj-registration
// @desc    Submit hajj pre-registration
// @access  Public
router.post('/', createHajjRegistration);

export default router;
