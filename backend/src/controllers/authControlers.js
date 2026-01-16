// Import bcrypt for hashing passwords
const bcrypt = require('bcryptjs');

// Import JWT for token-based authentication
const jwt = require('jsonwebtoken');

// Import PostgreSQL connection pool
const { pool } = require('../config/database');

// Import email service
const { sendWelcomeEmail } = require('../services/emailService');

/* -------------------- User Registration -------------------- */
exports.register = async (req, res) => {
  try {
    // Extract user details from request body
    const { email, password, full_name, gender, mobile_no } = req.body;

    // Check if user already exists by email or mobile
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR mobile_no = $2',
      [email, mobile_no]
    );
 
    if (userCheck.rows.length > 0) {
      const existingUser = userCheck.rows[0];
      const message = existingUser.email === email 
        ? 'User already exists with this email' 
        : 'User already exists with this mobile number';
        
      return res.status(400).json({
        success: false,
        message
      });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert new user into database
    const newUser = await pool.query(
      `INSERT INTO users 
       (email, password_hash, full_name, gender, mobile_no, signup_type, otp) 
       VALUES ($1, $2, $3, $4, $5, 'e', $6) 
       RETURNING id, email, full_name, gender, mobile_no, created_at`,
      [email, hashedPassword, full_name, gender, mobile_no, otp]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Send verification OTP to email (and conceptually SMS)
    let emailStatus = 'pending';
    try {
      const { sendVerificationEmail, sendSMS } = require('../services/emailService');
      
      // Send to Email
      const emailResult = await sendVerificationEmail(email, otp);
      console.log(`📧 OTP ${otp} sent to:`, email);
      emailStatus = emailResult.success ? 'sent' : 'failed';
      
      // Send to Phone (SMS)
      await sendSMS(mobile_no, otp);
      console.log(`📱 OTP ${otp} sent to:`, mobile_no);
      
    } catch (emailErr) {
      console.error('Failed to send verification notifications:', emailErr.message);
      emailStatus = 'error';
    }

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.rows[0],
        token,
        requires_mobile_verification: true,
        email_status: emailStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/* -------------------- User Login -------------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Remove sensitive information
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        expires_in: process.env.JWT_EXPIRY
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/* -------------------- Get User Profile -------------------- */
exports.getProfile = async (req, res) => {
  try {
    // Get userId from decoded JWT (set by auth middleware)
    const userId = req.user.userId;

    // Fetch user profile data
    const userResult = await pool.query(
      'SELECT id, email, full_name, gender, mobile_no, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userResult.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/* -------------------- Mobile Verification -------------------- */
exports.verifyMobile = async (req, res) => {
  try {
    const { mobile_no, otp } = req.body;
    const userId = req.user.userId;

    // Fetch user to verify OTP
    const userResult = await pool.query(
      'SELECT otp FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const storedOtp = userResult.rows[0].otp;

    // Verify OTP (Check if matches)
    if (otp !== storedOtp && otp !== '123456') { // Allow 123456 as master OTP for testing
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark mobile as verified and clear OTP
    await pool.query(
      'UPDATE users SET is_mobile_verified = true, otp = NULL WHERE id = $1',
      [userId]
    );

    // Fetch updated user data
    const updatedUser = await pool.query(
      'SELECT id, email, full_name, gender, mobile_no, is_mobile_verified, created_at FROM users WHERE id = $1',
      [userId]
    );

    // Generate new JWT token
    const token = jwt.sign(
      { userId: updatedUser.rows[0].id, email: updatedUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.json({
      success: true,
      message: 'Mobile number verified successfully',
      data: {
        user: updatedUser.rows[0],
        token
      }
    });
  } catch (error) {
    console.error('Mobile verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Mobile verification failed',
      error: error.message
    });
  }
};

/* -------------------- Resend OTP -------------------- */
exports.resendOtp = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user to get email and mobile
    const userResult = await pool.query(
      'SELECT email, mobile_no, full_name FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { email, mobile_no } = userResult.rows[0];

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP in database
    await pool.query(
      'UPDATE users SET otp = $1 WHERE id = $2',
      [otp, userId]
    );

    // Send verification OTP to email and SMS
    let emailStatus = 'pending';
    try {
      const { sendVerificationEmail, sendSMS } = require('../services/emailService');
      
      // Send to Email
      const emailResult = await sendVerificationEmail(email, otp);
      emailStatus = emailResult.success ? 'sent' : 'failed';
      
      // Send to Phone (SMS)
      await sendSMS(mobile_no, otp);
      
      console.log(`📧 New OTP ${otp} resent to:`, email);
    } catch (emailErr) {
      console.error('Failed to resend verification notifications:', emailErr.message);
      emailStatus = 'error';
    }

    res.json({
      success: true,
      message: 'OTP resent successfully',
      email_status: emailStatus
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    });
  }
};

