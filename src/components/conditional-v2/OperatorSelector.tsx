import { motion } from 'motion/react';

interface OperatorSelectorProps {
  onSelectOperator: (operator: string) => void;
}

export function OperatorSelector({ onSelectOperator }: OperatorSelectorProps) {
  const operators = [
    { symbol: '>', label: 'Greater than' },
    { symbol: '<', label: 'Less than' },
    { symbol: '>=', label: 'Greater or equal' },
    { symbol: '<=', label: 'Less or equal' },
    { symbol: '==', label: 'Equal to' },
    { symbol: '!=', label: 'Not equal to' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-4"
    >
      <h3 className="text-[14px] text-gray-700 mb-3">Comparison Operator</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {operators.map((op, index) => (
          <motion.button
            key={op.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectOperator(op.symbol)}
            className="flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[#feee7d] hover:bg-[#feee7d]/5 active:scale-[0.98] transition-all min-h-[64px]"
          >
            <span className="text-[20px] text-black mb-1">{op.symbol}</span>
            <span className="text-[10px] text-gray-600 text-center leading-tight">
              {op.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
