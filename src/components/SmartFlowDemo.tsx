import { ArrowLeft, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowConnectorGreen } from './FlowConnectorGreen';
import { FlowMarker } from './FlowMarker';
import { ConditionalNodeV3 } from './ConditionalNodeV3';
import { PathIndicator } from './PathIndicator';
import { FlowPreview } from './FlowPreview';

interface SmartFlowDemoProps {
  onBack: () => void;
}

type PathChoice = 'yes' | 'no';

export function SmartFlowDemo({ onBack }: SmartFlowDemoProps) {
  const [currentPath, setCurrentPath] = useState<PathChoice[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToMain = () => {
    setCurrentPath([]);
  };

  const switchPath = (index: number, choice: PathChoice) => {
    const newPath = [...currentPath];
    newPath[index] = choice;
    // Remove any choices after this index
    newPath.length = index + 1;
    setCurrentPath(newPath);
  };

  // Flow definition - nested structure
  // Main path (all YES choices)
  // Conditional 1: Balance > $1000
  //   YES -> Step 4 -> Conditional 2: Market Bullish
  //     YES -> Step 6 -> Conditional 3: APY > 15%
  //       YES -> Step 8 -> End
  //       NO  -> Step 12 -> End
  //     NO  -> Step 13 -> End
  //   NO  -> Step 14 -> Conditional 4: Has Experience
  //     YES -> Step 15 -> End
  //     NO  -> Step 16 -> End

  // Preview nodes for global view
  const previewNodes = [
    { id: '1', type: 'action' as const, title: 'Connect Wallet', x: 200, y: 20 },
    { id: '2', type: 'action' as const, title: 'Check Balance', x: 200, y: 80 },
    { id: '3', type: 'conditional' as const, title: 'Balance > $1000?', x: 200, y: 140, yesBranch: '4', noBranch: '14' },
    
    // YES branch from Conditional 1
    { id: '4', type: 'action' as const, title: 'Analyze Market', x: 280, y: 220, parent: '3' },
    { id: '5', type: 'conditional' as const, title: 'Market Bullish?', x: 280, y: 280, yesBranch: '6', noBranch: '13', parent: '4' },
    
    // YES branch from Conditional 2
    { id: '6', type: 'action' as const, title: 'Select Pool', x: 360, y: 360, parent: '5' },
    { id: '7', type: 'conditional' as const, title: 'APY > 15%?', x: 360, y: 420, yesBranch: '8', noBranch: '12', parent: '6' },
    { id: '8', type: 'action' as const, title: 'Deposit Max', x: 440, y: 500, parent: '7' },
    
    // NO branch from Conditional 3
    { id: '12', type: 'action' as const, title: 'Find Alternative', x: 280, y: 500, parent: '7' },
    
    // NO branch from Conditional 2
    { id: '13', type: 'action' as const, title: 'Wait Bull Market', x: 200, y: 360, parent: '5' },
    
    // NO branch from Conditional 1
    { id: '14', type: 'action' as const, title: 'Micro Strategy', x: 120, y: 220, parent: '3' },
    { id: '15', type: 'conditional' as const, title: 'Has Experience?', x: 120, y: 280, yesBranch: '16', noBranch: '17', parent: '14' },
    { id: '16', type: 'action' as const, title: 'Advanced Mode', x: 200, y: 360, parent: '15' },
    { id: '17', type: 'action' as const, title: 'Safe Mode', x: 40, y: 360, parent: '15' },
  ];

  // Determine what to show based on current path
  const getCurrentView = () => {
    // Main path (YES, YES, YES)
    if (currentPath.length === 0 || currentPath[0] === 'yes') {
      if (currentPath.length <= 1 || currentPath[1] === 'yes') {
        if (currentPath.length <= 2 || currentPath[2] === 'yes') {
          // Main YES path
          return 'main';
        } else {
          // Conditional 3 NO branch
          return 'cond3-no';
        }
      } else {
        // Conditional 2 NO branch
        return 'cond2-no';
      }
    } else {
      // Conditional 1 NO branch
      if (currentPath.length <= 1 || currentPath[1] === 'yes') {
        return 'cond1-no-yes';
      } else {
        return 'cond1-no-no';
      }
    }
  };

  const view = getCurrentView();

  // Determine slide direction
  const getSlideDirection = (prevPath: PathChoice[], newPath: PathChoice[]) => {
    // If switching from yes to no at any level: slide right (no path comes from left)
    // If switching from no to yes at any level: slide left (yes path comes from right)
    
    for (let i = 0; i < Math.max(prevPath.length, newPath.length); i++) {
      if (prevPath[i] !== newPath[i]) {
        if (newPath[i] === 'no') {
          return 'right'; // NO path slides in from left
        } else {
          return 'left'; // YES path slides in from right
        }
      }
    }
    return 'right';
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
          <h1 className="text-[20px] leading-tight">Smart Flow Editor</h1>
          <button
            onClick={() => setShowPreview(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Removed PathIndicator - no more viewing branch warning */}

      <div className="flex-1 overflow-y-auto pt-[106px] pb-8">
        <div className="py-6">
          <AnimatePresence mode="wait">
            {view === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <FlowMarker type="start" />
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="1"
                    type="action"
                    icon="wallet"
                    title="Step 1: Connect Wallet"
                    subtitle="Initialize Web3 connection"
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="2"
                    type="action"
                    icon="trend"
                    title="Step 2: Check Balance"
                    subtitle="Query wallet balance"
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="3"
                    condition="If Balance > $1000"
                    status="recorded"
                    currentPath="yes"
                    onSwitchToNo={() => switchPath(0, 'no')}
                  />
                </div>
                <FlowConnectorGreen />

                <div className="px-4">
                  <FlowNode
                    id="4"
                    type="action"
                    icon="trend"
                    title="Step 4: Analyze Market"
                    subtitle="Check market conditions"
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="5"
                    condition="If Market Bullish"
                    status="recorded"
                    currentPath="yes"
                    onSwitchToNo={() => switchPath(1, 'no')}
                  />
                </div>
                <FlowConnectorGreen />

                <div className="px-4">
                  <FlowNode
                    id="6"
                    type="action"
                    icon="swap"
                    title="Step 6: Select High APY Pool"
                    subtitle="Find pool with > 15% APY"
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="7"
                    condition="If APY > 15%"
                    status="recorded"
                    currentPath="yes"
                    onSwitchToNo={() => switchPath(2, 'no')}
                  />
                </div>
                <FlowConnectorGreen />

                <div className="px-4">
                  <FlowNode
                    id="8"
                    type="action"
                    icon="swap"
                    title="Step 8: Deposit Max Amount"
                    subtitle="Deposit full balance"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <FlowMarker type="end" />
              </motion.div>
            )}

            {view === 'cond3-no' && (
              <motion.div
                key="cond3-no"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <FlowMarker type="start" />
                <FlowConnector />

                <div className="px-4 opacity-50">
                  <FlowNode
                    id="1"
                    type="action"
                    icon="wallet"
                    title="Step 1: Connect Wallet"
                    subtitle="(Previous steps)"
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="7"
                    condition="If APY > 15%"
                    status="recorded"
                    currentPath="no"
                    onSwitchToYes={() => switchPath(2, 'yes')}
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="12"
                    type="action"
                    icon="alert"
                    title="Step 12: Find Alternative Pool"
                    subtitle="Search for better options"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <FlowMarker type="end" />
              </motion.div>
            )}

            {view === 'cond2-no' && (
              <motion.div
                key="cond2-no"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <FlowMarker type="start" />
                <FlowConnector />

                <div className="px-4 opacity-50">
                  <FlowNode
                    id="1"
                    type="action"
                    icon="wallet"
                    title="Step 1-4: Previous Steps"
                    subtitle="Connect, Check, Analyze..."
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="5"
                    condition="If Market Bullish"
                    status="recorded"
                    currentPath="no"
                    onSwitchToYes={() => switchPath(1, 'yes')}
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="13"
                    type="action"
                    icon="alert"
                    title="Step 13: Wait for Bull Market"
                    subtitle="Monitor market conditions"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <FlowMarker type="end" />
              </motion.div>
            )}

            {view === 'cond1-no-yes' && (
              <motion.div
                key="cond1-no-yes"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <FlowMarker type="start" />
                <FlowConnector />

                <div className="px-4 opacity-50">
                  <FlowNode
                    id="1"
                    type="action"
                    icon="wallet"
                    title="Step 1-2: Previous Steps"
                    subtitle="Connect, Check balance..."
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="3"
                    condition="If Balance > $1000"
                    status="recorded"
                    currentPath="no"
                    onSwitchToYes={() => switchPath(0, 'yes')}
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="14"
                    type="action"
                    icon="wallet"
                    title="Step 14: Use Micro Strategy"
                    subtitle="Strategy for small balances"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="15"
                    condition="If Has DeFi Experience"
                    status="pending"
                    currentPath="yes"
                    onSwitchToNo={() => switchPath(1, 'no')}
                  />
                </div>
                <FlowConnectorGreen />

                <div className="px-4">
                  <FlowNode
                    id="16"
                    type="action"
                    icon="trend"
                    title="Step 16: Advanced Mode"
                    subtitle="Use advanced features"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <FlowMarker type="end" />
              </motion.div>
            )}

            {view === 'cond1-no-no' && (
              <motion.div
                key="cond1-no-no"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col"
              >
                <FlowMarker type="start" />
                <FlowConnector />

                <div className="px-4 opacity-50">
                  <FlowNode
                    id="1"
                    type="action"
                    icon="wallet"
                    title="Step 1-14: Previous Steps"
                    subtitle="Connect, Check, Micro Strategy..."
                    status="recorded"
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <ConditionalNodeV3
                    id="15"
                    condition="If Has DeFi Experience"
                    status="pending"
                    currentPath="no"
                    onSwitchToYes={() => switchPath(1, 'yes')}
                  />
                </div>
                <FlowConnector />

                <div className="px-4">
                  <FlowNode
                    id="17"
                    type="action"
                    icon="alert"
                    title="Step 17: Safe Mode"
                    subtitle="Keep funds in wallet"
                    status="pending"
                  />
                </div>
                <FlowConnector />

                <FlowMarker type="end" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FlowPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        nodes={previewNodes}
      />
    </motion.div>
  );
}