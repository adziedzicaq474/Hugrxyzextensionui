import { Play, CheckCircle2 } from 'lucide-react';

interface FlowMarkerProps {
  type: 'start' | 'end';
}

export function FlowMarker({ type }: FlowMarkerProps) {
  const isStart = type === 'start';

  return (
    <div
      className={`w-full border-2 rounded-xl p-4 ${
        isStart
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-gray-100 border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isStart ? 'bg-emerald-100' : 'bg-gray-200'
          }`}
        >
          {isStart ? (
            <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Label */}
        <div className="flex-1">
          <h3
            className={`text-[16px] leading-tight ${
              isStart ? 'text-emerald-900' : 'text-gray-900'
            }`}
          >
            {isStart ? 'Strategy Start' : 'Complete'}
          </h3>
          <p className="text-[14px] leading-relaxed text-gray-600">
            {isStart ? 'Initialize your DeFi strategy' : 'Strategy execution finished'}
          </p>
        </div>
      </div>
    </div>
  );
}
