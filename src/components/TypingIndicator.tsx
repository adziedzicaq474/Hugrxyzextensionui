import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#feee7d]">
        <Bot className="w-4 h-4 text-black" />
      </div>
      <div className="flex-1 flex justify-start">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '1s' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
