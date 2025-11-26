import { motion, AnimatePresence } from 'motion/react';
import { Target, MousePointerClick, Tag, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function OnboardingModal({ isOpen, onClose, onGetStarted }: OnboardingModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleGetStarted = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideOnboarding', 'true');
    }
    onGetStarted();
  };

  // Staggered animation variants for steps
  const stepVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - 70% opacity dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                {/* Header - Large Target Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-16 h-16 bg-[#feee7d] rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-black" strokeWidth={2} />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[24px] leading-tight text-center text-gray-900 mb-8"
                >
                  How Capture Mode Works
                </motion.h2>

                {/* Steps List - 4 steps with staggered animations */}
                <div className="space-y-6 mb-8">
                  {/* Step 1 */}
                  <motion.div
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={stepVariants}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <MousePointerClick className="w-5 h-5 text-gray-700" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                        Interact Normally
                      </h3>
                      <p className="text-[14px] leading-relaxed text-gray-600">
                        Click, type, and navigate as you usually would
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={stepVariants}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Tag className="w-5 h-5 text-gray-700" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                        Actions Are Tagged
                      </h3>
                      <p className="text-[14px] leading-relaxed text-gray-600">
                        Every interaction is automatically captured
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={stepVariants}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-gray-700" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                        Build Your Flow
                      </h3>
                      <p className="text-[14px] leading-relaxed text-gray-600">
                        Steps are added to your automation flow
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 4 */}
                  <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={stepVariants}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 text-gray-700" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] leading-tight text-gray-900 mb-1">
                        Stop When Done
                      </h3>
                      <p className="text-[14px] leading-relaxed text-gray-600">
                        Click stop to finish and review your workflow
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* Primary Button */}
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-[#feee7d] text-black px-6 py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[44px]"
                  >
                    Start
                  </button>

                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-gray-300 appearance-none cursor-pointer checked:bg-black checked:border-black transition-colors"
                      />
                      {dontShowAgain && (
                        <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-[14px] leading-tight text-gray-600 group-hover:text-gray-900 transition-colors">
                      Hide
                    </span>
                  </label>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}