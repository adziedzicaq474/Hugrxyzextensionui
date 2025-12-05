import { motion, AnimatePresence } from 'motion/react';
import { Camera, ArrowLeft, Sparkles, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface CaptureSetupProps {
  fieldName: string;
  onStartRecording: (variableName: string, extractionConfig?: ExtractionConfig) => void;
  onBack: () => void;
}

interface ExtractionConfig {
  method: 'full' | 'regex';
  pattern?: string;
  testExample?: string;
}

export function CaptureSetup({
  fieldName,
  onStartRecording,
  onBack,
}: CaptureSetupProps) {
  const [variableName, setVariableName] = useState('');
  const [step, setStep] = useState<'name' | 'capture' | 'extraction'>('name');
  
  // Extraction config
  const [extractionMethod, setExtractionMethod] = useState<'full' | 'regex'>('full');
  const [capturedText, setCapturedText] = useState('1.5 ETH'); // Simulated capture
  const [selectedText, setSelectedText] = useState('');
  const [regexPattern, setRegexPattern] = useState('');
  const [isEditingRegex, setIsEditingRegex] = useState(false);
  const [testText, setTestText] = useState('');

  const handleStartRecording = () => {
    if (variableName.trim()) {
      // Simulate capture
      setStep('capture');
      
      // Auto-proceed to extraction after simulated capture
      setTimeout(() => {
        setStep('extraction');
      }, 1000);
    }
  };

  const handleConfirmExtraction = () => {
    const config: ExtractionConfig = {
      method: extractionMethod,
      pattern: extractionMethod === 'regex' ? regexPattern : undefined,
      testExample: extractionMethod === 'regex' ? selectedText : capturedText,
    };
    
    onStartRecording(variableName.trim(), config);
  };

  // Auto-detect regex pattern based on selected text
  const detectPattern = (text: string): string => {
    // Decimal number (e.g., "1.5")
    if (/^\d+\.\d+$/.test(text)) return '\\d+\\.\\d+';
    
    // Integer (e.g., "42")
    if (/^\d+$/.test(text)) return '\\d+';
    
    // Percentage (e.g., "15%")
    if (/^\d+\.?\d*%$/.test(text)) return '\\d+\\.?\\d*%';
    
    // Currency with symbol (e.g., "$1,000.50")
    if (/^\$[\d,]+\.?\d*$/.test(text)) return '\\$[\\d,]+\\.?\\d*';
    
    // Default: exact text
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleTextSelection = () => {
    // Simulate text selection
    const selection = '1.5';
    setSelectedText(selection);
    setExtractionMethod('regex');
    
    const pattern = detectPattern(selection);
    setRegexPattern(pattern);
  };

  const testRegex = (pattern: string, testInput: string): string | null => {
    try {
      const regex = new RegExp(pattern);
      const match = testInput.match(regex);
      return match ? match[0] : null;
    } catch {
      return null;
    }
  };

  // Step 1: Variable Name
  if (step === 'name') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-gray-200 rounded-xl p-4"
      >
        <h3 className="text-[14px] text-gray-700 mb-3">Capture {fieldName}</h3>
        
        <div className="space-y-4">
          {/* Variable Name Input */}
          <div>
            <label className="block text-[14px] text-gray-700 mb-2">
              Variable Name
            </label>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="balance"
              className="w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-black focus:outline-none transition-colors min-h-[44px] text-[16px]"
              autoFocus
            />
            <p className="text-[12px] text-gray-600 mt-2">
              This name will be used to reference the captured value
            </p>
          </div>

          {/* Start Recording Button */}
          <button
            onClick={handleStartRecording}
            disabled={!variableName.trim()}
            className="w-full bg-[#ef5285] text-white px-6 py-3 rounded-full hover:bg-[#d94373] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" strokeWidth={2} />
            <span className="text-[16px]">Start Recording</span>
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
          >
            <span className="text-[16px]">Back</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Step 2: Capturing (Simulated)
  if (step === 'capture') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-[#ef5285] rounded-xl p-6 text-center"
      >
        <div className="w-16 h-16 bg-[#ef5285]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-[#ef5285] animate-pulse" strokeWidth={2} />
        </div>
        <h3 className="text-[16px] text-black mb-2">Recording...</h3>
        <p className="text-[14px] text-gray-600">
          Click on the element you want to capture
        </p>
      </motion.div>
    );
  }

  // Step 3: Extraction Method Selection
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-4"
    >
      <h3 className="text-[14px] text-gray-700 mb-3">Extract Value from Text</h3>

      {/* Captured Text Display */}
      <div className="bg-[#F2F2F2] rounded-lg p-3 mb-4">
        <p className="text-[12px] text-gray-600 mb-1">Captured Text:</p>
        <p className="text-[16px] text-black font-mono">{capturedText}</p>
      </div>

      {/* Extraction Method Selection */}
      <div className="space-y-3 mb-4">
        {/* Full Text */}
        <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#feee7d] hover:bg-[#feee7d]/5 cursor-pointer transition-all">
          <input
            type="radio"
            name="extraction"
            checked={extractionMethod === 'full'}
            onChange={() => setExtractionMethod('full')}
            className="mt-1"
          />
          <div className="flex-1">
            <p className="text-[16px] text-gray-900 mb-1">Use full text</p>
            <p className="text-[12px] text-gray-600">
              Capture: <span className="font-mono">&quot;{capturedText}&quot;</span>
            </p>
          </div>
        </label>

        {/* Regex Extraction */}
        <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#feee7d] hover:bg-[#feee7d]/5 cursor-pointer transition-all">
          <input
            type="radio"
            name="extraction"
            checked={extractionMethod === 'regex'}
            onChange={() => setExtractionMethod('regex')}
            className="mt-1"
          />
          <div className="flex-1">
            <p className="text-[16px] text-gray-900 mb-2">Extract part of text</p>
            
            {extractionMethod === 'regex' && (
              <div className="space-y-3">
                {/* Selection Helper */}
                {!selectedText && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-[12px] text-gray-700 mb-2">
                      Select the part you want to extract:
                    </p>
                    <div className="bg-white rounded px-3 py-2 border border-blue-300">
                      <p className="text-[14px] font-mono">
                        <button
                          onClick={handleTextSelection}
                          className="text-blue-600 hover:bg-blue-100 px-1 rounded"
                        >
                          1.5
                        </button>
                        {' '}ETH
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2">
                      Click on the blue text to select it
                    </p>
                  </div>
                )}

                {/* Auto-detected Pattern */}
                {selectedText && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#10B981]/10 border border-[#10B981] rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#10B981]" strokeWidth={2} />
                        <p className="text-[12px] text-gray-700">
                          Auto-detected pattern
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] text-gray-600">Extract:</span>
                        <code className="flex-1 text-[14px] font-mono text-black bg-white px-2 py-1 rounded border border-[#10B981]">
                          {selectedText}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-600">Regex:</span>
                        {!isEditingRegex ? (
                          <>
                            <code className="flex-1 text-[14px] font-mono text-gray-900 bg-white px-2 py-1 rounded border border-[#10B981]">
                              {regexPattern}
                            </code>
                            <button
                              onClick={() => setIsEditingRegex(true)}
                              className="text-[#10B981] hover:text-[#059669] p-1"
                            >
                              <Edit2 className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </>
                        ) : (
                          <input
                            type="text"
                            value={regexPattern}
                            onChange={(e) => setRegexPattern(e.target.value)}
                            onBlur={() => setIsEditingRegex(false)}
                            className="flex-1 text-[14px] font-mono px-2 py-1 border-2 border-[#10B981] rounded focus:outline-none"
                            autoFocus
                          />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Test Regex */}
                {selectedText && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-[12px] text-gray-700 mb-2">Test with different text:</p>
                    <input
                      type="text"
                      value={testText}
                      onChange={(e) => setTestText(e.target.value)}
                      placeholder="2.8 ETH"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-black focus:outline-none text-[14px] mb-2"
                    />
                    {testText && (
                      <div>
                        <span className="text-[12px] text-gray-600">Result: </span>
                        {testRegex(regexPattern, testText) ? (
                          <span className="text-[14px] text-[#10B981]">
                            ✓ {testRegex(regexPattern, testText)}
                          </span>
                        ) : (
                          <span className="text-[14px] text-[#ef5285]">
                            ✗ No match
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleConfirmExtraction}
          disabled={extractionMethod === 'regex' && !selectedText}
          className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-[16px]">Confirm</span>
        </button>
        <button
          onClick={() => setStep('name')}
          className="w-full bg-[#F2F2F2] text-black px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
        >
          <span className="text-[16px]">Back</span>
        </button>
      </div>
    </motion.div>
  );
}
