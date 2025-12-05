import { motion } from 'motion/react';
import { Play, ArrowLeft } from 'lucide-react';

interface Variable {
  name: string;
  type: 'capture' | 'fixed' | 'existing';
  value?: string;
}

interface ConditionData {
  varA: Variable | null;
  operator: string | null;
  varB: Variable | null;
}

interface ActionBlock {
  id: string;
  name: string;
  goal: string;
  nodeType: 'interaction' | 'conditional' | 'while' | 'for';
}

interface PathPreviewProps {
  condition: ConditionData;
  yesBlocks: ActionBlock[];
  noBlocks: ActionBlock[];
  onConfirm: () => void;
  onBack: () => void;
}

export function PathPreview({
  condition,
  yesBlocks,
  noBlocks,
  onConfirm,
  onBack,
}: PathPreviewProps) {
  const getNodeTypeLabel = (nodeType: string) => {
    switch (nodeType) {
      case 'interaction':
        return 'Action';
      case 'conditional':
        return 'If/Else';
      case 'while':
        return 'While';
      case 'for':
        return 'For';
      default:
        return nodeType;
    }
  };

  const totalBlocksToRecord = yesBlocks.length + noBlocks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Info Card */}
      <div className="bg-[#feee7d]/10 border-2 border-[#feee7d] rounded-xl p-4">
        <h3 className="text-[14px] text-black mb-2">📋 Recording Plan</h3>
        <p className="text-[12px] text-gray-700">
          AI has configured {totalBlocksToRecord} block{totalBlocksToRecord !== 1 ? 's' : ''} to
          record for this conditional.
        </p>
      </div>

      {/* Condition Display */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
        <h3 className="text-[14px] text-gray-700 mb-2">Condition</h3>
        <div className="flex items-center gap-2 text-[16px]">
          <span className="px-3 py-2 bg-[#F2F2F2] rounded-md text-black">
            {condition.varA?.name}
          </span>
          <span className="text-black">{condition.operator}</span>
          <span className="px-3 py-2 bg-[#F2F2F2] rounded-md text-black">
            {condition.varB?.name || condition.varB?.value}
          </span>
        </div>
      </div>

      {/* YES Path */}
      {yesBlocks.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#10B981]/10 rounded-full flex items-center justify-center">
              <span className="text-[14px]">✓</span>
            </div>
            <h3 className="text-[14px] text-black">YES Path</h3>
            <span className="ml-auto text-[12px] text-gray-600">
              {yesBlocks.length} block{yesBlocks.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {yesBlocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center gap-3 px-3 py-2 bg-[#F2F2F2] rounded-lg"
              >
                <span className="text-[12px] text-gray-600 w-5">{index + 1}.</span>
                <div className="flex-1">
                  <p className="text-[14px] text-black">{block.name}</p>
                  <p className="text-[12px] text-gray-600">{block.goal}</p>
                </div>
                <span className="text-[10px] text-gray-500 px-2 py-1 bg-white rounded">
                  {getNodeTypeLabel(block.nodeType)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NO Path */}
      {noBlocks.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#ef5285]/10 rounded-full flex items-center justify-center">
              <span className="text-[14px]">✗</span>
            </div>
            <h3 className="text-[14px] text-black">NO Path</h3>
            <span className="ml-auto text-[12px] text-gray-600">
              {noBlocks.length} block{noBlocks.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {noBlocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center gap-3 px-3 py-2 bg-[#F2F2F2] rounded-lg"
              >
                <span className="text-[12px] text-gray-600 w-5">{index + 1}.</span>
                <div className="flex-1">
                  <p className="text-[14px] text-black">{block.name}</p>
                  <p className="text-[12px] text-gray-600">{block.goal}</p>
                </div>
                <span className="text-[10px] text-gray-500 px-2 py-1 bg-white rounded">
                  {getNodeTypeLabel(block.nodeType)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onConfirm}
          className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px] flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
          <span className="text-[16px]">Start Recording Paths</span>
        </button>
        <button
          onClick={onBack}
          className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
        >
          <span className="text-[16px]">Back</span>
        </button>
      </div>
    </motion.div>
  );
}
