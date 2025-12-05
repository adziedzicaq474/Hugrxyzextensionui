import { motion } from 'motion/react';
import { GitBranch } from 'lucide-react';

interface ConditionBuilderProps {
  onContinue: () => void;
  currentCondition: {
    variableA: any;
    operator: string | null;
    variableB: any;
  };
}

export function ConditionBuilder({ onContinue, currentCondition }: ConditionBuilderProps) {
  const { variableA, operator, variableB } = currentCondition;

  const getDisplayValue = (value: any) => {
    if (!value) return 'Not set';
    if (value.type === 'fixed') return value.value;
    if (value.type === 'captured') return value.name;
    if (value.type === 'existing') return value.name;
    return 'Not set';
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#feee7d] rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[20px] text-gray-900">Define Condition</h2>
              <p className="text-[14px] text-gray-600">Build your if/else logic</p>
            </div>
          </div>
        </motion.div>

        {/* Condition Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6"
        >
          <p className="text-[14px] text-gray-600 mb-4">Build your condition:</p>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-center">
              <p className="text-[12px] text-gray-500 mb-1">Variable A</p>
              <p className="text-[16px] text-gray-900">{getDisplayValue(variableA)}</p>
            </div>
            
            <div className="w-16 bg-white border-2 border-gray-300 rounded-lg px-3 py-3 text-center">
              <p className="text-[16px] text-gray-900">{operator || '?'}</p>
            </div>
            
            <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-center">
              <p className="text-[12px] text-gray-500 mb-1">Value</p>
              <p className="text-[16px] text-gray-900">{getDisplayValue(variableB)}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-[14px] text-gray-700">
              Example: <span className="font-mono">currentPrice &gt; 1.0</span>
            </p>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <p className="text-[14px] text-gray-700">
            <span className="font-semibold">Next steps:</span> You'll define Variable A, choose an operator ({'>'}, &lt;, ==), and set the comparison value.
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={onContinue}
            className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
          >
            <span className="text-[16px]">Set Variable A</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}