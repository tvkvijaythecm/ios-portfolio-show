import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Bell, Check, Palette, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  duration: number;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

interface NotificationConfig {
  enabled: boolean;
  name: string;
  message: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

const WelcomeSettings = () => {
  const [config, setConfig] = useState<WelcomeConfig>({
    enabled: true,
    text: "Hello",
    subtext: "Welcome to my portfolio",
    duration: 5000,
    gradientFrom: "#2563eb",
    gradientVia: "#9333ea",
    gradientTo: "#f97316",
  });
  
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    enabled: true,
    name: "John Smith",
    message: "Welcome! Hope you're having a great day.",
    gradientFrom: "#2563eb",
    gradientVia: "#9333ea",
    gradientTo: "#f97316",
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [welcomeRes, notificationRes] = await Promise.all([
        supabase.from("app_settings").select("value").eq("key", "welcome").maybeSingle(),
        supabase.from("app_settings").select("value").eq("key", "welcome_notification").maybeSingle(),
      ]);

      if (welcomeRes.data?.value) {
        setConfig({ ...config, ...(welcomeRes.data.value as unknown as WelcomeConfig) });
      }
      if (notificationRes.data?.value) {
        setNotificationConfig({ ...notificationConfig, ...(notificationRes.data.value as unknown as NotificationConfig) });
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
      // Upsert welcome settings
      const { error: welcomeError } = await supabase
        .from("app_settings")
        .upsert({ 
          key: "welcome", 
          value: JSON.parse(JSON.stringify(config)) 
        }, { onConflict: "key" });

      if (welcomeError) throw welcomeError;

      // Upsert notification settings
      const { error: notificationError } = await supabase
        .from("app_settings")
        .upsert({ 
          key: "welcome_notification", 
          value: JSON.parse(JSON.stringify(notificationConfig)) 
        }, { onConflict: "key" });

      if (notificationError) throw notificationError;

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Settings</h2>
        <p className="text-white/60 mb-6">Customize welcome screen and notification</p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Welcome Screen Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Welcome Screen
              </CardTitle>
              <CardDescription className="text-white/60">
                Configure the welcome animation screen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Enable Welcome Screen</Label>
                  <p className="text-white/40 text-sm">Show welcome animation on app load</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Main Text</Label>
                <Input
                  value={config.text}
                  onChange={(e) => setConfig({ ...config, text: e.target.value })}
                  placeholder="Hello"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Subtext</Label>
                <Input
                  value={config.subtext}
                  onChange={(e) => setConfig({ ...config, subtext: e.target.value })}
                  placeholder="Welcome to my portfolio"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">
                  Duration: {(config.duration / 1000).toFixed(1)}s
                </Label>
                <Slider
                  value={[config.duration]}
                  onValueChange={([value]) => setConfig({ ...config, duration: value })}
                  min={2000}
                  max={10000}
                  step={500}
                  className="py-2"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white/80">Gradient Colors</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">From</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.gradientFrom}
                        onChange={(e) => setConfig({ ...config, gradientFrom: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={config.gradientFrom}
                        onChange={(e) => setConfig({ ...config, gradientFrom: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Via</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.gradientVia}
                        onChange={(e) => setConfig({ ...config, gradientVia: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={config.gradientVia}
                        onChange={(e) => setConfig({ ...config, gradientVia: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">To</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.gradientTo}
                        onChange={(e) => setConfig({ ...config, gradientTo: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={config.gradientTo}
                        onChange={(e) => setConfig({ ...config, gradientTo: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Screen Preview */}
              <div className="space-y-2">
                <Label className="text-white/80">Preview</Label>
                <div 
                  className="aspect-[9/16] max-h-48 rounded-xl overflow-hidden border border-white/20 flex flex-col items-center justify-center"
                  style={{
                    background: `linear-gradient(to bottom right, ${config.gradientFrom}, ${config.gradientVia}, ${config.gradientTo})`
                  }}
                >
                  {config.enabled ? (
                    <>
                      <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Barkentina', sans-serif" }}>
                        {config.text || "Hello"}
                      </p>
                      <p className="text-white/80 text-xs">
                        {config.subtext || "Welcome"}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/40 text-sm">Disabled</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Welcome Notification
              </CardTitle>
              <CardDescription className="text-white/60">
                Configure the notification that appears after home screen loads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Enable Notification</Label>
                  <p className="text-white/40 text-sm">Show welcome notification popup</p>
                </div>
                <Switch
                  checked={notificationConfig.enabled}
                  onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Name</Label>
                <Input
                  value={notificationConfig.name}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, name: e.target.value })}
                  placeholder="John Smith"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Message</Label>
                <Input
                  value={notificationConfig.message}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, message: e.target.value })}
                  placeholder="Welcome! Hope you're having a great day."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white/80">Gradient Colors</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">From</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={notificationConfig.gradientFrom}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientFrom: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={notificationConfig.gradientFrom}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientFrom: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Via</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={notificationConfig.gradientVia}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientVia: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={notificationConfig.gradientVia}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientVia: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">To</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={notificationConfig.gradientTo}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientTo: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={notificationConfig.gradientTo}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, gradientTo: e.target.value })}
                        className="bg-white/10 border-white/20 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preview */}
              <div className="space-y-2">
                <Label className="text-white/80">Preview</Label>
                <div 
                  className="rounded-2xl p-4 flex items-start gap-3"
                  style={{
                    background: `linear-gradient(to bottom right, ${notificationConfig.gradientFrom}e6, ${notificationConfig.gradientVia}e6, ${notificationConfig.gradientTo}e6)`
                  }}
                >
                  <span className="text-xs text-white/70 font-medium pt-0.5">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">
                      {notificationConfig.name || "Name"}
                    </div>
                    <div className="text-white/70 text-xs">
                      {notificationConfig.message || "Message"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {saving ? "Saving..." : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeSettings;
