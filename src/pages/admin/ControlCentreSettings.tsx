import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Settings, 
  Check, 
  Flashlight, 
  Cloud, 
  Info, 
  RotateCcw, 
  Palette,
  User,
  Music,
  Zap,
  Eye,
  Phone,
  Mail,
  Search,
  Bell,
  MessageCircle,
  Play,
  Pause,
  MapPin,
  Sun
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

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

const ControlCentreSettings = () => {
  const [config, setConfig] = useState<ControlCentreConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
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
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const jsonValue = JSON.parse(JSON.stringify(config));
      
      const { data: existing } = await supabase
        .from("app_settings")
        .select("id")
        .eq("key", "control_centre")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("app_settings")
          .update({ value: jsonValue })
          .eq("key", "control_centre");

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("app_settings")
          .insert([{ key: "control_centre", value: jsonValue }]);

        if (error) throw error;
      }

      toast.success("Control Centre settings saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleItems = [
    { key: "showTorch", label: "Flashlight", icon: Flashlight, description: "Toggle device flashlight" },
    { key: "showWeather", label: "Weather Widget", icon: Cloud, description: "Show weather card" },
    { key: "showInfo", label: "Settings Button", icon: Info, description: "Open info/settings app" },
    { key: "showReboot", label: "Reboot Button", icon: RotateCcw, description: "Reset app state" },
    { key: "showMusicPlayer", label: "Music Player", icon: Music, description: "Radio/music player widget" },
    { key: "showQuickActions", label: "Quick Actions", icon: Zap, description: "Search bar & quick buttons" },
    { key: "showProfileCard", label: "Profile Card", icon: User, description: "User profile widget" },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Neumorphic style helpers for preview
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
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <AdminHeader title="Control Centre" description="Configure neumorphic dashboard design" />
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto"
        >
          <Check className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Widget Visibility */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <Eye className="w-5 h-5" />
              Widget Visibility
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Show or hide control centre widgets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {toggleItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
                  </div>
                  <div>
                    <Label className="text-white text-sm">{item.label}</Label>
                    <p className="text-white/40 text-xs hidden sm:block">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={config[item.key as keyof ControlCentreConfig] as boolean}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <User className="w-5 h-5" />
              Profile Card Settings
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Customize the profile widget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Profile Name</Label>
              <Input
                value={config.profileName}
                onChange={(e) => setConfig({ ...config, profileName: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Subtitle</Label>
              <Input
                value={config.profileSubtitle}
                onChange={(e) => setConfig({ ...config, profileSubtitle: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., Phone customization"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Profile Image URL</Label>
              <Input
                value={config.profileImageUrl}
                onChange={(e) => setConfig({ ...config, profileImageUrl: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com/avatar.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Neumorphic Colors */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
              <Palette className="w-5 h-5" />
              Neumorphic Colors
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Customize the dark neumorphic theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Background Color */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                  className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                />
                <Input
                  value={config.bgColor}
                  onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                  className="flex-1 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Accent Color (Active state)</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                />
                <Input
                  value={config.accentColor}
                  onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                  className="flex-1 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Primary Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                  className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                  className="flex-1 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Secondary Text Color */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Secondary Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.secondaryTextColor}
                  onChange={(e) => setConfig({ ...config, secondaryTextColor: e.target.value })}
                  className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                />
                <Input
                  value={config.secondaryTextColor}
                  onChange={(e) => setConfig({ ...config, secondaryTextColor: e.target.value })}
                  className="flex-1 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Shadow Light */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Light Shadow</Label>
              <Input
                value={config.shadowLight}
                onChange={(e) => setConfig({ ...config, shadowLight: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="rgba(255, 255, 255, 0.03)"
              />
            </div>

            {/* Shadow Dark */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Dark Shadow</Label>
              <Input
                value={config.shadowDark}
                onChange={(e) => setConfig({ ...config, shadowDark: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="rgba(0, 0, 0, 0.6)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base md:text-lg">Live Preview</CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Neumorphic dashboard preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 rounded-2xl" style={{ backgroundColor: config.bgColor }}>
              
              {/* Clock Widget Preview */}
              <div style={neuInset} className="p-4 flex items-center justify-between">
                <div 
                  className="px-4 py-2 flex items-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '50px',
                  }}
                >
                  <span className="text-2xl font-bold" style={{ color: config.textColor }}>11:32</span>
                </div>
                <div className="flex items-center space-x-2 text-right">
                  <span className="text-2xl font-medium" style={{ color: config.textColor }}>02</span>
                  <div className="text-[10px] leading-tight" style={{ color: config.secondaryTextColor }}>
                    Wed<br/>Sept
                  </div>
                </div>
              </div>

              {/* Quick Actions Preview */}
              {config.showQuickActions && (
                <div className="flex space-x-3">
                  <div style={neuOutset} className="flex-grow p-3 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-0.5 text-xs">
                      <span className="text-[#4285F4] font-bold">G</span>
                      <span className="text-[#EA4335] font-bold">o</span>
                      <span className="text-[#FBBC05] font-bold">o</span>
                      <span className="text-[#4285F4] font-bold">g</span>
                      <span className="text-[#34A853] font-bold">l</span>
                      <span className="text-[#EA4335] font-bold">e</span>
                    </div>
                    <Search className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                  </div>
                  <div className="flex space-x-2">
                    <div style={neuBtn} className="w-10 h-10 rounded-full flex items-center justify-center">
                      <Phone className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </div>
                    <div style={neuBtn} className="w-10 h-10 rounded-full flex items-center justify-center">
                      <Mail className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Card Preview */}
              {config.showProfileCard && (
                <div style={neuOutset} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden p-0.5" style={neuInset}>
                      <img 
                        src={config.profileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold" style={{ color: config.textColor }}>{config.profileName}</h3>
                      <p className="text-[8px]" style={{ color: config.secondaryTextColor }}>{config.profileSubtitle}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Bell className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                </div>
              )}

              {/* Media & Weather Preview */}
              <div className="grid grid-cols-2 gap-3">
                {config.showMusicPlayer && (
                  <div style={neuOutset} className="p-3 flex flex-col justify-between aspect-square">
                    <div>
                      <h4 className="text-[10px] font-bold truncate" style={{ color: config.textColor }}>CrabDance Radio</h4>
                      <p className="text-[8px]" style={{ color: config.secondaryTextColor }}>Live Stream</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: config.accentColor }}>
                        <Play className="w-3 h-3 text-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {config.showWeather && (
                  <div style={neuOutset} className="p-3 flex flex-col justify-between aspect-square">
                    <div className="flex items-start justify-between">
                      <Cloud className="text-blue-400 w-5 h-5" />
                      <div className="text-right">
                        <div className="text-[10px] font-bold" style={{ color: config.textColor }}>21°C</div>
                        <div className="text-[8px]" style={{ color: config.secondaryTextColor }}>Cloudy</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-2 h-2" style={{ color: config.textColor }} />
                      <span className="text-[8px]" style={{ color: config.textColor }}>Location</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Buttons Preview */}
              <div style={neuOutset} className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {config.showTorch && (
                    <div style={neuBtn} className="w-10 h-10 mx-auto rounded-full flex items-center justify-center">
                      <Flashlight className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </div>
                  )}
                  {config.showInfo && (
                    <div style={neuBtn} className="w-10 h-10 mx-auto rounded-full flex items-center justify-center">
                      <Settings className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                    </div>
                  )}
                  <div style={neuBtn} className="w-10 h-10 mx-auto rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3" style={{ color: config.secondaryTextColor }} />
                  </div>
                  {config.showReboot && (
                    <div style={neuBtn} className="w-10 h-10 mx-auto rounded-full flex items-center justify-center">
                      <RotateCcw className="w-3 h-3" style={{ color: "#ef4444" }} />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlCentreSettings;
