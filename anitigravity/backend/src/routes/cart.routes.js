// Cart Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { cartValidation } = require('../middleware/validation.middleware');
const {
  getCart, addToCart, updateCartItem,
  removeFromCart, clearCart
} = require('../controllers/cart.controller');

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/', cartValidation, addToCart);
router.put('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
