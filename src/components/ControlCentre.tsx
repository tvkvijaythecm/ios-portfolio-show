import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { 
  X, 
  Flashlight, 
  Cloud, 
  Info, 
  RotateCcw, 
  Globe, 
  MapPin, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Upload,
  Clock,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ControlCentreProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWeather: () => void;
  onOpenInfo: () => void;
}

interface ControlCentreConfig {
  showTorch: boolean;
  showWeather: boolean;
  showInfo: boolean;
  showReboot: boolean;
  panelBgColor: string;
  panelBgOpacity: number;
  cardBgColor: string;
  cardBgOpacity: number;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

const defaultConfig: ControlCentreConfig = {
  showTorch: true,
  showWeather: true,
  showInfo: true,
  showReboot: true,
  panelBgColor: "#1f2937",
  panelBgOpacity: 40,
  cardBgColor: "#ffffff",
  cardBgOpacity: 30,
  accentColor: "#8b5cf6",
  textColor: "#ffffff",
  borderColor: "#ffffff",
};

const ControlCentre = ({ isOpen, onClose, onOpenWeather, onOpenInfo }: ControlCentreProps) => {
  const [ipAddress, setIpAddress] = useState("Detecting...");
  const [location, setLocation] = useState("Detecting...");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("No song loaded");
  const [torchOn, setTorchOn] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "stream">("file");
  const [config, setConfig] = useState<ControlCentreConfig>(defaultConfig);
  const { toast } = useToast();

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
    loadConfig();
  }, []);

  // Helper to convert hex + opacity to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  // Detect IP Address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress("Unable to detect"));
  }, []);

  // Detect Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "Unknown";
            const country = data.address.country || "Unknown";
            setLocation(`${city}, ${country}`);
          } catch {
            setLocation("Location detected");
          }
        },
        () => setLocation("Location unavailable")
      );
    } else {
      setLocation("Not supported");
    }
  }, []);

  // Update Time and Date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      
      setCurrentTime(`${displayHours}:${minutes}:${seconds} ${ampm}`);
      
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      setCurrentDay(days[now.getDay()]);
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
      description: "All data, cookies, and cache cleared. Reloading page...",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleTorchToggle = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as any]
        });
        setTorchOn(!torchOn);
      } else {
        toast({
          title: "Flashlight not available",
          description: "Your device doesn't support flashlight control",
        });
      }
    } catch {
      toast({
        title: "Flashlight error",
        description: "Unable to access flashlight. Please enable camera permissions.",
      });
    }
  };

  const handleUploadSong = () => {
    setShowUploadDialog(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSongTitle(file.name);
      setShowUploadDialog(false);
      toast({
        title: "Song uploaded",
        description: `${file.name} ready to play`,
      });
    }
  };

  const handleStreamLoad = () => {
    if (streamUrl) {
      setSongTitle(streamUrl.split('/').pop() || "Stream loaded");
      setShowUploadDialog(false);
      toast({
        title: "Stream loaded",
        description: "Ready to play",
      });
    }
  };

  if (!isOpen) return null;

  const cardStyle = {
    backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
    borderWidth: 1,
    borderColor: hexToRgba(config.borderColor, 20),
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
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
        className="fixed inset-x-0 bottom-0 z-[101] max-w-2xl mx-auto"
      >
        <div 
          className="rounded-t-3xl shadow-2xl p-4 md:p-6 pb-6 md:pb-8"
          style={{ 
            backgroundColor: hexToRgba(config.panelBgColor, config.panelBgOpacity),
            backdropFilter: 'blur(24px)',
            borderTop: `1px solid ${hexToRgba(config.borderColor, 20)}`
          }}
        >
          {/* Drag Handle */}
          <div 
            className="w-12 h-1.5 rounded-full mx-auto mb-4 md:mb-6" 
            style={{ backgroundColor: hexToRgba(config.textColor, 40) }}
          />

          {/* IP Address */}
          <div 
            className="rounded-2xl p-3 md:p-4 mb-2 md:mb-3 flex items-center gap-3"
            style={cardStyle}
          >
            <Globe className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.accentColor }} />
            <div>
              <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>IP Address</p>
              <p className="text-base md:text-lg font-semibold" style={{ color: config.textColor }}>{ipAddress}</p>
            </div>
          </div>

          {/* Location */}
          <div 
            className="rounded-2xl p-3 md:p-4 mb-3 md:mb-4 flex items-center gap-3"
            style={cardStyle}
          >
            <MapPin className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.accentColor }} />
            <div>
              <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>Location</p>
              <p className="text-base md:text-lg font-semibold" style={{ color: config.textColor }}>{location}</p>
            </div>
          </div>

          {/* Music Player */}
          <div 
            className="rounded-2xl p-3 md:p-4 mb-3 md:mb-4"
            style={cardStyle}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3">
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: hexToRgba(config.textColor, 10), border: `1px solid ${hexToRgba(config.borderColor, 20)}` }}
              >
                <span className="text-2xl md:text-4xl">🎵</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs md:text-sm mb-1" style={{ color: config.textColor }}>{songTitle}</p>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: hexToRgba(config.textColor, 20) }}>
                  <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: config.accentColor }} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-3">
              <button className="p-1.5 md:p-2 rounded-full transition" style={{ color: config.textColor }}>
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="p-1.5 md:p-2 rounded-full transition" style={{ color: config.textColor }}>
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 md:p-3 rounded-full transition"
                style={{ backgroundColor: config.accentColor, color: '#fff' }}
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              <button className="p-1.5 md:p-2 rounded-full transition" style={{ color: config.textColor }}>
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="p-1.5 md:p-2 rounded-full transition" style={{ color: config.textColor }}>
                <span className="text-sm">📺</span>
              </button>
            </div>
            <button 
              onClick={handleUploadSong}
              className="w-8 h-8 md:w-10 md:h-10 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto hover:bg-red-600 transition shadow-lg"
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
            <div 
              className="rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-3"
              style={cardStyle}
            >
              <Clock className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.accentColor }} />
              <div>
                <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>Time</p>
                <p className="text-sm md:text-base font-semibold" style={{ color: config.textColor }}>{currentTime}</p>
              </div>
            </div>
            <div 
              className="rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-3"
              style={cardStyle}
            >
              <Calendar className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.accentColor }} />
              <div>
                <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>{currentDay}</p>
                <p className="text-sm md:text-base font-semibold" style={{ color: config.textColor }}>{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {config.showTorch && (
              <button 
                onClick={handleTorchToggle}
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition"
                style={{ 
                  ...cardStyle,
                  boxShadow: torchOn ? `0 0 20px ${config.accentColor}40` : 'none'
                }}
              >
                <Flashlight className="w-5 h-5 md:w-6 md:h-6" style={{ color: torchOn ? config.accentColor : config.textColor }} />
                <span className="text-xs" style={{ color: hexToRgba(config.textColor, 80) }}>Torch</span>
              </button>
            )}
            {config.showWeather && (
              <button 
                onClick={() => {
                  onOpenWeather();
                  onClose();
                }}
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition"
                style={cardStyle}
              >
                <Cloud className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.textColor }} />
                <span className="text-xs" style={{ color: hexToRgba(config.textColor, 80) }}>Weather</span>
              </button>
            )}
            {config.showInfo && (
              <button 
                onClick={() => {
                  onOpenInfo();
                  onClose();
                }}
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition"
                style={cardStyle}
              >
                <Info className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.textColor }} />
                <span className="text-xs" style={{ color: hexToRgba(config.textColor, 80) }}>Info</span>
              </button>
            )}
            {config.showReboot && (
              <button 
                onClick={handleReboot}
                className="bg-red-500/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 hover:bg-red-600/80 transition border border-red-400/30"
              >
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-xs text-white">Reboot</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[102] flex items-center justify-center p-4"
          onClick={() => setShowUploadDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background/95 backdrop-blur-2xl rounded-2xl p-4 md:p-6 max-w-md w-full shadow-xl border border-white/20"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4">Load Music</h3>
            
            {/* Tab Selection */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadType("file")}
                className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
                  uploadType === "file"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setUploadType("stream")}
                className={`flex-1 py-2 px-3 md:px-4 rounded-lg transition text-sm md:text-base ${
                  uploadType === "stream"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Stream URL
              </button>
            </div>

            {uploadType === "file" ? (
              <div className="mb-4">
                <label className="block w-full p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition cursor-pointer text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload audio file</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Paste stream URL..."
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full p-3 bg-muted rounded-lg mb-4 outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                />
                <button
                  onClick={handleStreamLoad}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition mb-2 text-sm md:text-base"
                >
                  Load Stream
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowUploadDialog(false)}
              className="w-full bg-muted py-3 rounded-lg hover:bg-muted/80 transition text-sm md:text-base"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ControlCentre;
