import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowMarker } from './FlowMarker';
import { ConditionalNode } from './ConditionalNode';
import { BranchPath } from './BranchPath';

interface ConditionalFlowDemoProps {
  onBack: () => void;
}

export function ConditionalFlowDemo({ onBack }: ConditionalFlowDemoProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Progress Stepper */}
      <ProgressStepper currentStep="flow" />

      {/* Sticky Header */}
      <div className="fixed top-[53px] left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] leading-tight">Conditional Flow Demo</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Canvas - Vertical Flow with Branches */}
      <div className="flex-1 pt-[106px] pb-8 overflow-y-auto">
        <div className="py-6">
          <div className="flex flex-col">
            {/* Start Marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <FlowMarker type="start" />
            </motion.div>

            {/* Connector */}
            <FlowConnector />

            {/* Node 1: Connect Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-4"
            >
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Connect Wallet"
                subtitle="Connect to Uniswap V3 pool"
                status="recorded"
              />
            </motion.div>

            {/* Connector */}
            <FlowConnector />

            {/* Node 2: Add Liquidity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4"
            >
              <FlowNode
                id="2"
                type="action"
                icon="swap"
                title="Add Liquidity"
                subtitle="Deposit USDC/ETH with 0.3% fee tier"
                status="recorded"
              />
            </motion.div>

            {/* Connector */}
            <FlowConnector />

            {/* Node 3: Monitor APY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-4"
            >
              <FlowNode
                id="3"
                type="action"
                icon="trend"
                title="Monitor APY"
                subtitle="Track pool performance every 6 hours"
                status="recorded"
              />
            </motion.div>

            {/* Connector */}
            <FlowConnector />

            {/* Conditional Node */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-4"
            >
              <ConditionalNode id="cond-1" condition="If APY > 5%" status="recorded" />
            </motion.div>

            {/* Branch Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-4 mt-4 space-y-4"
            >
              {/* Yes Path */}
              <BranchPath type="yes">
                <FlowNode
                  id="yes-1"
                  type="action"
                  icon="swap"
                  title="Continue Strategy"
                  subtitle="Keep liquidity in pool"
                  status="recorded"
                />
                <FlowConnector />
                <FlowNode
                  id="yes-2"
                  type="action"
                  icon="trend"
                  title="Compound Rewards"
                  subtitle="Reinvest earned fees"
                  status="recorded"
                />
              </BranchPath>

              {/* No Path */}
              <BranchPath type="no">
                <FlowNode
                  id="no-1"
                  type="action"
                  icon="alert"
                  title="Trigger Alert"
                  subtitle="Notify low APY"
                  status="recorded"
                />
                <FlowConnector />
                <FlowNode
                  id="no-2"
                  type="action"
                  icon="swap"
                  title="Withdraw Funds"
                  subtitle="Remove liquidity from pool"
                  status="pending"
                />
              </BranchPath>
            </motion.div>

            {/* Note: No merge point - branches end independently */}

            {/* Connector */}
            <FlowConnector />

            {/* Final Node (after conditional branches) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="px-4"
            >
              <FlowNode
                id="final"
                type="action"
                icon="alert"
                title="Generate Report"
                subtitle="Send performance summary"
                status="pending"
              />
            </motion.div>

            {/* Connector */}
            <FlowConnector />

            {/* End Marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <FlowMarker type="end" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}