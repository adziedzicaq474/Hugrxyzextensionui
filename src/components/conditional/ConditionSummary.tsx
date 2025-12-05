import { motion } from 'motion/react';
import { CheckCircle, Edit2 } from 'lucide-react';

interface ConditionSummaryProps {
  condition: {
    variableA: any;
    operator: string | null;
    variableB: any;
  };
  onEdit: () => void;
  onConfirm: () => void;
}

export function ConditionSummary({ condition, onEdit, onConfirm }: ConditionSummaryProps) {
  const { variableA, operator, variableB } = condition;

  const getVarDisplay = (v: any) => {
    if (!v) return '?';
    if (v.type === 'fixed') return v.value;
    if (v.type === 'captured') return v.name;
    if (v.type === 'existing') return v.name;
    return '?';
  };

  const getVarType = (v: any) => {
    if (!v) return '';
    if (v.type === 'fixed') return `fixed, ${v.dataType}`;
    if (v.type === 'captured') return `captured, ${v.dataType}`;
    if (v.type === 'existing') return `existing, ${v.dataType}`;
    return '';
  };

  const conditionString = `${getVarDisplay(variableA)} ${operator} ${getVarDisplay(variableB)}`;

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[20px] text-gray-900 mb-2">Condition Summary</h2>
          <p className="text-[14px] text-gray-600">Review your condition</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2} />
            <span className="text-[14px] text-green-700 font-semibold">
              Your condition:
            </span>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-[20px] text-gray-900 font-mono text-center mb-4">
              {conditionString}
            </p>

            <div className="space-y-3 text-[14px]">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[60px]">Left:</span>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">{getVarDisplay(variableA)}</p>
                  <p className="text-gray-600 text-[12px]">({getVarType(variableA)})</p>
                  {variableA?.captureConfig?.extractedValue && (
                    <p className="text-gray-600 text-[12px]">
                      Current: {variableA.captureConfig.extractedValue}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[60px]">Right:</span>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">{getVarDisplay(variableB)}</p>
                  <p className="text-gray-600 text-[12px]">({getVarType(variableB)})</p>
                </div>
              </div>

              {/* Result preview if possible */}
              {variableA?.captureConfig?.extractedValue && variableB?.value && (
                <div className="pt-3 border-t border-green-200">
                  <span className="text-gray-600">Current result: </span>
                  <span className="text-gray-900 font-semibold">
                    {eval(`${variableA.captureConfig.extractedValue} ${operator} ${variableB.value}`) ? 'TRUE ✓' : 'FALSE ✗'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-green-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-[14px]">Edit</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onConfirm}
            className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
          >
            <span className="text-[16px]">Confirm Condition</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
