import { useState, useEffect, useRef } from "react";
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
  Calendar,
  RefreshCw,
  Volume2,
  Radio
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

const RADIO_STREAM_URL = "https://radios.crabdance.com:8002/1";
const RADIO_STATION_NAME = "CrabDance Radio";

const ControlCentre = ({ isOpen, onClose, onOpenWeather, onOpenInfo }: ControlCentreProps) => {
  const [ipAddress, setIpAddress] = useState("Detecting...");
  const [isFetchingIp, setIsFetchingIp] = useState(false);
  const [location, setLocation] = useState("Detecting...");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [config, setConfig] = useState<ControlCentreConfig>(defaultConfig);
  const [isLoadingRadio, setIsLoadingRadio] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  
  const { toast } = useToast();

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
    loadConfig();
  }, []);

  // Helper to convert hex + opacity to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  // Check if torch is supported
  useEffect(() => {
    const checkTorchSupport = async () => {
      try {
        // Try to get user media to check for torch support
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { exact: "environment" } 
          } 
        });
        
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        
        // Check if torch is supported
        if ('torch' in capabilities) {
          setTorchSupported(true);
        }
        
        // Stop the stream immediately since we're just checking
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

  // IP Detection with multiple fallback services
  const detectIPAddress = async () => {
    if (isFetchingIp) return;
    
    setIsFetchingIp(true);
    
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.my-ip.io/v2/ip.json',
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service, {
          headers: {
            'Accept': 'application/json',
          },
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
    
    // WebRTC fallback
    try {
      const rtcPeerConnection = new (window.RTCPeerConnection || (window as any).webkitRTCPeerConnection)({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      
      rtcPeerConnection.createDataChannel('');
      const offer = await rtcPeerConnection.createOffer();
      await rtcPeerConnection.setLocalDescription(offer);
      
      const localIpRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
      const ipMatch = rtcPeerConnection.localDescription?.sdp?.match(localIpRegex);
      
      if (ipMatch && ipMatch[1]) {
        setIpAddress(ipMatch[1]);
      } else {
        setIpAddress("Unable to detect");
      }
    } catch (rtcError) {
      setIpAddress("Unable to detect");
    } finally {
      setIsFetchingIp(false);
    }
  };

  // Detect IP Address on mount
  useEffect(() => {
    detectIPAddress();
  }, []);

  // Manual IP refresh function
  const refreshIpAddress = () => {
    setIpAddress("Detecting...");
    detectIPAddress();
  };

  // Detect Location with improved error handling
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        setLocation("Geolocation not supported");
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
        
        const geocodingServices = [
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          `https://geocode.xyz/${latitude},${longitude}?json=1`,
        ];

        for (const service of geocodingServices) {
          try {
            const response = await fetch(service, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'ControlCentreApp/1.0'
              }
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            let locationText = "Location detected";
            if (service.includes('nominatim')) {
              const city = data.address?.city || data.address?.town || data.address?.village || "";
              const country = data.address?.country || "";
              locationText = city && country ? `${city}, ${country}` : "Location detected";
            } else if (service.includes('geocode.xyz')) {
              const city = data.city || data.region || "";
              const country = data.country || "";
              locationText = city && country ? `${city}, ${country}` : "Location detected";
            }
            
            setLocation(locationText);
            return;
          } catch (error) {
            console.log(`Failed to fetch location from ${service}:`, error);
          }
        }
        
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        
      } catch (error) {
        console.error("Geolocation error:", error);
        
        // Try IP-based location as fallback
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            const city = data.city || "";
            const country = data.country_name || "";
            setLocation(city && country ? `${city}, ${country}` : "Location detected");
          } else {
            setLocation("Location unavailable");
          }
        } catch (ipError) {
          setLocation("Location unavailable");
        }
      }
    };

    detectLocation();
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
      if (!torchSupported) {
        toast({
          title: "Flashlight not supported",
          description: "Your device doesn't have a torch or it's not accessible",
          variant: "destructive",
        });
        return;
      }

      // If torch is currently on, turn it off
      if (torchOn && videoTrackRef.current) {
        await videoTrackRef.current.applyConstraints({
          advanced: [{ torch: false }] as any
        });
        setTorchOn(false);
        
        // Stop the stream if we're turning off
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
          videoTrackRef.current = null;
        }
        
        toast({
          title: "Flashlight Off",
          description: "Torch has been turned off",
        });
        return;
      }

      // Get camera access for torch
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

      // Check if torch is available
      const capabilities = track.getCapabilities();
      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: true }] as any
        });
        setTorchOn(true);
        toast({
          title: "Flashlight On",
          description: "Torch has been activated",
        });
      } else {
        toast({
          title: "Flashlight not available",
          description: "Torch feature not found on camera",
          variant: "destructive",
        });
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        videoTrackRef.current = null;
      }
      
    } catch (error: any) {
      console.error("Torch error:", error);
      
      // Handle specific permission errors
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast({
          title: "Permission Required",
          description: "Please allow camera access to use the flashlight",
          variant: "destructive",
        });
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast({
          title: "Camera Not Found",
          description: "No rear camera found on this device",
          variant: "destructive",
        });
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast({
          title: "Camera in Use",
          description: "Camera is being used by another application",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Flashlight Error",
          description: error.message || "Unable to access flashlight",
          variant: "destructive",
        });
      }
      
      // Clean up on error
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
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const handleUploadSong = () => {
    setShowUploadDialog(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Feature Coming Soon",
        description: "Local file playback will be available in a future update",
      });
      setShowUploadDialog(false);
    }
  };

  const handleStreamLoad = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Custom stream URLs will be available in a future update",
    });
    setShowUploadDialog(false);
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

          {/* IP Address with Refresh */}
          <div 
            className="rounded-2xl p-3 md:p-4 mb-2 md:mb-3 flex items-center justify-between"
            style={cardStyle}
          >
            <div className="flex items-center gap-3 flex-1">
              <Globe className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.accentColor }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>IP Address</p>
                  {isFetchingIp && (
                    <div className="animate-spin">
                      <RefreshCw className="w-3 h-3" style={{ color: hexToRgba(config.textColor, 60) }} />
                    </div>
                  )}
                </div>
                <p className="text-base md:text-lg font-semibold" style={{ color: config.textColor }}>
                  {ipAddress}
                </p>
              </div>
            </div>
            <button
              onClick={refreshIpAddress}
              disabled={isFetchingIp}
              className="p-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: config.accentColor }}
              title="Refresh IP Address"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingIp ? 'animate-spin' : ''}`} />
            </button>
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

          {/* Radio Player */}
          <div 
            className="rounded-2xl p-3 md:p-4 mb-3 md:mb-4"
            style={cardStyle}
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: hexToRgba(config.accentColor, 20),
                  border: `1px solid ${hexToRgba(config.accentColor, 40)}`,
                  boxShadow: `0 0 20px ${hexToRgba(config.accentColor, 20)}`
                }}
              >
                <Radio className="w-6 h-6 md:w-8 md:h-8" style={{ color: config.accentColor }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-xs font-medium" style={{ color: hexToRgba(config.textColor, 80) }}>
                    {isPlaying ? "LIVE NOW" : "RADIO"}
                  </p>
                </div>
                <p className="text-base md:text-lg font-semibold mb-2" style={{ color: config.textColor }}>
                  {RADIO_STATION_NAME}
                </p>
                <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>
                  {RADIO_STREAM_URL.replace('https://', '')}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button 
                  onClick={toggleRadioPlayback}
                  disabled={isLoadingRadio}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: config.accentColor,
                    boxShadow: `0 4px 20px ${hexToRgba(config.accentColor, 40)}`
                  }}
                >
                  {isLoadingRadio ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4" style={{ color: hexToRgba(config.textColor, 60) }} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    accentColor: config.accentColor
                  }}
                />
                <span className="text-xs w-8 text-right" style={{ color: hexToRgba(config.textColor, 80) }}>
                  {volume}%
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span style={{ color: hexToRgba(config.textColor, 60) }}>
                  {isPlaying ? 'Streaming' : 'Paused'}
                </span>
              </div>
              <button 
                onClick={handleUploadSong}
                className="text-xs px-3 py-1 rounded-full transition hover:opacity-80"
                style={{ 
                  backgroundColor: hexToRgba(config.accentColor, 20),
                  color: config.accentColor,
                  border: `1px solid ${hexToRgba(config.accentColor, 30)}`
                }}
              >
                More Stations
              </button>
            </div>
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
                disabled={!torchSupported}
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  ...cardStyle,
                  boxShadow: torchOn ? `0 0 20px ${config.accentColor}40` : 'none'
                }}
              >
                <Flashlight className="w-5 h-5 md:w-6 md:h-6" style={{ 
                  color: torchOn ? config.accentColor : (torchSupported ? config.textColor : hexToRgba(config.textColor, 40))
                }} />
                <span className="text-xs" style={{ 
                  color: torchSupported ? hexToRgba(config.textColor, 80) : hexToRgba(config.textColor, 40)
                }}>
                  {torchSupported ? 'Torch' : 'No Torch'}
                </span>
              </button>
            )}
            {config.showWeather && (
              <button 
                onClick={() => {
                  onOpenWeather();
                  onClose();
                }}
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition hover:scale-105 active:scale-95"
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
                className="rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 transition hover:scale-105 active:scale-95"
                style={cardStyle}
              >
                <Info className="w-5 h-5 md:w-6 md:h-6" style={{ color: config.textColor }} />
                <span className="text-xs" style={{ color: hexToRgba(config.textColor, 80) }}>Info</span>
              </button>
            )}
            {config.showReboot && (
              <button 
                onClick={handleReboot}
                className="bg-red-500/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center gap-1 md:gap-2 hover:bg-red-600/80 transition border border-red-400/30 hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-xs text-white">Reboot</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upload/Stations Dialog */}
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
            style={{ backgroundColor: hexToRgba(config.panelBgColor, 95) }}
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: config.textColor }}>
              Radio Stations
            </h3>
            
            <div className="space-y-3 mb-4">
              <div 
                className="p-3 rounded-lg border transition cursor-pointer hover:scale-[1.02]"
                style={{ 
                  backgroundColor: hexToRgba(config.accentColor, 10),
                  borderColor: hexToRgba(config.accentColor, 30)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                    style={{ backgroundColor: hexToRgba(config.accentColor, 20) }}>
                    <Radio className="w-5 h-5" style={{ color: config.accentColor }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: config.textColor }}>{RADIO_STATION_NAME}</p>
                    <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>
                      Currently Playing
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border transition cursor-not-allowed opacity-50"
                style={{ 
                  backgroundColor: hexToRgba(config.cardBgColor, 20),
                  borderColor: hexToRgba(config.borderColor, 20)
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                    style={{ backgroundColor: hexToRgba(config.cardBgColor, 30) }}>
                    <Radio className="w-5 h-5" style={{ color: hexToRgba(config.textColor, 40) }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: hexToRgba(config.textColor, 40) }}>
                      More Stations Coming Soon
                    </p>
                    <p className="text-xs" style={{ color: hexToRgba(config.textColor, 30) }}>
                      Stay tuned for updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUploadSong}
                className="flex-1 py-2 px-4 rounded-lg transition text-sm md:text-base hover:opacity-90"
                style={{ 
                  backgroundColor: hexToRgba(config.accentColor, 20),
                  color: config.accentColor
                }}
              >
                Request Station
              </button>
              <button
                onClick={() => setShowUploadDialog(false)}
                className="flex-1 py-2 px-4 rounded-lg transition text-sm md:text-base hover:opacity-90"
                style={{ 
                  backgroundColor: hexToRgba(config.cardBgColor, 30),
                  color: config.textColor
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ControlCentre;
