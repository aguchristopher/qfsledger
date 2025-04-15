const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  host: 'stmp.titan.email',
  port: '465',
  auth: {
    user: 'support@qfsworldwide.info',
    pass: 'thswpkcauzjpwvzk'
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'support@qfsworldwide.info',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

module.exports = sendEmail;
