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
