import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { BasicRecordingScreen } from '../BasicRecordingScreen';

interface ActionBlock {
  id: string;
  name: string;
  goal: string;
  nodeType: 'interaction' | 'conditional' | 'while' | 'for';
  variables?: any[];
}

interface RecordingQueueProps {
  pathType: 'YES' | 'NO';
  blocks: ActionBlock[];
  onComplete: (recordings: any[]) => void;
  onBack: () => void;
}

export function RecordingQueue({
  pathType,
  blocks,
  onComplete,
  onBack,
}: RecordingQueueProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [recordings, setRecordings] = useState<any[]>([]);

  const currentBlock = blocks[currentBlockIndex];
  const totalBlocks = blocks.length;
  const progress = ((currentBlockIndex + 1) / totalBlocks) * 100;

  const handleBlockComplete = () => {
    // Store the recording for this block
    const newRecording = {
      blockId: currentBlock.id,
      blockName: currentBlock.name,
      steps: [], // In real implementation, this would come from BasicRecordingScreen
    };

    const updatedRecordings = [...recordings, newRecording];
    setRecordings(updatedRecordings);

    if (currentBlockIndex < totalBlocks - 1) {
      // Move to next block
      setCurrentBlockIndex((prev) => prev + 1);
    } else {
      // All blocks recorded
      onComplete(updatedRecordings);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-4 py-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          <span className="text-[16px]">Back</span>
        </button>

        {/* Path Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`px-3 py-1 rounded-full text-[12px] ${
              pathType === 'YES'
                ? 'bg-[#10B981]/10 text-[#10B981]'
                : 'bg-[#ef5285]/10 text-[#ef5285]'
            }`}
          >
            {pathType} Path
          </div>
          <span className="text-[14px] text-gray-600">
            Block {currentBlockIndex + 1}/{totalBlocks}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-[#feee7d]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Block Info */}
        <h2 className="text-[20px] text-gray-900">{currentBlock.name}</h2>
        <p className="text-[14px] text-gray-600 mt-1">{currentBlock.goal}</p>

        {/* Queue Preview */}
        <div className="mt-4 p-3 bg-[#F2F2F2] rounded-xl">
          <p className="text-[12px] text-gray-600 mb-2">Queue:</p>
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`flex items-center gap-2 text-[14px] ${
                  index === currentBlockIndex
                    ? 'text-black font-medium'
                    : index < currentBlockIndex
                    ? 'text-[#10B981]'
                    : 'text-gray-400'
                }`}
              >
                {index < currentBlockIndex && <span>✓</span>}
                {index === currentBlockIndex && <span>●</span>}
                {index > currentBlockIndex && <span>○</span>}
                <span>{block.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recording Area */}
      <div className="flex-1 overflow-y-auto">
        <BasicRecordingScreen
          actionBlock={currentBlock}
          currentIndex={currentBlockIndex + 1}
          totalBlocks={totalBlocks}
          onBack={onBack}
          onComplete={handleBlockComplete}
        />
      </div>
    </div>
  );
}
