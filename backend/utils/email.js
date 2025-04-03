const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

module.exports = sendEmail;
