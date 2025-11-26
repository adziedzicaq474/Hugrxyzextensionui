import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { WalletAuthWait } from './components/WalletAuthWait';
import { Dashboard } from './components/Dashboard';
import { AIArchitect } from './components/AIArchitect';
import { PlanReview } from './components/PlanReview';
import { FlowEditor } from './components/FlowEditor';
import { RecordingScreen } from './components/RecordingScreen';
import { ConditionalFlowDemo } from './components/ConditionalFlowDemo';
import { ComplexFlowDemo } from './components/ComplexFlowDemo';
import { SmartFlowDemo } from './components/SmartFlowDemo';
import { LoopFlowDemo } from './components/LoopFlowDemo';
import { AdvancedLoopDemo } from './components/AdvancedLoopDemo';
import { InteractiveLoopDemo } from './components/InteractiveLoopDemo';
import { OnboardingModal } from './components/OnboardingModal';
import { CaptureReview } from './components/CaptureReview';
import { DryRunScreen } from './components/DryRunScreen';
import { BlockRecordedSuccess } from './components/BlockRecordedSuccess';

type Screen = 'landing' | 'wallet-auth' | 'dashboard' | 'ai-architect' | 'plan-review' | 'flow-editor' | 'recording' | 'capture-review' | 'dry-run' | 'block-success' | 'conditional-demo' | 'complex-demo' | 'smart-flow' | 'loop-flow' | 'advanced-loop' | 'interactive-loop';
type StepperStep = 'chat' | 'flow' | 'record' | 'test' | 'deploy';

