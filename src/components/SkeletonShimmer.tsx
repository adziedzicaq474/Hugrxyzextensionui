import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export function SkeletonShimmer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 flex-row"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#feee7d]">
        <Bot className="w-4 h-4 text-black" />
      </div>
      <div className="flex-1 flex justify-start">
        <div className="max-w-[85%] rounded-xl p-4 bg-white border border-gray-200">
          {/* Shimmer skeleton lines with smooth gradient */}
          <div className="space-y-3">
            <div className="h-4 rounded bg-gradient-to-r from-[#F2F2F2] via-[#E5E5E5] to-[#F2F2F2] bg-[length:200%_100%] animate-shimmer w-full" />
            <div className="h-4 rounded bg-gradient-to-r from-[#F2F2F2] via-[#E5E5E5] to-[#F2F2F2] bg-[length:200%_100%] animate-shimmer w-[90%]" />
            <div className="h-4 rounded bg-gradient-to-r from-[#F2F2F2] via-[#E5E5E5] to-[#F2F2F2] bg-[length:200%_100%] animate-shimmer w-[70%] relative">
              {/* Blinking cursor */}
              <span className="absolute -right-2 top-0 bottom-0 w-0.5 bg-black animate-blink" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
