const express=require('express');
const router=express.Router();
const authController=require('../controllers/authControlers');
const forgetPasswordController = require('../controllers/forgetPasswordController');
const authMiddleware=require('../middleware/authMiddleware'); //authMiddleware → JWT authentication (protects routes)
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validationMiddleware');


// Public routes
router.post('/register', validateRegister, handleValidationErrors, authController.register); //register → Register new user
router.post('/login', validateLogin, handleValidationErrors, authController.login); //login → Login existing user
router.post('/verify-mobile', authMiddleware, authController.verifyMobile); //verify-mobile → Verify mobile number (protected)
router.post('/resend-otp', authMiddleware, authController.resendOtp); //resend-otp → Resend verification code (protected)

// Password reset routes
router.post('/forgot-password', forgetPasswordController.requestPasswordReset); // Request password reset
router.post('/reset-password', forgetPasswordController.resetPassword); // Reset password with token
router.post('/verify-reset-token', forgetPasswordController.verifyResetToken); // Verify if token is valid

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile); //profile → Get user profile (protected)

module.exports = router;


// This file is mounted in server.js like this:
// app.use('/api/auth', authRoutes);
// So the final URLs become:
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/verify-mobile
// GET  /api/auth/profile