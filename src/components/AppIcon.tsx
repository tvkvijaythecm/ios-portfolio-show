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
          imageIcon ? "" : "bg-[#1C1C1E]",
          !imageIcon && "shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {imageIcon ? (
          <img src={imageIcon} alt={label} className="w-full h-full object-cover" />
        ) : Icon ? (
          <Icon 
            className={cn(iconScale)} 
            strokeWidth={1.8}
            style={gradient ? { 
              stroke: 'url(#icon-gradient)',
              fill: 'none'
            } : undefined}
          />
        ) : null}
        {!imageIcon && gradient && Icon && (
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: gradient.split(',')[0].split('(')[1], stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: gradient.split(',')[1].split(')')[0], stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        )}
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

export default AppIcon;
