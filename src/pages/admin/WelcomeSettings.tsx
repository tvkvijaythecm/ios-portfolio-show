import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Bell, Check } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  duration: number;
}

const WelcomeSettings = () => {
  const [config, setConfig] = useState<WelcomeConfig>({
    enabled: true,
    text: "Hello",
    subtext: "Welcome to my portfolio",
    duration: 5000,
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
        .eq("key", "welcome")
        .maybeSingle();

      if (data?.value) {
        setConfig(data.value as unknown as WelcomeConfig);
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
        .eq("key", "welcome");

      if (error) throw error;
      toast.success("Welcome screen settings saved!");
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
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Screen</h2>
        <p className="text-white/60 mb-6">Customize the welcome animation and text</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Welcome Configuration
              </CardTitle>
              <CardDescription className="text-white/60">
                Set up the welcome screen appearance
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

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
                How the welcome screen will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] max-h-96 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex flex-col items-center justify-center">
                {config.enabled ? (
                  <>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Barkentina', sans-serif" }}
                    >
                      {config.text || "Hello"}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/80 text-sm"
                    >
                      {config.subtext || "Welcome"}
                    </motion.p>
                  </>
                ) : (
                  <p className="text-white/40">Welcome screen disabled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeSettings;
