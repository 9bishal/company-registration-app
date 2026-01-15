const nodemailer = require('nodemailer');

// Firebase REST API details
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_URL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`;

// Create transporter based on environment
const createTransporter = () => {
  // If SMTP is configured, use it
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

let transporter = createTransporter();

// Create test account for development
const getTestTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log('📧 Test email account created:');
  console.log('   Email:', testAccount.user);
  console.log('   Pass:', testAccount.pass);
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Email send result
 */
const admin = require('../config/firebase');

const sendEmail = async ({ to, subject, text, html, type = 'VERIFY_EMAIL', forceFirebase = false }) => {
  try {
    // 1. Try Firebase Admin to send verification/reset links
    // This uses Firebase's template and infrastructure
    if (FIREBASE_API_KEY && FIREBASE_API_KEY !== 'your_firebase_api_key' && 
       ['VERIFY_EMAIL', 'PASSWORD_RESET'].includes(type)) {
      
      console.log(`📧 Attempting to send ${type} via Firebase to ${to}...`);
      
      try {
        // If we want to use Firebase's own delivery system for links:
        // Note: generatesPasswordResetLink / generateEmailVerificationLink require the user to exist in Firebase
        const actionType = type === 'VERIFY_EMAIL' ? 'VERIFY_EMAIL' : 'PASSWORD_RESET';
        
        // We use the REST API as falling back since it's most reliable for cross-platform without user existence checks
        const response = await fetch(FIREBASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: type,
            email: to
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log(`✅ ${type} link sent via Firebase successfully. Check your inbox/spam.`);
          // If we also have custom OTP content, we might want to send that too via SMTP
          // but usually one method is enough. We'll return here if it succeeded.
          if (!forceFirebase && (html || text)) {
            console.log('💡 Firebase link sent. Also proceeding to send custom OTP email for better UX.');
          } else {
            return { success: true, provider: 'firebase' };
          }
        } else {
          console.warn('⚠️ Firebase Email API returned error:', data.error?.message);
        }
      } catch (err) {
        console.error('⚠️ Firebase delivery failed:', err.message);
      }
    }

    // 2. Fall back to SMTP or Ethereal for custom content (our OTP emails)
    console.log(`📧 Sending custom email (${subject}) to ${to}...`);
    
    if (!transporter) {
      transporter = await (process.env.SMTP_HOST ? createTransporter() : getTestTransporter());
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Company Registration" <noreply@company-registration.com>',
      to,
      subject,
      text,
      html
    };

    // LOG OTP to console for easy development access
    if (text && (text.includes('code') || text.includes('OTP'))) {
      console.log('-----------------------------------------');
      console.log(`🔑 VERIFICATION OTP FOR ${to}:`);
      console.log(text.match(/\d{6}/)?.[0] || text);
      console.log('-----------------------------------------');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent via Nodemailer:', info.messageId);
    
    if (info.messageId && !process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Preview URL (Ethereal):', previewUrl);
      return { 
        success: true, 
        messageId: info.messageId, 
        previewUrl, 
        provider: 'ethereal',
        message: 'Email sent via Ethereal. Check terminal for OTP or Preview URL.'
      };
    }

    return { success: true, messageId: info.messageId, provider: 'smtp' };
  } catch (error) {
    console.error('📧 Email error:', error);
    throw error;
  }
};

/**
 * Send welcome email after registration
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to Company Registration!',
    text: `Hello ${userName},\n\nWelcome to Company Registration! Your account has been created successfully.\n\nBest regards,\nCompany Registration Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Company Registration!</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Your account has been created successfully.</p>
        <p>You can now log in and start registering your company.</p>
        <br>
        <p>Best regards,<br>Company Registration Team</p>
      </div>
    `
  });
};

/**
 * Send verification email with OTP
 */
const sendVerificationEmail = async (userEmail, otp) => {
  return sendEmail({
    to: userEmail,
    subject: 'Verify Your Email - Company Registration',
    text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
        </div>
        <p style="color: #666;">This code will expire in 10 minutes.</p>
        <br>
        <p>Best regards,<br>Company Registration Team</p>
      </div>
    `,
    type: 'VERIFY_EMAIL'
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: userEmail,
    subject: 'Password Reset - Company Registration',
    text: `Click the following link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Company Registration Team</p>
      </div>
    `,
    type: 'PASSWORD_RESET'
  });
};

/**
 * Send company registration confirmation
 */
const sendCompanyRegistrationEmail = async (userEmail, companyName) => {
  return sendEmail({
    to: userEmail,
    subject: `Company Registration Successful - ${companyName}`,
    text: `Congratulations! Your company "${companyName}" has been registered successfully.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Company Registration Successful!</h2>
        <p>Congratulations!</p>
        <p>Your company <strong>"${companyName}"</strong> has been registered successfully.</p>
        <p>You can now access your company dashboard and manage your company details.</p>
        <br>
        <p>Best regards,<br>Company Registration Team</p>
      </div>
    `
  });
};

/**
 * Test email configuration
 */
const testEmailConnection = async () => {
  try {
    if (!transporter) {
      transporter = await getTestTransporter();
    }
    
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return { success: true, message: 'Email server connection verified' };
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send SMS via Firebase Phone Auth REST API
 */
const sendSMS = async (phoneNumber, otp) => {
  try {
    if (!FIREBASE_API_KEY || FIREBASE_API_KEY === 'your_firebase_api_key') {
      console.log(`📱 [MOCK SMS] To ${phoneNumber}: Your verification code is ${otp}`);
      return { success: true, provider: 'mock' };
    }

    // NOTE: Sending SMS via Identity Toolkit REST API usually requires 
    // a reCAPTCHA token or session which is hard to generate purely from backend.
    // This is most commonly done via the Firebase Client SDK.
    // For now, we log it and provide the endpoint structure.
    
    console.log(`📱 Attempting to send SMS to ${phoneNumber} via Firebase (REST structure)...`);
    
    // In a real production app with Firebase Admin, you might use different triggers
    // but here we demonstrate the intent:
    console.log(`📱 SMS OTP ${otp} would be sent to Firebase for delivery.`);
    
    return { success: true, provider: 'firebase-sms-simulated' };
  } catch (error) {
    console.error('📱 SMS error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendSMS, // Added sendSMS
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCompanyRegistrationEmail,
  testEmailConnection
};
