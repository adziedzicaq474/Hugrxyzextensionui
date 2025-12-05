import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowConnectorGreen } from './FlowConnectorGreen';
import { FlowConnectorBlue } from './FlowConnectorBlue';
import { FlowConnectorPurple } from './FlowConnectorPurple';
import { FlowMarker } from './FlowMarker';
import { NodeConfigSheet } from './NodeConfigSheet';
import { ConditionalNodeV3 } from './ConditionalNodeV3';
import { LoopNode } from './LoopNode';
import { ForLoopNode } from './ForLoopNode';
import { BranchPath } from './BranchPath';

interface FlowEditorProps {
  onBack: () => void;
  onNext: () => void;
  stepperStep?: 'chat' | 'flow' | 'record' | 'test' | 'deploy';
}

// Define node type
type ActionNode = {
  id: string;
  icon: 'wallet' | 'swap' | 'trend' | 'alert';
  title: string;
  subtitle: string;
  status: 'recorded' | 'pending';
  nodeType?: 'interaction' | 'conditional' | 'while' | 'for';
  conditionalType?: 'ifelse' | 'while' | 'for';
};

// Mock action nodes for visualization
const mockActionNodes: ActionNode[] = [
  {
    id: '1',
    icon: 'wallet' as const,
    title: 'Connect Wallet',
    subtitle: 'Connect to Uniswap V3 pool',
    status: 'recorded' as const,
  },
  {
    id: '2',
    icon: 'swap' as const,
    title: 'Add Liquidity',
    subtitle: 'Deposit USDC/ETH with 0.3% fee tier',
    status: 'recorded' as const,
  },
  {
    id: '3',
    icon: 'trend' as const,
    title: 'Monitor APY',
    subtitle: 'Track pool performance every 6 hours',
    status: 'pending' as const,
  },
  {
    id: '4',
    icon: 'alert' as const,
    title: 'Check Exit Condition',
    subtitle: 'Exit if IL > 5% or APY < 10%',
    status: 'pending' as const,
  },
  {
    id: '5',
    icon: 'swap' as const,
    title: 'Withdraw & Rebalance',
    subtitle: 'Remove liquidity and reallocate assets',
    status: 'pending' as const,
  },
];

