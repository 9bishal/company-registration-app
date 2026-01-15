const express = require('express');
const router = express.Router();
const { testEmailConnection, sendEmail } = require('../services/emailService');

// Test email connection
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testEmailConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipient email (to) is required' 
      });
    }

    const result = await sendEmail({
      to,
      subject: subject || 'Test Email from Company Registration',
      text: message || 'This is a test email to verify the email service is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>${message || 'This is a test email to verify the email service is working correctly.'}</p>
          <p style="color: #666; margin-top: 20px;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});

module.exports = router;
