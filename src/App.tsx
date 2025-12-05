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
import { TestScenarioSelection } from './components/TestScenarioSelection';
import { TestErrorRecovery } from './components/TestErrorRecovery';
import { generateMockScenarios } from './utils/scenarioGenerator';
import { generateMockError, generateMockSolutions } from './utils/errorRecoveryGenerator';

type Screen = 'landing' | 'wallet-auth' | 'dashboard' | 'ai-architect' | 'plan-review' | 'flow-editor' | 'recording' | 'capture-review' | 'dry-run' | 'block-success' | 'test-scenario' | 'conditional-demo' | 'complex-demo' | 'smart-flow' | 'loop-flow' | 'advanced-loop' | 'interactive-loop';
type StepperStep = 'chat' | 'flow' | 'record' | 'test' | 'deploy';

// Mock action blocks
const mockActionBlocks = [
  {
    id: '1',
    name: 'Connect Wallet',
    goal: 'Connect your MetaMask wallet to the Base network and authorize the application.',
    nodeType: 'interaction' as const,
    variables: [
      { key: 'Connected Address', value: '0x742d...3a9f', type: 'capture' as const },
      { key: 'Current Balance', value: '1.5 ETH', type: 'capture' as const },
      { key: 'Gas Price', value: '0.002 ETH', type: 'capture' as const },
    ],
  },
  {
    id: '2',
    name: 'Check Balance',
    goal: 'Check if balance is sufficient for the swap.',
    nodeType: 'conditional' as const,
    variables: [
      { key: 'Min Balance', value: '0.1 ETH', type: 'preset' as const },
    ],
    // AI pre-configured paths
    paths: {
      yes: {
        blocks: ['3', '4'], // Monitor Price Loop → Retry Swap
      },
      no: {
        blocks: ['5'], // Send Notification
      },
    },
  },
  {
    id: '3',
    name: 'Monitor Price Loop',
    goal: 'Monitor price while volatility is low.',
    nodeType: 'while' as const,
    variables: [
      { key: 'Max Volatility', value: '2%', type: 'preset' as const },
    ],
  },
  {
    id: '4',
    name: 'Retry Swap',
    goal: 'Try to execute swap up to 3 times.',
    nodeType: 'for' as const,
    variables: [
      { key: 'Max Attempts', value: '3', type: 'preset' as const },
    ],
  },
  {
    id: '5',
    name: 'Send Notification',
    goal: 'Alert user on completion.',
    nodeType: 'interaction' as const,
    variables: [],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('recording');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stepperStep, setStepperStep] = useState<StepperStep>('record');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Error recovery state
  const [showErrorRecovery, setShowErrorRecovery] = useState(false);
  
  // Recording flow state
  const [currentBlockIndex, setCurrentBlockIndex] = useState(2); // Start at block 2 (Check Balance - conditional)
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
    setStepperStep('test');
    setCurrentScreen('test-scenario');
  };

  const handleSelectScenario = (scenarioId: string) => {
    // Navigate to dry run with selected scenario
    console.log('Selected scenario:', scenarioId);
    setCurrentScreen('dry-run');
  };

  const handleBackFromScenario = () => {
    // Return to flow editor
    setCurrentScreen('flow-editor');
  };

  const handleSelectSolution = (solutionId: string) => {
    console.log('Selected solution:', solutionId);
    setShowErrorRecovery(false);
    
    // Handle different solution actions
    if (solutionId === 'retry') {
      // Retry the test
      setCurrentScreen('dry-run');
    } else if (solutionId === 'edit') {
      // Go back to edit variables
      setCurrentScreen('capture-review');
    } else if (solutionId === 'debug') {
      // View logs (could open a debug screen)
      console.log('Opening debug logs...');
    }
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
          availableBlocks={mockActionBlocks}
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
      {currentScreen === 'test-scenario' && (
        <TestScenarioSelection
          scenarios={generateMockScenarios()}
          onSelectScenario={handleSelectScenario}
          onBack={handleBackFromScenario}
          onTestError={() => setShowErrorRecovery(true)}
        />
      )}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onGetStarted={handleStartCapture}
        />
      )}
      {showErrorRecovery && (
        <TestErrorRecovery
          isOpen={showErrorRecovery}
          onClose={() => setShowErrorRecovery(false)}
          error={generateMockError()}
          solutions={generateMockSolutions()}
          onSelectSolution={handleSelectSolution}
        />
      )}
    </div>
  );
}