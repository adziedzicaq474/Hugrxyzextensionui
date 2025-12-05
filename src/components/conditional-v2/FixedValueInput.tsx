import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface FixedValueInputProps {
  fieldName: string;
  onConfirm: (name: string, value: string) => void;
  onBack: () => void;
}

export function FixedValueInput({
  fieldName,
  onConfirm,
  onBack,
}: FixedValueInputProps) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (name.trim() && value.trim()) {
      onConfirm(name.trim(), value.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-4"
    >
      <h3 className="text-[14px] text-gray-700 mb-3">Fixed Value for {fieldName}</h3>
      
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-[14px] text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Min Balance"
            className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
            autoFocus
          />
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-[14px] text-gray-700 mb-2">
            Value
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.1 ETH"
            className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
          />
          <p className="text-[12px] text-gray-600 mt-2">
            This value will be used in the condition
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!name.trim() || !value.trim()}
          className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" strokeWidth={2} />
          <span className="text-[16px]">Confirm</span>
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
        >
          <span className="text-[16px]">Back</span>
        </button>
      </div>
    </motion.div>
  );
}
