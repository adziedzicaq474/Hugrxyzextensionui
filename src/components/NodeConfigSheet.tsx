import { X, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface NodeConfigSheetProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  initialTitle: string;
  initialSubtitle: string;
  initialStatus: 'recorded' | 'pending';
  initialNodeType?: 'interaction' | 'conditional';
  initialConditionalType?: 'ifelse' | 'while' | 'for';
  onSave: (config: {
    title: string;
    subtitle: string;
    nodeType: 'interaction' | 'conditional';
    conditionalType?: 'ifelse' | 'while' | 'for';
  }) => void;
  onDelete?: () => void;
}

export function NodeConfigSheet({
  isOpen,
  onClose,
  nodeId,
  initialTitle,
  initialSubtitle,
  initialStatus,
  initialNodeType,
  initialConditionalType,
  onSave,
  onDelete,
}: NodeConfigSheetProps) {
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [nodeType, setNodeType] = useState<'interaction' | 'conditional'>(
    initialNodeType || 'interaction'
  );
  const [conditionalType, setConditionalType] = useState<'ifelse' | 'while' | 'for'>(
    initialConditionalType || 'ifelse'
  );

  const handleSave = () => {
    onSave({ 
      title, 
      subtitle, 
      nodeType, 
      conditionalType: nodeType === 'conditional' ? conditionalType : undefined 
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
      },
    },
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

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-[20px] leading-tight">Edit Node</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-6 max-h-[70vh] overflow-y-auto">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* Status Display (Read-only) */}
                <div>
                  <label className="block text-[14px] leading-relaxed text-gray-700 mb-2">
                    Status
                  </label>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      initialStatus === 'recorded'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {initialStatus === 'recorded' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[14px] leading-relaxed">Recorded</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span className="text-[14px] leading-relaxed">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-[14px] leading-relaxed text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#feee7d] transition-colors min-h-[44px]"
                    placeholder="Enter node title"
                  />
                </div>

                {/* Subtitle Input */}
                <div>
                  <label className="block text-[14px] leading-relaxed text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#feee7d] transition-colors resize-none"
                    placeholder="Enter node description"
                  />
                </div>

                {/* Type Selection (First Layer) */}
                <div>
                  <label className="block text-[14px] leading-relaxed text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNodeType('interaction')}
                      className={`px-4 py-3 border-2 rounded-md transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#feee7d] ${
                        nodeType === 'interaction'
                          ? 'border-[#feee7d] bg-[#feee7d]/10 text-black'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      Interaction
                    </button>
                    <button
                      onClick={() => setNodeType('conditional')}
                      className={`px-4 py-3 border-2 rounded-md transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#feee7d] ${
                        nodeType === 'conditional'
                          ? 'border-[#feee7d] bg-[#feee7d]/10 text-black'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      Conditional
                    </button>
                  </div>
                </div>

                {/* Conditional Type Selection (Second Layer) */}
                {nodeType === 'conditional' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[14px] leading-relaxed text-gray-700 mb-2">
                      Conditional Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setConditionalType('ifelse')}
                        className={`px-4 py-3 border-2 rounded-md transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#feee7d] ${
                          conditionalType === 'ifelse'
                            ? 'border-[#feee7d] bg-[#feee7d]/10 text-black'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        If-Else
                      </button>
                      <button
                        onClick={() => setConditionalType('while')}
                        className={`px-4 py-3 border-2 rounded-md transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#feee7d] ${
                          conditionalType === 'while'
                            ? 'border-[#feee7d] bg-[#feee7d]/10 text-black'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        While
                      </button>
                      <button
                        onClick={() => setConditionalType('for')}
                        className={`px-4 py-3 border-2 rounded-md transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#feee7d] ${
                          conditionalType === 'for'
                            ? 'border-[#feee7d] bg-[#feee7d]/10 text-black'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        For
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-4 py-4 space-y-2">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-[#feee7d] text-black px-4 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#feee7d] min-h-[44px]"
              >
                Save Changes
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-full transition-all hover:border-[#ef5285] hover:text-[#ef5285] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[44px]"
                >
                  Delete Node
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
