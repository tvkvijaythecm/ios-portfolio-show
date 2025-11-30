import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, MapPin } from "lucide-react";

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
            <Cloud className="w-16 h-16 text-gray-300 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-20 h-20 text-blue-400" />;
      case "11":
        return <Cloud className="w-20 h-20 text-gray-500" />;
      case "13":
        return <CloudSnow className="w-20 h-20 text-blue-300" />;
      default:
        return <Cloud className="w-20 h-20 text-gray-400" />;
    }
  };

  const getSmallWeatherIcon = (iconCode: string) => {
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case "01":
        return <Sun className="w-6 h-6 text-yellow-400 mx-auto" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-6 h-6 mx-auto">
            <Sun className="w-4 h-4 text-yellow-400 absolute top-0 left-0" />
            <Cloud className="w-5 h-5 text-gray-400 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-6 h-6 text-blue-400 mx-auto" />;
      case "13":
        return <CloudSnow className="w-6 h-6 text-blue-300 mx-auto" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-400 mx-auto" />;
    }
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-white text-xl">Loading weather...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-white text-xl">{error || "No data available"}</div>
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
    <div className="min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-y-auto">
      {/* Main Weather Card */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 text-white mb-6">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span className="text-xl font-semibold">{cityName}</span>
          <div className="ml-auto text-sm text-gray-400">{currentTime}</div>
        </div>

        {/* Current Weather */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-7xl font-bold text-white mb-2">
              {weather.temp}°C
            </div>
            <div className="text-gray-300 text-lg capitalize mb-1">
              {weather.description}
            </div>
            <div className="text-gray-400 text-sm">
              Feels like {weather.feels_like}°C
            </div>
          </div>
          <div className="text-right">
            {getWeatherIcon(weather.icon)}
          </div>
        </div>

        {/* Temperature Range */}
        <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-4 mb-6 border border-gray-600/50">
          <div className="flex justify-between items-center text-white">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">High</div>
              <div className="text-2xl font-bold text-red-400">{weather.temp_max}°</div>
            </div>
            <div className="h-8 w-px bg-gray-600" />
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Low</div>
              <div className="text-2xl font-bold text-blue-400">{weather.temp_min}°</div>
            </div>
            <div className="h-8 w-px bg-gray-600" />
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Humidity</div>
              <div className="text-2xl font-bold text-cyan-400">{weather.humidity}%</div>
            </div>
          </div>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50">
            <div className="flex items-center gap-3 text-white">
              <Wind className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Wind</div>
                <div className="text-lg font-semibold">{weather.wind_speed} km/h</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50">
            <div className="flex items-center gap-3 text-white">
              <Droplets className="w-6 h-6 text-cyan-400" />
              <div>
                <div className="text-sm text-gray-400">Rain</div>
                <div className="text-lg font-semibold">{weather.rain_chance || 38}%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50">
            <div className="flex items-center gap-3 text-white">
              <Sun className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">UV Index</div>
                <div className="text-lg font-semibold">{weather.uvi || 12}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50">
            <div className="flex items-center gap-3 text-white">
              <Cloud className="w-6 h-6 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Pressure</div>
                <div className="text-lg font-semibold">{weather.pressure} hPa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-gray-700/50 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-4">Hourly Forecast</h3>
        <div className="grid grid-cols-4 gap-3">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-700/50 rounded-2xl p-3 mb-2 border border-gray-600/50">
                {getSmallWeatherIcon(hour.icon)}
              </div>
              <div className="text-sm text-gray-300 mb-1 font-medium">{hour.time}</div>
              <div className="text-lg font-bold text-white">{hour.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.slice(1, 6).map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-2xl border border-gray-600/30">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-gray-600/50 rounded-lg flex items-center justify-center">
                  {getSmallWeatherIcon(day.icon)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{day.day}</div>
                  <div className="text-gray-400 text-sm capitalize">{day.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white font-semibold">{day.temp_max}°</div>
                <div className="text-gray-400 font-semibold">{day.temp_min}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
