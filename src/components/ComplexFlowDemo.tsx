import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { ProgressStepper } from './ProgressStepper';
import { FlowNode } from './FlowNode';
import { FlowConnector } from './FlowConnector';
import { FlowMarker } from './FlowMarker';
import { ConditionalNode } from './ConditionalNode';
import { BranchPath } from './BranchPath';

interface ComplexFlowDemoProps {
  onBack: () => void;
}

export function ComplexFlowDemo({ onBack }: ComplexFlowDemoProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <ProgressStepper currentStep="flow" />

      <div className="fixed top-[53px] left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] leading-tight">Complex Flow (15 Steps, 4 Paths)</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 pt-[106px] pb-8 overflow-y-auto">
        <div className="py-6">
          <div className="flex flex-col">
            {/* START */}
            <FlowMarker type="start" />
            <FlowConnector />

            {/* Step 1 */}
            <div className="px-4">
              <FlowNode
                id="1"
                type="action"
                icon="wallet"
                title="Step 1: Connect Wallet"
                subtitle="Initialize Web3 connection"
                status="recorded"
              />
            </div>
            <FlowConnector />

            {/* Step 2 */}
            <div className="px-4">
              <FlowNode
                id="2"
                type="action"
                icon="trend"
                title="Step 2: Check Balance"
                subtitle="Query wallet balance"
                status="recorded"
              />
            </div>
            <FlowConnector />

            {/* Step 3: Conditional 1 */}
            <div className="px-4">
              <ConditionalNode
                id="3"
                condition="Step 3: If Balance > $1000"
                status="recorded"
              />
            </div>

            {/* YES Branch from Conditional 1 */}
            <div className="px-4 mt-4 space-y-4">
              <BranchPath type="yes">
                {/* Step 4 */}
                <FlowNode
                  id="4"
                  type="action"
                  icon="trend"
                  title="Step 4: Analyze Market"
                  subtitle="Check market conditions"
                  status="recorded"
                />
                <FlowConnector />

                {/* Step 5: Conditional 2 */}
                <ConditionalNode
                  id="5"
                  condition="Step 5: If Market Bullish"
                  status="recorded"
                />

                {/* YES Branch from Conditional 2 (Nested Level 1) */}
                <div className="ml-4 mt-3 border-l-2 border-emerald-300 pl-3 space-y-3">
                  {/* Step 6 */}
                  <FlowNode
                    id="6"
                    type="action"
                    icon="swap"
                    title="Step 6: Select High APY Pool"
                    subtitle="Find pool with > 15% APY"
                    status="recorded"
                  />
                  <FlowConnector />

                  {/* Step 7: Conditional 3 (Nested Level 2) */}
                  <ConditionalNode
                    id="7"
                    condition="Step 7: If APY > 15%"
                    status="recorded"
                  />

                  {/* YES Branch from Conditional 3 (Nested Level 3) */}
                  <div className="ml-4 mt-3 border-l-2 border-emerald-200 pl-3 space-y-3">
                    {/* Step 8 */}
                    <FlowNode
                      id="8"
                      type="action"
                      icon="swap"
                      title="Step 8: Deposit Max Amount"
                      subtitle="Deposit full balance"
                      status="recorded"
                    />
                    <FlowConnector />

                    {/* Step 9: Conditional 4 (Nested Level 4) */}
                    <ConditionalNode
                      id="9"
                      condition="Step 9: If Auto-compound Enabled"
                      status="recorded"
                    />

                    {/* Final branches for Path 1 and Path 2 */}
                    <div className="ml-4 mt-3 space-y-3">
                      {/* Path 1 */}
                      <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl">
                        <div className="text-[12px] text-emerald-700 mb-2">✓ YES → PATH 1</div>
                        <FlowNode
                          id="10"
                          type="action"
                          icon="trend"
                          title="Step 10: Setup Auto-compound"
                          subtitle="Enable automatic compounding"
                          status="pending"
                        />
                        <div className="mt-2 flex justify-center">
                          <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[12px]">
                            🏁 Path 1 End
                          </div>
                        </div>
                      </div>

                      {/* Path 2 */}
                      <div className="p-3 bg-rose-100 border-2 border-rose-500 rounded-xl">
                        <div className="text-[12px] text-rose-700 mb-2">✗ NO → PATH 2</div>
                        <FlowNode
                          id="11"
                          type="action"
                          icon="trend"
                          title="Step 11: Manual Compound"
                          subtitle="Compound rewards manually"
                          status="pending"
                        />
                        <div className="mt-2 flex justify-center">
                          <div className="px-3 py-1 bg-rose-600 text-white rounded-full text-[12px]">
                            🏁 Path 2 End
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NO Branch from Conditional 3 - Path 3 */}
                  <div className="ml-4 mt-3 p-3 bg-rose-100 border-2 border-rose-500 rounded-xl">
                    <div className="text-[12px] text-rose-700 mb-2">✗ NO from Step 7 → PATH 3</div>
                    <FlowNode
                      id="12"
                      type="action"
                      icon="alert"
                      title="Step 12: Find Alternative Pool"
                      subtitle="Search for better options"
                      status="pending"
                    />
                    <div className="mt-2 flex justify-center">
                      <div className="px-3 py-1 bg-rose-600 text-white rounded-full text-[12px]">
                        🏁 Path 3 End
                      </div>
                    </div>
                  </div>
                </div>

                {/* NO Branch from Conditional 2 - Path 4 */}
                <div className="ml-4 mt-3 p-3 bg-rose-100 border-2 border-rose-500 rounded-xl">
                  <div className="text-[12px] text-rose-700 mb-2">✗ NO from Step 5 → PATH 4</div>
                  <FlowNode
                    id="13"
                    type="action"
                    icon="alert"
                    title="Step 13: Wait for Bull Market"
                    subtitle="Monitor market conditions"
                    status="pending"
                  />
                  <div className="mt-2 flex justify-center">
                    <div className="px-3 py-1 bg-rose-600 text-white rounded-full text-[12px]">
                      🏁 Path 4 End
                    </div>
                  </div>
                </div>
              </BranchPath>

              {/* NO Branch from Conditional 1 - Additional steps */}
              <BranchPath type="no">
                {/* Step 14 */}
                <FlowNode
                  id="14"
                  type="action"
                  icon="wallet"
                  title="Step 14: Use Micro Strategy"
                  subtitle="Strategy for small balances"
                  status="pending"
                />
                <FlowConnector />

                {/* Step 15: Conditional 5 */}
                <ConditionalNode
                  id="15"
                  condition="Step 15: If Has DeFi Experience"
                  status="pending"
                />

                <div className="ml-4 mt-3 space-y-3">
                  <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl">
                    <div className="text-[12px] text-emerald-700 mb-2">✓ YES → Join Path 1 or 2</div>
                    <div className="text-[14px] text-gray-700">
                      (Could merge with other paths)
                    </div>
                  </div>

                  <div className="p-3 bg-rose-100 border-2 border-rose-500 rounded-xl">
                    <div className="text-[12px] text-rose-700 mb-2">✗ NO → Safe Mode</div>
                    <div className="text-[14px] text-gray-700">
                      (Keeps funds in wallet)
                    </div>
                  </div>
                </div>
              </BranchPath>
            </div>

            <FlowConnector />
            <FlowMarker type="end" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
