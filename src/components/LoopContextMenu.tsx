import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RefreshCw } from 'lucide-react';

interface LoopContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  onDelete: () => void;
  onConvertToWhile: () => void;
}

export function LoopContextMenu({
  isOpen,
  onClose,
  position,
  onDelete,
  onConvertToWhile,
}: LoopContextMenuProps) {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleConvert = () => {
    onConvertToWhile();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Context Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="z-50 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Menu Items */}
            <button
              onClick={handleConvert}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-200"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] leading-tight text-gray-900">
                  Convert to While Loop
                </div>
                <div className="text-[12px] leading-tight text-gray-500 mt-0.5">
                  Change to condition-based
                </div>
              </div>
            </button>

            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] leading-tight text-red-600">
                  Delete Loop
                </div>
                <div className="text-[12px] leading-tight text-red-500 mt-0.5">
                  Remove this loop
                </div>
              </div>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
