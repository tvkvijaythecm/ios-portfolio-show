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
  forecast: Array<{
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
    case "01":
      return "sunny";
    case "02":
    case "03":
    case "04":
      return "cloudy";
    case "09":
    case "10":
      return "rainy";
    case "11":
      return "storm";
    case "13":
      return "snow";
    case "50":
      return "windy";
    default:
      return "sunny";
  }
};

const getWeatherIcon = (condition: string, size: number = 32, className: string = "") => {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun size={size} className={`text-yellow-400 drop-shadow-lg ${className}`} />;
    case "cloudy":
    case "partly cloudy":
      return <Cloud size={size} className={`text-white/90 drop-shadow-lg ${className}`} />;
    case "rainy":
    case "rain":
    case "light rainy":
      return <CloudRain size={size} className={`text-blue-300 drop-shadow-lg ${className}`} />;
    case "snow":
    case "snowy":
      return <CloudSnow size={size} className={`text-white drop-shadow-lg ${className}`} />;
    case "storm":
    case "thunderstorm":
      return <CloudLightning size={size} className={`text-yellow-300 drop-shadow-lg ${className}`} />;
    case "windy":
      return <Wind size={size} className={`text-gray-200 drop-shadow-lg ${className}`} />;
    default:
      return <Sun size={size} className={`text-yellow-400 drop-shadow-lg ${className}`} />;
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
          const { latitude, longitude } = position.coords;
          await fetchWeather(latitude, longitude);
        },
        async (err) => {
          console.error("Geolocation error:", err);
          setError(true);
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) throw new Error("Failed to fetch weather");
      
      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) throw new Error("Failed to fetch forecast");
      
      const forecastData = await forecastResponse.json();

      const dailyForecasts: Array<{ day: string; temp: number; tempMin: number; tempMax: number; condition: string }> = [];
      const processedDates = new Set<string>();
      const today = new Date().toDateString();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        if (dateStr !== today && !processedDates.has(dateStr) && dailyForecasts.length < 3) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            temp: Math.round(item.main.temp),
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
            condition: mapIconToCondition(item.weather[0].icon),
          });
        }
      });

      setLiveWeather({
        temperature: Math.round(currentData.main.temp),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        condition: mapIconToCondition(currentData.weather[0].icon),
        location: currentData.name,
        forecast: dailyForecasts,
      });
      
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(true);
      setLoading(false);
    }
  };

  const displayTemp = liveWeather?.temperature ?? config.temperature;
  const displayTempMin = liveWeather?.tempMin ?? config.temperature - 3;
  const displayTempMax = liveWeather?.tempMax ?? config.temperature + 5;
  const displayCondition = liveWeather?.condition ?? config.condition;
  const displayLocation = liveWeather?.location ?? config.location;
  const displayForecast = liveWeather?.forecast ?? config.forecast.slice(0, 3).map(f => ({
    ...f,
    tempMin: f.temp - 3,
    tempMax: f.temp + 5,
  }));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = date.getDate();
    const month = date.getMonth() + 1;
    return `${day} ${month}.${dateNum.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="w-full h-full rounded-[20px] sm:rounded-3xl overflow-hidden relative border border-white/20 backdrop-blur-xl"
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
      {/* Main Content */}
      <div className="h-full p-3 sm:p-4 flex flex-col justify-between">
        
        {/* Top Row - Location + Temperature */}
        <div className="flex items-start justify-between">
          {/* Location */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate text-white/70 drop-shadow-md">
              {loading ? "Loading..." : displayLocation}
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight mt-0.5 text-white drop-shadow-lg">
              {loading ? "--" : `${displayTemp}°`}
            </div>
          </div>

          {/* Weather Icon */}
          <div className="relative ml-2">
            {loading ? (
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-white/60" />
            ) : (
              getWeatherIcon(displayCondition, 36, "w-8 h-8 sm:w-10 sm:h-10")
            )}
          </div>
        </div>

        {/* Bottom - Condition + Hi/Lo */}
        <div className="mt-auto">
          <div className="text-[10px] sm:text-xs text-white/70 capitalize drop-shadow-md">
            {loading ? "..." : displayCondition}
          </div>
          <div className="text-[10px] sm:text-xs text-white/60 mt-0.5 drop-shadow-md">
            {loading ? "--" : `H:${displayTempMax}° L:${displayTempMin}°`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
