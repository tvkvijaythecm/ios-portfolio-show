import { useEffect, useState } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

const StatusBar = () => {
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
    <div className="fixed top-0 left-0 right-0 h-11 px-6 flex items-center justify-between text-white z-40">
      <span className="text-[15px] font-semibold tracking-tight">{currentTime}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4" strokeWidth={2.5} />
        <Wifi className="w-4 h-4" strokeWidth={2.5} />
        <Battery className="w-6 h-6" strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default StatusBar;
