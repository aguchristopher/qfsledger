const nodemailer = require('nodemailer');

const transporterr = nodemailer.createTransport({
  // Configure your email service here
  // Example for Gmail:
  service: 'gmail',
  auth: {
    user: 'aguchris740@gmail.com',
    pass: 'thswpkcauzjpwvzk'
  }
});

var transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 587,
  secure: true,
  auth: {
    user: 'support@qfsbestsecure.site',
    pass: 'Donkay101$'
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'support@qfsbestsecure.site',
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