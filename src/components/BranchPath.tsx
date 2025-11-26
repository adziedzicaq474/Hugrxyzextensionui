import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface BranchPathProps {
  type: 'yes' | 'no';
  children: ReactNode;
}

export function BranchPath({ type, children }: BranchPathProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isYes = type === 'yes';
  const bgColor = isYes ? 'bg-emerald-50' : 'bg-rose-50';
  const borderColor = isYes ? 'border-emerald-500' : 'border-rose-500';
  const textColor = isYes ? 'text-emerald-700' : 'text-rose-700';
  const lineColor = isYes ? 'bg-emerald-500' : 'bg-rose-500';
  const label = isYes ? 'Yes' : 'No';

  return (
    <div className="relative">
      {/* Branch Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-4 py-3 ${bgColor} border-2 ${borderColor} rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isYes ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${lineColor} rounded-full`} />
          <span className={`text-[14px] leading-tight ${textColor}`}>
            {label} Path
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-5 h-5 ${textColor}`} />
        </motion.div>
      </button>

      {/* Connector Line */}
      {isExpanded && (
        <div className="flex justify-center py-2">
          <div className={`w-0.5 h-4 ${lineColor}`} />
        </div>
      )}

      {/* Branch Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-3">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
