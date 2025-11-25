import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Gauge } from "lucide-react";

const OPENWEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366";

interface WeatherData {
  city: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  wind_speed: number;
  wind_deg: number;
}

interface ForecastDay {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("Loading...");

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
        (error) => {
          console.error("Geolocation error:", error);
          setError("Unable to get your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError("");

      // Fetch current weather by coordinates
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) throw new Error("Failed to fetch weather");
      
      const currentData = await currentResponse.json();
      
      setCityName(currentData.name);
      setWeather({
        city: currentData.name,
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        temp_min: Math.round(currentData.main.temp_min),
        temp_max: Math.round(currentData.main.temp_max),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        wind_speed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        wind_deg: currentData.wind.deg,
      });

      // Fetch 5-day forecast by coordinates
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) throw new Error("Failed to fetch forecast");
      
      const forecastData = await forecastResponse.json();
      
      // Process forecast data - get one entry per day at noon
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            temp_max: Math.round(item.main.temp_max),
            temp_min: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      });
      
      setForecast(dailyForecasts.slice(1)); // Skip today
      setLoading(false);
    } catch (err) {
      setError("Unable to fetch weather data");
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case "01":
        return <Sun className="w-20 h-20 text-yellow-400" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-20 h-20">
            <Sun className="w-12 h-12 text-yellow-400 absolute top-0 left-0" />
            <Cloud className="w-16 h-16 text-white dark:text-gray-300 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-20 h-20 text-blue-400" />;
      case "11":
        return <Cloud className="w-20 h-20 text-gray-600" />;
      case "13":
        return <CloudSnow className="w-20 h-20 text-blue-200" />;
      default:
        return <Cloud className="w-20 h-20 text-gray-400" />;
    }
  };

  const getSmallWeatherIcon = (iconCode: string) => {
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case "01":
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-12 h-12">
            <Sun className="w-8 h-8 text-yellow-400 absolute top-0 left-0" />
            <Cloud className="w-10 h-10 text-white dark:text-gray-300 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case "13":
        return <CloudSnow className="w-12 h-12 text-blue-200" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-400" />;
    }
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-gray-200 text-xl">Loading weather...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-gray-200 text-xl">{error || "No data available"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white dark:text-gray-200 mb-2">{cityName}</h2>
        <div className="h-px bg-white/30 dark:bg-gray-600 w-full" />
      </div>

      {/* Today's Weather */}
      <div className="bg-gradient-to-br from-blue-500/60 to-blue-600/60 dark:from-blue-900/70 dark:to-blue-950/70 backdrop-blur-sm rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white dark:text-gray-200 font-semibold text-lg">TODAY</span>
          <span className="text-white dark:text-gray-200 font-medium capitalize">{weather.description}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            {getWeatherIcon(weather.icon)}
          </div>
          
          <div className="text-right">
            <div className="text-7xl font-bold text-white dark:text-gray-200">{weather.temp}°C</div>
            <div className="text-white/80 dark:text-gray-300 text-lg mt-2">
              Max {weather.temp_max}°C
            </div>
            <div className="text-white/80 dark:text-gray-300 text-lg">
              Min {weather.temp_min}°C
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-white/70 dark:text-gray-400" />
            <div>
              <div className="text-white/70 dark:text-gray-400 text-sm">Humidity</div>
              <div className="text-white dark:text-gray-200 font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-white/70 dark:text-gray-400" />
            <div>
              <div className="text-white/70 dark:text-gray-400 text-sm">Wind</div>
              <div className="text-white dark:text-gray-200 font-semibold">
                {getWindDirection(weather.wind_deg)}, {weather.wind_speed} km/h
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-white/70 dark:text-gray-400" />
            <div>
              <div className="text-white/70 dark:text-gray-400 text-sm">Pressure</div>
              <div className="text-white dark:text-gray-200 font-semibold">{weather.pressure} hPa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-500/50 to-blue-600/50 dark:from-blue-900/60 dark:to-blue-950/60 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              {getSmallWeatherIcon(day.icon)}
              <span className="text-white dark:text-gray-200 font-bold text-2xl w-16">{day.day}</span>
            </div>
            
            <div className="text-right">
              <div className="text-white dark:text-gray-200 font-semibold text-lg">
                Max {day.temp_max}°C
              </div>
              <div className="text-white/80 dark:text-gray-300">
                Min {day.temp_min}°C
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
