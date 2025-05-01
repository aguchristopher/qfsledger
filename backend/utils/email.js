const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com', // Namecheap's SMTP host
  port: 465, // Secure port for SSL
 // secure: true,
  auth: {
    user: 'support@qfsbestsecure.info',
    pass: 'Donkay101$', // Use the actual password here
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'support@qfsbestsecure.info',
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
