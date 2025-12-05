import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Play, Pause, Check, MousePointer2, Type, ExternalLink, Variable, Move, Hand } from 'lucide-react';

interface PathRecordingProps {
  pathType: 'YES' | 'NO';
  condition: any;
  onComplete: (steps: any[]) => void;
  onBack: () => void;
}

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

export function PathRecording({ pathType, condition, onComplete, onBack }: PathRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedSteps, setRecordedSteps] = useState<any[]>([]);

  const { variableA, operator, variableB } = condition;
  const getVarDisplay = (v: any) => v?.name || v?.value || '?';
  const conditionString = `${getVarDisplay(variableA)} ${operator} ${getVarDisplay(variableB)}`;
  
  // Define colors based on path type
  const isYesPath = pathType === 'YES';
  const pathBgColor = isYesPath ? 'bg-green-50' : 'bg-rose-50';
  const pathBorderColor = isYesPath ? 'border-green-200' : 'border-rose-200';
  const pathBorderLeftColor = isYesPath ? 'border-green-500' : 'border-rose-500';
  const pathDotColor = isYesPath ? 'bg-green-500' : 'bg-rose-500';
  const pathButtonBg = isYesPath ? 'bg-green-500' : 'bg-rose-500';
  const pathButtonHoverBg = isYesPath ? 'hover:bg-green-600' : 'hover:bg-rose-600';
  const pathTextColor = isYesPath ? 'text-green-600' : 'text-rose-600';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Mock recording
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const mockSteps: any[] = [
      {
        id: '1',
        type: 'click',
        description: 'Click swap button',
        target: 'button[data-action="swap"]',
        timestamp: Date.now(),
      },
      {
        id: '2',
        type: 'input',
        description: 'Enter amount: 1.5',
        target: 'input[name="amount"]',
        value: '1.5',
        timestamp: Date.now() + 1000,
      },
    ];

    const intervalId = setInterval(() => {
      const currentStepIndex = recordedSteps.length;
      if (currentStepIndex < mockSteps.length) {
        const newStep = mockSteps[currentStepIndex];
        setRecordedSteps((prev) => [...prev, newStep]);
      } else {
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isRecording, isPaused, recordedSteps.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-[20px] text-gray-900 mb-2">Record {pathType} Path</h2>
            <p className="text-[14px] text-gray-600 mb-2">
              When: <span className="font-mono">{conditionString}</span>
            </p>
            <p className="text-[14px] text-gray-600">
              Is <span className={`font-semibold ${pathTextColor}`}>{pathType === 'YES' ? 'TRUE' : 'FALSE'}</span>, execute:
            </p>
          </motion.div>

          {!isRecording ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${pathBgColor} border-2 ${pathBorderColor} rounded-xl p-6 text-center`}
            >
              <button
                onClick={() => setIsRecording(true)}
                className={`${pathButtonBg} text-white px-6 py-3 rounded-full ${pathButtonHoverBg} active:scale-[0.98] transition-all min-h-[44px]`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
                  <span className="text-[16px]">Start Recording</span>
                </div>
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className={`border-l-4 ${pathBorderLeftColor} ${pathBgColor} rounded-r-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!isPaused ? (
                      <>
                        <div className={`w-3 h-3 ${pathDotColor} rounded-full animate-pulse`} />
                        <span className="text-[16px] text-gray-900">Recording {pathType} path</span>
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
              </div>

              {recordedSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-[16px] text-gray-900">
                    Actions ({recordedSteps.length})
                  </h3>
                  {recordedSteps.map((step, index) => {
                    const Icon = stepIcons[step.type as keyof typeof stepIcons];
                    const colorClass = stepColors[step.type as keyof typeof stepColors];
                    const typeLabel = stepTypeLabels[step.type as keyof typeof stepTypeLabels];

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-gray-50 border-b border-gray-100">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1">
                              <span className="text-[14px] text-gray-700">
                                Step {index + 1}
                              </span>
                              <span className="text-gray-300">·</span>
                              <span className={`text-[12px] px-2 py-0.5 rounded-full ${colorClass}`}>
                                {typeLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-4">
                          <p className="text-[16px] leading-tight text-gray-900">
                            {step.description}
                          </p>
                          {step.target && (
                            <div className="text-[14px] leading-tight text-gray-600 mt-2">
                              <span className="text-gray-500">Target: </span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono break-all">
                                {step.target}
                              </code>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 max-w-md mx-auto">
          {!isRecording ? (
            <button
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <span className="text-[16px]">Back</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Pause className="w-5 h-5 mx-auto" strokeWidth={2} />
              </button>
              <button
                onClick={() => onComplete(recordedSteps)}
                className={`flex-1 ${pathButtonBg} text-black px-6 py-3 rounded-full ${pathButtonHoverBg} active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]`}
              >
                <Check className="w-5 h-5" strokeWidth={2} />
                <span className="text-[16px]">Done with {pathType} path</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}