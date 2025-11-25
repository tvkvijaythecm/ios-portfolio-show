import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppIconProps {
  icon: LucideIcon;
  label: string;
  gradient?: string;
  bgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  size?: "normal" | "large";
}

const AppIcon = ({
  icon: Icon,
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
          "rounded-[22%] flex items-center justify-center app-shadow relative overflow-hidden",
          !gradient && bgColor
        )}
        style={gradient ? { background: gradient } : undefined}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className={cn(iconScale, iconColor)} strokeWidth={1.8} />
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

export default AppIcon;
