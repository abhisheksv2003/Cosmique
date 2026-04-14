// Admin Routes
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getDashboardStats, getUsers, getAllOrders,
  updateOrderStatus, getLowStockProducts
} = require('../controllers/admin.controller');

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/products/low-stock', getLowStockProducts);

module.exports = router;
