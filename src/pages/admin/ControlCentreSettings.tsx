import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Check, Flashlight, Cloud, Info, RotateCcw, Palette, Globe, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ControlCentreConfig {
  showTorch: boolean;
  showWeather: boolean;
  showInfo: boolean;
  showReboot: boolean;
  // Color scheme
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
    { key: "showWeather", label: "Weather", icon: Cloud, description: "Open weather app" },
    { key: "showInfo", label: "Info", icon: Info, description: "Open info/settings app" },
    { key: "showReboot", label: "Reboot", icon: RotateCcw, description: "Reset app state" },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Helper to convert hex + opacity to rgba for preview
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Control Centre</h2>
            <p className="text-white/60 text-sm md:text-base">Configure buttons and color scheme</p>
          </div>
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
          {/* Button Visibility */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                <Settings className="w-5 h-5" />
                Button Visibility
              </CardTitle>
              <CardDescription className="text-white/60 text-sm">
                Enable or disable control centre buttons
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

          {/* Color Scheme */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                <Palette className="w-5 h-5" />
                Color Scheme
              </CardTitle>
              <CardDescription className="text-white/60 text-sm">
                Customize the control centre appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Panel Background */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Panel Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.panelBgColor}
                    onChange={(e) => setConfig({ ...config, panelBgColor: e.target.value })}
                    className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.panelBgOpacity}
                    onChange={(e) => setConfig({ ...config, panelBgOpacity: parseInt(e.target.value) || 0 })}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                    placeholder="Opacity %"
                  />
                </div>
              </div>

              {/* Card Background */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Card Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.cardBgColor}
                    onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                    className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.cardBgOpacity}
                    onChange={(e) => setConfig({ ...config, cardBgOpacity: parseInt(e.target.value) || 0 })}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                    placeholder="Opacity %"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Accent Color</Label>
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
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Text Color</Label>
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
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.borderColor}
                    onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                    className="w-12 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                  />
                  <Input
                    value={config.borderColor}
                    onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-white/5 border-white/10 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base md:text-lg">Live Preview</CardTitle>
              <CardDescription className="text-white/60 text-sm">
                Preview of your control centre design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="rounded-2xl p-4 md:p-6"
                style={{ 
                  backgroundColor: hexToRgba(config.panelBgColor, config.panelBgOpacity),
                  backdropFilter: 'blur(24px)'
                }}
              >
                {/* Drag Handle */}
                <div 
                  className="w-12 h-1.5 rounded-full mx-auto mb-4"
                  style={{ backgroundColor: hexToRgba(config.textColor, 40) }}
                />

                {/* Sample Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div 
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{ 
                      backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
                      borderWidth: 1,
                      borderColor: hexToRgba(config.borderColor, 20)
                    }}
                  >
                    <Globe className="w-5 h-5" style={{ color: config.accentColor }} />
                    <div>
                      <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>IP Address</p>
                      <p className="text-sm font-semibold" style={{ color: config.textColor }}>192.168.1.1</p>
                    </div>
                  </div>
                  <div 
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{ 
                      backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
                      borderWidth: 1,
                      borderColor: hexToRgba(config.borderColor, 20)
                    }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: config.accentColor }} />
                    <div>
                      <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>Location</p>
                      <p className="text-sm font-semibold" style={{ color: config.textColor }}>Kuala Lumpur</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div 
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{ 
                      backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
                      borderWidth: 1,
                      borderColor: hexToRgba(config.borderColor, 20)
                    }}
                  >
                    <Clock className="w-5 h-5" style={{ color: config.accentColor }} />
                    <div>
                      <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>Time</p>
                      <p className="text-sm font-semibold" style={{ color: config.textColor }}>12:30 PM</p>
                    </div>
                  </div>
                  <div 
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{ 
                      backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
                      borderWidth: 1,
                      borderColor: hexToRgba(config.borderColor, 20)
                    }}
                  >
                    <CalendarIcon className="w-5 h-5" style={{ color: config.accentColor }} />
                    <div>
                      <p className="text-xs" style={{ color: hexToRgba(config.textColor, 60) }}>Saturday</p>
                      <p className="text-sm font-semibold" style={{ color: config.textColor }}>07 Dec 2024</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Preview */}
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {toggleItems
                    .filter((item) => config[item.key as keyof ControlCentreConfig])
                    .map((item) => (
                      <div
                        key={item.key}
                        className="aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2"
                        style={{ 
                          backgroundColor: item.key === 'showReboot' 
                            ? 'rgba(239, 68, 68, 0.8)' 
                            : hexToRgba(config.cardBgColor, config.cardBgOpacity),
                          borderWidth: 1,
                          borderColor: item.key === 'showReboot' 
                            ? 'rgba(248, 113, 113, 0.3)' 
                            : hexToRgba(config.borderColor, 20)
                        }}
                      >
                        <item.icon 
                          className="w-4 h-4 md:w-5 md:h-5" 
                          style={{ color: item.key === 'showReboot' ? '#fff' : config.textColor }} 
                        />
                        <span 
                          className="text-[10px] md:text-xs" 
                          style={{ color: item.key === 'showReboot' ? '#fff' : hexToRgba(config.textColor, 80) }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ControlCentreSettings;
