import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Edit3, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorMessageProps {
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  onEdit?: () => void;
  onSkip?: () => void;
}

export function ErrorMessage({ 
  message = "Response Failed",
  errorCode = "ERR_API_TIMEOUT: The request took too long to complete. Please try again.",
  onRetry,
  onEdit,
  onSkip
}: ErrorMessageProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: [0, -4, 4, -4, 4, 0], // Subtle shake animation
      }}
      transition={{
        opacity: { duration: 0.3 },
        y: { duration: 0.3 },
        x: { duration: 0.4, delay: 0.1 }
      }}
      className="flex gap-3 flex-row"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#ef5285]">
        <AlertTriangle className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 flex justify-start">
        <motion.div
          initial={{ borderColor: '#ef5285' }}
          animate={{ 
            borderColor: ['#ef5285', '#ff6b9d', '#ef5285'],
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
          className="max-w-[85%] rounded-xl p-4 bg-white border-2"
          style={{ borderColor: '#ef5285' }}
        >
          <p className="text-[16px] leading-relaxed text-[#ef5285] mb-4">
            {message}
          </p>
          
          {/* Action Buttons - Vertical Stack for Mobile */}
          <div className="flex flex-col gap-2 mb-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 bg-[#feee7d] text-black px-4 py-2 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[16px] leading-relaxed">Retry</span>
              </button>
            )}
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-transparent text-black px-4 py-2 rounded-md border border-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black min-h-[44px]"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-[16px] leading-relaxed">Edit</span>
                </button>
              )}
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="flex-1 flex items-center justify-center gap-2 bg-transparent text-black px-4 py-2 rounded-md border border-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black min-h-[44px]"
                >
                  <X className="w-4 h-4" />
                  <span className="text-[16px] leading-relaxed">Skip</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Error Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-gray-500 hover:text-gray-700 transition-colors focus:outline-none py-1"
          >
            <span className="text-sm">Technical Details</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-[#F2F2F2] rounded-md"
            >
              <code className="text-xs text-gray-600 break-words">
                {errorCode}
              </code>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}