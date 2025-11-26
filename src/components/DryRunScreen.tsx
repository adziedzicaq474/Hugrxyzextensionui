import { ArrowLeft, Play, Pause, CheckCircle, XCircle, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface StepResult {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  error?: string;
}

interface DryRunScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

// Mock step results
const mockSteps: StepResult[] = [
  { id: '1', description: 'Navigate to Uniswap', status: 'pending' },
  { id: '2', description: 'Click Connect Wallet', status: 'pending' },
  { id: '3', description: 'Connect MetaMask', status: 'pending' },
  { id: '4', description: 'Wait for wallet connection', status: 'pending' },
  { id: '5', description: 'Click Deposit', status: 'pending' },
  { id: '6', description: 'Enter token amount', status: 'pending' },
  { id: '7', description: 'Select token ETH', status: 'pending' },
  { id: '8', description: 'Select token USDC', status: 'pending' },
  { id: '9', description: 'Review swap details', status: 'pending' },
  { id: '10', description: 'Confirm swap', status: 'pending' },
];

export function DryRunScreen({ onBack, onComplete }: DryRunScreenProps) {
  const [steps, setSteps] = useState<StepResult[]>(mockSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);

  const successCount = steps.filter((s) => s.status === 'success').length;
  const errorCount = steps.filter((s) => s.status === 'error').length;
  const totalSteps = steps.length;
  const isComplete = successCount + errorCount === totalSteps;

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
    setIsPaused(false);
    if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  // Simulate step execution
  useEffect(() => {
    if (!isRunning || isPaused || currentStepIndex >= steps.length) {
      return;
    }

    // Update current step to running
    setSteps((prev) =>
      prev.map((step, index) =>
        index === currentStepIndex ? { ...step, status: 'running' } : step
      )
    );

    // Simulate step execution (random duration 800-1500ms)
    const duration = Math.random() * 700 + 800;
    const timer = setTimeout(() => {
      // Randomly succeed or fail (90% success rate)
      const success = Math.random() > 0.1;

      setSteps((prev) =>
        prev.map((step, index) =>
          index === currentStepIndex
            ? {
                ...step,
                status: success ? 'success' : 'error',
                duration: Math.round(duration),
                error: success ? undefined : 'Element not found',
              }
            : step
        )
      );

      // Move to next step
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // All steps complete
        setIsRunning(false);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isRunning, isPaused, currentStepIndex, steps.length]);

  const getStatusIcon = (status: StepResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" strokeWidth={2} />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2} />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" strokeWidth={2} />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
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

          {/* Title + Progress */}
          <div className="mb-4">
            <h1 className="text-[24px] leading-tight text-gray-900 mb-2">Test</h1>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-[#10B981]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((successCount + errorCount) / totalSteps) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[14px] text-gray-600 whitespace-nowrap">
                {successCount + errorCount}/{totalSteps}
              </span>
            </div>
          </div>

          {/* Stats */}
          {hasStarted && (
            <div className="flex items-center gap-4 text-[14px]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2} />
                <span className="text-gray-700">{successCount} passed</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" strokeWidth={2} />
                  <span className="text-gray-700">{errorCount} failed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body - Scrollable Step List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-3 max-w-md mx-auto">
          {steps.map((step, index) => (
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
              <div
                className={`border rounded-xl p-4 transition-all ${
                  step.status === 'running'
                    ? 'border-blue-300 bg-blue-50 shadow-md scale-[1.02]'
                    : step.status === 'success'
                    ? 'border-green-300 bg-green-50'
                    : step.status === 'error'
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 pt-0.5">{getStatusIcon(step.status)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Step Number + Description */}
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-[14px] text-gray-500 flex-shrink-0">
                        {index + 1}.
                      </span>
                      <p className="text-[16px] leading-tight text-gray-900">
                        {step.description}
                      </p>
                    </div>

                    {/* Duration or Error */}
                    {step.duration && (
                      <div className="text-[12px] text-gray-500 mt-1">
                        {step.duration}ms
                      </div>
                    )}
                    {step.error && (
                      <div className="text-[12px] text-red-700 mt-1 bg-red-100 px-2 py-1 rounded">
                        Error: {step.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              // Start Button
              <motion.button
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleStart}
                className="w-full bg-[#10B981] text-white px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
                <span className="text-[16px]">Start Test</span>
              </motion.button>
            ) : isComplete ? (
              // Complete Button
              <motion.button
                key="complete"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={onComplete}
                className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="text-[16px]">Continue to Deploy</span>
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </motion.button>
            ) : isPaused ? (
              // Resume Button
              <motion.button
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handleResume}
                className="w-full bg-[#10B981] text-white px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
                <span className="text-[16px]">Resume</span>
              </motion.button>
            ) : (
              // Pause Button
              <motion.button
                key="pause"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={handlePause}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Pause className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">Pause</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}