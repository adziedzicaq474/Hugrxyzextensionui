import { motion } from 'motion/react';
import { GitBranch, CheckCircle, Circle } from 'lucide-react';

interface ConditionalNodeProps {
  id: string;
  condition: string;
  status?: 'recorded' | 'pending';
  onClick?: () => void;
}

export function ConditionalNode({ id, condition, status = 'pending', onClick }: ConditionalNodeProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full bg-white border-2 border-[#feee7d] rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#feee7d]"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#feee7d] rounded-xl">
            <GitBranch className="w-5 h-5 text-black" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] leading-tight text-gray-900">
                Conditional
              </h3>
              {status === 'recorded' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <p className="text-[14px] leading-relaxed text-gray-600">
              {condition}
            </p>
          </div>
        </div>

        {/* Branch Indicators */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
          <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[12px] leading-tight text-emerald-700">Yes Path</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 rounded-lg">
            <div className="w-2 h-2 bg-rose-500 rounded-full" />
            <span className="text-[12px] leading-tight text-rose-700">No Path</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
