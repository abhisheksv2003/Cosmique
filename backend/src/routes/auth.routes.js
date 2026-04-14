// Auth Routes
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { registerValidation, loginValidation, addressValidation } = require('../middleware/validation.middleware');
const {
  register, login, refreshAccessToken, getProfile,
  updateProfile, changePassword, logout,
  addAddress, getAddresses, deleteAddress
} = require('../controllers/auth.controller');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', authenticate, logout);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addressValidation, addAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);

module.exports = router;
