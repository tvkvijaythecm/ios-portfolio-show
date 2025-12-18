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
  const iconSize = size === "large" ? "w-20 h-20" : "w-[61px] h-[61px]";
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
          "flex items-center justify-center relative rounded-[22%] overflow-hidden",
          "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
        )}
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {imageIcon ? (
          <motion.img 
            src={imageIcon} 
            alt={label} 
            className="w-full h-full object-contain rounded-[22%]"
            whileHover={{ 
              filter: "brightness(1.1)",
            }}
          />
        ) : Icon ? (
          <Icon className={cn(iconScale, iconColor)} strokeWidth={1.8} />
        ) : null}
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

export default AppIcon;
