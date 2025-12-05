import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

// Phases
import { ConditionBuilder } from './conditional/ConditionBuilder';
import { VariableSelector } from './conditional/VariableSelector';
import { VariableCapture } from './conditional/VariableCapture';
import { OperatorSelector } from './conditional/OperatorSelector';
import { ConditionSummary } from './conditional/ConditionSummary';
import { PathActionSelector } from './conditional/PathActionSelector';
import { PathRecording } from './conditional/PathRecording';
import { StepJumpSelector } from './conditional/StepJumpSelector';

interface Variable {
  key: string;
  value: string;
  type: 'preset' | 'from_step' | 'capture';
  fromStep?: number;
  description?: string;
}

interface LogicCondition {
  condition: string;
  ifTrue: string;
  ifFalse: string;
}

interface ActionBlock {
  id: string;
  name: string;
  goal: string;
  logic?: LogicCondition[];
  variables: Variable[];
  nodeType?: 'interaction' | 'conditional' | 'while' | 'for';
}

interface ConditionalRecordingFlowProps {
  actionBlock: ActionBlock;
  currentIndex: number;
  totalBlocks: number;
  onBack: () => void;
  onComplete: () => void;
}

// Flow phases
type Phase = 
  | 'condition-builder'
  | 'variable-a-selector'
  | 'variable-a-capture'
  | 'operator-selector'
  | 'variable-b-selector'
  | 'variable-b-capture'
  | 'condition-summary'
  | 'yes-path-action'
  | 'yes-path-record'
  | 'yes-path-jump'
  | 'no-path-action'
  | 'no-path-record'
  | 'no-path-jump'
  | 'complete';

