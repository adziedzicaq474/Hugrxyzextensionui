import { Plus } from 'lucide-react';

interface FlowConnectorBlueProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
  dashed?: boolean;
}

export function FlowConnectorBlue({ 
  showAddButton = false, 
  onAddClick,
  dashed = false 
}: FlowConnectorBlueProps) {
  return (
    <div className="flex items-center justify-center py-4 relative">
      {/* Vertical blue line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-0.5 h-full bg-blue-500 ${dashed ? 'opacity-50' : ''}`} />
      </div>

      {/* Optional Add Button */}
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}
