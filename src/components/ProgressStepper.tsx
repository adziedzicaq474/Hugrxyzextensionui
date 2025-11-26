import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: string;
}

const steps = [
  { id: 'chat', label: 'Chat' },
  { id: 'flow', label: 'Flow' },
  { id: 'record', label: 'Record' },
  { id: 'test', label: 'Test' },
  { id: 'deploy', label: 'Deploy' },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <span
                  className={`text-sm transition-all ${
                    index === currentIndex
                      ? 'text-black font-semibold'
                      : index < currentIndex
                      ? 'text-[#10B981]'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                <div
                  className={`w-full h-1 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#feee7d]'
                      : index < currentIndex
                      ? 'bg-[#10B981]'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
              {index < steps.length - 1 && (
                <div className="w-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}