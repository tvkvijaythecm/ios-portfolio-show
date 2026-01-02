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
  condition: string;
  location: string;
  forecast: Array<{
    day: string;
    temp: number;
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
          // Fallback to static config data
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
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) throw new Error("Failed to fetch weather");
      
      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) throw new Error("Failed to fetch forecast");
      
      const forecastData = await forecastResponse.json();

      // Process forecast - get next 4 days
      const dailyForecasts: Array<{ day: string; temp: number; condition: string }> = [];
      const processedDates = new Set<string>();
      const today = new Date().toDateString();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        if (dateStr !== today && !processedDates.has(dateStr) && dailyForecasts.length < 4) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            condition: mapIconToCondition(item.weather[0].icon),
          });
        }
      });

      setLiveWeather({
        temperature: Math.round(currentData.main.temp),
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

  // Use live data if available, otherwise use config
  const displayTemp = liveWeather?.temperature ?? config.temperature;
  const displayCondition = liveWeather?.condition ?? config.condition;
  const displayLocation = liveWeather?.location ?? config.location;
  const displayForecast = liveWeather?.forecast ?? config.forecast;

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
          <span className="text-xs font-medium opacity-90 truncate max-w-[60%]">
            {loading ? "Loading..." : displayLocation}
          </span>
          {loading ? (
            <Loader2 size={20} className="animate-spin opacity-70" />
          ) : (
            getWeatherIcon(displayCondition, 20)
          )}
        </div>
        
        {/* Main Temperature */}
        <div className="flex items-center gap-1">
          {loading ? (
            <span className="text-4xl font-light leading-none opacity-50">--°</span>
          ) : (
            <>
              <span className="text-4xl font-light leading-none">{displayTemp}°</span>
              {getWeatherIcon(displayCondition, 28)}
            </>
          )}
        </div>
        
        {/* Condition */}
        <div className="text-xs opacity-80 capitalize">
          {loading ? "Fetching weather..." : displayCondition}
        </div>
        
        {/* Forecast */}
        {config.showForecast && !loading && (
          <div className="flex justify-between pt-1.5 border-t border-white/20">
            {displayForecast.slice(0, 4).map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] opacity-70">{day.day}</span>
                {getWeatherIcon(day.condition, 14)}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Decorative rain drops for rainy weather */}
      {!loading && displayCondition.toLowerCase().includes("rain") && (
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
