import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { FormulaBuilder } from './FormulaBuilder';
import { VariableSelector } from './VariableSelector';
import { OperatorSelector } from './OperatorSelector';
import { CaptureSetup } from './CaptureSetup';
import { FixedValueInput } from './FixedValueInput';
import { ExistingVariableSelector } from './ExistingVariableSelector';
import { RecordingQueue } from './RecordingQueue';
import { PathPreview } from './PathPreview';

interface Variable {
  name: string;
  type: 'capture' | 'fixed' | 'existing';
  value?: string;
  extractionMethod?: 'full' | 'regex';
  regexPattern?: string;
}

interface ConditionData {
  varA: Variable | null;
  operator: string | null;
  varB: Variable | null;
}

interface PathConfig {
  blocks: string[];
}

interface ActionBlock {
  id: string;
  name: string;
  goal: string;
  nodeType: 'interaction' | 'conditional' | 'while' | 'for';
  variables?: any[];
  paths?: {
    yes?: PathConfig;
    no?: PathConfig;
  };
}

interface ConditionalSetupScreenProps {
  actionBlock: ActionBlock;
  currentIndex: number;
  totalBlocks: number;
  availableBlocks: ActionBlock[];
  onBack: () => void;
  onComplete: () => void;
}

type ContentView =
  | 'formula'
  | 'var-selector'
  | 'operator-selector'
  | 'capture-setup'
  | 'fixed-input'
  | 'path-preview'
  | 'yes-recording'
  | 'no-recording'
  | 'complete';

