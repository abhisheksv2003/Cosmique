// Input Validation Middleware
const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName').trim().notEmpty().withMessage('First name required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name required').isLength({ max: 50 }),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  validate
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate
];

// Product validations
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('categoryId').notEmpty().withMessage('Category required'),
  body('sku').trim().notEmpty().withMessage('SKU required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  validate
];

// Review validation
const reviewValidation = [
  body('productId').notEmpty().withMessage('Product ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
  validate
];

// Cart validation
const cartValidation = [
  body('productId').notEmpty().withMessage('Product ID required'),
  body('quantity').optional().isInt({ min: 1, max: 10 }).withMessage('Quantity must be 1-10'),
  validate
];

// Order validation
const orderValidation = [
  body('addressId').notEmpty().withMessage('Address required'),
  body('paymentMethod').optional().isString(),
  validate
];

// Address validation
const addressValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name required'),
  body('phone').notEmpty().withMessage('Phone required'),
  body('street').trim().notEmpty().withMessage('Street address required'),
  body('city').trim().notEmpty().withMessage('City required'),
  body('state').trim().notEmpty().withMessage('State required'),
  body('zipCode').trim().notEmpty().withMessage('ZIP code required'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  reviewValidation,
  cartValidation,
  orderValidation,
  addressValidation
};
