'use client';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import SendScreen from '../../../components/screens/SendScreen';
import ReceiveScreen from '../../../components/screens/ReceiveScreen';
import SwapScreen from '../../../components/screens/SwapScreen';
import LinkWalletScreen from '../../../components/screens/LinkWalletScreen';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, HeadphonesIcon, LogOut, Menu, Languages, ChevronDown, ChevronLeft } from 'lucide-react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    setSelectedTab('overview');
  };

  const renderScreen = () => {
    switch(selectedTab) {
      case 'send':
        return <SendScreen />;
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
                <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-lg">+2.5%</span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">$25,420.65</p>
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
              <p className="text-gray-400 mt-1">Welcome back, User</p>
            </div>
          </header>

          {renderScreen()}

          {selectedTab === 'overview' && (
            <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'Received', amount: '+0.25 BTC', time: '2 hours ago', status: 'Completed' },
                  { type: 'Sent', amount: '-0.15 ETH', time: '5 hours ago', status: 'Pending' },
                  { type: 'Swapped', amount: 'BTC → ETH', time: '1 day ago', status: 'Completed' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'Received' ? 'bg-green-500/20 text-green-500' :
                        activity.type === 'Sent' ? 'bg-red-500/20 text-red-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {activity.type === 'Received' ? <ArrowLeftCircle size={20} /> :
                         activity.type === 'Sent' ? <ArrowRightCircle size={20} /> :
                         <RefreshCw size={20} />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.type}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{activity.amount}</p>
                      <p className={`text-sm ${
                        activity.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>{activity.status}</p>
                    </div>
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
