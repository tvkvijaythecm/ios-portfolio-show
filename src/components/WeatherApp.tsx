import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, MapPin, Gauge } from "lucide-react";

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
        wind_speed: Math.round(currentData.wind.speed * 3.6),
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
      
      // Process forecast data
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
      
      // Process hourly forecast
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
        return <Sun className="w-16 h-16 text-yellow-400" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-16 h-16">
            <Sun className="w-10 h-10 text-yellow-400 absolute top-0 left-0" />
            <Cloud className="w-12 h-12 text-gray-300 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      case "11":
        return <Cloud className="w-16 h-16 text-gray-500" />;
      case "13":
        return <CloudSnow className="w-16 h-16 text-blue-300" />;
      default:
        return <Cloud className="w-16 h-16 text-gray-400" />;
    }
  };

  const getSmallWeatherIcon = (iconCode: string) => {
    const code = iconCode.substring(0, 2);
    
    switch (code) {
      case "01":
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case "02":
      case "03":
      case "04":
        return (
          <div className="relative w-5 h-5">
            <Sun className="w-3 h-3 text-yellow-400 absolute top-0 left-0" />
            <Cloud className="w-4 h-4 text-gray-400 absolute bottom-0 right-0" />
          </div>
        );
      case "09":
      case "10":
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case "13":
        return <CloudSnow className="w-5 h-5 text-blue-300" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
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
    <div className="min-h-full bg-gray-900 p-6 overflow-y-auto">
      {/* Main Weather Card */}
      <div className="mb-8">
        {/* Location and Time */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h1 className="text-3xl font-light">
              <span className="font-medium">{weather.city.split(' ')[0]}</span>
              <br />
              <span className="text-2xl font-bold">{weather.city.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <div className="text-gray-400 text-sm font-medium">
            {currentTime}
          </div>
        </div>

        {/* Current Temperature and Condition */}
        <div className="text-center mb-8">
          <div className="text-7xl font-light text-white mb-2">
            {weather.temp}°C
          </div>
          <div className="text-xl text-gray-300 capitalize mb-1">
            {weather.description}
          </div>
          <div className="text-gray-400 text-sm">
            Feels like {weather.feels_like}°C
          </div>
        </div>

        {/* Temperature Range */}
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm mb-1">High</div>
              <div className="text-white text-xl font-semibold">{weather.temp_max}°</div>
            </div>
            <div className="border-l border-r border-gray-700/50">
              <div className="text-gray-400 text-sm mb-1">Low</div>
              <div className="text-white text-xl font-semibold">{weather.temp_min}°</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Humidity</div>
              <div className="text-white text-xl font-semibold">{weather.humidity}%</div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 font-medium">Wind</span>
            </div>
            <div className="text-white font-semibold">{weather.wind_speed} km/h</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30">
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300 font-medium">Rain</span>
            </div>
            <div className="text-white font-semibold">{weather.rain_chance || 20}%</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300 font-medium">UV Index</span>
            </div>
            <div className="text-white font-semibold">{weather.uvi || 12}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Pressure</span>
            </div>
            <div className="text-white font-semibold">{weather.pressure} hPa</div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">Hourly Forecast</h3>
        <div className="grid grid-cols-4 gap-3">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="text-center bg-gray-800/30 rounded-2xl p-3 border border-gray-700/30">
              <div className="text-gray-300 text-sm mb-2 font-medium">{hour.time}</div>
              <div className="flex justify-center mb-2">
                {getSmallWeatherIcon(hour.icon)}
              </div>
              <div className="text-white font-semibold text-lg">{hour.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.slice(1, 6).map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 flex items-center justify-center">
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
