'use client';
import { Copy, Download } from 'lucide-react';

export default function ReceiveScreen() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Receive Crypto</h3>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="aspect-square w-48 mx-auto bg-white p-2 rounded-lg">
              {/* QR Code placeholder */}
              <div className="w-full h-full bg-gray-800"></div>
            </div>
          </div>
          <div className="relative">
            <input 
              type="text" 
              value="0x1234...5678"
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
            <button className="absolute right-2 top-2 text-blue-400 hover:text-blue-500">
              <Copy size={20} />
            </button>
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            <Download size={20} />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
