import express from 'express';
import { body } from 'express-validator';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentById,
  processRefund,
  createBankTransferInvoice,
  submitBankTransfer,
  getBankDetails,
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadSingleToMemory } from '../middleware/upload.middleware.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const createPaymentIntentValidation = [
  body('bookingId').trim().notEmpty().withMessage('Booking ID is required'),
];

const confirmPaymentValidation = [
  body('paymentIntentId').trim().notEmpty().withMessage('Payment Intent ID is required'),
  body('bookingId').trim().notEmpty().withMessage('Booking ID is required'),
];

// Routes
router.post(
  '/create-intent',
  authenticate,
  createPaymentIntentValidation,
  validate,
  createPaymentIntent
);
router.post('/confirm', authenticate, confirmPaymentValidation, validate, confirmPayment);
router.post(
  '/create-bank-transfer',
  authenticate,
  createPaymentIntentValidation,
  validate,
  createBankTransferInvoice
);

// Bank transfer with receipt upload
router.get('/bank-details', authenticate, getBankDetails);
router.post(
  '/bank-transfer',
  authenticate,
  uploadSingleToMemory('receipt'),
  submitBankTransfer
);

router.get('/:id', authenticate, getPaymentById);
router.post('/:id/refund', authenticate, authorize('ADMIN'), processRefund);

export default router;

