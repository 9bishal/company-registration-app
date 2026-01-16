// Forget Password Controller
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = result.rows[0].id;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save OTP to database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [hashedOTP, expiryTime, userId]
    );

    // Send email with OTP
    try {
      const emailResult = await sendPasswordResetEmail(email, otp);
      
      if (emailResult && emailResult.success) {
        res.status(200).json({ 
          success: true, 
          message: 'OTP sent to your email. Valid for 15 minutes.' 
        });
      } else {
        return res.status(500).json({ 
          message: emailResult?.message || 'Failed to send OTP email' 
        });
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError.message);
      return res.status(500).json({ 
        message: 'Failed to send OTP email. Please check your email address and try again.' 
      });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Hash token to compare
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const userId = result.rows[0].id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, userId]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify reset token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [hashedToken]
    );

    const isValid = result.rows.length > 0;

    res.status(200).json({ 
      valid: isValid, 
      message: isValid ? 'Token is valid' : 'Token is invalid or expired' 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};
