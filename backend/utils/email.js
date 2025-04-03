const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  service: 'gmail',
  auth: {
    user: 'aguchris740@gmail.com',
    pass: 'thswpkcauzjpwvzk'
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'aguchris740@gmail.com',
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
