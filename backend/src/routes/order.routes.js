// Order Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { orderValidation } = require('../middleware/validation.middleware');
const {
  createOrder, getOrders, getOrder, cancelOrder
} = require('../controllers/order.controller');

router.use(authenticate);

router.post('/', orderValidation, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
