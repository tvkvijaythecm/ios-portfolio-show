import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface DateWidgetConfig {
  enabled: boolean;
  showDayName: boolean;
  headerColor: string;
  dateColor: string;
  dayNameColor: string;
  backgroundColor: string;
}

const DateWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [config, setConfig] = useState<DateWidgetConfig>({
    enabled: true,
    showDayName: true,
    headerColor: "#ef4444",
    dateColor: "#000000",
    dayNameColor: "#666666",
    backgroundColor: "#ffffff",
  });

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "widget_date")
        .maybeSingle();
      
      if (data?.value) {
        setConfig(prev => ({ ...prev, ...(data.value as unknown as DateWidgetConfig) }));
      }
    };
    loadConfig();
  }, []);

  const monthName = currentDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNumber = currentDate.getDate();
  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="w-[61px] h-[61px] sm:w-[65px] sm:h-[65px] flex flex-col relative rounded-[22%] overflow-hidden border border-white/30"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.9) 50%, rgba(230,230,235,0.85) 100%)",
          boxShadow: `
            0 8px 20px rgba(0,0,0,0.3),
            0 4px 8px rgba(0,0,0,0.2),
            inset 0 1px 2px rgba(255,255,255,0.8),
            inset 0 -1px 2px rgba(0,0,0,0.1)
          `
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Month Header */}
        <div 
          className="h-[28%] flex items-center justify-center"
          style={{ backgroundColor: config.headerColor }}
        >
          <span className="text-white font-bold text-[8px] sm:text-[9px] tracking-wider">
            {monthName}
          </span>
        </div>
        
        {/* Date Body */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span 
            className="text-xl sm:text-2xl font-light leading-none"
            style={{ color: config.dateColor }}
          >
            {dayNumber}
          </span>
          {config.showDayName && (
            <span 
              className="text-[7px] sm:text-[8px] font-medium mt-0.5"
              style={{ color: config.dayNameColor }}
            >
              {dayName}
            </span>
          )}
        </div>
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm mt-1.5">
        Calendar
      </span>
    </motion.div>
  );
};

export default DateWidget;