export function ConditionalSetupScreen({
  actionBlock,
  currentIndex,
  totalBlocks,
  availableBlocks,
  onBack,
  onComplete,
}: ConditionalSetupScreenProps) {
  const [activeField, setActiveField] = useState<'varA' | 'operator' | 'varB' | null>('varA');
  const [currentView, setCurrentView] = useState<ContentView>('var-selector');

  const [condition, setCondition] = useState<ConditionData>({
    varA: null,
    operator: null,
    varB: null,
  });

  const [pathRecordings, setPathRecordings] = useState<{
    yes: any[] | null;
    no: any[] | null;
  }>({
    yes: null,
    no: null,
  });

  const progress = (currentIndex / totalBlocks) * 100;
  const isConditionComplete = condition.varA && condition.operator && condition.varB;

  // Get pre-configured paths from AI
  const yesPathBlocks = actionBlock.paths?.yes?.blocks || [];
  const noPathBlocks = actionBlock.paths?.no?.blocks || [];

  // Get actual block objects
  const yesBlocks = yesPathBlocks
    .map((id) => availableBlocks.find((b) => b.id === id))
    .filter(Boolean) as ActionBlock[];
  const noBlocks = noPathBlocks
    .map((id) => availableBlocks.find((b) => b.id === id))
    .filter(Boolean) as ActionBlock[];

  // Collect all available variables from previous blocks
  const availableVariables = availableBlocks
    .filter((block) => parseInt(block.id) < parseInt(actionBlock.id)) // Only from previous blocks
    .flatMap((block) => block.variables || [])
    .map((v) => ({
      name: v.key,
      type: 'existing' as const,
      value: v.value,
      originalType: v.type,
      description: v.description,
      fromStep: v.fromStep,
    }));

  // Handle field selection from formula
  const handleSelectField = (field: 'varA' | 'operator' | 'varB') => {
    setActiveField(field);

    if (field === 'operator') {
      setCurrentView('operator-selector');
    } else {
      setCurrentView('var-selector');
    }
  };

  // Handle variable selection mode
  const handleSelectCapture = () => {
    setCurrentView('capture-setup');
  };

  const handleSelectFixed = () => {
    setCurrentView('fixed-input');
  };

  const handleSelectExisting = () => {
    setCurrentView('existing-variable-selector');
  };

  // Handle capture recording start
  const handleStartRecording = (
    variableName: string,
    extractionConfig?: { method: 'full' | 'regex'; pattern?: string; testExample?: string }
  ) => {
    // In real implementation, this would start the actual recording
    console.log('Recording completed:', variableName, extractionConfig);

    const capturedVariable: Variable = {
      name: variableName,
      type: 'capture',
      value: extractionConfig?.testExample || 'captured_value',
      extractionMethod: extractionConfig?.method,
      regexPattern: extractionConfig?.pattern,
    };

    if (activeField === 'varA') {
      setCondition({ ...condition, varA: capturedVariable });
      setActiveField('operator');
      setCurrentView('operator-selector');
    } else if (activeField === 'varB') {
      setCondition({ ...condition, varB: capturedVariable });
      setActiveField(null);
      setCurrentView('formula');
    }
  };

  // Handle fixed value confirm
  const handleFixedValueConfirm = (name: string, value: string) => {
    const fixedVariable: Variable = {
      name,
      type: 'fixed',
      value,
    };

    if (activeField === 'varA') {
      setCondition({ ...condition, varA: fixedVariable });
      setActiveField('operator');
      setCurrentView('operator-selector');
    } else if (activeField === 'varB') {
      setCondition({ ...condition, varB: fixedVariable });
      setActiveField(null);
      setCurrentView('formula');
    }
  };

  // Handle existing variable selection
  const handleExistingVariableSelect = (variable: Variable) => {
    if (activeField === 'varA') {
      setCondition({ ...condition, varA: variable });
      setActiveField('operator');
      setCurrentView('operator-selector');
    } else if (activeField === 'varB') {
      setCondition({ ...condition, varB: variable });
      setActiveField(null);
      setCurrentView('formula');
    }
  };

  // Handle operator selection
  const handleOperatorSelect = (operator: string) => {
    setCondition({ ...condition, operator });
    setActiveField('varB');
    setCurrentView('var-selector');
  };

  // Handle path preview confirmation
  const handleStartPathRecording = () => {
    // Start with YES path if it has blocks
    if (yesBlocks.length > 0) {
      setCurrentView('yes-recording');
    } else if (noBlocks.length > 0) {
      setCurrentView('no-recording');
    } else {
      // No paths to record
      onComplete();
    }
  };

  // Handle YES path recording complete
  const handleYesRecordingComplete = (recordings: any[]) => {
    setPathRecordings({
      ...pathRecordings,
      yes: recordings,
    });

    // Move to NO path or complete
    if (noBlocks.length > 0) {
      setCurrentView('no-recording');
    } else {
      setCurrentView('complete');
      setTimeout(onComplete, 1500);
    }
  };

  // Handle NO path recording complete
  const handleNoRecordingComplete = (recordings: any[]) => {
    setPathRecordings({
      ...pathRecordings,
      no: recordings,
    });

    // All done
    setCurrentView('complete');
    setTimeout(onComplete, 1500);
  };

  // Render current view
  const renderContent = () => {
    // Full-screen recording views
    if (currentView === 'yes-recording' && yesBlocks.length > 0) {
      return (
        <RecordingQueue
          pathType="YES"
          blocks={yesBlocks}
          onComplete={handleYesRecordingComplete}
          onBack={() => setCurrentView('path-preview')}
        />
      );
    }

    if (currentView === 'no-recording' && noBlocks.length > 0) {
      return (
        <RecordingQueue
          pathType="NO"
          blocks={noBlocks}
          onComplete={handleNoRecordingComplete}
          onBack={() => {
            // If YES was already recorded, can't go back
            if (pathRecordings.yes) {
              return;
            }
            setCurrentView('path-preview');
          }}
        />
      );
    }

    // Complete view
    if (currentView === 'complete') {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#10B981]" strokeWidth={2} />
            </div>
            <h2 className="text-[20px] text-black mb-2">Conditional Recorded!</h2>
            <p className="text-[14px] text-gray-600">Both paths configured successfully</p>
          </motion.div>
        </div>
      );
    }

    // Standard view with header and body
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="px-4 py-4">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              <span className="text-[16px]">Back</span>
            </button>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] text-gray-600">
                  Recording Step {currentIndex}/{totalBlocks}
                </span>
                <span className="text-[14px] text-gray-900">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-[#feee7d]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Step Title */}
            <h2 className="text-[20px] text-gray-900">{actionBlock.name}</h2>
            <p className="text-[14px] text-gray-600 mt-1">If/Else Conditional</p>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-md mx-auto space-y-4">
            {/* Stage 1: Formula Builder */}
            <FormulaBuilder
              condition={condition}
              activeField={activeField}
              onSelectField={handleSelectField}
            />

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              {currentView === 'var-selector' && (
                <VariableSelector
                  key="var-selector"
                  title={activeField === 'varA' ? 'Variable A' : 'Comparison Value'}
                  onSelectCapture={handleSelectCapture}
                  onSelectFixed={handleSelectFixed}
                  onSelectExisting={handleSelectExisting}
                />
              )}

              {currentView === 'operator-selector' && (
                <OperatorSelector key="operator-selector" onSelectOperator={handleOperatorSelect} />
              )}

              {currentView === 'capture-setup' && (
                <CaptureSetup
                  key="capture-setup"
                  fieldName={activeField === 'varA' ? 'Variable A' : 'Variable B'}
                  onStartRecording={handleStartRecording}
                  onBack={() => setCurrentView('var-selector')}
                />
              )}

              {currentView === 'fixed-input' && (
                <FixedValueInput
                  key="fixed-input"
                  fieldName={activeField === 'varA' ? 'Variable A' : 'Variable B'}
                  onConfirm={handleFixedValueConfirm}
                  onBack={() => setCurrentView('var-selector')}
                />
              )}

              {currentView === 'existing-variable-selector' && (
                <ExistingVariableSelector
                  key="existing-variable-selector"
                  fieldName={activeField === 'varA' ? 'Variable A' : 'Variable B'}
                  availableVariables={availableVariables}
                  onSelectVariable={handleExistingVariableSelect}
                  onBack={() => setCurrentView('var-selector')}
                />
              )}

              {/* Stage 2: Path Preview (AI pre-configured) */}
              {isConditionComplete && currentView === 'formula' && (
                <motion.div
                  key="formula-complete"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => setCurrentView('path-preview')}
                    className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
                  >
                    <span className="text-[16px]">Continue to Path Recording</span>
                  </button>
                </motion.div>
              )}

              {currentView === 'path-preview' && (
                <PathPreview
                  key="path-preview"
                  condition={condition}
                  yesBlocks={yesBlocks}
                  noBlocks={noBlocks}
                  onConfirm={handleStartPathRecording}
                  onBack={() => setCurrentView('formula')}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
}