const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  host: 'stmp.hostinger.com',
  port: '465',
  auth: {
    user: 'aguchris740@gmail.com',
    pass: 'thswpkcauzjpwvzk'
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'aguchris740@gmail.com',
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
