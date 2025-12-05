import { motion } from 'motion/react';

interface Variable {
  name: string;
  type: 'capture' | 'fixed' | 'existing';
  value?: string;
}

interface ConditionData {
  varA: Variable | null;
  operator: string | null;
  varB: Variable | null;
}

interface FormulaBuilderProps {
  condition: ConditionData;
  activeField: 'varA' | 'operator' | 'varB' | null;
  onSelectField: (field: 'varA' | 'operator' | 'varB') => void;
}

export function FormulaBuilder({
  condition,
  activeField,
  onSelectField,
}: FormulaBuilderProps) {
  const getFieldState = (
    field: 'varA' | 'operator' | 'varB'
  ): 'empty' | 'filled' | 'active' => {
    if (activeField === field) return 'active';
    if (condition[field]) return 'filled';
    return 'empty';
  };

  const getFieldClassName = (state: 'empty' | 'filled' | 'active') => {
    switch (state) {
      case 'empty':
        return 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400';
      case 'filled':
        return 'border-2 border-black bg-[#F2F2F2] hover:bg-gray-200';
      case 'active':
        return 'border-2 border-[#feee7d] bg-[#feee7d]/10';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
      <h3 className="text-[14px] text-gray-700 mb-3">IF Condition</h3>
      
      <div className="flex items-center gap-2">
        {/* Variable A */}
        <motion.button
          onClick={() => onSelectField('varA')}
          className={`flex-1 min-h-[44px] px-4 py-3 rounded-md transition-all ${getFieldClassName(
            getFieldState('varA')
          )}`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-[14px] text-black">
            {condition.varA ? condition.varA.name : '?'}
          </span>
        </motion.button>

        {/* Operator */}
        <motion.button
          onClick={() => onSelectField('operator')}
          className={`w-20 min-h-[44px] px-3 py-3 rounded-md transition-all ${getFieldClassName(
            getFieldState('operator')
          )}`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-[14px] text-black">
            {condition.operator || '?'}
          </span>
        </motion.button>

        {/* Variable B */}
        <motion.button
          onClick={() => onSelectField('varB')}
          className={`flex-1 min-h-[44px] px-4 py-3 rounded-md transition-all ${getFieldClassName(
            getFieldState('varB')
          )}`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-[14px] text-black">
            {condition.varB ? condition.varB.name : '?'}
          </span>
        </motion.button>
      </div>

      {/* Helper Text */}
      {activeField && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] text-gray-600 mt-3"
        >
          {activeField === 'varA' && 'Select or capture Variable A'}
          {activeField === 'operator' && 'Choose comparison operator'}
          {activeField === 'varB' && 'Select or capture comparison value'}
        </motion.p>
      )}
    </div>
  );
}
