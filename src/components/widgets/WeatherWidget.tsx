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
      return <Sun size={size} className={`text-yellow-500 drop-shadow-lg ${className}`} />;
    case "cloudy":
    case "partly cloudy":
      return <Cloud size={size} className={`text-gray-500 drop-shadow-lg ${className}`} />;
    case "rainy":
    case "rain":
    case "light rainy":
      return <CloudRain size={size} className={`text-blue-500 drop-shadow-lg ${className}`} />;
    case "snow":
    case "snowy":
      return <CloudSnow size={size} className={`text-blue-300 drop-shadow-lg ${className}`} />;
    case "storm":
    case "thunderstorm":
      return <CloudLightning size={size} className={`text-purple-500 drop-shadow-lg ${className}`} />;
    case "windy":
      return <Wind size={size} className={`text-gray-500 drop-shadow-lg ${className}`} />;
    default:
      return <Sun size={size} className={`text-yellow-500 drop-shadow-lg ${className}`} />;
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

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="w-[61px] h-[61px] sm:w-[130px] sm:h-[130px] flex flex-col items-center justify-center relative rounded-[22%] overflow-hidden bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 border border-white/30"
        style={{
          boxShadow: `
            0 8px 20px rgba(0,0,0,0.3),
            0 4px 8px rgba(0,0,0,0.2),
            inset 0 1px 2px rgba(255,255,255,0.4),
            inset 0 -1px 2px rgba(0,0,0,0.1)
          `
        }}
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Weather Icon */}
        <div className="mb-0.5 sm:mb-1">
          {loading ? (
            <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin text-white" />
          ) : (
            getWeatherIcon(displayCondition, 24, "w-5 h-5 sm:w-8 sm:h-8 text-white")
          )}
        </div>
        
        {/* Temperature */}
        <div className="text-white font-bold text-sm sm:text-2xl leading-none drop-shadow-md">
          {loading ? "--" : `${displayTemp}°`}
        </div>
        
        {/* Location - only show on larger size */}
        <div className="hidden sm:block text-white/90 text-[9px] mt-0.5 font-medium truncate max-w-[90%] text-center">
          {loading ? "..." : displayLocation}
        </div>
      </motion.div>
      <span className="text-white text-[11px] font-medium tracking-tight text-center leading-tight max-w-[70px] drop-shadow-sm mt-1.5">
        Weather
      </span>
    </motion.div>
  );
};

export default WeatherWidget;