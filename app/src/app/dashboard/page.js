'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import SendScreen from '../../../components/screens/SendScreen';
import ReceiveScreen from '../../../components/screens/ReceiveScreen';
import LinkWalletScreen from '../../../components/screens/LinkWalletScreen';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, HeadphonesIcon, LogOut, Menu, Languages, ChevronDown, ChevronLeft, ExternalLink, ChevronRight } from 'lucide-react';
import { api } from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { checkWalletType } from '@/utils/walletUtils';

export default function Dashboard() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    isVerified: false
  });
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [walletState, setWalletState] = useState({
    wallets: [],
    walletTypes: {},
    loading: false,
    error: null
  });
  const [cryptoBalances, setCryptoBalances] = useState({
    bitcoin: 0,
    ripple: 0,
    stellar: 0,
    ethereum: 0,
    'shiba-inu': 0
  });
  const [walletBalances, setWalletBalances] = useState({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [totalCryptoBalance, setTotalCryptoBalance] = useState(0);
  const [accountCryptoBalances, setAccountCryptoBalances] = useState({
    BTC: 0,
    ETH: 0,
    XRP: 0,
    XLM: 0
  });

  const buyOptions = [
    {
      name: 'MoonPay',
      description: 'Buy crypto with credit card or bank transfer',
      url: 'https://www.moonpay.com',
      logo: 'https://cdn.brandfetch.io/id6XER0Pfn/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'
    },
    {
      name: 'Binance',
      description: 'World\'s largest crypto exchange',
      url: 'https://www.binance.com',
      logo: 'https://cdn.brandfetch.io/id-pjrLx_q/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'
    },
    {
      name: 'Coinbase',
      description: 'US-based trusted exchange platform',
      url: 'https://www.coinbase.com',
      logo: 'https://cdn.brandfetch.io/idwDWo4ONQ/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const [balanceResponse, transactionsResponse, userResponse] = await Promise.all([
          api.getBalance(token),
          api.getTransactions(token),
          api.getUser(token)
        ]);
        
        // Update account crypto balances from balance response
        const accountBalances = {
          BTC: balanceResponse.balances.find(b => b.currency === 'BTC')?.amount || 0,
          ETH: balanceResponse.balances.find(b => b.currency === 'ETH')?.amount || 0,
          XRP: balanceResponse.balances.find(b => b.currency === 'XRP')?.amount || 0,
          XLM: balanceResponse.balances.find(b => b.currency === 'XLM')?.amount || 0
        };
        
        setAccountCryptoBalances(accountBalances);
        
        // Combine account and wallet balances
        const combinedBalances = {
          bitcoin: accountBalances.BTC + (cryptoBalances.bitcoin || 0),
          ethereum: accountBalances.ETH + (cryptoBalances.ethereum || 0),
          ripple: accountBalances.XRP + (cryptoBalances.ripple || 0),
          stellar: accountBalances.XLM + (cryptoBalances.stellar || 0),
          'shiba-inu': cryptoBalances['shiba-inu'] || 0
        };
        
        setCryptoBalances(combinedBalances);

        // Calculate total balance including crypto
        if (cryptoData) {
          const totalCryptoValue = Object.entries(combinedBalances).reduce((sum, [coinId, balance]) => {
            const price = cryptoData[coinId]?.usd || 0;
            return sum + (balance * price);
          }, 0);

          setBalanceData({
            ...balanceResponse,
            totalBalance: balanceResponse.totalBalance + totalCryptoValue
          });
        } else {
          setBalanceData(balanceResponse);
        }

        // Update other data
        setTransactions(transactionsResponse.transactions);
        setUsername(userResponse.username);
        setUserInfo({
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          email: userResponse.email,
          phoneNumber: userResponse.phoneNumber,
          country: userResponse.country,
          isVerified: userResponse.isVerified
        });
      } catch (error) {
        toast.error('Failed to fetch user data');
      }
    };

    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ripple,stellar,ethereum,shiba-inu&vs_currencies=usd&include_24h_change=true&include_last_updated_at=true&include_high_24h=true'
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [router, cryptoData]);

  useEffect(() => {
    if (cryptoData && Object.keys(cryptoBalances).length > 0) {
      const total = Object.entries(cryptoBalances).reduce((sum, [coinId, balance]) => {
        const price = cryptoData[coinId]?.usd || 0;
        return sum + (balance * price);
      }, 0);
      setTotalCryptoBalance(total);
      
      setBalanceData(prev => ({
        ...prev,
        totalBalance: (prev?.totalBalance || 0) + total
      }));
    }
  }, [cryptoData, cryptoBalances]);

  const fetchWalletBalances = async (wallets) => {
    setIsLoadingBalances(true);
    const balances = {};
    const aggregatedBalances = {
      bitcoin: 0,
      ripple: 0,
      stellar: 0,
      ethereum: 0,
      'shiba-inu': 0
    };
    
    try {
      console.log('=== Processing Wallets ===');
      console.log(`Total wallets to process: ${wallets.length}`);

      for (const wallet of wallets) {
        if (wallet.walletAddress) {
          const type = wallet.type;
          console.log(`\nWallet Found:`);
          console.log(`Address: ${wallet.walletAddress}`);
          console.log(`Type: ${type}`);
          
          const balance = await api.getWalletBalance(wallet.walletAddress, type);
          console.log(`Balance: ${balance} ${type}`);
          
          balances[wallet.walletAddress] = {
            balance,
            type,
            lastUpdated: new Date().toISOString()
          };
          
          switch(type.toLowerCase()) {
            case 'bitcoin':
              aggregatedBalances.bitcoin += balance;
              break;
            case 'ethereum':
              aggregatedBalances.ethereum += balance;
              break;
            case 'ripple':
              aggregatedBalances.ripple += balance;
              break;
            case 'stellar':
              aggregatedBalances.stellar += balance;
              break;
          }
        } else {
          console.log(`\nSkipped wallet: ${wallet.walletAddress || 'No address'}`);
          console.log('Reason: Invalid address or unknown type');
        }
      }

      console.log('\n=== Wallet Processing Complete ===');
      console.log('Aggregated Balances:', aggregatedBalances);

      setWalletBalances(balances);
      setCryptoBalances(aggregatedBalances);
      
      console.log('Wallet balances:', balances);
      console.log('Aggregated balances:', aggregatedBalances);
      
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      toast.error('Failed to fetch wallet balances');
    } finally {
      setIsLoadingBalances(false);
    }
  };

  useEffect(() => {
    const fetchWallets = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setWalletState(prev => ({ ...prev, loading: true }));
      try {
        const response = await api.getWallets(token);
        console.log('Fetched wallets:', response.wallets);
        
        const wallets = response.wallets;
        const walletTypes = {};
        
        for (const wallet of wallets) {
          if (wallet.walletAddress) {
            const typeInfo = checkWalletType(wallet.walletAddress);
            if (typeInfo) {
              walletTypes[wallet.walletAddress] = typeInfo;
              console.log(`Detected wallet type for ${wallet.walletAddress}:`, typeInfo);
            }
          }
        }

        setWalletState({
          wallets,
          walletTypes,
          loading: false,
          error: null
        });

        await fetchWalletBalances(wallets);
        
      } catch (error) {
        console.error('Error in wallet fetching:', error);
        setWalletState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
        toast.error('Failed to fetch wallets');
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.tab) {
        setSelectedTab(event.state.tab);
      } else {
        setSelectedTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (!window.history.state?.tab) {
      window.history.replaceState({ tab: 'overview' }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    window.history.pushState({ tab }, '');
  };

  const handleBack = () => {
    setSelectedTab('overview');
  };

  const renderCryptoBalance = (crypto) => {
    const accountBalance = accountCryptoBalances[crypto.symbol] || 0;
    const walletBalance = cryptoBalances[crypto.id] || 0;
    const totalBalance = accountBalance + walletBalance;
    const usdValue = (totalBalance * (cryptoData[crypto.id]?.usd || 0));

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm text-gray-400">Total Balance</p>
            <p className="text-lg font-semibold text-white">
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })} {crypto.symbol}
            </p>
            <p className="text-sm text-gray-400">
              ≈ ${usdValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Wallet Balance</p>
            <p className="text-sm text-white">
              {walletBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })} {crypto.symbol}
            </p>
            <p className="text-sm text-gray-400">Account: {accountBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch(selectedTab) {
      case 'send':
        return <SendScreen balance={balanceData} onSuccess={() => fetchUserData()} />;
      case 'receive':
        return <ReceiveScreen />;
      case 'buy':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Buy Crypto</h2>
                <button 
                  onClick={() => handleTabChange('overview')}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid gap-4">
                {buyOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={option.logo} 
                        alt={option.name} 
                        className="w-12 h-12 object-contain rounded-full"
                      />
                      <div>
                        <h3 className="text-white font-medium">{option.name}</h3>
                        <p className="text-gray-400 text-sm">{option.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      case 'link':
        return <LinkWalletScreen />;
      case 'wallets':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Your Wallets</h3>
                <button 
                  onClick={() => handleTabChange('link')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                >
                  <Wallet size={18} />
                  Link New Wallet
                </button>
              </div>
              
              {walletState.wallets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="text-blue-400" size={32} />
                  </div>
                  <h4 className="text-white font-medium text-lg mb-2">No Wallets Linked</h4>
                  <p className="text-gray-400 mb-6">Link your first wallet to get started</p>
                  <button 
                    onClick={() => handleTabChange('link')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all"
                  >
                    Link Wallet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {walletState.wallets.map((wallet, index) => {
                    const walletType = walletState.walletTypes[wallet.walletAddress]?.type;
                    const balance = walletBalances[wallet.walletAddress]?.balance || 0;
                    
                    return (
                      <div 
                        key={wallet.walletAddress || index} 
                        className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Wallet className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{walletType || 'Unknown'} Wallet</h4>
                            <p className="text-gray-400 text-sm truncate max-w-[200px]">
                              {wallet.walletAddress || 'No address provided'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Balance:</span>
                            {isLoadingBalances ? (
                              <span className="text-white font-medium animate-pulse">Loading...</span>
                            ) : (
                              <span className="text-white font-medium">
                                {balance.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 8
                                })} {walletType}
                              </span>
                            )}
                          </div>
                          {walletBalances[wallet.walletAddress]?.lastUpdated && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Last Updated:</span>
                              <span className="text-gray-400 text-sm">
                                {new Date(walletBalances[wallet.walletAddress].lastUpdated).toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Total Balance</h3>
                <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-lg">
                  {balanceData?.totalBalance ? `$${balanceData.totalBalance.toFixed(2)}` : 'Active'}
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">
                ${balanceData?.totalBalance?.toLocaleString() || '0.00'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleTabChange('send')}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <ArrowRightCircle size={18} />
                  Send
                </button>
                <button 
                  onClick={() => handleTabChange('receive')}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <ArrowLeftCircle size={18} />
                  Receive
                </button>
                <button 
                  onClick={() => handleTabChange('buy')}
                  className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <RefreshCw size={18} />
                  Buy
                </button>
                <button 
                  onClick={() => handleTabChange('link')}
                  className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <Wallet size={18} />
                  Link Wallet
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white">{tx.type}</p>
                        <p className="text-sm text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg ${tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                        </p>
                        <p className="text-sm text-gray-400">{tx.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const mobileMenuItems = [
    { icon: <Wallet />, label: 'Overview', id: 'overview' },
    { icon: <ArrowRightCircle />, label: 'Send', id: 'send' },
    { icon: <ArrowLeftCircle />, label: 'Receive', id: 'receive' },
    { icon: <RefreshCw />, label: 'Buy', id: 'buy' },
    { icon: <History />, label: 'History', id: 'history' },
    { icon: <Wallet />, label: 'Wallets', id: 'wallets' },
  ];

  const cryptoList = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      id: 'bitcoin',
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      balance: cryptoBalances.bitcoin
    },
    {
      name: 'Ripple',
      symbol: 'XRP',
      id: 'ripple',
      image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
      balance: cryptoBalances.ripple
    },
    {
      name: 'Stellar',
      symbol: 'XLM',
      id: 'stellar',
      image: 'https://cryptologos.cc/logos/stellar-xlm-logo.png',
      balance: cryptoBalances.stellar
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      id: 'ethereum',
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      balance: cryptoBalances.ethereum
    },
    {
      name: 'Shiba Inu',
      symbol: 'SHIB',
      id: 'shiba-inu',
      image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
      balance: cryptoBalances['shiba-inu']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-center" />
      <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* Mobile Navigation */}
      <div className={`md:hidden fixed top-0 h-screen transition-transform duration-300 transform ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-gray-900/95 border-l border-white/10 z-40 backdrop-blur-sm w-64 right-0`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white p-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={24} />
          </button>
          <span className="text-white font-medium">Menu</span>
        </div>
        <div className="px-2 pt-4 pb-3 space-y-1">
          {mobileMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleTabChange(item.id);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span className="text-white">{item.icon}</span>
              <span className="text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between gap-4 mb-8 bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {userInfo.firstName || 'User'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 hidden lg:block">{userInfo.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                userInfo.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {userInfo.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </header>

          {renderScreen()}

          {selectedTab === 'overview' && (
            <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Market Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {cryptoList.map((crypto) => (
                  <div 
                    key={crypto.id} 
                    className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h4 className="text-white font-medium">{crypto.name}</h4>
                        <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                      </div>
                    </div>
                    {cryptoData && cryptoData[crypto.id] ? (
                      renderCryptoBalance(crypto)
                    ) : (
                      <div className="animate-pulse">
                        <div className="h-8 bg-white/5 rounded mb-2"></div>
                        <div className="h-4 bg-white/5 rounded w-2/3"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallets Summary Section */}
          {selectedTab === 'overview' && walletState.wallets.length > 0 && (
            <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Your Wallets</h3>
                <button 
                  onClick={() => handleTabChange('wallets')}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {walletState.wallets.slice(0, 3).map((wallet, index) => {
                  const walletType = walletState.walletTypes[wallet.walletAddress]?.type;
                  const balance = walletBalances[wallet.walletAddress]?.balance || 0;
                  
                  return (
                    <div 
                      key={wallet.walletAddress || index} 
                      className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Wallet className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{walletType || 'Unknown'} Wallet</h4>
                          <p className="text-gray-400 text-sm truncate max-w-[200px]">
                            {wallet.walletAddress || 'No address provided'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Balance:</span>
                          {isLoadingBalances ? (
                            <span className="text-white font-medium animate-pulse">Loading...</span>
                          ) : (
                            <span className="text-white font-medium">
                              {balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8
                              })} {walletType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {walletState.wallets.length > 3 && (
                  <div 
                    className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
                  >
                    <button 
                      onClick={() => handleTabChange('wallets')}
                      className="text-blue-400 hover:text-blue-300 flex flex-col items-center gap-2"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Wallet className="text-blue-400" size={20} />
                      </div>
                      <span>View {walletState.wallets.length - 3} more wallets</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
