import { motion } from 'motion/react';
import { ArrowLeft, Database } from 'lucide-react';

interface ExistingVariable {
  name: string;
  type: 'capture' | 'fixed' | 'existing';
  value?: string;
  originalType?: string;
  description?: string;
  fromStep?: number;
}

interface ExistingVariableSelectorProps {
  fieldName: string;
  availableVariables: ExistingVariable[];
  onSelectVariable: (variable: ExistingVariable) => void;
  onBack: () => void;
}

export function ExistingVariableSelector({
  fieldName,
  availableVariables,
  onSelectVariable,
  onBack,
}: ExistingVariableSelectorProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed':
        return 'Preset';
      case 'capture':
        return 'Captured';
      case 'existing':
        return 'From Step';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixed':
        return 'bg-blue-100 text-blue-700';
      case 'capture':
        return 'bg-[#10B981]/10 text-[#10B981]';
      case 'existing':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-4"
    >
      <h3 className="text-[14px] text-gray-700 mb-3">
        Select Existing Variable for {fieldName}
      </h3>

      {availableVariables.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Database className="w-8 h-8 text-gray-400" strokeWidth={2} />
          </div>
          <p className="text-[14px] text-gray-600 mb-1">No variables available yet</p>
          <p className="text-[12px] text-gray-500">
            Variables from previous blocks will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto mb-4">
          {availableVariables.map((variable, index) => (
            <motion.button
              key={`${variable.name}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectVariable(variable)}
              className="w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[#feee7d] hover:bg-[#feee7d]/5 active:scale-[0.98] transition-all text-left min-h-[44px]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] text-black truncate">{variable.name}</p>
                  {variable.originalType && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${getTypeColor(
                        variable.originalType
                      )}`}
                    >
                      {getTypeLabel(variable.originalType)}
                    </span>
                  )}
                </div>
                {variable.description && (
                  <p className="text-[12px] text-gray-600 line-clamp-1">{variable.description}</p>
                )}
                {variable.value && (
                  <p className="text-[12px] text-gray-500 mt-1">
                    <span className="font-mono">{variable.value}</span>
                  </p>
                )}
                {variable.fromStep && (
                  <p className="text-[10px] text-gray-500 mt-1">From Step {variable.fromStep}</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px] flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-[16px]">Back</span>
      </button>
    </motion.div>
  );
}