import { motion } from "framer-motion";
import { LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyApp {
  icon: LucideIcon;
  label: string;
  gradient?: string;
  bgColor?: string;
  imageIcon?: string;
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
          <h2 className="text-white text-xl font-bold">Other Apps</h2>
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
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={app.onClick}
              >
                {app.imageIcon ? (
                  <img 
                    src={app.imageIcon} 
                    alt={app.label}
                    className="w-16 h-16 rounded-[22%] app-shadow object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-16 h-16 rounded-[22%] flex items-center justify-center app-shadow",
                      !app.gradient && app.bgColor
                    )}
                    style={app.gradient ? { background: app.gradient } : undefined}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                )}
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
