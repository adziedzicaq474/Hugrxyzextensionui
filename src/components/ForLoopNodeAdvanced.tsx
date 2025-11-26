import { motion } from 'motion/react';
import { Repeat, ArrowUpLeft, CheckCircle2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ForLoopNodeAdvancedProps {
  id: string;
  iterations: number;
  currentIteration?: number; // Current iteration count (1-based)
  status?: 'recorded' | 'pending' | 'running';
  onClick?: () => void;
  children?: ReactNode;
  showLoopBack?: boolean;
}

export function ForLoopNodeAdvanced({
  id,
  iterations,
  currentIteration = 0,
  status = 'pending',
  onClick,
  children,
  showLoopBack = true,
}: ForLoopNodeAdvancedProps) {
  const isRunning = status === 'running';
  const isCompleted = currentIteration >= iterations;

  return (
    <div className="relative">
      {/* For Loop Container with Dashed Purple Border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={onClick}
        whileHover={{ scale: 1.005 }}
        className="w-full bg-purple-50/30 border-2 border-dashed rounded-xl overflow-visible"
        style={{ borderColor: isCompleted ? '#10B981' : '#8B5CF6' }}
      >
        {/* Header */}
        <div className="p-4 bg-white/80 border-b-2 border-dashed" style={{ borderColor: isCompleted ? '#10B981' : '#8B5CF6' }}>
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: isCompleted ? '#10B981' : '#8B5CF6' }}>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Repeat className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[16px] leading-tight text-gray-900">
                  For Loop
                </h3>
                {/* Iteration Badge - Purple bg, white text */}
                <div className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full" style={{ backgroundColor: isCompleted ? '#10B981' : '#8B5CF6' }}>
                  <span className="text-[14px] leading-tight text-white">
                    ×{iterations}
                  </span>
                </div>
                {/* Current Iteration Indicator */}
                {isRunning && currentIteration > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-full"
                    style={{ backgroundColor: '#F3E8FF', borderColor: '#C084FC' }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6' }} />
                    <span className="text-[12px] leading-tight" style={{ color: '#7C3AED' }}>
                      Iteration {currentIteration}/{iterations}
                    </span>
                  </motion.div>
                )}
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: isCompleted ? '#10B981' : '#8B5CF6' }}>
                {isCompleted 
                  ? `Completed ${iterations} ${iterations === 1 ? 'iteration' : 'iterations'}`
                  : `Repeat ${iterations} ${iterations === 1 ? 'time' : 'times'}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Loop Content Area */}
        <div className="p-4 space-y-0">
          {children}
        </div>

        {/* Loop-back Arrow - Bottom of container */}
        {showLoopBack && !isCompleted && (
          <div className="px-4 pb-4">
            <div className="relative flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: '#F3E8FF', borderColor: '#C084FC', borderWidth: '2px' }}>
              {/* Curved Arrow Icon */}
              <div className="flex items-center gap-2">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                  isRunning ? 'animate-pulse' : ''
                }`} style={{ backgroundColor: '#8B5CF6' }}>
                  <ArrowUpLeft className="w-4 h-4 text-white" />
                </div>
                <span className="text-[14px] leading-tight" style={{ color: '#7C3AED' }}>
                  Next (Iterate)
                </span>
              </div>
              
              {/* Iteration Counter */}
              <div className="text-[12px] leading-tight" style={{ color: '#8B5CF6' }}>
                Loop back to start
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-100 border-2 border-emerald-300 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-[14px] leading-tight text-emerald-700">
                All iterations complete
              </span>
            </div>
          </div>
        )}

        {/* Loop Exit Indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md ${
            isCompleted ? 'bg-emerald-500' : 'bg-purple-500'
          } text-white`}>
            <span className="text-[12px] leading-tight">Exit Loop</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}