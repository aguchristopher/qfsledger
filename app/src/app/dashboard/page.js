'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import SendScreen from '../../../components/screens/SendScreen';
import ReceiveScreen from '../../../components/screens/ReceiveScreen';
import SwapScreen from '../../../components/screens/SwapScreen';
import LinkWalletScreen from '../../../components/screens/LinkWalletScreen';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, HeadphonesIcon, LogOut, Menu, Languages, ChevronDown, ChevronLeft } from 'lucide-react';
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
        setBalanceData(balanceResponse);
        setTransactions(transactionsResponse.transactions);
        setUsername(userResponse.username);
      } catch (error) {
        toast.error('Failed to fetch user data');
        if (error.message === 'Invalid token') {
          localStorage.removeItem('token');
          router.push('/login');
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

  const handleBack = () => {
    setSelectedTab('overview');
  };

  const renderScreen = () => {
    switch(selectedTab) {
      case 'send':
        return <SendScreen balance={balanceData} onSuccess={() => fetchUserData()} />;
      case 'receive':
        return <ReceiveScreen />;
      case 'swap':
        return <SwapScreen />;
      case 'link':
        return <LinkWalletScreen />;
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
                  onClick={() => setSelectedTab('send')}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <ArrowRightCircle size={18} />
                  Send
                </button>
                <button 
                  onClick={() => setSelectedTab('receive')}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <ArrowLeftCircle size={18} />
                  Receive
                </button>
                <button 
                  onClick={() => setSelectedTab('swap')}
                  className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-xl transition-all"
                >
                  <RefreshCw size={18} />
                  Swap
                </button>
                <button 
                  onClick={() => setSelectedTab('link')}
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
          {[
            { icon: <Wallet />, label: 'Overview', id: 'overview' },
            { icon: <ArrowRightCircle />, label: 'Send', id: 'send' },
            { icon: <ArrowLeftCircle />, label: 'Receive', id: 'receive' },
            { icon: <RefreshCw />, label: 'Swap', id: 'swap' },
            { icon: <History />, label: 'History', id: 'history' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedTab(item.id);
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
          <header className="flex items-center gap-4 mb-8 bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
            {selectedTab !== 'overview' && (
              <button
                onClick={handleBack}
                className="p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {username || 'User'}</p>
            </div>
          </header>

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
        </div>
      </div>
    </div>
  );
}
