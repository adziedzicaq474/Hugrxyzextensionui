import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PlanCardProps {
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
  onView?: () => void;
  superseded?: boolean;
}

export function PlanCard({ 
  title = "Strategy Plan Ready",
  tableData,
  onView,
  superseded = false
}: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: superseded 
          ? 'none'
          : [
              '0 0 0 rgba(254, 238, 125, 0)',
              '0 0 20px rgba(254, 238, 125, 0.4)',
              '0 0 0 rgba(254, 238, 125, 0)',
            ]
      }}
      transition={{ 
        duration: 0.4,
        y: { type: "spring", stiffness: 100, damping: 15 },
        boxShadow: { 
          duration: 2,
          repeat: 2,
          repeatType: "loop"
        }
      }}
      onClick={superseded ? undefined : onView}
      className={`w-full rounded-xl border-2 bg-white p-4 transition-all ${
        superseded
          ? 'border-gray-300 opacity-60 cursor-not-allowed'
          : 'border-[#feee7d] hover:shadow-lg hover:scale-[1.01] cursor-pointer'
      }`}
    >
      {/* Badge at Top */}
      <div className="mb-3">
        <div className={`inline-flex px-3 py-1 rounded-full ${
          superseded ? 'bg-gray-200' : 'bg-[#feee7d]'
        }`}>
          <span className={`text-sm ${superseded ? 'text-gray-500' : 'text-black'}`}>
            {superseded ? 'Superseded' : 'Ready to Review'}
          </span>
        </div>
      </div>

      {/* Title - Full Width */}
      <div className="mb-4">
        <h3 className={`text-[20px] leading-tight ${superseded ? 'text-gray-500' : ''}`}>
          {title}
        </h3>
      </div>

      {/* Table Data */}
      {tableData && (
        <div className="space-y-3 mb-4">
          {/* Strategy Type */}
          {tableData.strategyType && (
            <div>
              <div className={`text-sm mb-1 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Strategy Type
              </div>
              <div className={`text-[16px] leading-relaxed ${superseded ? 'text-gray-400' : 'text-black'}`}>
                {tableData.strategyType}
              </div>
            </div>
          )}

          {/* Primary Protocols */}
          {tableData.primaryProtocols && (
            <div>
              <div className={`text-sm mb-1 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Primary Protocols
              </div>
              <div className={`text-[16px] leading-relaxed ${superseded ? 'text-gray-400' : 'text-black'}`}>
                {tableData.primaryProtocols}
              </div>
            </div>
          )}

          {/* Chains */}
          {tableData.chains && (
            <div>
              <div className={`text-sm mb-1 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Chains
              </div>
              <div className={`text-[16px] leading-relaxed ${superseded ? 'text-gray-400' : 'text-black'}`}>
                {tableData.chains}
              </div>
            </div>
          )}

          {/* Primary Pool/Market URL */}
          {tableData.primaryPoolUrl && (
            <div>
              <div className={`text-sm mb-1 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Primary Pool/Market URL
              </div>
              <div className={`text-xs font-mono break-all ${superseded ? 'text-gray-400' : 'text-gray-700'} bg-[#F2F2F2] p-2 rounded-md`}>
                {tableData.primaryPoolUrl}
              </div>
            </div>
          )}

          {/* Capture Status */}
          {tableData.captureStatus && (
            <div className={`p-3 rounded-md ${
              superseded ? 'bg-gray-50' : 'bg-[#F2F2F2]'
            }`}>
              <div className={`text-sm mb-1 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Docs / Capture Status
              </div>
              <div className={`text-[16px] leading-relaxed ${superseded ? 'text-gray-400' : 'text-black'}`}>
                {tableData.captureStatus}
              </div>
            </div>
          )}

          {/* Known Parameters */}
          {tableData.knownParameters && tableData.knownParameters.length > 0 && (
            <div className={`p-3 rounded-md ${
              superseded ? 'bg-gray-50' : 'bg-[#F2F2F2]'
            }`}>
              <div className={`text-sm mb-2 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Known Parameters
              </div>
              <div className="space-y-2">
                {tableData.knownParameters.map((param, index) => (
                  <div key={index} className="text-sm">
                    <div className={`mb-1 ${superseded ? 'text-gray-500' : 'text-gray-700'}`}>
                      • {param.label}
                    </div>
                    <div className={`font-mono text-xs ml-3 break-all ${superseded ? 'text-gray-400' : 'text-gray-600'}`}>
                      {param.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unknown Parameters */}
          {tableData.unknownParameters && tableData.unknownParameters.length > 0 && (
            <div className={`p-3 rounded-md ${
              superseded ? 'bg-gray-50' : 'bg-[#F2F2F2]'
            }`}>
              <div className={`text-sm mb-2 ${superseded ? 'text-gray-500' : 'text-gray-600'}`}>
                Unknown Parameters
              </div>
              <div className="space-y-1">
                {tableData.unknownParameters.map((param, index) => (
                  <div key={index} className={`text-sm ${superseded ? 'text-gray-500' : 'text-gray-700'}`}>
                    • {param}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className={`text-[16px] leading-relaxed ${superseded ? 'text-gray-400' : 'text-black'}`}>
          {superseded ? 'Plan replaced' : 'Tap to review'}
        </span>
        <ArrowRight className={`w-5 h-5 ${superseded ? 'text-gray-400' : 'text-black'}`} />
      </div>
    </motion.div>
  );
}