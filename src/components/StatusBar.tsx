import { useEffect, useState } from "react";
import { Wifi, Battery, Signal, Fingerprint } from "lucide-react";

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
        <Battery className="w-6 h-6" strokeWidth={2.5} />
        <button 
          onClick={onControlCentreOpen}
          className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Open Control Centre"
        >
          <Fingerprint className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
