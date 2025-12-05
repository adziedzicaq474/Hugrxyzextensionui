import { motion } from 'motion/react';

interface OperatorSelectorProps {
  variableA: any;
  onSelectOperator: (operator: string) => void;
  onBack: () => void;
}

const operators = [
  { symbol: '>', label: 'Greater than', description: 'A > B' },
  { symbol: '<', label: 'Less than', description: 'A < B' },
  { symbol: '>=', label: 'Greater or equal', description: 'A >= B' },
  { symbol: '<=', label: 'Less or equal', description: 'A <= B' },
  { symbol: '==', label: 'Equal to', description: 'A == B' },
  { symbol: '!=', label: 'Not equal to', description: 'A != B' },
];

export function OperatorSelector({ variableA, onSelectOperator, onBack }: OperatorSelectorProps) {
  const varDisplay = variableA?.name || variableA?.value || '?';

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[20px] text-gray-900 mb-2">Select Operator</h2>
          <p className="text-[14px] text-gray-600">
            Left side: <span className="font-mono font-semibold">{varDisplay}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-[14px] text-gray-700 mb-3">Choose comparison:</p>

          <div className="grid grid-cols-2 gap-3">
            {operators.map((op, index) => (
              <motion.button
                key={op.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => onSelectOperator(op.symbol)}
                className="bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-center transition-all active:scale-[0.95] min-h-[44px]"
              >
                <div className="text-[24px] text-gray-900 mb-1">{op.symbol}</div>
                <div className="text-[12px] text-gray-600">{op.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <p className="text-[14px] text-gray-700">
            <span className="font-semibold">Example:</span> If you want to check if the price is above 1.0, select <span className="font-mono">&gt;</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}