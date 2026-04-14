// Product Routes
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { productValidation } = require('../middleware/validation.middleware');
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getFeaturedProducts
} = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), productValidation, createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

module.exports = router;
