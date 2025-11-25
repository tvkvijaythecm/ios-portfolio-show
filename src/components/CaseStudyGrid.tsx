import { motion } from "framer-motion";
import { LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyApp {
  icon: LucideIcon;
  label: string;
  gradient?: string;
  bgColor?: string;
  onClick: () => void;
}

interface CaseStudyGridProps {
  apps: CaseStudyApp[];
  onClose: () => void;
}

const CaseStudyGrid = ({ apps, onClose }: CaseStudyGridProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Case Study</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {apps.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={app.onClick}
              >
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-purple-900/90 border-2 relative overflow-hidden"
                  style={{
                    borderImage: 'linear-gradient(135deg, #FF00FF, #00E5FF, #FF6B00) 1',
                    boxShadow: `
                      0 0 20px rgba(255, 0, 255, 0.5),
                      0 0 40px rgba(0, 229, 255, 0.3),
                      inset 0 0 20px rgba(255, 0, 255, 0.1)
                    `
                  }}
                >
                  {/* Starfield */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[20%] left-[30%]" />
                    <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[60%] left-[70%]" />
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[40%] left-[50%]" />
                  </div>
                  
                  <Icon 
                    className="w-8 h-8 relative z-10" 
                    strokeWidth={2.5}
                    style={app.gradient ? {
                      stroke: `url(#case-gradient-${index})`,
                      filter: 'drop-shadow(0 0 8px currentColor) drop-shadow(0 0 15px currentColor)',
                      color: app.gradient.split(',')[0].trim()
                    } : undefined}
                  />
                  {app.gradient && (
                    <svg width="0" height="0" style={{ position: 'absolute' }}>
                      <defs>
                        <linearGradient id={`case-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: app.gradient.split(',')[0].trim(), stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: app.gradient.split(',')[1].trim(), stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>
                <span className="text-white text-xs font-medium text-center leading-tight">
                  {app.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CaseStudyGrid;
