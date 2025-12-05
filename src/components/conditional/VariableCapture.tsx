import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Hand, Check, Edit2 } from 'lucide-react';

interface VariableCaptureProps {
  variableName: string;
  onComplete: (variable: any) => void;
  onBack: () => void;
}

type CapturePhase = 'name' | 'capture' | 'extract';

export function VariableCapture({ variableName, onComplete, onBack }: VariableCaptureProps) {
  const [phase, setPhase] = useState<CapturePhase>('name');
  const [varName, setVarName] = useState('');
  const [capturedText, setCapturedText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [extractionMethod, setExtractionMethod] = useState<'full' | 'regex'>('full');
  const [regexPattern, setRegexPattern] = useState('');
  const [isEditingRegex, setIsEditingRegex] = useState(false);
  const [testText, setTestText] = useState('');

  const handleStartCapture = () => {
    // Mock: Simulate capturing an element
    setTimeout(() => {
      setCapturedText('1 USDC ≈ 0.999652 USDC');
      setPhase('extract');
    }, 1000);
  };

  const handleTextSelection = (text: string) => {
    setSelectedText(text);
    setExtractionMethod('regex');
    
    // Auto-detect regex pattern
    const pattern = detectPattern(text);
    setRegexPattern(pattern);
  };

  const detectPattern = (text: string): string => {
    // Decimal number
    if (/^\d+\.\d+$/.test(text)) return '\\d+\\.\\d+';
    // Integer
    if (/^\d+$/.test(text)) return '\\d+';
    // Percentage
    if (/^\d+%$/.test(text)) return '\\d+%';
    // Uppercase letters
    if (/^[A-Z]+$/.test(text)) return '[A-Z]+';
    // Hex address
    if (/^0x[a-fA-F0-9]+$/.test(text)) return '0x[a-fA-F0-9]+';
    // Default: escape special chars
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  const handleComplete = () => {
    const variable = {
      type: 'captured',
      name: varName,
      captureConfig: {
        target: 'div.price-display',
        rawText: capturedText,
        extractionMethod,
        regex: extractionMethod === 'regex' ? regexPattern : undefined,
        extractedValue: extractionMethod === 'regex' ? selectedText : capturedText,
      },
      dataType: 'number',
    };
    onComplete(variable);
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {phase === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-[20px] text-gray-900 mb-2">Capture {variableName}</h2>
                <p className="text-[14px] text-gray-600">
                  First, name this variable for future reference
                </p>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 mb-2">
                  Variable name
                </label>
                <input
                  type="text"
                  value={varName}
                  onChange={(e) => setVarName(e.target.value)}
                  placeholder="e.g., currentPrice"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#feee7d] focus:outline-none text-[16px]"
                />
                <p className="text-[12px] text-gray-500 mt-2">
                  Use camelCase (e.g., currentPrice, walletBalance)
                </p>
              </div>

              <button
                onClick={() => setPhase('capture')}
                disabled={!varName}
                className="w-full bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span className="text-[16px]">Next: Capture Element</span>
              </button>
            </motion.div>
          )}

          {phase === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-[20px] text-gray-900 mb-2">Capture Element</h2>
                <p className="text-[14px] text-gray-600">
                  Variable: <span className="font-mono font-semibold">{varName}</span>
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hand className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-[16px] text-gray-900 mb-2">Click to capture</h3>
                <p className="text-[14px] text-gray-600 mb-4">
                  Click the element on the page you want to capture
                </p>
                <button
                  onClick={handleStartCapture}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <span className="text-[16px]">Start Capture</span>
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'extract' && (
            <motion.div
              key="extract"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-[20px] text-gray-900 mb-2">Extract Value</h2>
                <p className="text-[14px] text-gray-600">
                  Variable: <span className="font-mono font-semibold">{varName}</span>
                </p>
              </div>

              {/* Captured Text */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                  <span className="text-[14px] text-green-700 font-semibold">
                    Element captured
                  </span>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-3">
                  <p className="text-[12px] text-gray-500 mb-1">Captured text:</p>
                  <p className="text-[16px] text-gray-900 font-mono">{capturedText}</p>
                </div>
              </div>

              {/* Extraction Method */}
              <div className="space-y-3">
                <p className="text-[14px] text-gray-700 font-semibold">
                  Select extraction method:
                </p>

                {/* Option 1: Use full text */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="extraction"
                    checked={extractionMethod === 'full'}
                    onChange={() => setExtractionMethod('full')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-[16px] text-gray-900">Use full text</p>
                    <p className="text-[14px] text-gray-600 font-mono break-all">
                      "{capturedText}"
                    </p>
                  </div>
                </label>

                {/* Option 2: Extract part */}
                <label className="flex items-start gap-3 cursor-pointer">
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
                        {/* Highlight selection */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-[12px] text-gray-600 mb-2">
                            Highlight the value you need:
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[14px] text-gray-900">1 USDC ≈</span>
                            <button
                              onClick={() => handleTextSelection('0.999652')}
                              className={`px-2 py-1 rounded ${
                                selectedText === '0.999652'
                                  ? 'bg-yellow-200 border-2 border-yellow-400'
                                  : 'hover:bg-gray-200'
                              }`}
                            >
                              <span className="text-[14px] font-mono">0.999652</span>
                            </button>
                            <span className="text-[14px] text-gray-900">USDC</span>
                          </div>
                          {selectedText && (
                            <p className="text-[12px] text-green-600 mt-2">
                              Selected: "{selectedText}"
                            </p>
                          )}
                        </div>

                        {/* Auto-detected pattern */}
                        {selectedText && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-[12px] text-gray-600 mb-2">
                              Auto-detected pattern:
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] text-gray-600">Type:</span>
                              <span className="text-[14px] text-gray-900">Decimal number</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[12px] text-gray-600">Regex:</span>
                              {!isEditingRegex ? (
                                <>
                                  <code className="flex-1 text-[14px] font-mono text-gray-900 bg-white px-2 py-1 rounded border border-blue-200">
                                    {regexPattern}
                                  </code>
                                  <button
                                    onClick={() => setIsEditingRegex(true)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <input
                                  type="text"
                                  value={regexPattern}
                                  onChange={(e) => setRegexPattern(e.target.value)}
                                  onBlur={() => setIsEditingRegex(false)}
                                  className="flex-1 text-[14px] font-mono px-2 py-1 border-2 border-blue-400 rounded focus:outline-none"
                                  autoFocus
                                />
                              )}
                            </div>
                            <div className="mt-2">
                              <span className="text-[12px] text-gray-600">Preview: </span>
                              <span className="text-[14px] text-green-600 font-semibold">
                                ✓ {selectedText}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Test extraction */}
                        {selectedText && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-[12px] text-gray-600 mb-2">
                              Test extraction (optional):
                            </p>
                            <input
                              type="text"
                              value={testText}
                              onChange={(e) => setTestText(e.target.value)}
                              placeholder="Try another example: 1 USDC ≈ 1.000123 USDC"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-[14px] focus:border-blue-400 focus:outline-none mb-2"
                            />
                            {testText && (
                              <div>
                                <span className="text-[12px] text-gray-600">Result: </span>
                                {testRegex(regexPattern, testText) ? (
                                  <span className="text-[14px] text-green-600 font-semibold">
                                    ✓ {testRegex(regexPattern, testText)}
                                  </span>
                                ) : (
                                  <span className="text-[14px] text-red-600">
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

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <span className="text-[16px]">Back</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-[#feee7d] text-black px-6 py-3 rounded-full hover:bg-[#fde047] active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <span className="text-[16px]">Confirm</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
