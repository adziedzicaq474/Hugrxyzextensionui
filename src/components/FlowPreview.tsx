import { motion } from 'motion/react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FlowNode {
  id: string;
  type: 'action' | 'conditional';
  title: string;
  x: number;
  y: number;
  yesBranch?: string;
  noBranch?: string;
  parent?: string;
}

interface FlowPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: FlowNode[];
}

export function FlowPreview({ isOpen, onClose, nodes }: FlowPreviewProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset view when opened
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate SVG dimensions
  const maxX = Math.max(...nodes.map(n => n.x)) + 100;
  const maxY = Math.max(...nodes.map(n => n.y)) + 60;
  const minX = Math.min(...nodes.map(n => n.x)) - 20;
  const minY = Math.min(...nodes.map(n => n.y)) - 20;
  
  const width = maxX - minX;
  const height = maxY - minY;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.1), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev * 0.8, 0.1));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-gray-700" />
          <h2 className="text-[18px] leading-tight text-gray-900">Flow Preview</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#feee7d]"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#feee7d]"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#feee7d] text-white text-[12px]"
        >
          Reset View
        </button>
        <div className="ml-auto text-white text-[12px]">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-900 cursor-move"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox={`${minX} ${minY} ${width} ${height}`}
            className="max-w-full h-auto"
            style={{ maxHeight: '90vh', maxWidth: '90vw' }}
          >
            {/* Draw connectors */}
            {nodes.map((node) => {
              const lines = [];
              
              if (node.yesBranch) {
                const targetNode = nodes.find(n => n.id === node.yesBranch);
                if (targetNode) {
                  const startX = node.x + 80;
                  const startY = node.y + 40;
                  const endX = targetNode.x + 80;
                  const endY = targetNode.y;
                  
                  lines.push(
                    <path
                      key={`${node.id}-yes`}
                      d={`M ${startX} ${startY} L ${startX} ${(startY + endY) / 2} L ${endX} ${(startY + endY) / 2} L ${endX} ${endY}`}
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  );
                }
              }
              
              if (node.noBranch) {
                const targetNode = nodes.find(n => n.id === node.noBranch);
                if (targetNode) {
                  const startX = node.x + 80;
                  const startY = node.y + 40;
                  const endX = targetNode.x + 80;
                  const endY = targetNode.y;
                  
                  lines.push(
                    <path
                      key={`${node.id}-no`}
                      d={`M ${startX} ${startY} L ${startX} ${(startY + endY) / 2} L ${endX} ${(startY + endY) / 2} L ${endX} ${endY}`}
                      stroke="#ef5285"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                    />
                  );
                }
              }
              
              return lines;
            })}

            {/* Draw nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width="160"
                  height="40"
                  rx="8"
                  fill={node.type === 'conditional' ? '#feee7d' : '#ffffff'}
                  stroke={node.type === 'conditional' ? '#feee7d' : '#e5e7eb'}
                  strokeWidth="2"
                />
                <text
                  x={node.x + 80}
                  y={node.y + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                  fontWeight="500"
                >
                  {node.type === 'conditional' ? 'Conditional' : 'Action'}
                </text>
                <text
                  x={node.x + 80}
                  y={node.y + 28}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#111827"
                  fontWeight="600"
                >
                  {node.title.length > 18 ? node.title.substring(0, 18) + '...' : node.title}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center gap-4 text-[12px] text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-emerald-500" />
            <span>Yes Path</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="2" className="overflow-visible">
              <line
                x1="0"
                y1="1"
                x2="24"
                y2="1"
                stroke="#ef5285"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
            <span>No Path</span>
          </div>
          <div className="ml-auto text-gray-400">
            Scroll to zoom • Drag to pan
          </div>
        </div>
      </div>
    </motion.div>
  );
}