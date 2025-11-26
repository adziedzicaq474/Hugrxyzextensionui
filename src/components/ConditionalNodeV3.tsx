import { motion } from 'motion/react';
import { GitBranch, ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';

interface ConditionalNodeV3Props {
  id: string;
  condition: string;
  status?: 'recorded' | 'pending';
  currentPath: 'yes' | 'no';
  onSwitchToNo?: () => void;
  onSwitchToYes?: () => void;
  onClick?: () => void;
}

export function ConditionalNodeV3({
  id,
  condition,
  status = 'pending',
  currentPath,
  onSwitchToNo,
  onSwitchToYes,
  onClick,
}: ConditionalNodeV3Props) {
  return (
    <div className="relative">
      {/* Unified Card - Conditional + Buttons as one component */}
      <div className="w-full bg-white border-2 border-[#feee7d] rounded-xl overflow-hidden">
        {/* Top: Conditional Content */}
        <motion.div
          onClick={onClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="p-4"
        >
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
        </motion.div>

        {/* Bottom: Path Selection Buttons */}
        <div className="flex">
          {/* No Button - Left side (Red) */}
          {currentPath === 'yes' && onSwitchToNo && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToNo();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-rose-100 border-t-2 border-r border-[#feee7d] text-rose-700 hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[14px] leading-tight">No</span>
            </motion.button>
          )}

          {/* When on NO path, show empty placeholder for layout */}
          {currentPath === 'no' && (
            <div className="flex-1 opacity-30">
              <div className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-100 border-t-2 border-r border-[#feee7d] text-gray-500">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[14px] leading-tight">No</span>
              </div>
            </div>
          )}

          {/* Yes Button - Right side (Green) */}
          {currentPath === 'yes' && (
            <div className="flex-1 relative">
              <div className="flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-100 border-t-2 border-[#feee7d] text-emerald-700">
                <span className="text-[14px] leading-tight">Yes</span>
                <ArrowDown className="w-4 h-4" />
              </div>
              {/* Green connector dot at center bottom */}
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0.5 h-1 bg-emerald-500 z-10" />
            </div>
          )}

          {/* When on NO path, Yes button becomes clickable to go back - SOLID GREEN with Arrow Right */}
          {currentPath === 'no' && onSwitchToYes && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToYes();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-500 border-t-2 border-[#feee7d] text-white hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <span className="text-[14px] leading-tight">Yes</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}