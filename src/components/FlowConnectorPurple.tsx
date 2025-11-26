import { Plus } from 'lucide-react';

interface FlowConnectorPurpleProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
  dashed?: boolean;
}

export function FlowConnectorPurple({ 
  showAddButton = false, 
  onAddClick,
  dashed = false 
}: FlowConnectorPurpleProps) {
  return (
    <div className="flex items-center justify-center py-4 relative">
      {/* Vertical purple line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-0.5 h-full bg-purple-500 ${dashed ? 'opacity-50' : ''}`} />
      </div>

      {/* Optional Add Button */}
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-purple-500 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}
