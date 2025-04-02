'use client';
import { useState } from 'react';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, HeadphonesIcon, LogOut, ChevronLeft, ChevronRight, Bitcoin, Coins } from 'lucide-react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white/5 border-r border-white/10 transition-all duration-300`}>
        <div className="p-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white p-2 rounded-lg hover:bg-white/10">
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        <nav className="mt-8">
          {[
            { icon: <Wallet />, label: 'Overview', id: 'overview' },
            { icon: <ArrowRightCircle />, label: 'Send', id: 'send' },
            { icon: <ArrowLeftCircle />, label: 'Receive', id: 'receive' },
            { icon: <RefreshCw />, label: 'Swap', id: 'swap' },
            { icon: <History />, label: 'History', id: 'history' },
            { icon: <Bell />, label: 'Notifications', id: 'notifications' },
            { icon: <HeadphonesIcon />, label: 'Support', id: 'support' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full flex items-center p-4 space-x-4 hover:bg-white/10 ${
                selectedTab === item.id ? 'bg-white/10' : ''
              }`}
            >
              <span className="text-white">{item.icon}</span>
              {isSidebarOpen && <span className="text-white">{item.label}</span>}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 space-x-4 hover:bg-white/10 text-red-500"
          >
            <LogOut />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, User</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 text-white bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                <Bell />
              </button>
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <div className="text-white pr-2">
                  <p className="font-semibold">User Name</p>
                  <p className="text-sm text-gray-400">Premium</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Total Balance</h3>
                <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-lg">+2.5%</span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">$25,420.65</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200">
                  <ArrowRightCircle size={18} />
                  Send
                </button>
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200">
                  <ArrowLeftCircle size={18} />
                  Receive
                </button>
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200">
                  <RefreshCw size={18} />
                  Swap
                </button>
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200">
                  <Wallet size={18} />
                  Link
                </button>
              </div>
            </div>
            
            {/* Crypto Cards */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Bitcoin className="text-yellow-500" />
                <h3 className="text-xl font-semibold text-white">Bitcoin</h3>
              </div>
              <p className="text-2xl font-bold text-white">$42,975.23</p>
              <p className="text-red-400 mt-2">-1.2%</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="text-blue-500" />
                <h3 className="text-xl font-semibold text-white">Ethereum</h3>
              </div>
              <p className="text-2xl font-bold text-white">$2,245.14</p>
              <p className="text-green-400 mt-2">+3.8%</p>
            </div>
          </div>

          {/* Recent Activity Section */}
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
        </div>
      </div>
    </div>
  );
}
