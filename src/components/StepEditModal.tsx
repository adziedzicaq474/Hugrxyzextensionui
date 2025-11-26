import { motion, AnimatePresence } from 'motion/react';
import { X, MousePointer2, Type, ExternalLink, Check, Variable, Move, Hand } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CapturedStep {
  id: string;
  type: 'click' | 'input' | 'navigate' | 'wait' | 'wallet' | 'variable' | 'drag' | 'hover';
  description: string;
  target?: string;
  value?: string;
  walletAction?: 'sign' | 'switch-chain' | 'confirm-tx' | 'add-token' | 'approve-token';
  variableType?: 'string' | 'number';
  variableName?: string;
}

interface StepEditModalProps {
  isOpen: boolean;
  step: CapturedStep | null;
  onClose: () => void;
  onSave: (updatedStep: CapturedStep) => void;
}

const stepTypeOptions = [
  { value: 'click', label: 'Click', icon: MousePointer2 },
  { value: 'input', label: 'Input', icon: Type },
  { value: 'navigate', label: 'Navigate', icon: ExternalLink },
  { value: 'wait', label: 'Wait', icon: Check },
  { value: 'wallet', label: 'Wallet', icon: Check },
  { value: 'variable', label: 'Variable', icon: Variable },
  { value: 'drag', label: 'Drag', icon: Move },
  { value: 'hover', label: 'Hover', icon: Hand },
] as const;

const walletActionOptions = [
  { value: 'sign', label: 'Sign Message' },
  { value: 'switch-chain', label: 'Switch Blockchain' },
  { value: 'confirm-tx', label: 'Confirm Transaction' },
  { value: 'add-token', label: 'Add Token' },
  { value: 'approve-token', label: 'Approve Token' },
] as const;

const variableTypeOptions = [
  { value: 'string', label: 'String (Text)' },
  { value: 'number', label: 'Number (Numeric)' },
] as const;

export function StepEditModal({ isOpen, step, onClose, onSave }: StepEditModalProps) {
  const [formData, setFormData] = useState<CapturedStep | null>(null);

  // Initialize form data when step changes
  useEffect(() => {
    if (step) {
      setFormData({ ...step });
    }
  }, [step]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const handleTypeChange = (newType: CapturedStep['type']) => {
    if (formData) {
      setFormData({ 
        ...formData, 
        type: newType,
        // Reset type-specific fields when type changes
        walletAction: newType === 'wallet' ? 'sign' : undefined,
        variableType: newType === 'variable' ? 'string' : undefined,
        variableName: newType === 'variable' ? '' : undefined,
      });
    }
  };

  // Check if target field should be editable
  const isTargetEditable = formData?.type === 'navigate';

  if (!formData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto max-h-[90vh] flex flex-col"
          >
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col max-h-full">
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-[20px] leading-tight text-gray-900">
                  Edit Step
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Body - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-[14px] text-gray-700 mb-3">
                      Step Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {stepTypeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = formData.type === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleTypeChange(option.value)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-h-[44px] ${
                              isSelected
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" strokeWidth={2} />
                            <span className="text-[14px]">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Wallet Action Selection (only for wallet type) */}
                  {formData.type === 'wallet' && (
                    <div>
                      <label className="block text-[14px] text-gray-700 mb-2">
                        Wallet Action
                      </label>
                      <select
                        value={formData.walletAction || 'sign'}
                        onChange={(e) =>
                          setFormData({ 
                            ...formData, 
                            walletAction: e.target.value as CapturedStep['walletAction']
                          })
                        }
                        className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px] bg-white appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          paddingRight: '40px',
                        }}
                      >
                        <option value="sign">Sign Message</option>
                        <option value="switch-chain">Switch Blockchain</option>
                        <option value="confirm-tx">Confirm Transaction</option>
                        <option value="add-token">Add Token</option>
                        <option value="approve-token">Approve Token</option>
                      </select>
                    </div>
                  )}

                  {/* Variable Type Selection (only for variable type) */}
                  {formData.type === 'variable' && (
                    <>
                      <div>
                        <label className="block text-[14px] text-gray-700 mb-3">
                          Variable Type
                        </label>
                        <div className="space-y-2">
                          {variableTypeOptions.map((option) => {
                            const isSelected = formData.variableType === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() =>
                                  setFormData({ ...formData, variableType: option.value })
                                }
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all min-h-[44px] ${
                                  isSelected
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-[14px]">{option.label}</span>
                                {isSelected && (
                                  <div className="w-5 h-5 flex items-center justify-center bg-black rounded-full">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Variable Name */}
                      <div>
                        <label className="block text-[14px] text-gray-700 mb-2">
                          Variable Name
                        </label>
                        <input
                          type="text"
                          value={formData.variableName || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, variableName: e.target.value })
                          }
                          placeholder="tokenPrice"
                          className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-[14px] text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Click 'Deposit'"
                      className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
                    />
                  </div>

                  {/* Target Selector */}
                  {(formData.type === 'click' ||
                    formData.type === 'input' ||
                    formData.type === 'navigate' ||
                    formData.type === 'wallet' ||
                    formData.type === 'drag' ||
                    formData.type === 'hover' ||
                    formData.type === 'variable') && (
                    <div>
                      <label className="block text-[14px] text-gray-700 mb-2">
                        {formData.type === 'navigate' ? 'Target URL' : 'Target Selector'}
                        {!isTargetEditable && (
                          <span className="ml-2 text-[12px] text-gray-500">(Read-only)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={formData.target || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, target: e.target.value })
                        }
                        placeholder={
                          formData.type === 'navigate'
                            ? 'https://app.uniswap.org'
                            : 'button[data-action="deposit"]'
                        }
                        readOnly={!isTargetEditable}
                        className={`w-full px-4 py-3 rounded-md border-2 focus:outline-none transition-colors min-h-[44px] text-[16px] font-mono text-[14px] ${
                          isTargetEditable
                            ? 'border-gray-200 focus:border-black bg-white'
                            : 'border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  )}

                  {/* Value (for Input and Wait) */}
                  {(formData.type === 'input' || formData.type === 'wait') && (
                    <div>
                      <label className="block text-[14px] text-gray-700 mb-2">
                        {formData.type === 'input' ? 'Input Value' : 'Wait Duration'}
                      </label>
                      <input
                        type="text"
                        value={formData.value || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, value: e.target.value })
                        }
                        placeholder={formData.type === 'input' ? '0.1' : '2s'}
                        className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[44px]"
                >
                  Save
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:border-gray-400 hover:text-gray-900 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}