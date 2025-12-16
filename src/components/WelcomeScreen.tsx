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
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  mainTextFont: string;
  subtextFont: string;
  mainTextSize: number;
  subtextSize: number;
  textColor: string;
}

const FONT_MAP: Record<string, string> = {
  barkentina: "'Barkentina', sans-serif",
  vintage: "'Vintage Goods', sans-serif",
  sackers: "'Sackers Gothic', sans-serif",
  trajan: "'Trajan Pro', serif",
  playfair: "'Playfair Display', serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  roboto: "'Roboto', sans-serif",
  oswald: "'Oswald', sans-serif",
  dancing: "'Dancing Script', cursive",
  pacifico: "'Pacifico', cursive",
  lobster: "'Lobster', cursive",
  greatvibes: "'Great Vibes', cursive",
  satisfy: "'Satisfy', cursive",
  sacramento: "'Sacramento', cursive",
  allura: "'Allura', cursive",
  comfortaa: "'Comfortaa', cursive",
  righteous: "'Righteous', sans-serif",
  orbitron: "'Orbitron', sans-serif",
  cinzel: "'Cinzel', serif",
  cormorant: "'Cormorant Garamond', serif",
};

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [config, setConfig] = useState<WelcomeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'welcome')
        .single();
      
      if (data?.value) {
        setConfig(data.value as unknown as WelcomeConfig);
      } else {
        // No settings found, skip welcome screen
        onComplete();
      }
      setIsLoading(false);
    };
    loadSettings();
  }, [onComplete]);

  useEffect(() => {
    if (isLoading || !config) return;
    
    if (!config.enabled) {
      onComplete();
      return;
    }
    
    const durationMs = config.duration > 100 ? config.duration : config.duration * 1000;
    
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onComplete, config, isLoading]);

  // Don't render anything until settings are loaded
  if (isLoading || !config || !config.enabled) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Dynamic gradient background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: `linear-gradient(to bottom right, ${config.gradientFrom}, ${config.gradientVia}, ${config.gradientTo})`
        }}
      />

      {/* Animated Welcome Text - no background layer */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="tracking-wide"
          style={{ 
            fontFamily: FONT_MAP[config.mainTextFont] || "'Vintage Goods', sans-serif",
            fontSize: `${config.mainTextSize}px`,
            color: config.textColor || "#ffffff"
          }}
        >
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
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div
          className="tracking-[0.3em] uppercase"
          style={{ 
            fontFamily: FONT_MAP[config.subtextFont] || "'Sackers Gothic', sans-serif",
            fontSize: `${config.subtextSize}px`,
            color: config.textColor || "#ffffff",
            opacity: 0.8
          }}
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
