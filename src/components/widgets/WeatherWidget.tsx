import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherWidgetConfig {
  enabled: boolean;
  location: string;
  temperature: number;
  condition: string;
  showForecast: boolean;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

const getWeatherIcon = (condition: string, size: number = 32) => {
  const iconProps = { size, className: "text-yellow-300" };
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun {...iconProps} />;
    case "cloudy":
    case "partly cloudy":
      return <Cloud {...iconProps} className="text-white/80" />;
    case "rainy":
    case "rain":
    case "light rainy":
      return <CloudRain {...iconProps} className="text-blue-200" />;
    case "snow":
    case "snowy":
      return <CloudSnow {...iconProps} className="text-white" />;
    case "storm":
    case "thunderstorm":
      return <CloudLightning {...iconProps} className="text-yellow-200" />;
    case "windy":
      return <Wind {...iconProps} className="text-gray-200" />;
    default:
      return <Sun {...iconProps} />;
  }
};

const WeatherWidget = () => {
  const [config, setConfig] = useState<WeatherWidgetConfig>({
    enabled: true,
    location: "Kuala Lumpur",
    temperature: 27,
    condition: "Partly Cloudy",
    showForecast: true,
    gradientFrom: "#1e3a5f",
    gradientTo: "#4a6fa5",
    textColor: "#ffffff",
    forecast: [
      { day: "Sun", temp: 28, condition: "sunny" },
      { day: "Mon", temp: 27, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "rainy" },
      { day: "Wed", temp: 26, condition: "cloudy" },
    ],
  });

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "widget_weather")
        .maybeSingle();
      
      if (data?.value) {
        setConfig(prev => ({ ...prev, ...(data.value as unknown as WeatherWidgetConfig) }));
      }
    };
    loadConfig();
  }, []);

  return (
    <motion.div
      className="w-full aspect-square rounded-3xl overflow-hidden p-3 relative"
      style={{
        background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Weather content */}
      <div className="h-full flex flex-col justify-between" style={{ color: config.textColor }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium opacity-90">Today's Weather</span>
          {getWeatherIcon(config.condition, 20)}
        </div>
        
        {/* Main Temperature */}
        <div className="flex items-center gap-1">
          <span className="text-4xl font-light leading-none">{config.temperature}°</span>
          {getWeatherIcon(config.condition, 28)}
        </div>
        
        {/* Condition */}
        <div className="text-xs opacity-80">{config.condition}</div>
        
        {/* Forecast */}
        {config.showForecast && (
          <div className="flex justify-between pt-1.5 border-t border-white/20">
            {config.forecast.slice(0, 4).map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] opacity-70">{day.day}</span>
                {getWeatherIcon(day.condition, 14)}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Decorative rain drops for rainy weather */}
      {config.condition.toLowerCase().includes("rain") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-3 bg-blue-200/40 rounded-full"
              style={{ left: `${10 + i * 12}%` }}
              animate={{
                y: ["-10%", "110%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;
