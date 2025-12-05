import { motion } from 'motion/react';
import { Play, ArrowRight, SkipForward } from 'lucide-react';

interface PathActionSelectorProps {
  pathType: 'YES' | 'NO';
  condition: any;
  onSelectRecord: () => void;
  onSelectJump: () => void;
  onSelectSkip: () => void;
  onBack: () => void;
}

export function PathActionSelector({
  pathType,
  condition,
  onSelectRecord,
  onSelectJump,
  onSelectSkip,
  onBack,
}: PathActionSelectorProps) {
  const { variableA, operator, variableB } = condition;
  const getVarDisplay = (v: any) => v?.name || v?.value || '?';
  const conditionString = `${getVarDisplay(variableA)} ${operator} ${getVarDisplay(variableB)}`;
  
  // Define colors based on path type
  const isYesPath = pathType === 'YES';
  const pathBorderColor = isYesPath ? 'border-green-300' : 'border-rose-300';
  const pathHoverBorderColor = isYesPath ? 'hover:border-green-400' : 'hover:border-rose-400';
  const pathHoverBgColor = isYesPath ? 'hover:bg-green-50' : 'hover:bg-rose-50';
  const pathBgColor = isYesPath ? 'bg-green-100' : 'bg-rose-100';
  const pathIconColor = isYesPath ? 'text-green-700' : 'text-rose-700';
  const pathTextColor = isYesPath ? 'text-green-600' : 'text-rose-600';

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[20px] text-gray-900 mb-2">{pathType} Path Action</h2>
          <p className="text-[14px] text-gray-600 mb-3">
            When: <span className="font-mono">{conditionString}</span>
          </p>
          <p className="text-[14px] text-gray-600">
            Is <span className={`font-semibold ${pathTextColor}`}>{pathType === 'YES' ? 'TRUE' : 'FALSE'}</span>, what to do?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {/* Option 1: Record new actions */}
          <button
            onClick={onSelectRecord}
            className={`w-full bg-white border-2 ${pathBorderColor} ${pathHoverBorderColor} ${pathHoverBgColor} rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${pathBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Play className={`w-5 h-5 ${pathIconColor}`} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Record new actions</h3>
                <p className="text-[14px] text-gray-600">
                  Capture a sequence of steps to execute
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Jump to step */}
          <button
            onClick={onSelectJump}
            className="w-full bg-white border-2 border-gray-300 hover:border-[#feee7d] hover:bg-yellow-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-blue-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Go to Step X</h3>
                <p className="text-[14px] text-gray-600">
                  Jump back to a previous step
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Skip */}
          <button
            onClick={onSelectSkip}
            className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl p-4 text-left transition-all active:scale-[0.98] min-h-[44px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <SkipForward className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-gray-900 mb-1">Skip (do nothing)</h3>
                <p className="text-[14px] text-gray-600">
                  Continue to next step without action
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <p className="text-[14px] text-gray-700">
            <span className="font-semibold">Tip:</span> Use "Record" for new actions, "Jump" to create loops, or "Skip" if this path doesn't need handling.
          </p>
        </motion.div>
      </div>
    </div>
  );
}