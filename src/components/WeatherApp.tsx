import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, MapPin, Menu } from "lucide-react";

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
  rain_chance?: number;
  uvi?: number;
}

interface ForecastDay {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
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
      
      // Fetch UV index
      let uvIndex = 0;
      try {
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
        );
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          uvIndex = Math.round(uvData.value);
        }
      } catch (err) {
        console.log("UV data not available");
      }
      
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
        rain_chance: currentData.rain ? Math.round((currentData.rain['1h'] || 0) * 10) : 20,
        uvi: uvIndex,
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
            day: date.toLocaleDateString('en-US', { weekday: 'long' }),
            temp_max: Math.round(item.main.temp_max),
            temp_min: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      });
      
      setForecast(dailyForecasts);
      
      // Process hourly forecast (next 4 hours)
      const hourlyData: HourlyForecast[] = forecastData.list.slice(0, 4).map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon,
        };
      });
      
      setHourlyForecast(hourlyData);
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
        return <Sun className="w-10 h-10 text-yellow-500 mx-auto" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-10 h-10 mx-auto">
            <Sun className="w-7 h-7 text-yellow-500 absolute top-0 left-0" />
            <Cloud className="w-8 h-8 text-gray-400 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-10 h-10 text-blue-500 mx-auto" />;
      case "13":
        return <CloudSnow className="w-10 h-10 text-blue-300 mx-auto" />;
      default:
        return <Cloud className="w-10 h-10 text-gray-400 mx-auto" />;
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

  const currentTime = new Date().toLocaleString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5" />
          <span className="text-lg font-medium">{cityName}</span>
        </div>
        <Menu className="w-6 h-6 text-white" />
      </div>

      {/* Current Weather - Large Display */}
      <div className="mb-6">
        <div className="text-white/90 text-sm mb-2">{currentTime}</div>
        <div className="flex items-start justify-between mb-4">
          <div className="text-[120px] leading-none font-bold text-white">
            {weather.temp}°C
          </div>
        </div>
        <div className="inline-block">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
            <span className="text-white text-sm capitalize">{weather.description}</span>
          </div>
        </div>
      </div>

      {/* Today/Tomorrow Quick Forecast */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 mb-4 border border-white/30">
        <div className="flex items-center justify-around text-white">
          <div className="text-center">
            <div className="text-sm mb-1">Today</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="text-red-200">↑</span>{weather.temp_max}°
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-200">↓</span>{weather.temp_min}°
              </span>
            </div>
          </div>
          
          {forecast[1] && (
            <>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-sm mb-1">{forecast[1].day}</div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="text-red-200">↑</span>{forecast[1].temp_max}°
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-blue-200">↓</span>{forecast[1].temp_min}°
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weather Details */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5 mb-4 border border-white/30">
        <div className="grid grid-cols-3 gap-4 text-white">
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-semibold mb-1">{weather.rain_chance || 23}%</div>
            <div className="text-xs opacity-80">Chance of rain</div>
          </div>
          
          <div className="text-center border-l border-r border-white/30">
            <Wind className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-semibold mb-1">{weather.wind_speed} km/h</div>
            <div className="text-xs opacity-80">Wind speed</div>
          </div>
          
          <div className="text-center">
            <Sun className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-semibold mb-1">UVI {weather.uvi || 2}</div>
            <div className="text-xs opacity-80">UV Index</div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-white rounded-3xl p-5 mb-4 shadow-lg">
        <h3 className="text-gray-900 font-bold text-xl mb-4">Hourly Forecast</h3>
        <div className="grid grid-cols-4 gap-3">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-100 rounded-2xl p-3 mb-2">
                {getSmallWeatherIcon(hour.icon)}
              </div>
              <div className="text-xs text-gray-500 mb-1">{hour.time}</div>
              <div className="text-xl font-bold text-gray-900">{hour.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tomorrow Forecast */}
      {forecast[1] && (
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-2xl p-3">
                {getSmallWeatherIcon(forecast[1].icon)}
              </div>
              <div>
                <div className="text-gray-900 font-bold text-xl">Tomorrow</div>
                <div className="text-gray-500 text-sm capitalize">{forecast[1].description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-red-500 flex items-center gap-1">
                  <span>↑</span>{forecast[1].temp_max}°
                </span>
                <span className="text-blue-500 flex items-center gap-1">
                  <span>↓</span>{forecast[1].temp_min}°
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
