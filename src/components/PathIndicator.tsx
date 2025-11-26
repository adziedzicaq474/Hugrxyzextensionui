import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';

interface PathIndicatorProps {
  currentPath: string[];
  onNavigateToMain: () => void;
}

export function PathIndicator({ currentPath, onNavigateToMain }: PathIndicatorProps) {
  const isMainPath = currentPath.length === 0 || currentPath.every(p => p === 'yes');
  
  if (isMainPath) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-[106px] left-0 right-0 z-30 bg-rose-500 text-white px-4 py-3 shadow-lg"
    >
      <button
        onClick={onNavigateToMain}
        className="flex items-center gap-2 w-full focus:outline-none focus:ring-2 focus:ring-white rounded-md px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <div className="flex-1 text-left">
          <div className="text-[12px] leading-tight opacity-90">Viewing Branch</div>
          <div className="text-[14px] leading-tight">
            {currentPath.map((p, i) => (
              <span key={i}>
                {i > 0 && ' → '}
                <span className="capitalize">{p}</span>
              </span>
            ))}
          </div>
        </div>
        <Home className="w-4 h-4 opacity-75" />
      </button>
    </motion.div>
  );
}
