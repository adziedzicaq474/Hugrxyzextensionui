import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowConnectorPurple } from './FlowConnectorPurple';
import { FlowMarker } from './FlowMarker';
import { ForLoopNodeInteractive } from './ForLoopNodeInteractive';
import { toast } from 'sonner@2.0.3';

interface InteractiveLoopDemoProps {
  onBack: () => void;
}

export function InteractiveLoopDemo({ onBack }: InteractiveLoopDemoProps) {
  const [loopIterations, setLoopIterations] = useState(3);
  const [showLoop, setShowLoop] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateIterations = (iterations: number) => {
    setLoopIterations(iterations);
    toast.success(`Loop updated to ${iterations} ${iterations === 1 ? 'iteration' : 'iterations'}`);
  };

  const handleDelete = () => {
    setShowLoop(false);
    toast.error('Loop deleted');
    setTimeout(() => setShowLoop(true), 3000);
  };

  const handleConvertToWhile = () => {
    toast.info('Converting to While Loop...', {
      description: 'This feature would convert the For loop to a While loop',
    });
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
          <h1 className="text-[20px] leading-tight">Interactive Loop</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[106px] pb-8">
        {/* Instructions Panel - Removed for production use */}

        <div className="py-6">
          <div className="flex flex-col">
            <FlowMarker type="start" />
            <FlowConnector />

            <div className="px-4">
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Initialize Transaction"
                subtitle="Prepare for execution"
                status="recorded"
              />
            </div>
            <FlowConnectorPurple />

            {/* Interactive For Loop Container */}
            {showLoop && (
              <div className="px-4">
                <ForLoopNodeInteractive
                  id="forloop1"
                  iterations={loopIterations}
                  status="pending"
                  onUpdateIterations={handleUpdateIterations}
                  onDelete={handleDelete}
                  onConvertToWhile={handleConvertToWhile}
                >
                  {/* Nested nodes inside for loop */}
                  <FlowNode
                    id="2"
                    type="action"
                    icon="trend"
                    title="Attempt Transaction"
                    subtitle="Try to execute on-chain"
                    status="pending"
                  />
                  <FlowConnector />

                  <FlowNode
                    id="3"
                    type="action"
                    icon="alert"
                    title="Wait 30 Seconds"
                    subtitle="Delay before retry"
                    status="pending"
                  />
                </ForLoopNodeInteractive>
              </div>
            )}

            {!showLoop && (
              <div className="px-4 py-8 text-center">
                <div className="text-[14px] leading-relaxed text-gray-500">
                  Loop deleted (will restore in 3s...)
                </div>
              </div>
            )}

            <FlowConnectorPurple />

            <div className="px-4">
              <FlowNode
                id="4"
                type="action"
                icon="wallet"
                title="Finalize Transaction"
                subtitle="Complete execution"
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