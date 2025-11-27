import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import aboutIcon from "@/assets/about-icon.png";

interface WelcomeNotificationProps {
  onDismiss: () => void;
}

const WelcomeNotification = ({ onDismiss }: WelcomeNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="fixed top-2 left-4 right-4 z-[200] mx-auto max-w-md"
        >
          <div className="bg-background/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 p-4 flex items-start gap-3">
            {/* Time */}
            <span className="text-xs text-muted-foreground font-medium pt-0.5">
              {currentTime}
            </span>

            {/* Avatar/Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden relative shadow-md">
                <img src={aboutIcon} alt="About" className="w-full h-full object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm">
                John Smith
              </div>
              <div className="text-muted-foreground text-xs">
                Welcome! Hope you're having a great day.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeNotification;
