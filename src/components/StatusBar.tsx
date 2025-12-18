import { useEffect, useState } from "react";
import { Wifi, Signal } from "lucide-react";
import { motion } from "framer-motion";
import controlCenterIcon from "@/assets/icons/control-center.svg";

interface StatusBarProps {
  onControlCentreOpen?: () => void;
}

const StatusBar = ({ onControlCentreOpen }: StatusBarProps) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-11 px-6 flex items-center justify-between text-white dark:text-gray-200 z-40">
      <span className="text-[15px] font-semibold tracking-tight">{currentTime}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4" strokeWidth={2.5} />
        <Wifi className="w-4 h-4" strokeWidth={2.5} />
        {/* Full battery icon with green fill */}
        <div className="relative w-6 h-4 flex items-center">
          <div className="w-5 h-3 border-[1.5px] border-white rounded-[2px] relative overflow-hidden">
            <div className="absolute inset-[1px] bg-green-500 rounded-[1px]" />
          </div>
          <div className="w-[2px] h-1.5 bg-white rounded-r-sm ml-[1px]" />
        </div>
        <button 
          onClick={onControlCentreOpen}
          className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Open Control Centre"
        >
          <motion.img
            src={controlCenterIcon}
            alt="Control Centre"
            className="w-5 h-5"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
