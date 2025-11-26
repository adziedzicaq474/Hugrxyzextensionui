import { Plus } from 'lucide-react';

interface FlowConnectorGreenProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
  fromCenter?: boolean; // Connect from center of Yes button
}

export function FlowConnectorGreen({ showAddButton = false, onAddClick, fromCenter = true }: FlowConnectorGreenProps) {
  return (
    <div className="flex items-center justify-center py-4 relative">
      {/* Vertical green line - positioned from center when fromCenter is true */}
      <div className={`absolute inset-0 flex items-center ${fromCenter ? 'justify-center' : 'justify-start'}`}>
        <div className={`w-0.5 h-full bg-emerald-500 ${fromCenter ? '' : 'ml-4'}`} />
      </div>

      {/* Optional Add Button */}
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}