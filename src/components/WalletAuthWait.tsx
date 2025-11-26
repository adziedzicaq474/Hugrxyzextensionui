import { useState, useEffect } from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletAuthWaitProps {
  onWalletConnected: () => void;
  onBack: () => void;
}

export function WalletAuthWait({ onWalletConnected, onBack }: WalletAuthWaitProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      onWalletConnected();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[24px] leading-tight">HUGR.xyz</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-[72px] pb-8 px-4 flex items-center justify-center">
        <motion.div
          className="w-full max-w-md flex flex-col gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center flex flex-col gap-4">
            <div className="w-16 h-16 bg-[#feee7d] rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-[24px] leading-tight tracking-tight">Connect Wallet</h2>
            <p className="text-[16px] leading-relaxed text-gray-700">
              Connect your wallet to start building automated DeFi strategies.
            </p>
          </div>

          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          <div className="border border-gray-200 rounded-xl p-5">
            <p className="text-[16px] leading-relaxed text-gray-700 text-center">
              We support MetaMask, WalletConnect, and Coinbase Wallet.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}