import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Camera, X, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { ProgressStepper } from './ProgressStepper';
import { ChatMessages } from './ChatMessages';
import { StreamingMessage } from './StreamingMessage';
import { ErrorMessage } from './ErrorMessage';

interface AIArchitectProps {
  onBack: () => void;
  onViewPlan?: () => void;
  stepperStep?: 'chat' | 'flow' | 'record' | 'test' | 'deploy';
  initialPrompt?: string;
  onPromptUsed?: () => void;
}

const placeholders = [
  "Create a stablecoin strategy...",
  "Automate CLMM rebalancing...",
  "Build an arbitrage bot...",
  "Set up yield farming..."
];

export function AIArchitect({ onBack, onViewPlan, stepperStep, initialPrompt, onPromptUsed }: AIArchitectProps) {
  const [messages, setMessages] = useState<Array<{
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
  }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Architect. I\'ll help you design and build your DeFi strategy. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [capturedInfos, setCapturedInfos] = useState<Array<{ id: string; url: string }>>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingCharIndex, setStreamingCharIndex] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [lastCapturedInfos, setLastCapturedInfos] = useState<Array<{ id: string; url: string }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to top on mount (when returning from plan review)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    // If user has sent a message, stop the typewriter effect
    if (hasUserSentMessage) {
      setPlaceholder('Keep polishing your plan');
      return;
    }

    const currentPlaceholder = placeholders[placeholderIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentPlaceholder.length) {
          setPlaceholder(currentPlaceholder.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setPlaceholder(currentPlaceholder.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next placeholder
          setIsDeleting(false);
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, hasUserSentMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputValue]);

  // Handle initial prompt from parent (e.g., from "Request Changes")
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInputValue(initialPrompt);
      // Focus on input and move cursor to end
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(initialPrompt.length, initialPrompt.length);
        }
      }, 100);
      // Notify parent that prompt has been used
      if (onPromptUsed) {
        onPromptUsed();
      }
    }
  }, [initialPrompt, onPromptUsed]);

  // Smooth scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, streamingContent, showError]);

  // Streaming effect - character by character
  useEffect(() => {
    if (!isStreaming) {
      // Clean up interval when not streaming
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
      return;
    }

    const fullResponse = "Great choice! Let me help you configure that strategy. What's your risk tolerance? We can set up conservative (3-5% APY), moderate (8-12% APY), or aggressive (15%+ APY) parameters based on your preferences.";
    
    setStreamingContent('');
    setStreamingCharIndex(0);
    setShowSkeleton(true);
    setShowError(false);

    // Simulate random error (30% chance) for demonstration
    const shouldError = Math.random() < 0.3;

    if (shouldError) {
      // Show skeleton then error after 2 seconds
      const errorTimeout = setTimeout(() => {
        // Clean up streaming
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setIsStreaming(false);
        setShowError(true);
      }, 2000);

      return () => {
        clearTimeout(errorTimeout);
      };
    }

    // Show skeleton for 500ms before starting text stream
    const skeletonTimeout = setTimeout(() => {
      setShowSkeleton(false);
      
      streamingIntervalRef.current = setInterval(() => {
        setStreamingCharIndex((prevIndex) => {
          if (prevIndex >= fullResponse.length) {
            // Streaming complete
            if (streamingIntervalRef.current) {
              clearInterval(streamingIntervalRef.current);
              streamingIntervalRef.current = null;
            }
            
            // Add final message to chat
            setTimeout(() => {
              setIsStreaming(false);
              const shouldShowPlan = (window as any).__shouldShowPlan;
              
              const aiMessage = {
                id: Date.now().toString(),
                role: 'assistant' as const,
                content: fullResponse,
                timestamp: new Date(),
                planData: shouldShowPlan ? {
                  title: "Cross-chain USDC Arbitrage Strategy",
                  tableData: {
                    strategyType: "Cross-chain USDC Arbitrage",
                    primaryProtocols: "OKX DEX Bridge",
                    chains: "Base, Mantle, Linea, Arbitrum",
                    primaryPoolUrl: "https://web3.okx.com/zh-hant/dex-swap/bridge?chain=base,mantle&token=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                    captureStatus: "Capture collected (from provided HTML)",
                    knownParameters: [
                      { label: "Base USDC Contract", value: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
                      { label: "Mantle USDC Contract", value: "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9" },
                      { label: "Linea USDC Contract", value: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
                      { label: "Arbitrum USDC Contract", value: "0xaf88d065e77c8cc2239327c5edb3a432268e5831" },
                      { label: "Target Net Profit Threshold", value: ">0.15%" },
                      { label: "Execution Environment", value: "Automated via OKX Wallet Extension (via Capture Protocol Info)" }
                    ],
                    unknownParameters: [
                      "Real-time price spread on Linea/Arbitrum (requires periodic Capture)",
                      "Exact gas fees for each route (requires periodic Capture)"
                    ]
                  },
                  superseded: false
                } : undefined
              };
              setMessages((prev) => [...prev, aiMessage]);
              setStreamingContent('');
              
              // Clear the flag
              (window as any).__shouldShowPlan = false;
            }, 100);
            
            return prevIndex;
          }
          
          const newContent = fullResponse.slice(0, prevIndex + 1);
          setStreamingContent(newContent);
          return prevIndex + 1;
        });
      }, 30); // 30ms per character for smooth streaming
    }, 500);

    return () => {
      clearTimeout(skeletonTimeout);
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
    };
  }, [isStreaming]);

  const handleSend = () => {
    if (!inputValue.trim() && capturedInfos.length === 0) return;

    // Add user message
    const attachments = capturedInfos.length > 0
      ? `\n\n[Attached: ${capturedInfos.map(info => info.url).join(', ')}]`
      : '';
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: `${inputValue}${attachments}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Check if user is asking for a strategy/plan
    const shouldShowPlan = inputValue.toLowerCase().includes('strategy') || 
                          inputValue.toLowerCase().includes('plan') ||
                          inputValue.toLowerCase().includes('create') ||
                          inputValue.toLowerCase().includes('build');
    
    setInputValue('');
    setCapturedInfos([]);
    setHasUserSentMessage(true);
    setLastUserMessage(inputValue);
    setLastCapturedInfos(capturedInfos);
    
    // Start streaming after a short delay
    setTimeout(() => {
      setIsStreaming(true);
      // Store whether to show plan after streaming
      (window as any).__shouldShowPlan = shouldShowPlan;
    }, 500);
  };
  
  const handleStop = () => {
    // Clear streaming interval
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    
    // Add current streaming content as final message
    if (streamingContent) {
      const aiMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: streamingContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
    
    setIsStreaming(false);
    setStreamingContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCaptureInfo = () => {
    setIsCapturing(true);
    // Simulate capture process with random URL
    setTimeout(() => {
      const mockUrls = [
        'web3.okx.com/...268e5831',
        'app.uniswap.org/...9a3f7b2c',
        'app.aave.com/...4d8e6f1a',
        'curve.fi/...7c2b9e5d',
        'compound.finance/...1f4a8c3e'
      ];
      const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
      const newInfo = {
        id: Date.now().toString(),
        url: randomUrl
      };
      setCapturedInfos((prev) => [...prev, newInfo]);
      setIsCapturing(false);
    }, 1000);
  };

  const handleRemoveCapturedInfo = (id: string) => {
    setCapturedInfos((prev) => prev.filter(info => info.id !== id));
  };

  const handleRetry = () => {
    setShowError(false);
    // Retry with exact same payload (message + attachments)
    setTimeout(() => {
      setIsStreaming(true);
    }, 500);
  };

  const handleEdit = () => {
    setShowError(false);
    // Populate input with last user message and restore attachments for editing
    setInputValue(lastUserMessage);
    setCapturedInfos(lastCapturedInfos);
    // Focus on input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSkip = () => {
    // Clear error and reset state
    setShowError(false);
    setLastUserMessage('');
    setLastCapturedInfos([]);
  };

  const handleViewPlan = (messageId: string) => {
    console.log('View plan:', messageId);
    // TODO: Navigate to plan detail view
    if (onViewPlan) {
      onViewPlan();
    }
  };

  const handleEditPlan = (messageId: string) => {
    console.log('Edit plan:', messageId);
    // TODO: Open plan editor
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Progress Stepper */}
      <ProgressStepper currentStep={stepperStep || "chat"} />

      {/* Sticky Header */}
      <header className="sticky top-[76px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3 bg-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[24px] leading-tight">AI Architect</h1>
        </div>
      </header>

      {/* Scrollable Chat Area */}
      <main className="flex-1 overflow-y-auto pb-[220px] pt-0">
        <div className="pt-4">
          <ChatMessages 
            messages={messages} 
            onViewPlan={handleViewPlan}
            onEditPlan={handleEditPlan}
          />
          {isStreaming && (
            <div className="mt-4 px-4">
              <StreamingMessage content={streamingContent} showSkeleton={showSkeleton} />
            </div>
          )}
          {showError && (
            <div className="mt-4 px-4">
              <ErrorMessage onRetry={handleRetry} onEdit={handleEdit} onSkip={handleSkip} />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Sticky Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="px-4 py-4 flex flex-col gap-3">
          {/* Captured Infos */}
          {capturedInfos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {capturedInfos.map((info) => (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 bg-[#feee7d] rounded-md px-3 py-2"
                >
                  <Camera className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-sm text-black">{info.url}</span>
                  <button
                    onClick={() => handleRemoveCapturedInfo(info.id)}
                    className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors flex-shrink-0"
                    aria-label="Remove captured info"
                  >
                    <X className="w-3 h-3 text-black" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              rows={2}
              disabled={isStreaming}
              className="w-full resize-none border border-gray-200 rounded-md px-4 py-3 pr-14 text-[16px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#feee7d] disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ maxHeight: '140px' }}
            />
            {isStreaming ? (
              <button
                onClick={handleStop}
                className="absolute right-2 bottom-2 bg-[#ef5285] text-white p-2 rounded-full transition-all hover:scale-[1.05] active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-black w-10 h-10 flex items-center justify-center"
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() && capturedInfos.length === 0}
                className="absolute right-2 bottom-2 bg-[#feee7d] text-black p-2 rounded-full transition-all hover:scale-[1.05] active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleCaptureInfo}
            disabled={isCapturing || isStreaming}
            className="w-full bg-transparent text-black px-4 py-3 rounded-md border border-gray-200 transition-all hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[16px] leading-relaxed">
              {isCapturing ? 'Capturing...' : 'Get Info'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}