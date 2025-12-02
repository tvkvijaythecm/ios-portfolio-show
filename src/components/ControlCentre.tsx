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

interface ControlCentreProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWeather: () => void;
  onOpenInfo: () => void;
}

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
  const { toast } = useToast();

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
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
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
        <div className="bg-background/95 backdrop-blur-2xl rounded-t-3xl shadow-2xl border-t border-border/50 p-6 pb-8">
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

          {/* IP Address */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-3 flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">IP Address</p>
              <p className="text-lg font-semibold">{ipAddress}</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{location}</p>
            </div>
          </div>

          {/* Music Player */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center border border-border">
                <span className="text-4xl">🎵</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{songTitle}</p>
                <div className="h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-primary rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mb-3">
              <button className="p-2 hover:bg-background rounded-full transition">
                <X className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-background rounded-full transition">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="p-2 hover:bg-background rounded-full transition">
                <SkipForward className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-background rounded-full transition">
                <span className="text-sm">📺</span>
              </button>
            </div>
            <button 
              onClick={handleUploadSong}
              className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto hover:bg-red-600 transition shadow-lg"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-base font-semibold">{currentTime}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{currentDay}</p>
                <p className="text-base font-semibold">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={handleTorchToggle}
              className={`bg-background rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition ${torchOn ? 'ring-2 ring-primary' : ''}`}
            >
              <Flashlight className={`w-6 h-6 ${torchOn ? 'text-primary' : ''}`} />
              <span className="text-xs">Torch</span>
            </button>
            <button 
              onClick={() => {
                onOpenWeather();
                onClose();
              }}
              className="bg-background rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition"
            >
              <Cloud className="w-6 h-6" />
              <span className="text-xs">Weather</span>
            </button>
            <button 
              onClick={() => {
                onOpenInfo();
                onClose();
              }}
              className="bg-background rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition"
            >
              <Info className="w-6 h-6" />
              <span className="text-xs">Info</span>
            </button>
            <button 
              onClick={handleReboot}
              className="bg-background rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-destructive/10 transition"
            >
              <RotateCcw className="w-6 h-6" />
              <span className="text-xs">Reboot</span>
            </button>
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
            className="bg-background rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Load Music</h3>
            <input
              type="text"
              placeholder="Paste stream URL..."
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full p-3 bg-muted rounded-lg mb-4 outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={handleStreamLoad}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition"
              >
                Load Stream
              </button>
              <button
                onClick={() => setShowUploadDialog(false)}
                className="px-6 bg-muted py-3 rounded-lg hover:bg-muted/80 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ControlCentre;
