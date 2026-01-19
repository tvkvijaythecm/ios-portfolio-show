import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import startupSound from "@/assets/startup-sound.wav";
import SlideToUnlock from "./SlideToUnlock";

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
  mainTextColor: string;
  subtextColor: string;
  textShadow: boolean;
  textShadowColor: string;
  textShadowBlur: number;
  backgroundImage?: string;
  useBackgroundImage?: boolean;
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
  const [showSlider, setShowSlider] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Play startup sound when welcome screen is shown
  useEffect(() => {
    if (!isLoading && config?.enabled) {
      audioRef.current = new Audio(startupSound);
      audioRef.current.play().catch(console.error);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading, config?.enabled]);

  // Show slider after text animation completes
  useEffect(() => {
    if (isLoading || !config?.enabled) return;
    
    // Calculate time for text animation (based on text length)
    const textAnimationTime = (config.text.length * 100) + 1000;
    
    const timer = setTimeout(() => {
      setShowSlider(true);
    }, textAnimationTime);

    return () => clearTimeout(timer);
  }, [config, isLoading]);

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // Don't render anything until settings are loaded
  if (isLoading || !config || !config.enabled) return null;

  const getTextShadow = () => {
    if (!config.textShadow) return "none";
    return `0 4px ${config.textShadowBlur}px ${config.textShadowColor}`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isUnlocking ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background - Image or Gradient */}
      {config.useBackgroundImage && config.backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${config.backgroundImage})`
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </>
      ) : (
        <div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(to bottom right, ${config.gradientFrom}, ${config.gradientVia}, ${config.gradientTo})`
          }}
        />
      )}

      {/* Animated Welcome Text */}
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
            color: config.mainTextColor || "#ffffff",
            textShadow: getTextShadow()
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
            color: config.subtextColor || "#ffffff",
            textShadow: getTextShadow()
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

      {/* iOS-style Lock Screen Clock */}
      <AnimatePresence>
        {showSlider && (
          <motion.div
            className="absolute top-16 z-20 flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Time */}
            <div
              className="
                text-[180px]
                sm:text-[220px]
                md:text-[260px]
                font-light
                leading-[0.85]
                text-white
              "
              style={{
                fontFamily: "'iPhone Lite', sans-serif",
                letterSpacing: '1px',
                textShadow: "0 8px 40px rgba(0,0,0,0.4)"
              }}
            >  
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </div>
            {/* Date */}
            <div 
              className="text-xl font-light text-white/90 mt-2"
              style={{
                fontFamily: "'iPhone', sans-serif",
                textShadow: "0 1px 10px rgba(0,0,0,0.3)"
              }}
            >
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide to Unlock */}
      <AnimatePresence>
        {showSlider && (
          <motion.div
            className="absolute bottom-20 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <SlideToUnlock onUnlock={handleUnlock} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomeScreen;
