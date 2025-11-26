import { motion, AnimatePresence } from 'motion/react';
import { X, Repeat, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIterations: number;
  onSave: (iterations: number) => void;
}

export function EditLoopModal({
  isOpen,
  onClose,
  currentIterations,
  onSave,
}: EditLoopModalProps) {
  const [iterations, setIterations] = useState(currentIterations);

  useEffect(() => {
    setIterations(currentIterations);
  }, [currentIterations]);

  const handleIncrement = () => {
    if (iterations < 99) {
      setIterations(iterations + 1);
    }
  };

  const handleDecrement = () => {
    if (iterations > 1) {
      setIterations(iterations - 1);
    }
  };

  const handleSave = () => {
    onSave(iterations);
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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#8B5CF6' }}>
                      <Repeat className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-[20px] leading-tight text-gray-900">
                      Edit Loop
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                <label className="block text-[16px] leading-tight text-gray-900 mb-4">
                  Iterations
                </label>
                
                {/* Counter Control */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={handleDecrement}
                    disabled={iterations <= 1}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  {/* Display */}
                  <div className="min-w-[120px] text-center">
                    <div className="text-[48px] leading-none mb-2" style={{ color: '#8B5CF6' }}>
                      {iterations}
                    </div>
                    <div className="text-[14px] leading-tight text-gray-600">
                      {iterations === 1 ? 'iteration' : 'iterations'}
                    </div>
                  </div>

                  <button
                    onClick={handleIncrement}
                    disabled={iterations >= 99}
                    className="w-12 h-12 flex items-center justify-center text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    style={{ backgroundColor: '#8B5CF6' }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Input Alternative */}
                <div className="mt-6">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={iterations}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 99) {
                        setIterations(value);
                      }
                    }}
                    className="w-full px-4 py-2.5 text-center text-[16px] leading-tight border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent min-h-[44px]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 bg-transparent border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-2.5 text-white rounded-full hover:opacity-90 transition-opacity min-h-[44px]"
                  style={{ backgroundColor: '#8B5CF6' }}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}