// Mock action blocks
const mockActionBlocks = [
  {
    id: '1',
    name: 'Connect Wallet',
    goal: 'Connect your MetaMask wallet to the Base network and authorize the application.',
    variables: [
      { key: 'Wallet', value: 'MetaMask', type: 'preset' as const },
      { key: 'Network', value: 'Base', type: 'preset' as const },
    ],
  },
  {
    id: '2',
    name: 'Select Tokens',
    goal: 'Choose the tokens you want to swap. Select ETH as input and USDC as output.',
    variables: [
      { key: 'Input Token', value: 'ETH', type: 'preset' as const },
      { key: 'Output Token', value: 'USDC', type: 'preset' as const },
      { key: 'DEX Platform', value: 'Uniswap', type: 'preset' as const },
    ],
  },
  {
    id: '3',
    name: 'Calculate Profit',
    goal: 'Review the exchange rate and calculate if the profit margin meets your threshold.',
    logic: [
      {
        condition: 'Check if net profit margin is greater than or equal to 5%',
        ifTrue: 'Continue to Step 4 (Execute Swap)',
        ifFalse: 'Skip to Step 6 (Wait and Retry)',
      },
    ],
    variables: [
      { key: 'Amount', value: '0.1 ETH', type: 'preset' as const },
      { key: 'Slippage', value: '0.5%', type: 'preset' as const },
      {
        key: 'current_rate',
        value: '',
        type: 'capture' as const,
        description: 'Current exchange rate from the page',
      },
      {
        key: 'estimated_output',
        value: '',
        type: 'capture' as const,
        description: 'Estimated USDC output shown on screen',
      },
    ],
  },
  {
    id: '4',
    name: 'Execute Swap',
    goal: 'Confirm and execute the token swap transaction on the blockchain.',
    variables: [
      { key: 'Gas Strategy', value: 'Medium', type: 'preset' as const },
      {
        key: 'swap_amount',
        value: '',
        type: 'from_step' as const,
        fromStep: 3,
      },
    ],
  },
  {
    id: '5',
    name: 'Bridge to Mantle',
    goal: 'Transfer your USDC from Base to Mantle network using the OKX bridge.',
    variables: [
      {
        key: 'route',
        value: '',
        type: 'from_step' as const,
        fromStep: 4,
      },
      { key: 'amount', value: 'amount_to_bridge', type: 'preset' as const },
      {
        key: 'bridge_url',
        value: '',
        type: 'capture' as const,
        description: 'Bridge URL from the routing page',
      },
      {
        key: 'source_token_address',
        value: '',
        type: 'capture' as const,
        description: 'Base USDC contract address',
      },
      {
        key: 'target_token_address',
        value: '',
        type: 'capture' as const,
        description: 'Mantle USDC contract address',
      },
    ],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('flow-editor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stepperStep, setStepperStep] = useState<StepperStep>('flow');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Recording flow state
  const [currentBlockIndex, setCurrentBlockIndex] = useState(1);
  const totalBlocks = mockActionBlocks.length;

  // Check if user has seen onboarding before
  useEffect(() => {
    const hideOnboarding = localStorage.getItem('hideOnboarding');
    if (hideOnboarding === 'true') {
      setHasSeenOnboarding(true);
      setShowOnboarding(false);
    } else {
      // First time user - show onboarding
      setShowOnboarding(true);
    }
  }, []);

  const handleStartCapture = () => {
    // Close modal
    setShowOnboarding(false);
    // Mark as seen
    setHasSeenOnboarding(true);
    // Navigate to Screen E.2 (Recording Screen)
    setCurrentScreen('recording');
    setStepperStep('record');
  };

  const handleStartBuilding = () => {
    if (!isAuthenticated) {
      // Navigate to wallet auth screen
      setCurrentScreen('wallet-auth');
    } else {
      // Already authenticated, go directly to AI Architect
      setCurrentScreen('ai-architect');
    }
  };

  const handleDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleWalletConnected = () => {
    setIsAuthenticated(true);
    setCurrentScreen('ai-architect');
  };

  const handleBack = () => {
    setCurrentScreen('landing');
    setStepperStep('chat');
  };

  const handleViewPlan = () => {
    setCurrentScreen('plan-review');
  };

  const handleBackToChat = () => {
    setCurrentScreen('ai-architect');
  };

  const handleConfirmPlan = () => {
    // Advance stepper to 'flow' and navigate to flow editor
    setStepperStep('flow');
    setCurrentScreen('flow-editor');
  };

  const handleRequestChanges = () => {
    // Return to AI Architect with prompt
    setInputPrompt('What changes would you like to make?');
    setCurrentScreen('ai-architect');
  };

  const handleBackFromFlow = () => {
    // Return to plan review
    setCurrentScreen('plan-review');
  };

  const handleNextFromFlow = () => {
    // Reset block index and advance stepper to 'record'
    setCurrentBlockIndex(1);
    setStepperStep('record');
    // Navigate directly to recording screen (merged component)
    setCurrentScreen('recording');
  };

  const handleStartRecordingBlock = () => {
    // Start recording current block
    setCurrentScreen('recording');
  };

  const handleStopRecording = () => {
    // Navigate to capture review
    setCurrentScreen('capture-review');
  };

  const handleDryRunForBlock = () => {
    // Navigate to dry run test
    setStepperStep('test');
    setCurrentScreen('dry-run');
  };

  const handleDryRunComplete = () => {
    // Dry run succeeded, show success screen
    setStepperStep('record');
    setCurrentScreen('block-success');
  };

  const handleNextBlock = () => {
    // Move to next block
    if (currentBlockIndex < totalBlocks) {
      setCurrentBlockIndex((prev) => prev + 1);
      setCurrentScreen('recording');
    }
  };

  const handleRetryBlock = () => {
    // Re-record current block
    setCurrentScreen('recording');
  };

  const handleFinishAllBlocks = () => {
    // All blocks recorded, navigate to deploy
    setStepperStep('deploy');
    console.log('All blocks recorded! Proceeding to deploy...');
  };

  const currentBlock = mockActionBlocks[currentBlockIndex - 1];
  const hasMoreBlocks = currentBlockIndex < totalBlocks;

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'landing' && (
        <LandingPage
          onStartBuilding={handleStartBuilding}
          onDashboard={handleDashboard}
        />
      )}
      {currentScreen === 'wallet-auth' && (
        <WalletAuthWait
          onWalletConnected={handleWalletConnected}
          onBack={handleBack}
        />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard onBack={handleBack} />
      )}
      {currentScreen === 'ai-architect' && (
        <AIArchitect 
          onBack={handleBack} 
          onViewPlan={handleViewPlan}
          stepperStep={stepperStep}
          initialPrompt={inputPrompt}
          onPromptUsed={() => setInputPrompt('')}
        />
      )}
      {currentScreen === 'plan-review' && (
        <PlanReview 
          onBack={handleBackToChat}
          onConfirm={handleConfirmPlan}
          onRequestChanges={handleRequestChanges}
        />
      )}
      {currentScreen === 'flow-editor' && (
        <FlowEditor
          onBack={handleBackFromFlow}
          onNext={handleNextFromFlow}
          stepperStep={stepperStep}
        />
      )}
      {currentScreen === 'recording' && (
        <RecordingScreen
          actionBlock={currentBlock}
          currentIndex={currentBlockIndex}
          totalBlocks={totalBlocks}
          onBack={() => setCurrentScreen('flow-editor')}
          onComplete={handleStopRecording}
        />
      )}
      {currentScreen === 'capture-review' && (
        <CaptureReview
          onBack={() => setCurrentScreen('recording')}
          onDryRun={handleDryRunForBlock}
          onAddMore={() => setCurrentScreen('recording')}
        />
      )}
      {currentScreen === 'dry-run' && (
        <DryRunScreen
          onBack={() => {
            setCurrentScreen('capture-review');
            setStepperStep('record');
          }}
          onComplete={handleDryRunComplete}
        />
      )}
      {currentScreen === 'block-success' && (
        <BlockRecordedSuccess
          blockName={currentBlock.name}
          currentIndex={currentBlockIndex}
          totalBlocks={totalBlocks}
          hasMoreBlocks={hasMoreBlocks}
          onNextBlock={handleNextBlock}
          onRetryBlock={handleRetryBlock}
          onFinish={handleFinishAllBlocks}
        />
      )}
      {currentScreen === 'conditional-demo' && (
        <ConditionalFlowDemo
          onBack={handleBack}
        />
      )}
      {currentScreen === 'complex-demo' && (
        <ComplexFlowDemo
          onBack={handleBack}
        />
      )}
      {currentScreen === 'smart-flow' && (
        <SmartFlowDemo
          onBack={handleBack}
        />
      )}
      {currentScreen === 'loop-flow' && (
        <LoopFlowDemo
          onBack={handleBack}
        />
      )}
      {currentScreen === 'advanced-loop' && (
        <AdvancedLoopDemo
          onBack={handleBack}
        />
      )}
      {currentScreen === 'interactive-loop' && (
        <InteractiveLoopDemo
          onBack={handleBack}
        />
      )}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onGetStarted={handleStartCapture}
        />
      )}
    </div>
  );
}