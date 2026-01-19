import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SlideToUnlockProps {
  onUnlock: () => void;
}

const SlideToUnlock = ({ onUnlock }: SlideToUnlockProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPressed(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPressed) return;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    
    if (deltaX > 150) {
      onUnlock();
    }
    setIsPressed(false);
  };

  return (
    <div 
      className="flex items-center justify-center gap-1 cursor-pointer select-none"
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Chevron arrow */}
      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mr-1"
      >
        <ChevronRight className="w-5 h-5 text-white/60" strokeWidth={1.5} />
      </motion.div>

      {/* iOS 7 style shimmer text */}
      <div className="relative overflow-hidden">
        <span className="text-white/40 text-xl font-light tracking-wide">
          slide to unlock
        </span>
        
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 flex items-center"
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5
          }}
        >
          <div 
            className="h-full w-[60%] flex items-center"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            <span className="text-xl font-light tracking-wide whitespace-nowrap text-transparent bg-clip-text"
              style={{
                background: "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              slide to unlock
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideToUnlock;
