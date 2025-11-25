import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppIconProps {
  icon?: LucideIcon;
  imageIcon?: string;
  label: string;
  gradient?: string;
  bgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  size?: "normal" | "large";
}

const AppIcon = ({
  icon: Icon,
  imageIcon,
  label,
  gradient,
  bgColor = "bg-blue-500",
  iconColor = "text-white",
  onClick,
  size = "normal",
}: AppIconProps) => {
  const iconSize = size === "large" ? "w-20 h-20" : "w-[60px] h-[60px]";
  const iconScale = size === "large" ? "w-12 h-12" : "w-8 h-8";

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 cursor-pointer"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          iconSize,
          "rounded-[22%] flex items-center justify-center relative overflow-hidden",
          imageIcon ? "" : "bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-purple-900/90",
          !imageIcon && "border-2"
        )}
        style={!imageIcon ? {
          borderImage: 'linear-gradient(135deg, #FF00FF, #00E5FF, #FF6B00) 1',
          boxShadow: `
            0 0 20px rgba(255, 0, 255, 0.5),
            0 0 40px rgba(0, 229, 255, 0.3),
            inset 0 0 20px rgba(255, 0, 255, 0.1)
          `
        } : undefined}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Starfield background */}
        {!imageIcon && (
          <>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[20%] left-[30%]" />
              <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[60%] left-[70%]" />
              <div className="absolute w-1 h-1 bg-white rounded-full top-[40%] left-[50%]" />
              <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[80%] left-[20%]" />
            </div>
            {/* Grid floor effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20">
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(transparent 0%, rgba(255, 0, 255, 0.3) 100%)',
                maskImage: 'linear-gradient(to bottom, transparent, black)'
              }} />
            </div>
          </>
        )}
        
        {imageIcon ? (
          <img src={imageIcon} alt={label} className="w-full h-full object-cover" />
        ) : Icon ? (
          <Icon 
            className={cn(iconScale, "relative z-10")} 
            strokeWidth={2.5}
            style={{ 
              filter: `drop-shadow(0 0 8px currentColor) drop-shadow(0 0 15px currentColor)`,
              color: gradient ? gradient.split(',')[0].trim() : '#00E5FF',
              stroke: gradient ? `url(#icon-gradient-${label})` : undefined
            }}
          />
        ) : null}
        {!imageIcon && gradient && Icon && (
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id={`icon-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: gradient.split(',')[0].trim(), stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: gradient.split(',')[1].trim(), stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        )}
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-[0_2px_8px_rgba(255,0,255,0.3)]">
        {label}
      </span>
    </motion.div>
  );
};

export default AppIcon;
