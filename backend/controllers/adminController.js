const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -otp -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        totalBalance: user.totalBalance,
        balances: user.balances
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.fundUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, currency } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create balance for the currency
    let balance = user.balances.find(b => b.currency === currency);
    if (!balance) {
      user.balances.push({ currency, amount: 0 });
      balance = user.balances[user.balances.length - 1];
    }

    balance.amount += parseFloat(amount);
    balance.updatedAt = Date.now();

    // Add transaction to history
    user.transactionHistory.push({
      type: 'deposit',
      amount: parseFloat(amount),
      currency,
      description: 'Admin funding',
      timestamp: Date.now(),
      status: 'completed'
    });

    // Update total balance
    user.totalBalance = user.balances.reduce((total, b) => total + b.amount, 0);

    await user.save();
    res.json({ message: 'User funded successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error funding user', error: error.message });
  }
};

exports.updateUserCoins = async (req, res) => {
  try {
    const { userId } = req.params;
    const { BTC, ETH, XRP } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update transaction history with new coin balances
    const lastTransaction = user.transactionHistory[user.transactionHistory.length - 1] || {};
    lastTransaction.cryptoBalances = {
      BTC: parseFloat(BTC) || 0,
      ETH: parseFloat(ETH) || 0,
      XRP: parseFloat(XRP) || 0
    };

    await user.save();
    res.json({ message: 'User coins updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user coins', error: error.message });
  }
};
