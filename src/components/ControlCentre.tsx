import { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { 
  Flashlight, 
  Cloud, 
  Info, 
  RotateCcw, 
  MapPin, 
  Play, 
  Pause, 
  Volume2,
  Radio,
  Phone,
  Settings,
  Search,
  Mail,
  Bell,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExternalLinkDialog from "@/components/ExternalLinkDialog";
import { AnimatePresence } from "framer-motion";

interface ControlCentreProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWeather: () => void;
  onOpenInfo: () => void;
}

interface ContactSettings {
  phone_number: string | null;
  whatsapp_number: string | null;
}

interface ControlCentreConfig {
  showTorch: boolean;
  showWeather: boolean;
  showInfo: boolean;
  showReboot: boolean;
  showMusicPlayer: boolean;
  showQuickActions: boolean;
  showProfileCard: boolean;
  bgColor: string;
  shadowLight: string;
  shadowDark: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  profileName: string;
  profileSubtitle: string;
  profileImageUrl: string;
}

const defaultConfig: ControlCentreConfig = {
  showTorch: true,
  showWeather: true,
  showInfo: true,
  showReboot: true,
  showMusicPlayer: true,
  showQuickActions: true,
  showProfileCard: true,
  bgColor: "#1e1e1e",
  shadowLight: "rgba(255, 255, 255, 0.03)",
  shadowDark: "rgba(0, 0, 0, 0.6)",
  accentColor: "#00ff4c",
  textColor: "#ffffff",
  secondaryTextColor: "#888888",
  profileName: "User",
  profileSubtitle: "Welcome back",
  profileImageUrl: "",
};

const RADIO_STREAM_URL = "https://radios.crabdance.com:8002/1";
const RADIO_STATION_NAME = "CrabDance Radio";

const ControlCentre = ({ isOpen, onClose, onOpenWeather, onOpenInfo }: ControlCentreProps) => {
  const [_ipAddress, setIpAddress] = useState("Detecting...");
  const [isFetchingIp, setIsFetchingIp] = useState(false);
  const [location, setLocation] = useState("Detecting...");
  const [currentTime, setCurrentTime] = useState("");
  const [_currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [dayNumber, setDayNumber] = useState("");
  const [monthName, setMonthName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [config, setConfig] = useState<ControlCentreConfig>(defaultConfig);
  const [isLoadingRadio, setIsLoadingRadio] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState("--");
  const [weatherCondition, setWeatherCondition] = useState("--");
  const [showGoogleSearch, setShowGoogleSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [showExternalDialog, setShowExternalDialog] = useState<{ app: string; url: string } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  
  const { toast } = useToast();

  // Neumorphic styles
  const neuOutset = {
    background: config.bgColor,
    boxShadow: `8px 8px 16px ${config.shadowDark}, -4px -4px 12px ${config.shadowLight}`,
    borderRadius: "24px",
  };

  const neuInset = {
    background: config.bgColor,
    boxShadow: `inset 6px 6px 12px ${config.shadowDark}, inset -3px -3px 8px ${config.shadowLight}`,
    borderRadius: "24px",
  };

  const neuBtn = {
    background: config.bgColor,
    boxShadow: `4px 4px 8px ${config.shadowDark}, -2px -2px 6px ${config.shadowLight}`,
    borderRadius: "50%",
  };

  const neuBtnActive = {
    boxShadow: `inset 3px 3px 6px ${config.shadowDark}, inset -1px -1px 4px ${config.shadowLight}`,
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(RADIO_STREAM_URL);
      audioRef.current.preload = "none";
      audioRef.current.volume = volume / 100;
      
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        setIsLoadingRadio(false);
      });
      
      audioRef.current.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setIsLoadingRadio(false);
        setIsPlaying(false);
        toast({
          title: "Radio Error",
          description: "Unable to connect to radio stream",
          variant: "destructive",
        });
      });
      
      audioRef.current.addEventListener("waiting", () => {
        setIsLoadingRadio(true);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      if (videoTrackRef.current) {
        videoTrackRef.current = null;
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Load config from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "control_centre")
          .maybeSingle();

        if (data?.value) {
          setConfig({ ...defaultConfig, ...(data.value as unknown as ControlCentreConfig) });
        }
      } catch (error) {
        console.error("Error loading control centre config:", error);
      }
    };

    const loadContactSettings = async () => {
      try {
        const { data } = await supabase
          .from("contact_settings")
          .select("phone_number, whatsapp_number")
          .maybeSingle();
        
        if (data) {
          setContactSettings(data);
        }
      } catch (error) {
        console.error("Error loading contact settings:", error);
      }
    };

    loadConfig();
    loadContactSettings();
  }, []);

  // Check if torch is supported
  useEffect(() => {
    const checkTorchSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { exact: "environment" } } 
        });
        
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        
        if ('torch' in capabilities) {
          setTorchSupported(true);
        }
        
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.log("Torch not supported or permission denied:", error);
        setTorchSupported(false);
      }
    };

    if (isOpen && config.showTorch) {
      checkTorchSupport();
    }
  }, [isOpen, config.showTorch]);

  // IP Detection
  const detectIPAddress = async () => {
    if (isFetchingIp) return;
    setIsFetchingIp(true);
    
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://ipapi.co/json/',
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const ip = data.ip || data.ip_address || data.query;
        if (ip) {
          setIpAddress(ip);
          setIsFetchingIp(false);
          return;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${service}:`, error);
      }
    }
    
    setIpAddress("Unable to detect");
    setIsFetchingIp(false);
  };

  useEffect(() => {
    detectIPAddress();
  }, []);

  // Detect Location
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        setLocation("Not supported");
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000,
            enableHighAccuracy: false
          });
        });

        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept': 'application/json', 'User-Agent': 'ControlCentreApp/1.0' } }
          );
          
          if (response.ok) {
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const country = data.address?.country || "";
            setLocation(city && country ? `${city}, ${country}` : "Location detected");
          }
        } catch (error) {
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
      } catch (error) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            setLocation(data.city && data.country_name ? `${data.city}, ${data.country_name}` : "Location detected");
          } else {
            setLocation("Unavailable");
          }
        } catch (ipError) {
          setLocation("Unavailable");
        }
      }
    };

    detectLocation();
  }, []);

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });

        const { latitude, longitude } = position.coords;
        const apiKey = "bd5e378503939ddaee76f12ad7a97608";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeatherTemp(`${Math.round(data.main.temp)}°C`);
          setWeatherCondition(data.weather[0]?.description || "Clear");
        }
      } catch (error) {
        console.log("Weather fetch error:", error);
      }
    };

    fetchWeather();
  }, []);

  // Update Time and Date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      
      setCurrentTime(`${hours}:${minutes}`);
      
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      setCurrentDay(days[now.getDay()]);
      setDayNumber(String(now.getDate()).padStart(2, "0"));
      setMonthName(months[now.getMonth()]);
      setCurrentDate(`${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleReboot = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    toast({
      title: "Rebooting...",
      description: "All data cleared. Reloading...",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleTorchToggle = async () => {
    try {
      if (!torchSupported) {
        toast({
          title: "Flashlight not supported",
          description: "Your device doesn't have a torch",
          variant: "destructive",
        });
        return;
      }

      if (torchOn && videoTrackRef.current) {
        await videoTrackRef.current.applyConstraints({
          advanced: [{ torch: false }] as any
        });
        setTorchOn(false);
        
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
          videoTrackRef.current = null;
        }
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: "environment" },
          torch: true
        } as MediaTrackConstraints
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      videoTrackRef.current = track;

      const capabilities = track.getCapabilities();
      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: true }] as any
        });
        setTorchOn(true);
      } else {
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        videoTrackRef.current = null;
      }
    } catch (error: any) {
      console.error("Torch error:", error);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        videoTrackRef.current = null;
      }
      setTorchOn(false);
    }
  };

  const toggleRadioPlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingRadio(true);
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
        setIsLoadingRadio(false);
        toast({
          title: "Playback Error",
          description: "Unable to play radio stream",
          variant: "destructive",
        });
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      />

      {/* Control Centre Panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed inset-x-0 bottom-0 z-[101] max-w-[400px] mx-auto px-4 pb-6"
      >
        <div className="space-y-4">
          {/* Drag Handle */}
          <div className="w-12 h-1.5 rounded-full mx-auto mb-2" style={{ backgroundColor: config.secondaryTextColor }} />

          {/* Header Clock Widget */}
          <div style={neuInset} className="p-5 flex items-center justify-between">
            <div 
              className="px-6 py-2 flex items-center"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(4px)',
                borderRadius: '50px',
              }}
            >
              <span className="text-4xl font-bold" style={{ color: config.textColor }}>{currentTime}</span>
            </div>
            <div className="flex items-center space-x-3 text-right">
              <span className="text-4xl font-medium" style={{ color: config.textColor }}>{dayNumber}</span>
              <div className="text-xs leading-tight" style={{ color: config.secondaryTextColor }}>
                {currentDay}<br/>{monthName}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {config.showQuickActions && (
            <button 
              onClick={() => setShowGoogleSearch(true)}
              style={neuOutset} 
              className="w-full p-4 flex items-center justify-between px-6 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center space-x-1">
                <span className="text-[#4285F4] font-bold">G</span>
                <span className="text-[#EA4335] font-bold">o</span>
                <span className="text-[#FBBC05] font-bold">o</span>
                <span className="text-[#4285F4] font-bold">g</span>
                <span className="text-[#34A853] font-bold">l</span>
                <span className="text-[#EA4335] font-bold">e</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10 mx-2" />
              <Search className="w-4 h-4" style={{ color: config.secondaryTextColor }} />
            </button>
          )}

          {/* User Profile Card */}
          {config.showProfileCard && (
            <div style={neuOutset} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden p-1" style={neuInset}>
                  {config.profileImageUrl ? (
                    <img src={config.profileImageUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: config.textColor }}>{config.profileName}</h3>
                  <p className="text-[10px]" style={{ color: config.secondaryTextColor }}>{config.profileSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-[1px] bg-white/10 mx-4" />
                <div className="relative">
                  <Bell className="w-4 h-4" style={{ color: config.secondaryTextColor }} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2" style={{ borderColor: config.bgColor }} />
                </div>
              </div>
            </div>
          )}

          {/* Media & Weather Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Music Player */}
            {config.showMusicPlayer && (
              <div style={neuOutset} className="p-5 flex flex-col justify-between aspect-square">
                <div>
                  <h4 className="text-xs font-bold truncate" style={{ color: config.textColor }}>{RADIO_STATION_NAME}</h4>
                  <p className="text-[10px] mt-1" style={{ color: config.secondaryTextColor }}>Live Radio Stream</p>
                </div>
                
                <div className="w-full">
                  {/* Progress bar */}
                  <div style={neuInset} className="w-full h-[3px] mb-4 overflow-hidden rounded-full">
                    <div 
                      className="h-full transition-all duration-300" 
                      style={{ 
                        width: isPlaying ? '60%' : '0%',
                        backgroundColor: config.accentColor 
                      }} 
                    />
                  </div>
                  {/* Controls */}
                  <div className="flex justify-between items-center px-1">
                    <button className="active:scale-90 transition-transform">
                      <Volume2 className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </button>
                    <button 
                      onClick={toggleRadioPlayback}
                      disabled={isLoadingRadio}
                      className="active:scale-90 transition-transform disabled:opacity-50"
                    >
                      {isLoadingRadio ? (
                        <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: config.accentColor, borderTopColor: 'transparent' }} />
                      ) : isPlaying ? (
                        <Pause className="w-4 h-4" style={{ color: config.accentColor }} />
                      ) : (
                        <Play className="w-4 h-4" style={{ color: config.accentColor }} />
                      )}
                    </button>
                    <button className="active:scale-90 transition-transform">
                      <Radio className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Widget */}
            {config.showWeather && (
              <button 
                onClick={() => {
                  onOpenWeather();
                  onClose();
                }}
                style={neuOutset} 
                className="p-5 flex flex-col justify-between aspect-square text-left active:scale-95 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <Cloud className="text-blue-400 text-2xl w-8 h-8" />
                    <Sun className="text-yellow-400 text-xs w-3 h-3 absolute -top-1 -right-1" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: config.textColor }}>{weatherTemp}</div>
                    <div className="text-[8px] capitalize" style={{ color: config.secondaryTextColor }}>{weatherCondition}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" style={{ color: config.textColor }} />
                  <span className="text-[10px] font-medium truncate" style={{ color: config.textColor }}>{location}</span>
                </div>
              </button>
            )}
          </div>

          {/* Controls Grid */}
          <div style={neuOutset} className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {config.showTorch && (
                <button 
                  onClick={handleTorchToggle}
                  style={torchOn ? { ...neuBtn, ...neuBtnActive } : neuBtn}
                  className="w-12 h-12 mx-auto flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Flashlight 
                    className="w-4 h-4" 
                    style={{ color: torchOn ? config.accentColor : config.secondaryTextColor }} 
                  />
                </button>
              )}
              
              {config.showInfo && (
                <button 
                  onClick={() => {
                    onOpenInfo();
                    onClose();
                  }}
                  style={neuBtn}
                  className="w-12 h-12 mx-auto flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Settings className="w-4 h-4" style={{ color: config.secondaryTextColor }} />
                </button>
              )}

              <button 
                onClick={() => {
                  onOpenInfo();
                  onClose();
                }}
                style={neuBtn}
                className="w-12 h-12 mx-auto flex items-center justify-center active:scale-95 transition-transform"
              >
                <Info className="w-4 h-4" style={{ color: config.secondaryTextColor }} />
              </button>
              
              {config.showReboot && (
                <button 
                  onClick={handleReboot}
                  style={neuBtn}
                  className="w-12 h-12 mx-auto flex items-center justify-center active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" style={{ color: "#ef4444" }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Google Search Popup */}
      {showGoogleSearch && (
        <motion.div
          className="fixed inset-0 z-[102] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowGoogleSearch(false)} />
          <motion.div
            className="relative z-10 w-full max-w-[350px] rounded-2xl overflow-hidden"
            style={{ ...neuOutset, padding: "20px" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-[#4285F4] font-bold text-xl">G</span>
              <span className="text-[#EA4335] font-bold text-xl">o</span>
              <span className="text-[#FBBC05] font-bold text-xl">o</span>
              <span className="text-[#4285F4] font-bold text-xl">g</span>
              <span className="text-[#34A853] font-bold text-xl">l</span>
              <span className="text-[#EA4335] font-bold text-xl">e</span>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                  setShowGoogleSearch(false);
                  setSearchQuery("");
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google..."
                className="flex-1 px-4 py-3 rounded-xl text-sm"
                style={{ ...neuInset, color: config.textColor, background: config.bgColor }}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl active:scale-95 transition-transform"
                style={neuBtn}
              >
                <Search className="w-5 h-5" style={{ color: config.accentColor }} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* External Link Dialog */}
      {showExternalDialog && (
        <ExternalLinkDialog
          appName={showExternalDialog.app}
          onConfirm={() => {
            window.open(showExternalDialog.url, '_blank');
            setShowExternalDialog(null);
          }}
          onCancel={() => setShowExternalDialog(null)}
        />
      )}
    </>
  );
};

export default ControlCentre;
