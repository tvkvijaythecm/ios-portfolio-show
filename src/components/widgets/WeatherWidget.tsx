import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OPENWEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366";

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

interface LiveWeatherData {
  temperature: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  location: string;
  hourly: Array<{
    hour: string;
    temp: number;
    condition: string;
  }>;
  daily: Array<{
    day: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    condition: string;
  }>;
}

const mapIconToCondition = (iconCode: string): string => {
  const code = iconCode.substring(0, 2);
  switch (code) {
    case "01": return "sunny";
    case "02": case "03": case "04": return "cloudy";
    case "09": case "10": return "rainy";
    case "11": return "storm";
    case "13": return "snow";
    case "50": return "windy";
    default: return "sunny";
  }
};

const getWeatherIcon = (condition: string, size: number = 16, className: string = "") => {
  const base = `drop-shadow-lg ${className}`;
  switch (condition.toLowerCase()) {
    case "sunny": case "clear":
      return <Sun size={size} className={`text-yellow-400 ${base}`} />;
    case "cloudy": case "partly cloudy":
      return <Cloud size={size} className={`text-white/90 ${base}`} />;
    case "rainy": case "rain": case "light rainy":
      return <CloudRain size={size} className={`text-blue-300 ${base}`} />;
    case "snow": case "snowy":
      return <CloudSnow size={size} className={`text-white ${base}`} />;
    case "storm": case "thunderstorm":
      return <CloudLightning size={size} className={`text-yellow-300 ${base}`} />;
    case "windy":
      return <Wind size={size} className={`text-gray-200 ${base}`} />;
    default:
      return <Sun size={size} className={`text-yellow-400 ${base}`} />;
  }
};

const WeatherWidget = () => {
  const [config, setConfig] = useState<WeatherWidgetConfig>({
    enabled: true,
    location: "Kuala Lumpur",
    temperature: 27,
    condition: "Partly Cloudy",
    showForecast: true,
    gradientFrom: "#0a4d6e",
    gradientTo: "#1a8fb8",
    textColor: "#ffffff",
    forecast: [
      { day: "Sun", temp: 28, condition: "sunny" },
      { day: "Mon", temp: 27, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "rainy" },
    ],
  });

  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  const fetchWeatherByLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => { setError(true); setLoading(false); },
        { timeout: 10000 }
      );
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
      ]);

      if (!currentRes.ok || !forecastRes.ok) throw new Error("Failed");

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      // Hourly: next 6 entries (3-hour intervals)
      const hourly = forecastData.list.slice(0, 6).map((item: any) => ({
        hour: new Date(item.dt * 1000).getHours().toString(),
        temp: Math.round(item.main.temp),
        condition: mapIconToCondition(item.weather[0].icon),
      }));

      // Daily: aggregate by date
      const dailyMap = new Map<string, { temps: number[]; condition: string; day: string }>();
      const today = new Date().toDateString();
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        if (dateStr === today) return;
        if (!dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, {
            temps: [],
            condition: mapIconToCondition(item.weather[0].icon),
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          });
        }
        dailyMap.get(dateStr)!.temps.push(item.main.temp);
      });

      const daily = Array.from(dailyMap.values()).slice(0, 2).map(d => ({
        day: d.day,
        temp: Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
        tempMin: Math.round(Math.min(...d.temps)),
        tempMax: Math.round(Math.max(...d.temps)),
        condition: d.condition,
      }));

      setLiveWeather({
        temperature: Math.round(currentData.main.temp),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        condition: mapIconToCondition(currentData.weather[0].icon),
        location: currentData.name,
        hourly,
        daily,
      });
      setLoading(false);
      setError(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const displayTemp = liveWeather?.temperature ?? config.temperature;
  const displayTempMin = liveWeather?.tempMin ?? config.temperature - 3;
  const displayTempMax = liveWeather?.tempMax ?? config.temperature + 5;
  const displayCondition = liveWeather?.condition ?? config.condition;
  const displayLocation = liveWeather?.location ?? config.location;
  const displayHourly = liveWeather?.hourly ?? [];
  const displayDaily = liveWeather?.daily?.slice(0, 2) ?? config.forecast.slice(0, 2).map(f => ({
    ...f,
    tempMin: f.temp - 3,
    tempMax: f.temp + 5,
  }));

  // Compute global min/max for range bars
  const allMins = displayDaily.map(d => d.tempMin);
  const allMaxs = displayDaily.map(d => d.tempMax);
  const globalMin = Math.min(...allMins, displayTempMin);
  const globalMax = Math.max(...allMaxs, displayTempMax);
  const range = globalMax - globalMin || 1;

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
      <div className="h-full p-3 sm:p-4 flex flex-col">
        {/* Header: Location + Current Temp */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate text-white/70 drop-shadow-md">
              {loading ? "Loading..." : displayLocation}
            </div>
            <div className="text-3xl sm:text-4xl font-light tracking-tight text-white drop-shadow-lg">
              {loading ? "--" : `${displayTemp}°`}
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="mb-1">
              {loading ? (
                <Loader2 className="w-7 h-7 animate-spin text-white/60" />
              ) : (
                getWeatherIcon(displayCondition, 28)
              )}
            </div>
            <div className="text-[10px] sm:text-xs text-white/70 capitalize drop-shadow-md">
              {loading ? "..." : displayCondition}
            </div>
            <div className="text-[10px] sm:text-xs text-white/60 drop-shadow-md">
              {loading ? "--" : `H:${displayTempMax}° L:${displayTempMin}°`}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-1" />

        {/* Hourly Forecast Row */}
        {displayHourly.length > 0 && (
          <>
            <div className="flex justify-between items-center py-1 overflow-hidden">
              {displayHourly.slice(0, 6).map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-white/60">{h.hour}</span>
                  {getWeatherIcon(h.condition, 14)}
                  <span className="text-[10px] sm:text-xs text-white font-medium">{h.temp}°</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 my-1" />
          </>
        )}

        {/* Daily Forecast */}
        <div className="flex-1 flex flex-col justify-evenly">
          {displayDaily.map((d, i) => {
            const leftPct = ((d.tempMin - globalMin) / range) * 100;
            const widthPct = ((d.tempMax - d.tempMin) / range) * 100;
            return (
              <div key={i} className="flex items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-white/80 w-7 sm:w-8 font-medium">{d.day}</span>
                <div className="w-4 flex justify-center">
                  {getWeatherIcon(d.condition, 12)}
                </div>
                <span className="text-[10px] sm:text-xs text-white/60 w-6 text-right">{d.tempMin}°</span>
                <div className="flex-1 h-1 sm:h-1.5 rounded-full bg-white/10 relative mx-1">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 8)}%`,
                      background: "linear-gradient(90deg, rgba(100,180,255,0.8), rgba(255,180,50,0.8))",
                    }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-white w-6 text-right font-medium">{d.tempMax}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
