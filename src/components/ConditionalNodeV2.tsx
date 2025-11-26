import { motion } from 'motion/react';
import { GitBranch, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

interface ConditionalNodeV2Props {
  id: string;
  condition: string;
  status?: 'recorded' | 'pending';
  currentPath: 'yes' | 'no';
  onSwitchToNo?: () => void;
  onSwitchToYes?: () => void;
  onClick?: () => void;
}

export function ConditionalNodeV2({
  id,
  condition,
  status = 'pending',
  currentPath,
  onSwitchToNo,
  onSwitchToYes,
  onClick,
}: ConditionalNodeV2Props) {
  return (
    <div className="relative">
      {/* Main Node */}
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full bg-white border-2 border-[#feee7d] rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        {/* Switch to No Button - Top Left (when on YES path) */}
        {currentPath === 'yes' && onSwitchToNo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwitchToNo();
            }}
            className="absolute -top-3 -left-3 flex items-center gap-1 px-3 py-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 z-10"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="text-[12px] leading-tight">No</span>
          </button>
        )}

        {/* Switch to Yes Button - Top Right (when on NO path) */}
        {currentPath === 'no' && onSwitchToYes && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwitchToYes();
            }}
            className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 z-10"
          >
            <span className="text-[12px] leading-tight">Yes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#feee7d] rounded-xl">
              <GitBranch className="w-5 h-5 text-black" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                Conditional
              </h3>
              <p className="text-[14px] leading-relaxed text-gray-600">
                {condition}
              </p>
            </div>
          </div>
        </div>

        {/* Current Path Indicator - Bottom Center */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div
            className={`flex items-center gap-1 px-3 py-1.5 ${
              currentPath === 'yes' ? 'bg-emerald-500' : 'bg-rose-500'
            } text-white rounded-full shadow-md`}
          >
            <span className="text-[12px] leading-tight capitalize">{currentPath}</span>
            <ArrowDown className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}