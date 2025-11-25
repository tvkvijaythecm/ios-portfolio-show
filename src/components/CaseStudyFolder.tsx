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
        className="w-[60px] h-[60px] rounded-[22%] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-purple-900/90 border-2"
        style={{
          borderImage: 'linear-gradient(135deg, #FF00FF, #00E5FF, #FF6B00) 1',
          boxShadow: `
            0 0 20px rgba(255, 0, 255, 0.5),
            0 0 40px rgba(0, 229, 255, 0.3),
            inset 0 0 20px rgba(255, 0, 255, 0.1)
          `
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Starfield */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[20%] left-[30%]" />
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[60%] left-[70%]" />
        </div>
        
        <div className="grid grid-cols-2 gap-1 p-2 relative z-10">
          {miniApps.slice(0, 4).map((app, index) => {
            const Icon = app.icon;
            const colors = app.gradient?.match(/#[0-9A-F]{6}/gi) || ['#FFFFFF', '#CCCCCC'];
            return (
              <div
                key={index}
                className="w-6 h-6 rounded-[18%] flex items-center justify-center bg-gradient-to-br from-purple-800/50 to-blue-800/50"
                style={{
                  boxShadow: `0 0 10px rgba(255, 0, 255, 0.3)`
                }}
              >
                <Icon 
                  className="w-3 h-3" 
                  strokeWidth={2.5}
                  style={{
                    stroke: `url(#mini-gradient-${index})`,
                    filter: 'drop-shadow(0 0 4px currentColor)',
                    color: colors[0]
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
