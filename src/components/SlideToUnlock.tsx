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

      {/* Chrome metallic text with shimmer */}
      <div className="relative overflow-hidden">
        {/* Base chrome text layer */}
        <span 
          className="text-xl font-medium tracking-wider"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #a8a8a8 25%, #ffffff 50%, #8c8c8c 75%, #d4d4d4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 1px 1px rgba(255,255,255,0.3), 0 -1px 1px rgba(0,0,0,0.2)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          }}
        >
          slide to unlock
        </span>
        
        {/* Chrome shimmer overlay */}
        <motion.div
          className="absolute inset-0 flex items-center pointer-events-none"
          animate={{ x: ["-100%", "250%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.8
          }}
        >
          <div 
            className="h-full w-[40%] flex items-center"
          >
            <span 
              className="text-xl font-medium tracking-wider whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #ffffff 30%, #f0f8ff 50%, #ffffff 70%, transparent 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "blur(0.3px) brightness(1.5)"
              }}
            >
              slide to unlock
            </span>
          </div>
        </motion.div>

        {/* Secondary chrome reflection */}
        <motion.div
          className="absolute inset-0 flex items-center pointer-events-none opacity-60"
          animate={{ x: ["-150%", "300%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1.2
          }}
        >
          <div className="h-full w-[20%]">
            <span 
              className="text-xl font-medium tracking-wider whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
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
