// Payment Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  createPaymentIntent, confirmPayment, handleWebhook
} = require('../controllers/payment.controller');

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/confirm', authenticate, confirmPayment);

// Stripe webhook (raw body needed)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
