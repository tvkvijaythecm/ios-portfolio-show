import { motion } from "framer-motion";
import { ChevronLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AppPageProps {
  title: string;
  icon: LucideIcon;
  onClose: () => void;
  children: ReactNode;
  gradient?: string;
  bgColor?: string;
}

const AppPage = ({ title, icon: Icon, onClose, children, gradient, bgColor = "bg-white" }: AppPageProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ scale: 0.8, opacity: 0, borderRadius: "22%" }}
      animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
      exit={{ scale: 0.8, opacity: 0, borderRadius: "22%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={gradient ? { background: gradient } : undefined}
    >
      <div className={!gradient ? bgColor : ""}>
        {/* Header with iOS-style back button */}
        <div className="h-20 flex items-end justify-between px-6 pb-3 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <motion.button
            onClick={onClose}
            className="relative z-10 flex items-center"
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-9 h-9 text-[#007AFF]" strokeWidth={3} />
          </motion.button>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
              <Icon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-white text-2xl font-bold">{title}</h1>
          </div>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default AppPage;
