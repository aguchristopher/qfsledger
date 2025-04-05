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
  const [wallets, setWallets] = useState([]);
  const [walletTypes, setWalletTypes] = useState({});
  
  const checkWalletType = (walletAddress) => {
    // Log the input for debugging
    console.log('Checking wallet type for:', walletAddress);

    // Simple validation for wallet address
    if (!walletAddress || !walletAddress.trim()) {
      console.log('Invalid wallet address');
      return null;
    }
    
    // Normalize the wallet address
    const address = walletAddress.trim();
    
    let type = null;
    let format = null;
    
    // Enhanced pattern matching
    if (/^(1|3|bc1)[a-zA-Z0-9]{25,39}$/.test(address)) {
      type = 'Bitcoin';
      format = address.startsWith('bc1') ? 'Native SegWit' : 
               address.startsWith('3') ? 'SegWit' : 'Legacy';
    } else if (/^r[a-zA-Z0-9]{24,34}$/.test(address)) {
      type = 'Ripple';
      format = 'Standard';
    } else if (/^G[A-Z0-9]{55}$/.test(address)) {
      type = 'Stellar';
      format = 'Standard';
    }

    // Log the result
    console.log('Wallet type detection result:', { type, format });
    
    return { type, format };
  };

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
        const [balanceResponse, transactionsResponse, userResponse, walletsResponse] = await Promise.all([
          api.getBalance(token),
          api.getTransactions(token),
          api.getUser(token),
          api.getWallets(token)
          
        ]);
        setBalanceData(balanceResponse);
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
        setWallets(walletsResponse.wallets);
        
        // Process wallets and check their types
        const walletTypeMap = {};
        console.log('Processing wallets:', walletsResponse.wallets);

        walletsResponse.wallets.forEach((wallet, index) => {
          console.log(`Processing wallet ${index + 1}:`, wallet);
          
          if (wallet.walletaddress) {
            console.log(`Checking wallet address: ${wallet.walletaddress}`);
            const walletInfo = checkWalletType(wallet.walletaddress);
            console.log(`Wallet ${index + 1} info:`, walletInfo);
            
            if (walletInfo) {
              walletTypeMap[wallet.walletaddress] = walletInfo;
            }
          } else {
            console.log(`Wallet ${index + 1} has no address`);
          }
        });

        console.log('Final wallet types map:', walletTypeMap);
        // Add additional debugging output
        walletsResponse.wallets.forEach(wallet => {
          if (wallet.walletaddress) {
            console.log('Wallet address:', wallet.walletaddress);
            const type = checkWalletType(wallet.walletaddress);
            console.log('Detected wallet type:', type);
          }
        });
        setWalletTypes(walletTypeMap);
        
        console.log('User wallets:', walletsResponse.wallets); // Console log the wallets
        console.log('Wallet types:', walletTypeMap); // Console log the wallet types
      } catch (error) {
        toast.error('Failed to fetch user data');
        if (error.message === 'Invalid token') {
          localStorage.removeItem('token');
        }
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
  }, [router]);

  useEffect(() => {
    // Add popstate event listener to handle browser back button
    const handlePopState = (event) => {
      if (event.state?.tab) {
        setSelectedTab(event.state.tab);
      } else {
        setSelectedTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initialize the history state for the current tab
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
              
              {wallets.length === 0 ? (
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
                  {wallets.map((wallet, index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Wallet className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Wallet {index + 1}</h4>
                          <p className="text-gray-400 text-sm truncate max-w-[200px]">
                            {wallet.walletaddress || 'No address provided'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {wallet.walletaddress && walletTypes[wallet.walletaddress] ? (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Type:</span>
                              <span className="text-white font-medium">
                                {walletTypes[wallet.walletaddress].type}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Format:</span>
                              <span className="text-white font-medium">
                                {walletTypes[wallet.walletaddress].format}
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-400 text-sm">Unknown wallet type</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Linked:</span>
                          <span className="text-white font-medium">
                            {new Date(wallet.linkedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {wallet.referenceNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Reference:</span>
                            <span className="text-white font-medium">
                              {wallet.referenceNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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

          {/* {selectedTab === 'overview' && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="text-gray-400 text-sm">Account Type</h3>
                <p className="text-white font-medium mt-1">Personal Account</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="text-gray-400 text-sm">Phone Number</h3>
                <p className="text-white font-medium mt-1">{userInfo.phoneNumber}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="text-gray-400 text-sm">Country</h3>
                <p className="text-white font-medium mt-1">{userInfo.country}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="text-gray-400 text-sm">Account Status</h3>
                <p className="text-white font-medium mt-1">{userInfo.isVerified ? 'Active' : 'Pending Verification'}</p>
              </div>
            </div>
          )} */}

          {renderScreen()}

          {selectedTab === 'overview' && (
            <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Market Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[
                  {
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    id: 'bitcoin',
                    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                  },
                  {
                    name: 'Ripple',
                    symbol: 'XRP',
                    id: 'ripple',
                    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
                  },
                  {
                    name: 'Stellar',
                    symbol: 'XLM',
                    id: 'stellar',
                    image: 'https://cryptologos.cc/logos/stellar-xlm-logo.png'
                  },
                  {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    id: 'ethereum',
                    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
                  },
                  {
                    name: 'Shiba Inu',
                    symbol: 'SHIB',
                    id: 'shiba-inu',
                    image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png'
                  }
                ].map((crypto) => (
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
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-white">
                          ${cryptoData[crypto.id].usd.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8
                          })}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${
                            cryptoData[crypto.id].usd_24h_change >= 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            24h: {cryptoData[crypto.id].high_24h}%
                          </span>
                          <span className="text-sm text-gray-400">
                            {new Date(cryptoData[crypto.id].last_updated_at * 1000).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
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
          {selectedTab === 'overview' && wallets.length > 0 && (
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
                {wallets.slice(0, 3).map((wallet, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Wallet className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Wallet {index + 1}</h4>
                        <p className="text-gray-400 text-sm truncate max-w-[200px]">
                          {wallet.walletaddress || 'No address provided'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {wallet.walletaddress && walletTypes[wallet.walletaddress] ? (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Type:</span>
                          <span className="text-white font-medium">
                            {walletTypes[wallet.walletaddress].type}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">Unknown wallet type</p>
                      )}
                    </div>
                  </div>
                ))}
                {wallets.length > 3 && (
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
                      <span>View {wallets.length - 3} more wallets</span>
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
