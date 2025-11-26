import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';
import { PlanCard } from './PlanCard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planData?: {
    title?: string;
    tableData?: {
      strategyType?: string;
      primaryProtocols?: string;
      chains?: string;
      primaryPoolUrl?: string;
      captureStatus?: string;
      knownParameters?: Array<{ label: string; value: string }>;
      unknownParameters?: string[];
    };
    superseded?: boolean;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  onViewPlan?: (messageId: string) => void;
  onEditPlan?: (messageId: string) => void;
}

export function ChatMessages({ messages, onViewPlan, onEditPlan }: ChatMessagesProps) {
  return (
    <div className="px-4 flex flex-col gap-4">
      {messages.map((message, index) => (
        <div key={message.id} className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === 'assistant'
                  ? 'bg-[#feee7d]'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-black" />
              ) : (
                <User className="w-4 h-4 text-gray-700" />
              )}
            </div>
            <div
              className={`flex-1 ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 ${
                  message.role === 'assistant'
                    ? 'bg-white border border-gray-200'
                    : 'bg-[#feee7d] text-black'
                }`}
              >
                <p className="text-[16px] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Plan Card - Full Width Below Message */}
          {message.planData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="pl-11"
            >
              <PlanCard
                title={message.planData.title}
                tableData={message.planData.tableData}
                superseded={message.planData.superseded}
                onView={() => onViewPlan?.(message.id)}
                onEdit={() => onEditPlan?.(message.id)}
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}