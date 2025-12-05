import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ForRecordingFlowProps {
  actionBlock: any;
  currentIndex: number;
  totalBlocks: number;
  onBack: () => void;
  onComplete: () => void;
}

export function ForRecordingFlow({
  actionBlock,
  currentIndex,
  totalBlocks,
  onBack,
  onComplete,
}: ForRecordingFlowProps) {
  const progress = (currentIndex / totalBlocks) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="text-[16px]">Back</span>
          </button>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] text-gray-600">
                Recording Step {currentIndex}/{totalBlocks}
              </span>
              <span className="text-[14px] text-gray-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-[#feee7d]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <h2 className="text-[20px] text-gray-900">{actionBlock.name}</h2>
          <p className="text-[14px] text-gray-600 mt-1">For Loop</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[24px]">🔁</span>
          </div>
          <h3 className="text-[20px] text-gray-900 mb-2">For Loop Recording</h3>
          <p className="text-[16px] text-gray-600 mb-6">
            For loop recording: Set iteration count → Record loop body → Choose jump or record actions.
          </p>
          <button
            onClick={onComplete}
            className="bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
          >
            <span className="text-[16px]">Complete (Mock)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
