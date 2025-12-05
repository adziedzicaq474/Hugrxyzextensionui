import { motion } from 'motion/react';
import { Hand, Hash, Variable } from 'lucide-react';

interface VariableSelectorProps {
  title: string;
  currentCondition?: string;
  onSelectCaptureFromPage: () => void;
  onSelectFixedValue: (value: any) => void;
  onSelectExistingVariable: (variable: any) => void;
  onBack: () => void;
}

export function VariableSelector({
  title,
  currentCondition,
  onSelectCaptureFromPage,
  onSelectFixedValue,
  onSelectExistingVariable,
  onBack,
}: VariableSelectorProps) {
  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[20px] text-gray-900 mb-2">{title}</h2>
          {currentCondition && (
            <p className="text-[14px] text-gray-600">
              Current: <span className="font-mono">{currentCondition}</span>
            </p>
          )}
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-[14px] text-gray-600 mb-3">How to get this value?</p>

          {/* Option 1: Capture from page */}
          <button
            onClick={onSelectCaptureFromPage}
            className="w-full bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hand className="w-5 h-5 text-blue-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Capture from page</h3>
                <p className="text-[14px] text-gray-600">
                  Click an element and extract its value
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Fixed value */}
          <button
            onClick={() => {
              // Open fixed value input modal
              const value = prompt('Enter a fixed value:');
              if (value !== null) {
                onSelectFixedValue({
                  type: 'fixed',
                  value: value,
                  dataType: isNaN(Number(value)) ? 'string' : 'number',
                });
              }
            }}
            className="w-full bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hash className="w-5 h-5 text-purple-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Fixed value</h3>
                <p className="text-[14px] text-gray-600">
                  Enter a constant number or text
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Use existing variable */}
          <button
            onClick={() => {
              // TODO: Show existing variables list
              onSelectExistingVariable({
                type: 'existing',
                name: 'currentPrice',
                value: '0.999652',
                dataType: 'number',
              });
            }}
            className="w-full bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Variable className="w-5 h-5 text-green-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Use existing variable</h3>
                <p className="text-[14px] text-gray-600">
                  Select from previously captured variables
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <p className="text-[14px] text-gray-600">
            <span className="font-semibold">Tip:</span> For dynamic values that change (like prices), use "Capture from page". For constants, use "Fixed value".
          </p>
        </motion.div>
      </div>
    </div>
  );
}
