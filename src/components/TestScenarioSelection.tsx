import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface TestScenario {
  id: string;
  name: string;
  description: string;
  type: 'happy-path' | 'edge-case' | 'conditional';
  conditions?: {
    blockName: string;
    condition: string;
    result: boolean;
  }[];
  estimatedSteps: number;
  coveragePercentage?: number;
}

interface TestScenarioSelectionProps {
  scenarios: TestScenario[];
  onSelectScenario: (scenarioId: string) => void;
  onBack: () => void;
  onTestError?: () => void; // For demo purposes
}

const scenarioTypeConfig = {
  'happy-path': {
    label: 'Happy Path',
    borderColor: 'border-[#10B981]',
    badgeBg: 'bg-[#10B981]',
    badgeText: 'text-white',
  },
  'edge-case': {
    label: 'Edge Case',
    borderColor: 'border-[#ef5285]',
    badgeBg: 'bg-[#ef5285]',
    badgeText: 'text-white',
  },
  'conditional': {
    label: 'Conditional',
    borderColor: 'border-[#feee7d]',
    badgeBg: 'bg-[#feee7d]',
    badgeText: 'text-black',
  },
};

export function TestScenarioSelection({
  scenarios,
  onSelectScenario,
  onBack,
  onTestError,
}: TestScenarioSelectionProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200">
        <div className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[14px] text-gray-600 mb-2">Selecting test cases</p>
            <h1 className="text-[24px] text-gray-900">Select Test Scenario</h1>
          </motion.div>
        </div>
      </div>

      {/* Body - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {/* Scenario Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {scenarios.map((scenario, index) => {
              const config = scenarioTypeConfig[scenario.type];

              return (
                <motion.button
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`w-full bg-white border-l-4 ${config.borderColor} border border-gray-200 hover:shadow-md rounded-xl overflow-hidden transition-all active:scale-[0.98]`}
                >
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full ${config.badgeBg} ${config.badgeText} text-[12px]`}>
                        {config.label}
                      </div>
                      {/* Play Button */}
                      <div className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center hover:bg-[#feee7d] transition-colors">
                        <Play className="w-5 h-5 text-black" strokeWidth={2} fill="currentColor" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mb-4 text-left">
                      <h3 className="text-[16px] text-black mb-2">{scenario.name}</h3>
                      <p className="text-[14px] text-gray-600 leading-relaxed">{scenario.description}</p>
                    </div>

                    {/* Conditions - Plain Text */}
                    {scenario.conditions && scenario.conditions.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-gray-200 space-y-1 text-left">
                        {scenario.conditions.map((cond, idx) => (
                          <div key={idx} className="text-[12px] text-gray-600">
                            <span className="text-black">{cond.blockName}</span>: {cond.condition} → <span className={cond.result ? 'text-[#10B981]' : 'text-[#ef5285]'}>{cond.result ? 'TRUE' : 'FALSE'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Stats */}
                    <div className="flex items-center gap-4 text-[12px] text-gray-600">
                      <span>{scenario.estimatedSteps} steps</span>
                      {scenario.coveragePercentage && (
                        <>
                          <span>•</span>
                          <span>{scenario.coveragePercentage}% coverage</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Coverage Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#F2F2F2] rounded-xl p-4 mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] text-black">Total Coverage</span>
              <span className="text-[16px] text-black">
                {Math.round(scenarios.reduce((acc, s) => acc + (s.coveragePercentage || 0), 0) / scenarios.length)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#feee7d]"
                style={{
                  width: `${scenarios.reduce((acc, s) => acc + (s.coveragePercentage || 0), 0) / scenarios.length}%`,
                }}
              />
            </div>
            <p className="text-[12px] text-gray-600 mt-2">
              Run all scenarios for 100% coverage
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 max-w-md mx-auto space-y-2">
          {/* Demo: Test Error Button */}
          {onTestError && (
            <button
              onClick={onTestError}
              className="w-full bg-[#ef5285] text-white px-6 py-3 rounded-full hover:bg-[#d94373] active:scale-[0.98] transition-all min-h-[44px]"
            >
              <span className="text-[16px]">Demo: Trigger Error</span>
            </button>
          )}
          
          <button
            onClick={onBack}
            className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
          >
            <span className="text-[16px]">Back to Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
}