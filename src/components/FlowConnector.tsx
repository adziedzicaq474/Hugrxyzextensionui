import { Plus } from 'lucide-react';

interface FlowConnectorProps {
  onAddNode?: () => void;
}

export function FlowConnector({ onAddNode }: FlowConnectorProps) {
  return (
    <div className="relative w-full flex items-center justify-center py-2">
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2" />
      
      {/* Add Button */}
      <button
        onClick={onAddNode}
        className="relative z-10 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-all hover:border-[#feee7d] hover:bg-[#feee7d] hover:text-black hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#feee7d] focus:ring-offset-2"
        aria-label="Add node"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
