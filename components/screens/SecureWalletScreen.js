'use client';
import { useState } from 'react';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SecureWalletScreen() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSecureWallet = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate wallet address
      if (!walletAddress) {
        throw new Error('Please enter a wallet address');
      }

      // Here you would typically make an API call to verify/secure the wallet
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay

      toast.success('Wallet validation initiated');
      router.push('/link-wallet');
    } catch (error) {
      toast.error(error.message || 'Failed to secure wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Secure Your Wallet</h2>
          <p className="text-gray-400">Enter your wallet address to begin the security verification process</p>
        </div>

        <form onSubmit={handleSecureWallet} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Enter your wallet address"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center">
          Already verified? <button onClick={() => router.push('/link-wallet')} className="text-white hover:underline">Link your wallet</button>
        </p>
      </div>
    </div>
  );
}
