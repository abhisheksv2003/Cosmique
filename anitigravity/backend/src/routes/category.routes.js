// Category Routes
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getCategories, getCategory, createCategory,
  updateCategory, deleteCategory
} = require('../controllers/category.controller');

router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), createCategory);
router.put('/:id', authenticate, authorize('ADMIN'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

module.exports = router;
