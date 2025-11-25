import { useState, useEffect } from "react";
import { Sun, LogOut, LogIn } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  city: string;
  state: string;
  country: string;
  timezone: string;
}

const ClockApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<LocationData | null>(null);
  const [is24Hour, setIs24Hour] = useState(true);
  const [sunriseTime, setSunriseTime] = useState<Date | null>(null);
  const [sunsetTime, setSunsetTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  // Check authentication and load location
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserLocation(session.user.id);
      } else {
        loadDefaultLocation();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserLocation(session.user.id);
      } else {
        loadDefaultLocation();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserLocation = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('location_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setLocation({
          city: data.city,
          state: data.state || "",
          country: data.country,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        calculateSunTimes(Number(data.latitude), Number(data.longitude));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading location:", error);
      loadDefaultLocation();
    }
  };

  const loadDefaultLocation = () => {
    // Default to Kuala Lumpur
    setLocation({
      city: "Kuala Lumpur",
      state: "Federal Territory of Kuala Lumpur",
      country: "Malaysia",
      timezone: "Asia/Kuala_Lumpur",
    });
    calculateSunTimes(3.1390, 101.6869);
    setLoading(false);
  };

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      loadDefaultLocation();
    }
  };

  const handleAuthClick = () => {
    navigate("/auth");
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground rounded-3xl overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={user ? handleSignOut : handleAuthClick}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
          title={user ? "Sign out" : "Sign in"}
        >
          {user ? (
            <LogOut className="w-5 h-5 md:w-6 md:h-6 text-background" />
          ) : (
            <LogIn className="w-5 h-5 md:w-6 md:h-6 text-background" />
          )}
        </button>
        
        {/* 12h/24h Toggle */}
        <div className="flex items-center gap-0 bg-muted rounded-full p-1">
          <button
            onClick={() => setIs24Hour(false)}
            className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              !is24Hour
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            12h
          </button>
          <button
            onClick={() => setIs24Hour(true)}
            className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              is24Hour
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            24h
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-4xl md:text-6xl font-light">Loading...</div>
          </div>
        ) : (
          <>
            {/* Time and Date */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Date */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-baseline gap-3 md:gap-4">
                  <span className="text-[5rem] md:text-[8rem] font-extralight leading-none tracking-tight">
                    {format(currentTime, "dd")}
                  </span>
                  <div className="flex flex-col justify-center">
                    <span className="text-2xl md:text-4xl font-light">{format(currentTime, "EEE,")}</span>
                    <span className="text-2xl md:text-4xl font-light">{format(currentTime, "d MMM")}</span>
                  </div>
                </div>
              </div>

              {/* Large Time Display */}
              <div className="mb-8 md:mb-12">
                <div className="flex items-start gap-2 md:gap-4">
                  <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extralight leading-none tracking-tight">
                    {formatTime(currentTime, is24Hour).split(":")[0]}
                  </span>
                  <div className="flex flex-col pt-4 md:pt-6">
                    <span className="text-[3rem] md:text-[5rem] font-extralight leading-none tracking-tight opacity-40">
                      {formatTime(currentTime, is24Hour).split(":")[1]}
                    </span>
                    <span className="text-[2rem] md:text-[3rem] font-extralight leading-none tracking-tight opacity-30 mt-2">
                      {format(currentTime, "ss")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-6 md:space-y-8">
              {/* Sun Info */}
              {sunriseTime && sunsetTime && (
                <div>
                  <div className="flex items-center gap-2 text-lg md:text-xl">
                    <span>Sun 🌅:</span>
                    <span className="font-light">{getDaylight()}</span>
                  </div>
                  <div className="text-base md:text-lg text-muted-foreground font-light mt-1">
                    {format(sunriseTime, is24Hour ? "HH:mm" : "hh:mm")} - {format(sunsetTime, is24Hour ? "HH:mm" : "hh:mm")}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight">
                {location?.city && (
                  <>
                    <div>{location.city},</div>
                    {location.state && <div>{location.state},</div>}
                    <div>{location.country}.</div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClockApp;
