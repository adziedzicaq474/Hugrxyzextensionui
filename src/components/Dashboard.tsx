import { ArrowLeft, TrendingUp, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onBack: () => void;
}

export function Dashboard({ onBack }: DashboardProps) {
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
          <h1 className="text-[24px] leading-tight">Dashboard</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-[72px] pb-8 px-4">
        <div className="flex flex-col gap-6 py-8">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[20px] leading-tight">Active Strategies</h2>
            <p className="text-[16px] leading-relaxed text-gray-700">
              You don't have any deployed bots yet.
            </p>
          </motion.div>

          <motion.div
            className="border border-gray-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-[16px] leading-relaxed text-gray-700">
                Create your first strategy to get started
              </p>
              <button className="bg-[#feee7d] text-black px-6 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black min-h-[44px]">
                Create Strategy
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-[20px] leading-tight">Quick Stats</h3>
            <div className="flex flex-col gap-4">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#10B981]" />
                  <div>
                    <p className="text-[16px] leading-relaxed text-gray-700">Total Profit</p>
                    <p className="text-[20px] leading-tight">$0.00</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#feee7d]" />
                  <div>
                    <p className="text-[16px] leading-relaxed text-gray-700">Active Bots</p>
                    <p className="text-[20px] leading-tight">0</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}