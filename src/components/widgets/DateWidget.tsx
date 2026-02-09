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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase();

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Fill remaining cells to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isWeekend = (index: number) => {
    const col = index % 7;
    return col >= 5; // Saturday and Sunday columns
  };

  return (
    <motion.div
      className="w-full h-full rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(255,255,255,0.2)
        `,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `
          0 12px 40px rgba(0,0,0,0.4),
          inset 0 1px 0 rgba(255,255,255,0.25)
        `
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="h-full p-3 sm:p-4 flex flex-col justify-between">
        {/* Month Name */}
        <div className="text-white font-bold text-sm sm:text-base tracking-wider drop-shadow-md mb-1">
          {monthName}
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {weekdays.map((day, i) => (
            <div
              key={i}
              className={`text-center text-[10px] sm:text-xs font-semibold ${
                i >= 5 ? "text-white/40" : "text-white/60"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 flex-1">
          {cells.map((day, i) => (
            <div
              key={i}
              className="flex items-center justify-center"
            >
              {day !== null && (
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-[11px] sm:text-sm font-medium ${
                    day === today
                      ? "bg-white text-black font-bold"
                      : isWeekend(i)
                        ? "text-white/40"
                        : "text-white/90"
                  }`}
                >
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DateWidget;
