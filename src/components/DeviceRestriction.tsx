import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, RotateCcw, Smartphone } from "lucide-react";

interface DeviceRestrictionProps {
  children: React.ReactNode;
}

const DeviceRestriction = ({ children }: DeviceRestrictionProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // Check if it's a mobile/tablet device
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider it mobile if user agent says mobile OR it's a touch device with small screen
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isSmallScreen = Math.min(screenWidth, screenHeight) < 1024;
      
      setIsMobileDevice(isMobile || (isTouchDevice && isSmallScreen));
      
      // Desktop detection: large screen AND not a touch device primarily
      setIsDesktop(!isMobile && !isTouchDevice && screenWidth >= 1024);
      
      // Landscape detection (only matters for mobile)
      if (isMobile || (isTouchDevice && isSmallScreen)) {
        setIsLandscape(screenWidth > screenHeight && screenWidth < 1024);
      } else {
        setIsLandscape(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Show desktop blocker
  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Monitor className="w-24 h-24 text-red-500/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-1 bg-red-500 rotate-45 rounded-full" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Mobile Only Experience
          </h1>
          
          <p className="text-white/60 mb-8">
            This app is designed exclusively for mobile devices. Please visit on your smartphone or tablet for the best experience.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-white/40">
            <Smartphone className="w-8 h-8" />
            <span className="text-sm">Scan QR or visit on mobile</span>
          </div>
          
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/40">
              SNET OS is a mobile-first portfolio experience optimized for touch interactions
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show landscape blocker for mobile
  if (isLandscape && isMobileDevice) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          className="text-center"
        >
          <motion.div 
            className="mb-8 flex justify-center"
            animate={{ rotate: [0, -90, -90, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          >
            <Smartphone className="w-20 h-20 text-cyan-400" />
          </motion.div>
          
          <h1 className="text-xl font-bold text-white mb-4">
            Please Rotate Your Device
          </h1>
          
          <p className="text-white/60 mb-6">
            This app works best in portrait mode
          </p>
          
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <RotateCcw className="w-5 h-5" />
            <span className="text-sm">Rotate to portrait</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceRestriction;