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
        className="w-[60px] h-[60px] rounded-[22%] flex items-center justify-center relative overflow-hidden bg-[#1C1C1E] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="grid grid-cols-2 gap-1 p-2">
          {miniApps.slice(0, 4).map((app, index) => {
            const Icon = app.icon;
            const colors = app.gradient?.match(/#[0-9A-F]{6}/gi) || ['#FFFFFF', '#CCCCCC'];
            return (
              <div
                key={index}
                className="w-6 h-6 rounded-[18%] flex items-center justify-center bg-[#2C2C2E]"
              >
                <Icon 
                  className="w-3 h-3" 
                  strokeWidth={2}
                  style={{
                    stroke: `url(#mini-gradient-${index})`,
                    fill: 'none'
                  }}
                />
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id={`mini-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: colors[0], stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: colors[1], stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
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
