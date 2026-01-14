// Import bcrypt for hashing passwords
const bcrypt = require('bcryptjs');

// Import JWT for token-based authentication
const jwt = require('jsonwebtoken');

// Import PostgreSQL connection pool
const pool = require('../config/database');

/* -------------------- User Registration -------------------- */
exports.register = async (req, res) => {
  try {
    // Extract user details from request body
    const { email, password, full_name, gender, mobile_no } = req.body;

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into database
    const newUser = await pool.query(
      `INSERT INTO users 
       (email, password, full_name, gender, mobile_no, signup_type) 
       VALUES ($1, $2, $3, $4, $5, 'e') 
       RETURNING id, email, full_name, gender, mobile_no, created_at`,
      [email, hashedPassword, full_name, gender, mobile_no]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.rows[0],
        token,
        requires_mobile_verification: true
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
    delete user.password;

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

    // TODO: Verify OTP using Firebase / Twilio
    // For now, mark mobile as verified
    await pool.query(
      'UPDATE users SET is_mo_verified = true WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Mobile number verified successfully'
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