export function ConditionalRecordingFlow({
  actionBlock,
  currentIndex,
  totalBlocks,
  onBack,
  onComplete,
}: ConditionalRecordingFlowProps) {
  const [currentPhase, setCurrentPhase] = useState<Phase>('condition-builder');
  const [conditionData, setConditionData] = useState({
    variableA: null as any,
    operator: null as string | null,
    variableB: null as any,
  });
  const [pathActions, setPathActions] = useState({
    yes: null as any,
    no: null as any,
  });

  const progress = (currentIndex / totalBlocks) * 100;

  const handleBack = () => {
    if (currentPhase === 'condition-builder') {
      onBack();
    } else {
      // Navigate to previous phase
      // TODO: Implement phase navigation logic
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'condition-builder':
        return (
          <ConditionBuilder
            onContinue={() => setCurrentPhase('variable-a-selector')}
            currentCondition={conditionData}
          />
        );

      case 'variable-a-selector':
        return (
          <VariableSelector
            title="Variable A"
            onSelectCaptureFromPage={() => setCurrentPhase('variable-a-capture')}
            onSelectFixedValue={(value) => {
              setConditionData({ ...conditionData, variableA: value });
              setCurrentPhase('operator-selector');
            }}
            onSelectExistingVariable={(variable) => {
              setConditionData({ ...conditionData, variableA: variable });
              setCurrentPhase('operator-selector');
            }}
            onBack={() => setCurrentPhase('condition-builder')}
          />
        );

      case 'variable-a-capture':
        return (
          <VariableCapture
            variableName="Variable A"
            onComplete={(capturedVariable) => {
              setConditionData({ ...conditionData, variableA: capturedVariable });
              setCurrentPhase('operator-selector');
            }}
            onBack={() => setCurrentPhase('variable-a-selector')}
          />
        );

      case 'operator-selector':
        return (
          <OperatorSelector
            variableA={conditionData.variableA}
            onSelectOperator={(operator) => {
              setConditionData({ ...conditionData, operator });
              setCurrentPhase('variable-b-selector');
            }}
            onBack={() => setCurrentPhase('variable-a-selector')}
          />
        );

      case 'variable-b-selector':
        return (
          <VariableSelector
            title="Comparison Value"
            currentCondition={`${conditionData.variableA?.name || '?'} ${conditionData.operator || '?'} `}
            onSelectCaptureFromPage={() => setCurrentPhase('variable-b-capture')}
            onSelectFixedValue={(value) => {
              setConditionData({ ...conditionData, variableB: value });
              setCurrentPhase('condition-summary');
            }}
            onSelectExistingVariable={(variable) => {
              setConditionData({ ...conditionData, variableB: variable });
              setCurrentPhase('condition-summary');
            }}
            onBack={() => setCurrentPhase('operator-selector')}
          />
        );

      case 'variable-b-capture':
        return (
          <VariableCapture
            variableName="Variable B"
            onComplete={(capturedVariable) => {
              setConditionData({ ...conditionData, variableB: capturedVariable });
              setCurrentPhase('condition-summary');
            }}
            onBack={() => setCurrentPhase('variable-b-selector')}
          />
        );

      case 'condition-summary':
        return (
          <ConditionSummary
            condition={conditionData}
            onEdit={() => setCurrentPhase('condition-builder')}
            onConfirm={() => setCurrentPhase('yes-path-action')}
          />
        );

      case 'yes-path-action':
        return (
          <PathActionSelector
            pathType="YES"
            condition={conditionData}
            onSelectRecord={() => setCurrentPhase('yes-path-record')}
            onSelectJump={() => setCurrentPhase('yes-path-jump')}
            onSelectSkip={() => {
              setPathActions({ ...pathActions, yes: { type: 'skip' } });
              setCurrentPhase('no-path-action');
            }}
            onBack={() => setCurrentPhase('condition-summary')}
          />
        );

      case 'yes-path-record':
        return (
          <PathRecording
            pathType="YES"
            condition={conditionData}
            onComplete={(steps) => {
              setPathActions({ ...pathActions, yes: { type: 'record', steps } });
              setCurrentPhase('no-path-action');
            }}
            onBack={() => setCurrentPhase('yes-path-action')}
          />
        );

      case 'yes-path-jump':
        return (
          <StepJumpSelector
            pathType="YES"
            condition={conditionData}
            onSelectStep={(stepId) => {
              setPathActions({ ...pathActions, yes: { type: 'goto', stepId } });
              setCurrentPhase('no-path-action');
            }}
            onBack={() => setCurrentPhase('yes-path-action')}
          />
        );

      case 'no-path-action':
        return (
          <PathActionSelector
            pathType="NO"
            condition={conditionData}
            onSelectRecord={() => setCurrentPhase('no-path-record')}
            onSelectJump={() => setCurrentPhase('no-path-jump')}
            onSelectSkip={() => {
              setPathActions({ ...pathActions, no: { type: 'skip' } });
              setCurrentPhase('complete');
            }}
            onBack={() => setCurrentPhase('yes-path-action')}
          />
        );

      case 'no-path-record':
        return (
          <PathRecording
            pathType="NO"
            condition={conditionData}
            onComplete={(steps) => {
              setPathActions({ ...pathActions, no: { type: 'record', steps } });
              setCurrentPhase('complete');
            }}
            onBack={() => setCurrentPhase('no-path-action')}
          />
        );

      case 'no-path-jump':
        return (
          <StepJumpSelector
            pathType="NO"
            condition={conditionData}
            onSelectStep={(stepId) => {
              setPathActions({ ...pathActions, no: { type: 'goto', stepId } });
              setCurrentPhase('complete');
            }}
            onBack={() => setCurrentPhase('no-path-action')}
          />
        );

      case 'complete':
        return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[24px] text-gray-900 mb-2">Conditional Complete</h2>
              <p className="text-[16px] text-gray-600 mb-6">
                Your if/else logic has been recorded successfully.
              </p>
              <button
                onClick={onComplete}
                className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
              >
                <span className="text-[16px]">Complete</span>
              </button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="px-4 py-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
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

      {/* Body - Phase Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
