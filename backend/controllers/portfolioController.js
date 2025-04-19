const User = require('../models/User');

exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balances wallets');
    
    // Get crypto balances from user's balance array
    const accountBalances = {
      BTC: user.balances.find(b => b.currency === 'BTC')?.amount || 0,
      ETH: user.balances.find(b => b.currency === 'ETH')?.amount || 0,
      XRP: user.balances.find(b => b.currency === 'XRP')?.amount || 0,
      XLM: user.balances.find(b => b.currency === 'XLM')?.amount || 0
    };

    // Get fiat balances
    const fiatBalances = user.balances.filter(b => 
      !['BTC', 'ETH', 'XRP', 'XLM'].includes(b.currency)
    );

    // Calculate total crypto balances (account + wallet)
    const totalCryptoBalances = {
      BTC: accountBalances.BTC,
      ETH: accountBalances.ETH,
      XRP: accountBalances.XRP,
      XLM: accountBalances.XLM
    };

    res.json({
      fiatBalances,
      accountCryptoBalances: accountBalances,
      totalCryptoBalances
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};

exports.addPortfolioItem = async (req, res) => {
  try {
    const { currency, amount } = req.body;
    const user = await User.findById(req.user.id);
    
    user.balances.push({ currency, amount });
    await user.save();
    
    res.status(201).json(user.balances);
  } catch (error) {
    res.status(500).json({ message: 'Error adding portfolio item' });
  }
};

exports.updatePortfolioItem = async (req, res) => {
  try {
    const { currency, amount } = req.body;
    const user = await User.findById(req.user.id);
    
    const balance = user.balances.id(req.params.id);
    if (!balance) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    balance.currency = currency;
    balance.amount = amount;
    await user.save();
    
    res.json(user.balances);
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio item' });
  }
};

exports.deletePortfolioItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.balances.id(req.params.id).remove();
    await user.save();
    
    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item' });
  }
};
