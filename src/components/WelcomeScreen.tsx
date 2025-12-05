import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeScreenProps {
  onComplete: () => void;
}

interface WelcomeConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  duration: number;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [config, setConfig] = useState<WelcomeConfig>({
    enabled: true,
    text: "Welcome",
    subtext: "SURESH.APP",
    duration: 5
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'welcome')
        .single();
      
      if (data?.value) {
        setConfig(data.value as unknown as WelcomeConfig);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!config.enabled) {
      onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      onComplete();
    }, config.duration * 1000);

    return () => clearTimeout(timer);
  }, [onComplete, config.enabled, config.duration]);

  if (!config.enabled) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Vibrant gradient background matching wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500" />

      {/* Animated Welcome Text */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-7xl font-vintage tracking-wide">
          {config.text.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="inline-block drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div
          className="text-white text-xl font-sackers tracking-[0.3em] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.8,
            ease: "easeOut"
          }}
        >
          {config.subtext}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
