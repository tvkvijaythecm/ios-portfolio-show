import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SlideToUnlockProps {
  onUnlock: () => void;
}

const SlideToUnlock = ({ onUnlock }: SlideToUnlockProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Calculate track width dynamically
  const trackWidth = 280;
  const thumbWidth = 56;
  const maxDrag = trackWidth - thumbWidth - 8;
  
  // Progress for visual feedback
  const progress = useTransform(x, [0, maxDrag], [0, 1]);
  const textOpacity = useTransform(x, [0, maxDrag * 0.5], [1, 0]);
  const bgOpacity = useTransform(x, [0, maxDrag], [0.3, 0.8]);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= maxDrag * 0.85) {
      setUnlocked(true);
      x.set(maxDrag);
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Slider Track */}
      <div 
        ref={constraintsRef}
        className="relative w-[280px] h-14 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
        }}
      >
        {/* Progress fill */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 rounded-full"
          style={{ 
            scaleX: progress,
            transformOrigin: "left",
            opacity: bgOpacity
          }}
        />
        
        {/* Shimmer effect on text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pl-12"
          style={{ opacity: textOpacity }}
        >
          <span 
            className="text-white/80 text-sm font-medium tracking-wider"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,1), rgba(255,255,255,0.4))",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              animation: "shimmer 2s infinite linear"
            }}
          >
            slide to unlock
          </span>
        </motion.div>

        {/* Draggable thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute left-1 top-1 h-12 w-14 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div 
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 50%, #a3a3a3 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)"
            }}
          >
            <div className="flex items-center -ml-1">
              <ChevronRight className="w-5 h-5 text-gray-600 -mr-2" />
              <ChevronRight className="w-5 h-5 text-gray-500 -mr-2" />
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
};

export default SlideToUnlock;
