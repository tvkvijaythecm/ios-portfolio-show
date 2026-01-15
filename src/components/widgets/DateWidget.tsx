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
    dayNameColor: "#000000",
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

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const dayNumber = currentDate.getDate();
  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <motion.div
      className="w-full aspect-square rounded-3xl overflow-hidden shadow-xl border border-white/30"
      style={{
        backgroundColor: config.backgroundColor,
        boxShadow: `
          0 20px 50px rgba(0,0,0,0.35),
          0 10px 20px rgba(0,0,0,0.25),
          0 4px 8px rgba(0,0,0,0.15),
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.05)
        `,
        transform: "perspective(800px) rotateX(2deg) rotateY(2deg)",
        transformStyle: "preserve-3d"
      }}
      initial={{ scale: 0.9, opacity: 0, rotateX: 10, rotateY: 5 }}
      animate={{ scale: 1, opacity: 1, rotateX: 2, rotateY: 2 }}
      whileHover={{ 
        scale: 1.02, 
        rotateX: 0, 
        rotateY: 0,
        boxShadow: `
          0 30px 60px rgba(0,0,0,0.4),
          0 15px 30px rgba(0,0,0,0.3),
          0 5px 10px rgba(0,0,0,0.2),
          inset 0 2px 4px rgba(255,255,255,0.35),
          inset 0 -2px 4px rgba(0,0,0,0.05)
        `
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Month Header */}
      <div 
        className="h-[30%] flex items-center justify-center"
        style={{ backgroundColor: config.headerColor }}
      >
        <span className="text-white font-bold text-sm tracking-wider">
          {monthName}
        </span>
      </div>
      
      {/* Date Body */}
      <div className="h-[70%] flex flex-col items-center justify-center gap-0">
        <span 
          className="text-5xl font-light leading-none"
          style={{ color: config.dateColor }}
        >
          {dayNumber}
        </span>
        {config.showDayName && (
          <span 
            className="text-lg font-normal mt-1"
            style={{ color: config.dayNameColor }}
          >
            {dayName}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default DateWidget;
