import { motion } from 'motion/react';
import { Repeat, ArrowUpLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface ForLoopNodeProps {
  id: string;
  iterations: number;
  status?: 'recorded' | 'pending';
  onClick?: () => void;
  children?: ReactNode;
  showLoopBack?: boolean; // Show the loop-back arrow indicator
}

export function ForLoopNode({
  id,
  iterations,
  status = 'pending',
  onClick,
  children,
  showLoopBack = true,
}: ForLoopNodeProps) {
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
        style={{ borderColor: '#8B5CF6' }}
      >
        {/* Header */}
        <div className="p-4 bg-white/80 border-b-2 border-dashed" style={{ borderColor: '#8B5CF6' }}>
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#8B5CF6' }}>
              <Repeat className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[16px] leading-tight text-gray-900">
                  For Loop
                </h3>
                {/* Iteration Badge - Purple bg, white text */}
                <div className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full" style={{ backgroundColor: '#8B5CF6' }}>
                  <span className="text-[14px] leading-tight text-white">
                    ×{iterations}
                  </span>
                </div>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: '#8B5CF6' }}>
                Repeat {iterations} {iterations === 1 ? 'time' : 'times'}
              </p>
            </div>
          </div>
        </div>

        {/* Loop Content Area */}
        <div className="p-4 space-y-0">
          {children}
        </div>

        {/* Loop-back Arrow - Bottom of container */}
        {showLoopBack && (
          <div className="px-4 pb-4">
            <div className="relative flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: '#F3E8FF', borderColor: '#C084FC', borderWidth: '2px' }}>
              {/* Curved Arrow Icon */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: '#8B5CF6' }}>
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

        {/* Loop Exit Indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-full shadow-md" style={{ backgroundColor: '#8B5CF6' }}>
            <span className="text-[12px] leading-tight">Exit Loop</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}