import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LazyImage from "@/components/ui/lazy-image";

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
          "border border-white/25"
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.3), inset 0 -1px 1px rgba(255, 255, 255, 0.08)',
        }}
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {imageIcon ? (
          <LazyImage 
            src={imageIcon} 
            alt={label} 
            className="w-full h-full rounded-[22%]"
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
