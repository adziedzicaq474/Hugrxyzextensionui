import { motion } from 'motion/react';
import { Camera, Edit3, Link } from 'lucide-react';

interface Variable {
  name: string;
  type: 'capture' | 'fixed' | 'existing';
  value?: string;
}

interface VariableSelectorProps {
  title: string;
  onSelectCapture: () => void;
  onSelectFixed: () => void;
  onSelectExisting: () => void;
}

export function VariableSelector({
  title,
  onSelectCapture,
  onSelectFixed,
  onSelectExisting,
}: VariableSelectorProps) {
  const options = [
    {
      id: 'capture',
      label: 'Capture',
      description: 'Capture from page',
      icon: Camera,
      onClick: onSelectCapture,
    },
    {
      id: 'fixed',
      label: 'Fixed',
      description: 'Enter fixed value',
      icon: Edit3,
      onClick: onSelectFixed,
    },
    {
      id: 'existing',
      label: 'Existing',
      description: 'Use existing variable',
      icon: Link,
      onClick: onSelectExisting,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-4"
    >
      <h3 className="text-[14px] text-gray-700 mb-3">{title}</h3>
      
      <div className="space-y-2">
        {options.map((option, index) => {
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={option.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[#feee7d] hover:bg-[#feee7d]/5 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <div className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-black" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] text-black">{option.label}</p>
                <p className="text-[12px] text-gray-600">{option.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
