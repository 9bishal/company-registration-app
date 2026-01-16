const {body, validationResult}=require('express-validator');//import express-validator

// Registration validation rules
exports.validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('full_name').notEmpty().trim().withMessage('Full name is required'),
  body('gender').isIn(['M', 'F']).withMessage('Gender must be M or F'),
  body('mobile_no').notEmpty().withMessage('Mobile number is required')
];

// Login validation rules
exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Company profile validation
exports.validateCompanyProfile = [
  body('company_name').notEmpty().withMessage('Company name is required'),
  body('about_company').optional().isString(),
  body('industry_type').optional().isString(),
  body('team_size').optional().isString(),
  body('company_website').optional().isURL().withMessage('Invalid website URL')
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};