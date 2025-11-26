import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowConnectorPurple } from './FlowConnectorPurple';
import { FlowMarker } from './FlowMarker';
import { ForLoopNodeAdvanced } from './ForLoopNodeAdvanced';

interface AdvancedLoopDemoProps {
  onBack: () => void;
}

export function AdvancedLoopDemo({ onBack }: AdvancedLoopDemoProps) {
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-run iteration simulation
  useEffect(() => {
    if (isRunning && currentIteration < 3) {
      const timer = setTimeout(() => {
        setCurrentIteration((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentIteration >= 3) {
      setIsRunning(false);
    }
  }, [isRunning, currentIteration]);

  const handleStart = () => {
    setCurrentIteration(1);
    setIsRunning(true);
  };

  const handleReset = () => {
    setCurrentIteration(0);
    setIsRunning(false);
  };

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
          <h1 className="text-[20px] leading-tight">Advanced Loop Demo</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[106px] pb-8">
        {/* Control Panel */}
        <div className="px-4 py-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[16px] leading-tight text-gray-900 mb-3">
              Loop Simulation Controls
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleStart}
                disabled={isRunning || currentIteration >= 3}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentIteration >= 3 ? 'Completed' : isRunning ? 'Running...' : 'Start Loop'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
            {isRunning && (
              <p className="mt-3 text-[14px] leading-relaxed text-purple-700 text-center">
                Running iteration {currentIteration}/3...
              </p>
            )}
          </div>
        </div>

        <div className="py-6">
          <div className="flex flex-col">
            <FlowMarker type="start" />
            <FlowConnector />

            <div className="px-4">
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Initialize Retry System"
                subtitle="Set up transaction retry logic"
                status="recorded"
              />
            </div>
            <FlowConnectorPurple />

            {/* Advanced For Loop Container with Iteration Tracking */}
            <div className="px-4">
              <ForLoopNodeAdvanced
                id="forloop1"
                iterations={3}
                currentIteration={currentIteration}
                status={isRunning ? 'running' : currentIteration >= 3 ? 'recorded' : 'pending'}
              >
                {/* Nested nodes inside for loop */}
                <FlowNode
                  id="2"
                  type="action"
                  icon="trend"
                  title="Attempt Transaction"
                  subtitle="Try to execute on-chain"
                  status={currentIteration >= 1 ? 'recorded' : 'pending'}
                />
                <FlowConnector />

                <FlowNode
                  id="3"
                  type="action"
                  icon="alert"
                  title="Check Success"
                  subtitle="Verify transaction status"
                  status={currentIteration >= 1 ? 'recorded' : 'pending'}
                />
                <FlowConnector />

                <FlowNode
                  id="4"
                  type="action"
                  icon="swap"
                  title="Wait & Adjust Gas"
                  subtitle="Prepare for next attempt"
                  status={currentIteration >= 1 ? 'recorded' : 'pending'}
                />
              </ForLoopNodeAdvanced>
            </div>

            <FlowConnectorPurple />

            <div className="px-4">
              <FlowNode
                id="5"
                type="action"
                icon="wallet"
                title="Finalize Transaction"
                subtitle="Complete after retries"
                status={currentIteration >= 3 ? 'recorded' : 'pending'}
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
