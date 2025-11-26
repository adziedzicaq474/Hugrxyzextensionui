import { ArrowLeft, Play, MousePointer2, Type, ExternalLink, Check, GripVertical, Edit2, Trash2, Plus, Variable, Move, Hand } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StepEditModal } from './StepEditModal';

interface CapturedStep {
  id: string;
  type: 'click' | 'input' | 'navigate' | 'wait' | 'wallet' | 'variable' | 'drag' | 'hover';
  description: string;
  target?: string;
  value?: string;
  walletAction?: 'sign' | 'switch-chain' | 'confirm-tx' | 'add-token' | 'approve-token';
  variableType?: 'string' | 'number';
  variableName?: string;
}

interface CaptureReviewProps {
  onBack: () => void;
  onDryRun: () => void;
  onAddMore: () => void;
  steps?: CapturedStep[];
}

// Mock captured steps for demonstration
const defaultSteps: CapturedStep[] = [
  {
    id: '1',
    type: 'navigate',
    description: 'Navigate to Uniswap',
    target: 'https://app.uniswap.org',
  },
  {
    id: '2',
    type: 'click',
    description: 'Click Connect Wallet',
    target: 'button[aria-label="Connect Wallet"]',
  },
  {
    id: '3',
    type: 'wallet',
    description: 'Connect MetaMask',
    target: 'div[data-wallet="metamask"]',
  },
  {
    id: '4',
    type: 'wait',
    description: 'Wait for wallet connection',
    value: '2s',
  },
  {
    id: '5',
    type: 'click',
    description: 'Click Deposit',
    target: 'button[data-action="deposit"]',
  },
  {
    id: '6',
    type: 'input',
    description: 'Enter token amount',
    target: 'input[name="amount"]',
    value: '0.1',
  },
  {
    id: '7',
    type: 'click',
    description: 'Select token ETH',
    target: 'button[data-token="ETH"]',
  },
  {
    id: '8',
    type: 'click',
    description: 'Select token USDC',
    target: 'button[data-token="USDC"]',
  },
  {
    id: '9',
    type: 'click',
    description: 'Review swap details',
    target: 'button[data-action="review"]',
  },
  {
    id: '10',
    type: 'click',
    description: 'Confirm swap',
    target: 'button[data-action="confirm"]',
  },
];

const stepIcons = {
  click: MousePointer2,
  input: Type,
  navigate: ExternalLink,
  wait: Check,
  wallet: Check,
  variable: Variable,
  drag: Move,
  hover: Hand,
};

const stepTypeLabels = {
  click: 'Click',
  input: 'Input',
  navigate: 'Navigate',
  wait: 'Wait',
  wallet: 'Wallet',
  variable: 'Variable',
  drag: 'Drag',
  hover: 'Hover',
};

const stepColors = {
  click: 'bg-blue-50 text-blue-700 border-blue-200',
  input: 'bg-purple-50 text-purple-700 border-purple-200',
  navigate: 'bg-gray-50 text-gray-700 border-gray-200',
  wait: 'bg-gray-50 text-gray-600 border-gray-200',
  wallet: 'bg-green-50 text-green-700 border-green-200',
  variable: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  drag: 'bg-red-50 text-red-700 border-red-200',
  hover: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

interface DraggableStepCardProps {
  step: CapturedStep;
  index: number;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (step: CapturedStep) => void;
  onDelete: (id: string) => void;
}

const ITEM_TYPE = 'STEP_CARD';

function DraggableStepCard({ step, index, moveStep, onEdit, onDelete }: DraggableStepCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: step.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  preview(drop(ref));

  const Icon = stepIcons[step.type];
  const colorClass = stepColors[step.type];
  const typeLabel = stepTypeLabels[step.type];

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-gray-50 border-b border-gray-100">
        {/* Drag Handle */}
        <button
          ref={drag}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Step Badge */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1">
            <span className="text-[14px] text-gray-700">Step {index + 1}</span>
            <span className="text-gray-300">·</span>
            <span className={`text-[12px] px-2 py-0.5 rounded-full ${colorClass}`}>
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(step)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => onDelete(step.id)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-4">
        {/* Description */}
        <div className="mb-3">
          <p className="text-[16px] leading-tight text-gray-900">{step.description}</p>
        </div>

        {/* Target/Value Details */}
        <div className="space-y-2">
          {step.target && (
            <div className="text-[14px] leading-tight text-gray-600">
              <span className="text-gray-500">Target: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono break-all">
                {step.target}
              </code>
            </div>
          )}
          {step.value && (
            <div className="text-[14px] leading-tight text-gray-600">
              <span className="text-gray-500">Value: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                {step.value}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaptureReviewContent({ onBack, onDryRun, onAddMore, steps = defaultSteps }: CaptureReviewProps) {
  const [localSteps, setLocalSteps] = useState(steps);
  const [editingStep, setEditingStep] = useState<CapturedStep | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const stepCount = localSteps.length;

  const handleDelete = (id: string) => {
    setLocalSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const handleEdit = (step: CapturedStep) => {
    setEditingStep(step);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedStep: CapturedStep) => {
    setLocalSteps((prev) =>
      prev.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    );
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    setLocalSteps((prev) => {
      const newSteps = [...prev];
      const [draggedStep] = newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, draggedStep);
      return newSteps;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="px-4 py-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="text-[16px]">Back</span>
          </button>

          {/* Title + Count */}
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[24px] leading-tight text-gray-900">Actions</h1>
            <span className="text-[16px] leading-tight text-gray-600">
              {stepCount} {stepCount === 1 ? 'step' : 'steps'}
            </span>
          </div>
        </div>
      </div>

      {/* Body - Scrollable Step List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-3 max-w-md mx-auto">
          {localSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <DraggableStepCard
                step={step}
                index={index}
                moveStep={moveStep}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer - Fixed with Two Buttons */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 max-w-md mx-auto space-y-3">
          {/* Primary: Dry Run Test */}
          <button
            onClick={onDryRun}
            className="w-full bg-[#10B981] text-white px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
            <span className="text-[16px]">Dry Run Test</span>
          </button>

          {/* Secondary: Add More Steps */}
          <button
            onClick={onAddMore}
            className="w-full bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:border-gray-400 hover:text-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            <span className="text-[16px]">Add More Steps</span>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <StepEditModal
        isOpen={isEditModalOpen}
        step={editingStep}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStep(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export function CaptureReview(props: CaptureReviewProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CaptureReviewContent {...props} />
    </DndProvider>
  );
}