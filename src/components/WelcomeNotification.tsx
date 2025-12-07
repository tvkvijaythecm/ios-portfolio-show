import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import aboutIcon from "@/assets/about-icon.png";

interface WelcomeNotificationProps {
  onDismiss: () => void;
}

interface NotificationConfig {
  enabled: boolean;
  name: string;
  message: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

const WelcomeNotification = ({ onDismiss }: WelcomeNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<NotificationConfig>({
    enabled: true,
    name: "John Smith",
    message: "Welcome! Hope you're having a great day.",
    gradientFrom: "#2563eb",
    gradientVia: "#9333ea",
    gradientTo: "#f97316",
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'welcome_notification')
        .single();
      
      if (data?.value) {
        const loadedConfig = data.value as unknown as NotificationConfig;
        setConfig({ ...config, ...loadedConfig });
        if (loadedConfig.enabled !== false) {
          setIsVisible(true);
        } else {
          onDismiss();
        }
      } else {
        setIsVisible(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, onDismiss]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50 || info.velocity.y < -500) {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  if (!config.enabled) return null;

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
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.5, bottom: 0.1 }}
          onDragEnd={handleDragEnd}
          className="fixed top-2 left-4 right-4 z-[200] mx-auto max-w-md cursor-grab active:cursor-grabbing"
        >
          <div 
            className="backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-4 flex items-start gap-3"
            style={{
              background: `linear-gradient(to bottom right, ${config.gradientFrom}e6, ${config.gradientVia}e6, ${config.gradientTo}e6)`
            }}
          >
            {/* Time */}
            <span className="text-xs text-white/70 font-medium pt-0.5">
              {currentTime}
            </span>

            {/* Avatar/Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden relative shadow-md">
                <img src={aboutIcon} alt="About" className="w-full h-full object-cover" />
                <div 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2"
                  style={{ borderColor: config.gradientFrom }}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">
                {config.name}
              </div>
              <div className="text-white/70 text-xs">
                {config.message}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeNotification;
