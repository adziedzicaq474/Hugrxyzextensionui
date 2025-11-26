import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

interface LoopNodeProps {
  id: string;
  condition: string;
  status?: 'recorded' | 'pending';
  onClick?: () => void;
  children?: ReactNode;
}

export function LoopNode({
  id,
  condition,
  status = 'pending',
  onClick,
  children,
}: LoopNodeProps) {
  return (
    <div className="relative">
      {/* Loop Container with Dashed Blue Border */}
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.005 }}
        className="w-full bg-blue-50/30 border-2 border-dashed border-blue-500 rounded-xl overflow-visible"
      >
        {/* Header */}
        <div className="p-4 bg-white/80 border-b-2 border-dashed border-blue-500">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 rounded-xl">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                Loop
              </h3>
              <p className="text-[14px] leading-relaxed text-blue-700">
                {condition}
              </p>
            </div>
          </div>
        </div>

        {/* Loop Content Area */}
        <div className="p-4 space-y-0">
          {children}
        </div>

        {/* Loop Exit Indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-full shadow-md">
            <span className="text-[12px] leading-tight">Exit Loop</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
