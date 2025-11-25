import { useState, useEffect } from "react";
import { Sun, Globe } from "lucide-react";
import { format } from "date-fns";

interface LocationData {
  city: string;
  state: string;
  country: string;
  timezone: string;
}

const ClockApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<LocationData | null>(null);
  const [is24Hour, setIs24Hour] = useState(true);
  const [sunriseTime, setSunriseTime] = useState<Date | null>(null);
  const [sunsetTime, setSunsetTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate sunrise and sunset times
  const calculateSunTimes = (lat: number, lng: number) => {
    const now = new Date();
    const J2000 = 2451545.0;
    const daysSinceJ2000 = Math.floor((now.getTime() / 86400000) - 10957.5);
    
    // Simplified sunrise/sunset calculation
    const n = daysSinceJ2000 + 0.0008;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = (357.528 + 0.9856003 * n) % 360;
    const lambda = (L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180)) % 360;
    const epsilon = 23.439 - 0.0000004 * n;
    const alpha = Math.atan2(Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180), Math.cos(lambda * Math.PI / 180)) * 180 / Math.PI;
    const delta = Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;
    
    const cosH = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(delta * Math.PI / 180)) / (Math.cos(lat * Math.PI / 180) * Math.cos(delta * Math.PI / 180));
    const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;
    
    const transit = 12 - (lng / 15) - (alpha / 15);
    const sunrise = transit - (H / 15);
    const sunset = transit + (H / 15);
    
    const sunriseDate = new Date(now);
    sunriseDate.setHours(Math.floor(sunrise), Math.round((sunrise % 1) * 60), 0, 0);
    
    const sunsetDate = new Date(now);
    sunsetDate.setHours(Math.floor(sunset), Math.round((sunset % 1) * 60), 0, 0);
    
    setSunriseTime(sunriseDate);
    setSunsetTime(sunsetDate);
  };

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get location name using reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await response.json();
            
            setLocation({
              city: data.address.city || data.address.town || data.address.village || "Unknown",
              state: data.address.state || "",
              country: data.address.country || "",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            
            calculateSunTimes(latitude, longitude);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation({
              city: "Unknown Location",
              state: "",
              country: "",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation({
            city: "Location Access Denied",
            state: "",
            country: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          setLoading(false);
        }
      );
    } else {
      setLocation({
        city: "Geolocation Not Supported",
        state: "",
        country: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setLoading(false);
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, use24Hour: boolean) => {
    return use24Hour ? format(date, "HH:mm") : format(date, "hh:mm");
  };

  const formatSmallTime = (date: Date, use24Hour: boolean) => {
    return use24Hour ? format(date, "HH") : format(date, "hh");
  };

  const getDaylight = () => {
    if (!sunriseTime || !sunsetTime) return "";
    const duration = (sunsetTime.getTime() - sunriseTime.getTime()) / (1000 * 60 * 60);
    const hours = Math.floor(duration);
    const minutes = Math.round((duration % 1) * 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8">
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
          <Globe className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-gray-900" />
        </button>
        
        {/* 12h/24h Toggle */}
        <div className="flex items-center gap-0 bg-gray-200 dark:bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setIs24Hour(false)}
            className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              !is24Hour
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            12h
          </button>
          <button
            onClick={() => setIs24Hour(true)}
            className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              is24Hour
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            24h
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-8 pb-20 md:pb-32">
        {loading ? (
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-light">Loading...</div>
          </div>
        ) : (
          <>
            {/* Date */}
            <div className="mb-4 md:mb-8">
              <div className="text-2xl md:text-4xl font-light flex items-baseline gap-3 md:gap-4">
                <span className="text-6xl md:text-8xl font-extralight">
                  {format(currentTime, "dd")}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl md:text-3xl">{format(currentTime, "EEE,")}</span>
                  <span className="text-xl md:text-3xl">{format(currentTime, "d MMM")}</span>
                </div>
              </div>
            </div>

            {/* Large Time Display */}
            <div className="mb-8 md:mb-12 relative">
              <div className="flex items-baseline gap-2 md:gap-4">
                <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extralight leading-none tracking-tighter">
                  {formatTime(currentTime, is24Hour).split(":")[0]}
                </span>
                <span className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-extralight leading-none opacity-70">
                  {formatTime(currentTime, is24Hour).split(":")[1]}
                </span>
              </div>
              
              {/* Additional time zones */}
              <div className="absolute -right-2 md:right-0 top-0 flex flex-col gap-2 md:gap-3 text-gray-400 dark:text-gray-600">
                <span className="text-3xl md:text-5xl font-extralight">
                  {formatSmallTime(new Date(currentTime.getTime() + 6 * 60 * 60 * 1000), is24Hour)}
                </span>
                <span className="text-2xl md:text-4xl font-extralight">
                  {formatSmallTime(new Date(currentTime.getTime() + 8 * 60 * 60 * 1000), is24Hour)}
                </span>
                <span className="text-xl md:text-3xl font-extralight">
                  {formatSmallTime(new Date(currentTime.getTime() + 10 * 60 * 60 * 1000), is24Hour)}
                </span>
              </div>
            </div>

            {/* Sun Info */}
            {sunriseTime && sunsetTime && (
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl text-gray-600 dark:text-gray-400">
                  <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  <span className="font-light">
                    {getDaylight()}
                  </span>
                </div>
                <div className="text-sm md:text-base text-gray-500 dark:text-gray-500 mt-1 ml-8 md:ml-9 font-light">
                  {format(sunriseTime, is24Hour ? "HH:mm" : "hh:mm a")} - {format(sunsetTime, is24Hour ? "HH:mm" : "hh:mm a")}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight">
              {location?.city && (
                <>
                  <div>{location.city}</div>
                  {location.state && <div>{location.state},</div>}
                  <div>{location.country}</div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClockApp;
