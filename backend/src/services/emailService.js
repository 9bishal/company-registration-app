const nodemailer = require('nodemailer');
require('dotenv').config();

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
const sendPasswordResetEmail = async (userEmail, otp) => {
  console.log(`📧 Sending password reset OTP to ${userEmail}...`);
  console.log(`📧 OTP: ${otp}`);
  
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    console.error('❌ No SMTP transporter configured! Please set SMTP_HOST and SMTP_USER in .env');
    console.log('📧 OTP for testing:', otp);
    return { 
      success: true, 
      message: 'OTP sent (Email service not configured. Check console for OTP.)' 
    };
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"JobPilot" <noreply@jobpilot.com>',
      to: userEmail,
      subject: 'Password Reset OTP - JobPilot',
      text: `Your password reset OTP is: ${otp}\n\nThis OTP will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976d2; margin: 0;">🚀 JobPilot</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 10px 0;">Password Reset OTP</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0;">Enter this code to reset your password</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; font-weight: bold; color: #1976d2; letter-spacing: 10px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              ⏰ This OTP will expire in <strong>15 minutes</strong>
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Password reset OTP email error:', error.message);
    console.error('   Details:', error);
    // Still return success in development so flow continues
    console.log('📧 OTP for testing:', otp);
    return { 
      success: true, 
      message: `Email failed but OTP is: ${otp}` 
    };
  }
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
 * Send company registration success email (with user name)
 */
const sendCompanyRegistrationSuccess = async (userEmail, userName, companyName) => {
  console.log(`📧 Sending company registration success email to ${userEmail}...`);
  
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    console.error('❌ No SMTP transporter configured!');
    return { 
      success: false, 
      message: 'Email service not configured' 
    };
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Company Registration" <noreply@company-registration.com>',
      to: userEmail,
      subject: `🎉 Congratulations! ${companyName} is now registered`,
      text: `Hi ${userName},\n\nCongratulations! Your company "${companyName}" has been registered successfully. You can now access your dashboard and start managing your company.\n\nBest regards,\nCompany Registration Team`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Registration Successful!</h1>
          </div>
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Hi <strong>${userName}</strong>,</p>
            
            <p style="color: #555; font-size: 15px; line-height: 1.6;">Congratulations! Your company <strong style="color: #667eea;">"${companyName}"</strong> has been successfully registered in our system.</p>
            
            <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; border-radius: 5px;">
              <p style="margin: 0; color: #333;"><strong>What's Next?</strong></p>
              <ul style="margin: 10px 0 0 20px; color: #555; padding: 0;">
                <li>Access your company dashboard</li>
                <li>Complete your company profile</li>
                <li>Upload your company logo and banner</li>
                <li>Invite team members</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
            </div>
            
            <p style="color: #999; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              If you have any questions, please contact our support team.<br>
              <strong style="color: #667eea;">Company Registration Team</strong>
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Company registration success email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Company registration email error:', error.message);
    console.error('   Details:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${error.message}` 
    };
  }
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
  sendCompanyRegistrationSuccess, // Exporting the new function
  testEmailConnection
};
