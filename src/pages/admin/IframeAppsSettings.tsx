import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Calendar, Cloud, Globe, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";

interface IframeSettings {
  calendar_url: string;
  weather_url: string;
  goip_url: string;
  clock_url: string;
  suresh_url: string;
}

const IframeAppsSettings = () => {
  const [settings, setSettings] = useState<IframeSettings>({
    calendar_url: "",
    weather_url: "",
    goip_url: "",
    clock_url: "",
    suresh_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("key", "iframe_apps")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const value = data.value as unknown as IframeSettings;
        setSettings({
          calendar_url: value.calendar_url || "",
          weather_url: value.weather_url || "",
          goip_url: value.goip_url || "",
          clock_url: value.clock_url || "",
          suresh_url: value.suresh_url || "",
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
      const { data: existing } = await supabase
        .from("app_settings")
        .select("id")
        .eq("key", "iframe_apps")
        .maybeSingle();

      const jsonValue = JSON.parse(JSON.stringify(settings));
      
      if (existing) {
        const { error } = await supabase
          .from("app_settings")
          .update({ value: jsonValue })
          .eq("key", "iframe_apps");

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("app_settings")
          .insert([{ key: "iframe_apps", value: jsonValue }]);

        if (error) throw error;
      }

      toast.success("Iframe settings saved!");
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
    <div className="p-4 md:p-8">
      <AdminHeader title="Iframe Apps" description="Configure iframe URLs for Calendar, Weather, Clock, and Suresh apps" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Calendar App */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Calendar App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Iframe URL</Label>
                <Input
                  value={settings.calendar_url}
                  onChange={(e) => setSettings({ ...settings, calendar_url: e.target.value })}
                  placeholder="https://calendar.google.com/calendar/embed?src=..."
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Enter an iframe URL to embed an external calendar. App will show placeholder if empty.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weather App */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                Weather App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Iframe URL</Label>
                <Input
                  value={settings.weather_url}
                  onChange={(e) => setSettings({ ...settings, weather_url: e.target.value })}
                  placeholder="https://www.meteoblue.com/en/weather/widget/..."
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Enter an iframe URL to embed an external weather widget. App will show placeholder if empty.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clock App */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Clock App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Iframe URL</Label>
                <Input
                  value={settings.clock_url}
                  onChange={(e) => setSettings({ ...settings, clock_url: e.target.value })}
                  placeholder="https://www.timeanddate.com/worldclock/..."
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Enter an iframe URL to embed an external clock widget. App will show placeholder if empty.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suresh App */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Suresh App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Iframe URL</Label>
                <Input
                  value={settings.suresh_url}
                  onChange={(e) => setSettings({ ...settings, suresh_url: e.target.value })}
                  placeholder="https://your-portfolio-url.com"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Enter an iframe URL to embed external content. If empty, the built-in About content will be shown.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* GoIP App - Legacy */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                GoIP App (Legacy)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Iframe URL</Label>
                <Input
                  value={settings.goip_url}
                  onChange={(e) => setSettings({ ...settings, goip_url: e.target.value })}
                  placeholder="https://check.goip.my/"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Legacy setting. For new apps, use the "Other Apps" section instead.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default IframeAppsSettings;
