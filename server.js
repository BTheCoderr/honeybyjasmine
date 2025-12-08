const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Email subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { firstName, email, city } = req.body;

    // Validate input
    if (!firstName || !email) {
      return res.status(400).json({ 
        error: 'First name and email are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address' 
      });
    }

    // Send welcome email to subscriber
    const welcomeEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'HoneyByJasmine <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to The Honey List! 🍯',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #3a3a3a; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d4a574 0%, #c8965f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; }
              .content { background: #faf8f5; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #d4a574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to The Honey List! 🍯</h1>
              </div>
              <div class="content">
                <p>Hi ${firstName}!</p>
                <p>Thanks for joining The Honey List! I'm so excited to have you here.</p>
                <p>You'll now be the first to know about:</p>
                <ul>
                  <li>✨ Weekly menu releases (every Wednesday)</li>
                  <li>🔔 Sold-out alerts before they happen</li>
                  <li>💡 Tips and tricks for healthy eating</li>
                  <li>🎉 Special offers and exclusive content</li>
                </ul>
                <p>No spam, just the good stuff—promise!</p>
                <p>Talk soon,<br><strong>Jasmine</strong><br>HoneyByJasmine</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification emails to you and Jasmine
    const notificationEmails = [];
    if (process.env.RESEND_NOTIFICATION_EMAIL) {
      notificationEmails.push(process.env.RESEND_NOTIFICATION_EMAIL);
    }
    if (process.env.RESEND_JASMINE_EMAIL) {
      notificationEmails.push(process.env.RESEND_JASMINE_EMAIL);
    }

    // Send notification to all recipients
    if (notificationEmails.length > 0) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'HoneyByJasmine <onboarding@resend.dev>',
        to: notificationEmails,
        subject: `New Honey List Subscriber: ${firstName}`,
        html: `
          <p><strong>New subscriber:</strong></p>
          <ul>
            <li>Name: ${firstName}</li>
            <li>Email: ${email}</li>
            <li>City: ${city || 'Not provided'}</li>
          </ul>
        `,
      });
    }

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to The Honey List!',
      emailId: welcomeEmail.id 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to process subscription. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HoneyByJasmine API is running' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Resend configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
});

