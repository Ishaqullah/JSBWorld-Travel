import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// The Stripe CLI and real webhooks send JSON, but we need the raw body
// for signature verification.
router.post(
  '/', 
  express.raw({ type: 'application/json' }), 
  handleWebhook
);

export default router;
