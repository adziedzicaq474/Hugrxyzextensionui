import { Circle, ArrowDownUp, Wallet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface FlowNodeProps {
  id: string;
  type: 'action';
  icon: 'swap' | 'wallet' | 'trend' | 'alert';
  title: string;
  subtitle: string;
  status: 'recorded' | 'pending';
  onClick?: () => void;
}

const iconMap = {
  swap: ArrowDownUp,
  wallet: Wallet,
  trend: TrendingUp,
  alert: AlertCircle,
};

export function FlowNode({ id, type, icon, title, subtitle, status, onClick }: FlowNodeProps) {
  const IconComponent = iconMap[icon];
  const isRecorded = status === 'recorded';

  return (
    <button
      onClick={onClick}
      className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 transition-all hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-gray-400 text-left"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
          <IconComponent className="w-5 h-5 text-gray-700" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[16px] leading-tight flex-1">{title}</h3>
            {/* Status Badge */}
            <span
              className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] leading-tight ${
                isRecorded
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isRecorded ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Recorded</span>
                </>
              ) : (
                <>
                  <Circle className="w-3 h-3" />
                  <span>Pending</span>
                </>
              )}
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-gray-600">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
