import { ArrowLeft, Check, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PlanReviewProps {
  onBack: () => void;
  onConfirm?: () => void;
  onRequestChanges?: () => void;
  planContent?: string;
}

const defaultPlanContent = `STAGE: REQUIREMENTS_CONFIRMED

感謝您提供 OKX 跨鏈橋的完整頁面 HTML。這份數據極其關鍵，它讓我們能夠精確地解析出您所需的跨鏈橋接交易對的實時參數，為構建自動化套利策略奠定了堅實的基礎。

根據您提供的所有資訊（起始鏈為 Base，目標為 >0.15% 的淨利，全自動執行），並結合您上傳的 OKX 跨鏈 DEX 頁面 HTML 內容，我已確認所有必要細節。現將您的策略計劃呈上。

### Requirements Clarification Summary

| Field | Value |
| :--- | :--- |
| **Strategy Type** | Cross-chain USDC Arbitrage |
| **Primary Protocols** | OKX DEX Bridge |
| **Chains** | Base, Mantle, Linea, Arbitrum |
| **Primary Pool/Market URL** | https://web3.okx.com/zh-hant/dex-swap/bridge?chain=base,mantle&token=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9 (Base ↔ Mantle) |
| **Docs / Capture Status** | **Capture collected** (from provided HTML) |
| **Known Parameters** | - **Base USDC Contract**: \`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\`<br>- **Mantle USDC Contract**: \`0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9\`<br>- **Linea USDC Contract**: \`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\`<br>- **Arbitrum USDC Contract**: \`0xaf88d065e77c8cc2239327c5edb3a432268e5831\`<br>- **Target Net Profit Threshold**: >0.15%<br>- **Execution Environment**: Automated via OKX Wallet Extension (via Capture Protocol Info) |
| **Unknown Parameters** | - **Real-time price spread on Linea/Arbitrum** (requires periodic Capture)<br>- **Exact gas fees for each route** (requires periodic Capture) |

---

### Strategy Overview

本策略旨在利用 OKX DEX 跨鏈橋在 Base、Mantle、Linea 和 Arbitrum 四條鏈之間的 USDC 價格差異進行套利。核心邏輯是：當任一交易對（Base↔Mantle, Base↔Linea, Mantle↔Arbitrum）的價差（扣除所有橋接與交易成本後）超過 0.15% 時，自動執行從低價鏈向高價鏈的 USDC 轉移，從而實現淨利潤。

本策略的關鍵優勢在於，您提供的 OKX 跨鏈 DEX 頁面 HTML 已明確顯示了所有相關鏈和 USDC 合約地址，且 OKX 平台會在交易前清晰顯示所有成本（Gas + 橋接手續費），這使得我們能夠進行精確的淨利計算，避免了因成本估算錯誤而導致虧損的風險。

### Execution Steps

1.  **初始化與監控**：自動化腳本啟動後，將持續監控以下三個交易對的實時價格與成本：
    *   **Base ↔ Mantle**: \`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\` (Base) ↔ \`0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9\` (Mantle)
    *   **Base ↔ Linea**: \`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\` (Base) ↔ \`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\` (Linea)
    *   **Mantle ↔ Arbitrum**: \`0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9\` (Mantle) ↔ \`0xaf88d065e77c8cc2239327c5edb3a432268e5831\` (Arbitrum)

2.  **實時數據獲取**：腳本會自動打開對應的 OKX 跨鏈橋頁面（例如，Base↔Mantle 的 URL），並調用「Capture Protocol Info」功能，捕獲該頁面的 HTML 內容。

3.  **淨利計算**：腳本解析捕獲的 HTML，提取以下關鍵數據：
    *   **源鏈 USDC 金額** (您輸入的數量)
    *   **目標鏈預計收到的 USDC 金額**
    *   **總橋接成本** (Gas + 手續費，以 USDC 等值計算)
    *   **預計淨收益** (目標鏈收到的 USDC - 源鏈轉出的 USDC - 總成本)
    *   **淨收益率** (淨收益 / 源鏈轉出的 USDC)

4.  **決策與執行**：腳本計算所有三個交易對的淨收益率。
    *   **若任何一個交易對的淨收益率 > 0.15%**：腳本將自動執行以下操作：
        *   確認交易方向：若 Base 的 USDC 價格低於 Mantle，則執行 \`Base → Mantle\`。
        *   觸發交易：通過 OKX Wallet Extension 自動提交交易。
    *   **若所有交易對的淨收益率 ≤ 0.15%**：腳本將保持監控，不進行任何交易。

5.  **重複與輪詢**：腳本將以預設間隔（例如每 30 秒）重複步驟 2-4，持續尋找套利機會。

### Risk Management

*   **成本風險**：本策略的首要風險是交易成本（Gas + 橋接費）的波動。OKX DEX 在交易前顯示的費用是我們計算淨利的唯一依據，這有效降低了因成本估算錯誤而導致虧損的風險。
*   **價格風險**：在交易執行的短暫時間內，目標鏈的 USDC 價格可能下跌，導致淨利縮小甚至變為虧損。此風險無法完全避免，但通過設置 >0.15% 的淨利門檻和快速執行，我們將其控制在可接受範圍內。
*   **橋接失敗**：跨鏈橋接可能因網絡擁堵或合約問題而失敗。根據 OKX 官方說明，即使交易失敗，您仍需支付 Gas 費用。因此，本策略的淨利計算已將此成本納入考量，確保只有在預期淨利為正且超過門檻時才會執行。
*   **資金鎖定**：每次交易都會暫時鎖定您的 USDC 資金，直到交易完成。請確保您的資金流動性充足。
*   **技術風險**：自動化腳本依賴於 OKX Wallet Extension 的「Capture Protocol Info」功能。若該功能未來發生變化，策略可能失效。

### Monitoring & Exit

*   **監控**：系統將持續運行並記錄每次檢查的價格、成本和淨利。建議您定期（每日）檢查交易日誌，確保自動化流程正常運行。
*   **退出策略**：若市場環境發生劇變（例如，所有鏈的 USDC 價差長期低於 0.15%），或發現任何技術異常，請立即手動停止腳本。您可以隨時在 OKX Wallet 中手動執行交易，以撤回資金。`;

export function PlanReview({ onBack, onConfirm, onRequestChanges, planContent = defaultPlanContent }: PlanReviewProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3 bg-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[24px] leading-tight">Review Plan</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headings
                h1: ({ children }) => <h1 className="text-[24px] leading-tight mb-4 mt-8 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-[20px] leading-tight mb-3 mt-8">{children}</h2>,
                h3: ({ children }) => <h3 className="text-[20px] leading-tight mb-3 mt-6">{children}</h3>,
                
                // Paragraphs
                p: ({ children }) => <p className="text-[16px] leading-relaxed mb-4 text-gray-900">{children}</p>,
                
                // Lists
                ul: ({ children }) => <ul className="list-disc space-y-2 mb-4 ml-6 text-gray-900">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal space-y-2 mb-4 ml-6 text-gray-900">{children}</ol>,
                li: ({ children }) => <li className="text-[16px] leading-relaxed pl-1">{children}</li>,
                
                // Code
                code: ({ inline, children }: any) => 
                  inline ? (
                    <code className="px-2 py-1 bg-[#F2F2F2] rounded-md text-[14px] font-mono text-gray-900 break-all">
                      {children}
                    </code>
                  ) : (
                    <code className="block px-3 py-2 bg-[#F2F2F2] rounded-md text-[14px] font-mono text-gray-900 overflow-x-auto">
                      {children}
                    </code>
                  ),
                
                // Pre (code blocks)
                pre: ({ children }) => (
                  <pre className="px-4 py-3 bg-[#F2F2F2] rounded-xl text-[14px] font-mono text-gray-900 overflow-x-auto mb-6">
                    {children}
                  </pre>
                ),
                
                // Tables
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6 -mx-1">
                    <table className="w-full border-collapse border border-gray-300 rounded-xl overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-[#F2F2F2]">{children}</thead>,
                tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-gray-200 last:border-b-0">{children}</tr>,
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-[14px] text-gray-900 border-r border-gray-300 last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-[16px] leading-relaxed text-gray-900 border-r border-gray-200 last:border-r-0 break-words">
                    {children}
                  </td>
                ),
                
                // Horizontal Rule
                hr: () => <hr className="my-8 border-t border-gray-300" />,
                
                // Strong
                strong: ({ children }) => <strong className="text-black">{children}</strong>,
                
                // Emphasis
                em: ({ children }) => <em className="italic text-gray-900">{children}</em>,
                
                // Blockquote
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-700 italic">
                    {children}
                  </blockquote>
                ),
                
                // Links
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-black underline break-all hover:text-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {planContent}
            </ReactMarkdown>
          </motion.div>
        </div>
      </main>

      {/* Fixed Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="px-4 py-4 flex gap-3">
          <button
            onClick={onRequestChanges}
            className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-gray-400 text-gray-900 px-4 py-3 rounded-full transition-all hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[44px]"
          >
            <Edit3 className="w-5 h-5" />
            <span className="text-[16px] leading-relaxed">Revise</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
          >
            <Check className="w-5 h-5" />
            <span className="text-[16px] leading-relaxed">Confirm</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}