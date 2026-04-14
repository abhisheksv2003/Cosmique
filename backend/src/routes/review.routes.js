// Review Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { reviewValidation } = require('../middleware/validation.middleware');
const {
  createReview, getProductReviews, deleteReview
} = require('../controllers/review.controller');

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, reviewValidation, createReview);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
