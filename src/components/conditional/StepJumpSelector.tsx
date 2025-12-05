import { motion } from 'motion/react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface StepJumpSelectorProps {
  pathType: 'YES' | 'NO';
  condition: any;
  onSelectStep: (stepId: string) => void;
  onBack: () => void;
}

// Mock: Previous steps in the flow
const mockSteps = [
  { id: 'step-1', name: 'Connect Wallet' },
  { id: 'step-2', name: 'Check Balance' },
  { id: 'step-3', name: 'Monitor Price' },
  { id: 'step-4', name: 'While Loop' },
];

export function StepJumpSelector({ pathType, condition, onSelectStep, onBack }: StepJumpSelectorProps) {
  const { variableA, operator, variableB } = condition;
  const getVarDisplay = (v: any) => v?.name || v?.value || '?';
  const conditionString = `${getVarDisplay(variableA)} ${operator} ${getVarDisplay(variableB)}`;

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[20px] text-gray-900 mb-2">Jump to Step</h2>
          <p className="text-[14px] text-gray-600 mb-2">
            When: <span className="font-mono">{conditionString}</span>
          </p>
          <p className="text-[14px] text-gray-600 mb-4">
            Is {pathType === 'YES' ? 'TRUE' : 'FALSE'}, go back to:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-[14px] text-gray-700 mb-3">Select target step:</p>

          {mockSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className="w-full bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-[14px] text-gray-700">{index + 1}</span>
                  </div>
                  <span className="text-[16px] text-gray-900">{step.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </div>
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-[14px] text-yellow-900 font-semibold mb-1">
                Loop Warning
              </p>
              <p className="text-[14px] text-yellow-800">
                Going back may create a loop. Ensure your condition will eventually become FALSE to avoid infinite loops.
              </p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={onBack}
          className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
        >
          <span className="text-[16px]">Back</span>
        </button>
      </div>
    </div>
  );
}
