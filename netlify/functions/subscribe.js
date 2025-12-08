const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { firstName, email, city } = JSON.parse(event.body);

    // Validate input
    if (!firstName || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'First name and email are required' }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
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

    // Send notification email to Jasmine only
    if (process.env.RESEND_JASMINE_EMAIL) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'HoneyByJasmine <onboarding@resend.dev>',
        to: process.env.RESEND_JASMINE_EMAIL,
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed to The Honey List!',
        emailId: welcomeEmail.id,
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to process subscription. Please try again later.',
      }),
    };
  }
};

