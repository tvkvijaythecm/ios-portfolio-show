import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Check, Flashlight, Cloud, Info, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ControlCentreConfig {
  showTorch: boolean;
  showWeather: boolean;
  showInfo: boolean;
  showReboot: boolean;
}

const ControlCentreSettings = () => {
  const [config, setConfig] = useState<ControlCentreConfig>({
    showTorch: true,
    showWeather: true,
    showInfo: true,
    showReboot: true,
  });
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
        setConfig(data.value as unknown as ControlCentreConfig);
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
      const { error } = await supabase
        .from("app_settings")
        .update({ value: JSON.parse(JSON.stringify(config)) })
        .eq("key", "control_centre");

      if (error) throw error;
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
        <h2 className="text-2xl font-bold text-white mb-2">Control Centre</h2>
        <p className="text-white/60 mb-6">Configure which buttons appear in the control centre</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Button Visibility
              </CardTitle>
              <CardDescription className="text-white/60">
                Enable or disable control centre buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {toggleItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <Label className="text-white">{item.label}</Label>
                      <p className="text-white/40 text-xs">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={config[item.key as keyof ControlCentreConfig]}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, [item.key]: checked })
                    }
                  />
                </div>
              ))}

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {saving ? "Saving..." : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
              <CardDescription className="text-white/60">
                Active control centre buttons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {toggleItems
                  .filter((item) => config[item.key as keyof ControlCentreConfig])
                  .map((item) => (
                    <div
                      key={item.key}
                      className="aspect-square rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col items-center justify-center gap-2"
                    >
                      <item.icon className="w-6 h-6 text-white/80" />
                      <span className="text-white/60 text-xs">{item.label}</span>
                    </div>
                  ))}
                {toggleItems.filter((item) => config[item.key as keyof ControlCentreConfig]).length === 0 && (
                  <div className="col-span-2 py-8 text-center text-white/40">
                    No buttons enabled
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ControlCentreSettings;
