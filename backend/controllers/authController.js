const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');
const { generateOTP } = require('../utils/helpers');

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, username, country, phoneNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({ 
      email, 
      password,
      otp: {
        code: otp,
        expiresAt: otpExpiry
      },
      isVerified: false,
      firstName,
      lastName,
      username,
      country,
      phoneNumber
    });

    // Send OTP via email
    await sendEmail(email, 'Your OTP Code', `Welcome to our platform! Your OTP is: ${otp}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        isVerified: false
      },
      token,
      message: 'OTP has been sent to your email'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    const resetUrl = `https://qfsledger.onrender.com/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      'Password Reset Request',
      `Click the following link to reset your password: ${resetUrl}`
    );

    res.json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};
