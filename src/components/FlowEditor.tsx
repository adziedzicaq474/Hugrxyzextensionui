import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowMarker } from './FlowMarker';
import { NodeConfigSheet } from './NodeConfigSheet';

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
  nodeType?: 'interaction' | 'conditional';
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

            {/* Connector after start */}
            <FlowConnector onAddNode={() => handleAddNode('start')} />

            {/* Action Nodes */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {nodes.map((node, index) => (
                <motion.div key={node.id} variants={itemVariants}>
                  <FlowNode
                    id={node.id}
                    type="action"
                    icon={node.icon}
                    title={node.title}
                    subtitle={node.subtitle}
                    status={node.status}
                    onClick={() => handleNodeClick(node.id)}
                  />

                  {/* Connector between nodes */}
                  <FlowConnector onAddNode={() => handleAddNode(node.id)} />
                </motion.div>
              ))}
            </motion.div>

            {/* End Marker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (nodes.length + 1) * 0.1 }}
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