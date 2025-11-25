import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LoadingScreenProps {
  onClose: () => void;
  appName: string;
}

const LoadingScreen = ({ onClose, appName }: LoadingScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
      
      {/* Loading content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        {/* iOS-style spinner */}
        <div className="w-16 h-16 relative">
          <motion.div
            className="absolute inset-0 border-4 border-white/30 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-4 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        <p className="text-white text-lg font-medium">Opening {appName}...</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
