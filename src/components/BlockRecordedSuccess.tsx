import { CheckCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface BlockRecordedSuccessProps {
  blockName: string;
  currentIndex: number;
  totalBlocks: number;
  hasMoreBlocks: boolean;
  onNextBlock: () => void;
  onRetryBlock: () => void;
  onFinish: () => void;
}

export function BlockRecordedSuccess({
  blockName,
  currentIndex,
  totalBlocks,
  hasMoreBlocks,
  onNextBlock,
  onRetryBlock,
  onFinish,
}: BlockRecordedSuccessProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[24px] leading-tight text-center text-gray-900 mb-2"
        >
          {hasMoreBlocks ? 'Block Recorded!' : 'All Blocks Recorded!'}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[16px] text-center text-gray-600 mb-8 leading-relaxed"
        >
          {hasMoreBlocks
            ? `"${blockName}" test passed.`
            : 'All blocks recorded!'}
        </motion.p>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-50 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-gray-600">Progress</span>
            <span className="text-[14px] text-gray-900">
              {currentIndex}/{totalBlocks} blocks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${(currentIndex / totalBlocks) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-3"
        >
          {hasMoreBlocks ? (
            <>
              {/* Next Block Button */}
              <button
                onClick={onNextBlock}
                className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="text-[16px]">Record Next Block</span>
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Retry Button */}
              <button
                onClick={onRetryBlock}
                className="w-full bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:border-gray-400 hover:text-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">Re-record This Block</span>
              </button>
            </>
          ) : (
            <>
              {/* Finish Button */}
              <button
                onClick={onFinish}
                className="w-full bg-[#10B981] text-white px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="text-[16px]">Complete & Deploy</span>
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Retry Last Block Button */}
              <button
                onClick={onRetryBlock}
                className="w-full bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:border-gray-400 hover:text-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">Re-record Last Block</span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}