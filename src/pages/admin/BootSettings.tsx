import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";

interface BootConfig {
  logo: string;
  duration: number;
  progressColor: string;
  backgroundColor: string;
  animationStyle: "fade" | "zoom" | "slide";
}

const ANIMATION_OPTIONS = [
  { value: "fade", label: "Fade" },
  { value: "zoom", label: "Zoom" },
  { value: "slide", label: "Slide Up" },
];

const BootSettings = () => {
  const [config, setConfig] = useState<BootConfig>({
    logo: "/assets/boot-logo.svg",
    duration: 3000,
    progressColor: "#ffffff",
    backgroundColor: "#000000",
    animationStyle: "fade",
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
        .eq("key", "boot")
        .maybeSingle();

      if (data?.value) {
        const val = data.value as unknown as BootConfig;
        setConfig({
          logo: val.logo || "/assets/boot-logo.svg",
          duration: val.duration || 3000,
          progressColor: val.progressColor || "#ffffff",
          backgroundColor: val.backgroundColor || "#000000",
          animationStyle: val.animationStyle || "fade",
        });
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
        .upsert({ 
          key: "boot",
          value: JSON.parse(JSON.stringify(config)),
          updated_at: new Date().toISOString()
        }, { onConflict: "key" });

      if (error) throw error;
      toast.success("Boot settings saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setConfig({ ...config, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const getAnimationProps = () => {
    switch (config.animationStyle) {
      case "zoom":
        return { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      case "slide":
        return { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
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
    <div className="p-4 md:p-8">
      <AdminHeader title="Boot Screen Settings" description="Customize the app loading screen" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Boot Configuration
              </CardTitle>
              <CardDescription className="text-white/60">
                Customize logo, duration, colors and animation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/80">Boot Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-white/10 border-white/20 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">
                  Duration: {(config.duration / 1000).toFixed(1)}s
                </Label>
                <Slider
                  value={[config.duration]}
                  onValueChange={([value]) => setConfig({ ...config, duration: value })}
                  min={1000}
                  max={10000}
                  step={500}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Animation Style</Label>
                <Select
                  value={config.animationStyle}
                  onValueChange={(value: "fade" | "zoom" | "slide") => setConfig({ ...config, animationStyle: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIMATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="w-16 h-10 p-1 bg-white/10 border-white/20"
                  />
                  <Input
                    type="text"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Progress Bar Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.progressColor}
                    onChange={(e) => setConfig({ ...config, progressColor: e.target.value })}
                    className="w-16 h-10 p-1 bg-white/10 border-white/20"
                  />
                  <Input
                    type="text"
                    value={config.progressColor}
                    onChange={(e) => setConfig({ ...config, progressColor: e.target.value })}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                </div>
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
                Boot screen appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="aspect-[9/16] max-h-96 rounded-2xl overflow-hidden border border-white/20 flex flex-col items-center justify-center gap-8"
                style={{ backgroundColor: config.backgroundColor }}
              >
                {config.logo && (
                  <motion.img
                    key={config.animationStyle}
                    src={config.logo}
                    alt="Boot logo"
                    className="w-24 h-24 object-contain"
                    {...getAnimationProps()}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
                <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${config.progressColor}33` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.progressColor }}
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default BootSettings;