export function FlowEditor({ onBack, onNext, stepperStep }: FlowEditorProps) {
  const [nodes, setNodes] = useState<ActionNode[]>(mockActionNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isConfigSheetOpen, setIsConfigSheetOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<'yes' | 'no'>('yes');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddNode = (afterId?: string) => {
    console.log('Add node after:', afterId);
    // TODO: Implement add node logic
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsConfigSheetOpen(true);
  };

  const handleSaveNodeConfig = (config: {
    title: string;
    subtitle: string;
    nodeType: 'interaction' | 'conditional';
    conditionalType?: 'ifelse' | 'while' | 'for';
  }) => {
    if (!selectedNodeId) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNodeId
          ? { ...node, ...config }
          : node
      )
    );
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;

    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 35,
      },
    },
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Progress Stepper */}
      <ProgressStepper currentStep={stepperStep || 'flow'} />

      {/* Sticky Header */}
      <div className="fixed top-[53px] left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] leading-tight">Flow Editor</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Canvas - Vertical Flow */}
      <div className="flex-1 pt-[106px] pb-[88px] overflow-y-auto">
        <div className="px-4 py-6">
          <div className="flex flex-col">
            {/* Start Marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <FlowMarker type="start" />
            </motion.div>

            <FlowConnector />

            {/* Action 1: Connect Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Connect Wallet"
                subtitle="Connect to Base network"
                status="recorded"
                onClick={() => handleNodeClick('1')}
              />
            </motion.div>

            <FlowConnector />

            {/* Action 2: If/Else - Check Balance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, x: currentPath === 'yes' ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentPath === 'yes' ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="px-4"
              >
                <ConditionalNodeV3
                  id="2"
                  condition="Check if balance > 0.1 ETH"
                  status="recorded"
                  currentPath={currentPath}
                  onSwitchToNo={() => setCurrentPath('no')}
                  onSwitchToYes={() => setCurrentPath('yes')}
                  onClick={() => handleNodeClick('2')}
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {currentPath === 'yes' ? (
                /* YES PATH - Main flow */
                <motion.div
                  key="yes-path"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FlowConnectorGreen />

                  {/* Action 3: While Loop - Monitor Price */}
                  <div className="px-4 mb-6">
                    <LoopNode
                      id="3"
                      condition="While price is stable (volatility &lt; 2%)"
                      status="recorded"
                      onClick={() => handleNodeClick('3')}
                    >
                      <FlowNode
                        id="3a"
                        type="action"
                        icon="trend"
                        title="Monitor Price"
                        subtitle="Check every 10 minutes"
                        status="recorded"
                      />
                      <FlowConnectorBlue />
                      <FlowNode
                        id="3b"
                        type="action"
                        icon="swap"
                        title="Update Position"
                        subtitle="Adjust liquidity if needed"
                        status="recorded"
                      />
                    </LoopNode>
                  </div>

                  <FlowConnector />

                  {/* Action 4: For Loop - Retry Swap */}
                  <div className="px-4 mb-6">
                    <ForLoopNode
                      id="4"
                      iterations={3}
                      status="pending"
                      onClick={() => handleNodeClick('4')}
                    >
                      <FlowNode
                        id="4a"
                        type="action"
                        icon="swap"
                        title="Execute Swap"
                        subtitle="Try to swap ETH to USDC"
                        status="pending"
                      />
                      <FlowConnectorPurple />
                      <FlowNode
                        id="4b"
                        type="action"
                        icon="alert"
                        title="Wait & Adjust Gas"
                        subtitle="Increase gas if failed"
                        status="pending"
                      />
                    </ForLoopNode>
                  </div>

                  <FlowConnector />

                  {/* Action 5: Final Action */}
                  <FlowNode
                    id="5"
                    type="action"
                    icon="alert"
                    title="Send Notification"
                    subtitle="Alert user on completion"
                    status="pending"
                    onClick={() => handleNodeClick('5')}
                  />
                </motion.div>
              ) : (
                /* NO PATH - Alternative flow with 2 steps */
                <motion.div
                  key="no-path"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="ml-4"
                >
                  <BranchPath direction="left" />

                  {/* No Path Step 1 */}
                  <FlowNode
                    id="no-1"
                    type="action"
                    icon="alert"
                    title="Request Deposit"
                    subtitle="Prompt user to add more funds"
                    status="pending"
                    onClick={() => handleNodeClick('no-1')}
                  />

                  <FlowConnector />

                  {/* No Path Step 2 */}
                  <FlowNode
                    id="no-2"
                    type="action"
                    icon="wallet"
                    title="Wait for Deposit"
                    subtitle="Monitor wallet balance"
                    status="pending"
                    onClick={() => handleNodeClick('no-2')}
                  />

                  <div className="h-8" />
                </motion.div>
              )}
            </AnimatePresence>

            <FlowConnector />

            {/* End Marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <FlowMarker type="end" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="px-4 py-4">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 bg-[#feee7d] text-black px-4 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#feee7d] min-h-[44px]"
          >
            <span className="text-[16px] leading-relaxed">Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Node Config Sheet */}
      {isConfigSheetOpen && selectedNode && (
        <NodeConfigSheet
          isOpen={isConfigSheetOpen}
          onClose={() => setIsConfigSheetOpen(false)}
          nodeId={selectedNode.id}
          initialTitle={selectedNode.title}
          initialSubtitle={selectedNode.subtitle}
          initialStatus={selectedNode.status}
          initialNodeType={selectedNode.nodeType}
          initialConditionalType={selectedNode.conditionalType}
          onSave={handleSaveNodeConfig}
          onDelete={handleDeleteNode}
        />
      )}
    </motion.div>
  );
}