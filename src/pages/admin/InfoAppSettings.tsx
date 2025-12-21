import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Info, Settings2 } from "lucide-react";

interface InfoAppSettings {
  id: string;
  app_name: string;
  version: string;
  codebase: string;
  established_year: string;
  license: string;
  origin: string;
  privacy_label: string;
  license_label: string;
  logs_label: string;
  acknowledgements_label: string;
}

const InfoAppSettingsPage = () => {
  const [settings, setSettings] = useState<InfoAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("info_app_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings(data);
      } else {
        setSettings({
          id: "",
          app_name: "SNetOS",
          version: "1.5",
          codebase: "Javascript",
          established_year: "2024",
          license: "SNet Cloud Nexus",
          origin: "Kuala Lumpur, MY",
          privacy_label: "Privacy Policy",
          license_label: "GNU AGPLv3",
          logs_label: "System Logs",
          acknowledgements_label: "Acknowledgements",
        });
      }
    } catch (error) {
      console.error("Error loading info app settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      if (settings.id) {
        const { error } = await supabase
          .from("info_app_settings")
          .update({
            app_name: settings.app_name,
            version: settings.version,
            codebase: settings.codebase,
            established_year: settings.established_year,
            license: settings.license,
            origin: settings.origin,
            privacy_label: settings.privacy_label,
            license_label: settings.license_label,
            logs_label: settings.logs_label,
            acknowledgements_label: settings.acknowledgements_label,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("info_app_settings")
          .insert({
            app_name: settings.app_name,
            version: settings.version,
            codebase: settings.codebase,
            established_year: settings.established_year,
            license: settings.license,
            origin: settings.origin,
            privacy_label: settings.privacy_label,
            license_label: settings.license_label,
            logs_label: settings.logs_label,
            acknowledgements_label: settings.acknowledgements_label,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setSettings(data);
      }

      toast({
        title: "Success",
        description: "Info App settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Info App Settings"
        description="Manage the content displayed in the Info App"
      />

      {/* App Info Section */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">App Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white/70">App Name</Label>
            <Input
              value={settings?.app_name || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, app_name: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter app name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Version</Label>
            <Input
              value={settings?.version || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, version: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter version"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Codebase</Label>
            <Input
              value={settings?.codebase || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, codebase: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter codebase"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Established Year</Label>
            <Input
              value={settings?.established_year || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, established_year: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter year"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">License</Label>
            <Input
              value={settings?.license || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, license: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter license"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Origin</Label>
            <Input
              value={settings?.origin || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, origin: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter origin location"
            />
          </div>
        </div>
      </Card>

      {/* Menu Labels Section */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Settings2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Menu Labels</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white/70">Privacy Label</Label>
            <Input
              value={settings?.privacy_label || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, privacy_label: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter privacy menu label"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">License Label</Label>
            <Input
              value={settings?.license_label || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, license_label: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter license menu label"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Logs Label</Label>
            <Input
              value={settings?.logs_label || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, logs_label: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter logs menu label"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Acknowledgements Label</Label>
            <Input
              value={settings?.acknowledgements_label || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, acknowledgements_label: e.target.value } : null
                )
              }
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter acknowledgements menu label"
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Info App Settings"
        )}
      </Button>
    </div>
  );
};

export default InfoAppSettingsPage;
