import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowConnectorBlue } from './FlowConnectorBlue';
import { FlowConnectorPurple } from './FlowConnectorPurple';
import { FlowMarker } from './FlowMarker';
import { LoopNode } from './LoopNode';
import { ForLoopNode } from './ForLoopNode';
import { ForLoopNodeAdvanced } from './ForLoopNodeAdvanced';

interface LoopFlowDemoProps {
  onBack: () => void;
}

export function LoopFlowDemo({ onBack }: LoopFlowDemoProps) {
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
      <ProgressStepper currentStep="flow" />

      <div className="fixed top-[53px] left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] leading-tight">Loop Flow Demo</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[106px] pb-8">
        <div className="py-6">
          <div className="flex flex-col">
            <FlowMarker type="start" />
            <FlowConnector />

            <div className="px-4">
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Step 1: Initialize Strategy"
                subtitle="Set up DeFi position"
                status="recorded"
              />
            </div>
            <FlowConnector />

            <div className="px-4">
              <FlowNode
                id="2"
                type="action"
                icon="trend"
                title="Step 2: Check Health Factor"
                subtitle="Query current health ratio"
                status="recorded"
              />
            </div>
            <FlowConnectorBlue />

            {/* Loop Container */}
            <div className="px-4">
              <LoopNode
                id="loop1"
                condition="While Health Factor > 1.5"
                status="recorded"
              >
                {/* Nested nodes inside loop */}
                <FlowNode
                  id="3"
                  type="action"
                  icon="swap"
                  title="Step 3: Monitor Position"
                  subtitle="Check collateral value"
                  status="recorded"
                />
                <FlowConnector />

                <FlowNode
                  id="4"
                  type="action"
                  icon="trend"
                  title="Step 4: Adjust if Needed"
                  subtitle="Rebalance collateral"
                  status="recorded"
                />
                <FlowConnector />

                <FlowNode
                  id="5"
                  type="action"
                  icon="alert"
                  title="Step 5: Wait 5 Minutes"
                  subtitle="Delay before next check"
                  status="pending"
                />
              </LoopNode>
            </div>

            <FlowConnectorBlue />

            <div className="px-4">
              <FlowNode
                id="6"
                type="action"
                icon="alert"
                title="Step 6: Emergency Exit"
                subtitle="Health dropped below 1.5"
                status="pending"
              />
            </div>
            <FlowConnector />

            <div className="px-4">
              <FlowNode
                id="7"
                type="action"
                icon="swap"
                title="Step 7: Close Position"
                subtitle="Safely exit strategy"
                status="pending"
              />
            </div>
            <FlowConnectorPurple />

            {/* For Loop Container */}
            <div className="px-4">
              <ForLoopNode
                id="forloop1"
                iterations={3}
                status="pending"
              >
                {/* Nested nodes inside for loop */}
                <FlowNode
                  id="8"
                  type="action"
                  icon="trend"
                  title="Step 8: Retry Transaction"
                  subtitle="Attempt to finalize"
                  status="pending"
                />
                <FlowConnector />

                <FlowNode
                  id="9"
                  type="action"
                  icon="alert"
                  title="Step 9: Wait 30 Seconds"
                  subtitle="Delay before retry"
                  status="pending"
                />
              </ForLoopNode>
            </div>

            <FlowConnectorPurple />

            <div className="px-4">
              <FlowNode
                id="10"
                type="action"
                icon="wallet"
                title="Step 10: Confirm Exit"
                subtitle="Verify transaction success"
                status="pending"
              />
            </div>
            <FlowConnector />

            <FlowMarker type="end" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}