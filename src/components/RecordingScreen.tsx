import { ArrowLeft, Play, Pause, Check, Zap, Hand, Link, Repeat, Calculator, Send, Bridge, Wallet, ArrowLeftRight, DollarSign, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface Variable {
  key: string;
  value: string;
  type: 'preset' | 'from_step' | 'capture'; // 三種類型
  fromStep?: number; // 如果是 from_step，來自哪一步
  description?: string; // 給 capture 類型的友善說明
}

interface LogicCondition {
  condition: string; // 條件描述（自然語言）
  ifTrue: string; // 如果為真，做什麼
  ifFalse: string; // 如果為假，做什麼
}

interface ActionBlock {
  id: string;
  name: string;
  goal: string; // 友善的目標描述
  logic?: LogicCondition[]; // 可選的條件邏輯
  variables: Variable[];
}

interface RecordingScreenProps {
  actionBlock: ActionBlock;
  currentIndex: number;
  totalBlocks: number;
  onBack: () => void;
  onComplete: () => void;
}

export function RecordingScreen({
  actionBlock,
  currentIndex,
  totalBlocks,
  onBack,
  onComplete,
}: RecordingScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const progress = (currentIndex / totalBlocks) * 100;

  // 計時器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleDone = () => {
    onComplete();
  };

  // 分類變數
  const presetVars = actionBlock.variables.filter((v) => v.type === 'preset');
  const fromStepVars = actionBlock.variables.filter((v) => v.type === 'from_step');
  const captureVars = actionBlock.variables.filter((v) => v.type === 'capture');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="px-4 py-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors min-h-[44px]"
            disabled={isRecording}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="text-[16px]">Back</span>
          </button>

          {/* Progress Bar */}
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
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-8">
          {/* Step Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[24px] text-gray-900 mb-2">{actionBlock.name}</h2>
            <p className="text-[16px] leading-relaxed text-gray-600">{actionBlock.goal}</p>
          </motion.div>

          {/* Logic Section (if exists) */}
          {actionBlock.logic && actionBlock.logic.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-l-4 border-yellow-400 bg-yellow-50 rounded-r-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div className="flex-1 space-y-3">
                  <h3 className="text-[16px] text-gray-900">Decision Logic</h3>
                  {actionBlock.logic.map((logic, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-[14px] text-gray-700">{logic.condition}</p>
                      <div className="space-y-1.5 pl-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <p className="text-[14px] text-gray-900">{logic.ifTrue}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                            <div className="w-3 h-3 rounded-full border-2 border-gray-400" />
                          </div>
                          <p className="text-[14px] text-gray-600">{logic.ifFalse}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Variables Section */}
          {(presetVars.length > 0 || fromStepVars.length > 0 || captureVars.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <h3 className="text-[16px] text-gray-900">Configuration</h3>

              {/* Preset Variables */}
              {presetVars.length > 0 && (
                <div className="space-y-2">
                  {presetVars.map((variable) => (
                    <div
                      key={variable.key}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <span className="text-[14px] text-gray-600">{variable.key}</span>
                      <span className="text-[14px] text-gray-900">{variable.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* From Step Variables */}
              {fromStepVars.length > 0 && (
                <div className="space-y-2">
                  {fromStepVars.map((variable) => (
                    <div
                      key={variable.key}
                      className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <Zap className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <p className="text-[14px] text-gray-900">{variable.key}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          Auto-filled from Step {variable.fromStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Capture Variables - 重點強調 */}
              {captureVars.length > 0 && (
                <div className="border-l-4 border-[#feee7d] bg-yellow-50 rounded-r-xl p-4">
                  <div className="flex items-start gap-3">
                    <Hand className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="text-[16px] text-gray-900">Action Required</h4>
                        <p className="text-[14px] text-gray-600 mt-1">
                          Capture these values from the page:
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {captureVars.map((variable) => (
                          <li key={variable.key} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span className="text-[14px] text-gray-900">
                              {variable.description || variable.key}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Recording Status */}
          <AnimatePresence mode="wait">
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="border-l-4 border-red-500 bg-red-50 rounded-r-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!isPaused ? (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[16px] text-gray-900">Recording in progress</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span className="text-[16px] text-gray-900">Paused</span>
                      </>
                    )}
                  </div>
                  <span className="text-[16px] font-mono text-gray-900">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 max-w-md mx-auto">
          {!isRecording ? (
            // Start Recording Button
            <button
              onClick={handleStartRecording}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
              <span className="text-[16px]">Start</span>
            </button>
          ) : (
            // Pause and Done Buttons
            <div className="flex gap-3">
              <button
                onClick={handlePauseResume}
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Pause className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={handleDone}
                className="flex-1 bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Check className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">Done</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}