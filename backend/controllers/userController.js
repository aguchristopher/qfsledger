const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/email'); // You'll need to implement this

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info' });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otp = generateOTP();
    
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, 'Your OTP Code', `Your OTP is: ${otp}`);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.otp || !user.otp.code || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset password email
    await sendEmail(
      email,
      'Password Reset',
      `Reset your password using this token: ${resetToken}`
    );

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balances totalBalance');
    res.json({
      balances: user.balances,
      totalBalance: user.totalBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance' });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user.id)
      .select('transactionHistory')
      .slice('transactionHistory', [(page - 1) * limit, Number(limit)]);
    
    res.json({
      transactions: user.transactionHistory,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const { currency, amount, type, description } = req.body;
    const user = await User.findById(req.user.id);

    // Find or create balance for the currency
    let balance = user.balances.find(b => b.currency === currency);
    if (!balance) {
      user.balances.push({ currency, amount: 0 });
      balance = user.balances[user.balances.length - 1];
    }

    // Update balance based on transaction type
    if (type === 'deposit') {
      balance.amount += amount;
    } else if (type === 'withdrawal') {
      if (balance.amount < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      balance.amount -= amount;
    }

    balance.updatedAt = Date.now();

    // Add transaction to history
    user.transactionHistory.push({
      type,
      amount,
      currency,
      description,
      timestamp: Date.now()
    });

    // Update total balance
    user.totalBalance = user.balances.reduce((total, b) => total + b.amount, 0);

    await user.save();
    res.json({ 
      balance: user.balances,
      totalBalance: user.totalBalance,
      transaction: user.transactionHistory[user.transactionHistory.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating balance' });
  }
};
