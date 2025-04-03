'use client';
import { useState } from 'react';
import { Wallet, ArrowRightCircle, ArrowLeftCircle, RefreshCw, History, Bell, LogOut, Languages, Menu } from 'lucide-react';

export default function Navbar({ selectedTab, setSelectedTab, isMenuOpen, setIsMenuOpen }) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'ES', label: 'Spanish' },
    { code: 'FR', label: 'French' },
    { code: 'DE', label: 'German' },
    { code: 'CN', label: 'Chinese' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setIsLangMenuOpen(false);
    console.log(`Switching to ${langCode}`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 border-b border-white/10 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">CryptoApp</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {[
              { icon: <Wallet />, label: 'Overview', id: 'overview' },
              { icon: <ArrowRightCircle />, label: 'Send', id: 'send' },
              { icon: <ArrowLeftCircle />, label: 'Receive', id: 'receive' },
              { icon: <RefreshCw />, label: 'Swap', id: 'swap' },
              { icon: <History />, label: 'History', id: 'history' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 ${
                  selectedTab === item.id ? 'bg-white/10' : ''
                }`}
              >
                <span className="text-white">{item.icon}</span>
                <span className="text-white">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                <Languages size={20} />
                <span>{currentLang}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-white/10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2"
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && (
                        <span className="ml-auto text-blue-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <Bell size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-all"
            >
              <LogOut size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white bg-white/10 rounded-lg hover:bg-white/20"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
