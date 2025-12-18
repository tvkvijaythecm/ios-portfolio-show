import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyFolderProps {
  miniApps: Array<{
    icon: LucideIcon;
    gradient?: string;
    bgColor?: string;
  }>;
  label: string;
  onClick?: () => void;
}

const CaseStudyFolder = ({ miniApps, label, onClick }: CaseStudyFolderProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 cursor-pointer"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <motion.div
        className="w-[60px] h-[60px] rounded-[22%] flex items-center justify-center app-shadow relative overflow-hidden bg-gray-400/30 dark:bg-gray-700/50 backdrop-blur-md"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="grid grid-cols-2 gap-1 p-2">
          {miniApps.slice(0, 4).map((app, index) => {
            const Icon = app.icon;
            return (
              <div
                key={index}
                className={cn(
                  "w-6 h-6 rounded-[18%] flex items-center justify-center",
                  "bg-white/10 backdrop-blur-md border border-white/20 shadow-sm",
                  !app.gradient && app.bgColor
                )}
                style={app.gradient ? { background: app.gradient } : undefined}
              >
                <Icon className="w-3 h-3 text-white" strokeWidth={2} />
              </div>
            );
          })}
        </div>
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm">
        {label}
      </span>
    </motion.div>
  );
};

export default CaseStudyFolder;
