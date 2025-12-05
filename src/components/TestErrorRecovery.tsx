import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, RefreshCw, Edit3, Bug } from 'lucide-react';

interface ErrorDetail {
  step: string;
  error: string;
  timestamp: string;
}

interface SolutionCard {
  id: string;
  title: string;
  description: string;
  action: 'retry' | 'edit' | 'debug';
  icon: typeof RefreshCw;
}

interface TestErrorRecoveryProps {
  isOpen: boolean;
  error: ErrorDetail;
  solutions: SolutionCard[];
  onClose: () => void;
  onSelectSolution: (solutionId: string) => void;
}

const actionIcons = {
  retry: RefreshCw,
  edit: Edit3,
  debug: Bug,
};

export function TestErrorRecovery({
  isOpen,
  error,
  solutions,
  onClose,
  onSelectSolution,
}: TestErrorRecoveryProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex-shrink-0 pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex-shrink-0 px-4 pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Error Icon */}
                  <div className="w-12 h-12 bg-[#ef5285]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-[#ef5285]" strokeWidth={2} />
                  </div>
                  {/* Title */}
                  <div>
                    <h2 className="text-[20px] text-black mb-1">Test Failed</h2>
                    <p className="text-[14px] text-gray-600">
                      {error.step}
                    </p>
                  </div>
                </div>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5 text-black" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-md mx-auto space-y-6">
                {/* Error Details */}
                <div className="bg-[#F2F2F2] rounded-xl p-4">
                  <p className="text-[12px] text-gray-600 mb-1">Error Message</p>
                  <p className="text-[14px] text-black leading-relaxed mb-3">
                    {error.error}
                  </p>
                  <p className="text-[12px] text-gray-600">
                    {error.timestamp}
                  </p>
                </div>

                {/* Solutions Header */}
                <div>
                  <h3 className="text-[16px] text-black mb-3">Suggested Solutions</h3>
                </div>

                {/* Solution Cards */}
                <div className="space-y-3">
                  {solutions.map((solution, index) => {
                    const Icon = actionIcons[solution.action];
                    
                    return (
                      <motion.button
                        key={solution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelectSolution(solution.id)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-[#feee7d] hover:shadow-md active:scale-[0.98] transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-black" strokeWidth={2} />
                          </div>
                          {/* Content */}
                          <div className="flex-1">
                            <h4 className="text-[16px] text-black mb-1">
                              {solution.title}
                            </h4>
                            <p className="text-[14px] text-gray-600 leading-relaxed">
                              {solution.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4">
              <div className="max-w-md mx-auto">
                <button
                  onClick={onClose}
                  className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <span className="text-[16px]">Dismiss</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
