'use client';
import { useState } from 'react';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, HeadphonesIcon, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-black flex">
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
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-white bg-white/5 rounded-lg hover:bg-white/10">
                <Bell />
              </button>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Total Balance</h3>
              <p className="text-3xl text-white">$25,420.65</p>
              <p className="text-green-400 mt-2">+2.5%</p>
              <div className="flex gap-4 mt-4">
                <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  <ArrowRightCircle size={20} />
                  Send
                </button>
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  <ArrowLeftCircle size={20} />
                  Receive
                </button>
              </div>
            </div>
            {/* Add more dashboard cards based on selectedTab */}
          </div>

          {/* Dynamic content based on selected tab */}
          <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            {/* Add content based on selectedTab */}
          </div>
        </div>
      </div>
    </div>
  );
}
