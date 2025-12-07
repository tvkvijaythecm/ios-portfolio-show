import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Facebook, Instagram, Music, Twitter, Save } from "lucide-react";

interface SocialLinks {
  id: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  x_twitter_url: string | null;
}

const SocialLinksSettings = () => {
  const [settings, setSettings] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("social_links")
        .update({
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          tiktok_url: settings.tiktok_url,
          x_twitter_url: settings.x_twitter_url,
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Social links saved");
    } catch (error) {
      toast.error("Failed to save social links");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Social Links</h2>
        <p className="text-white/60">Manage social media URLs for the Social app in dock</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <Facebook className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Facebook</h3>
              <p className="text-white/40 text-sm">Your Facebook profile URL</p>
            </div>
          </div>
          <Input
            value={settings?.facebook_url || ""}
            onChange={(e) => setSettings({ ...settings!, facebook_url: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="https://facebook.com/username"
          />
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Instagram</h3>
              <p className="text-white/40 text-sm">Your Instagram profile URL</p>
            </div>
          </div>
          <Input
            value={settings?.instagram_url || ""}
            onChange={(e) => setSettings({ ...settings!, instagram_url: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="https://instagram.com/username"
          />
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">TikTok</h3>
              <p className="text-white/40 text-sm">Your TikTok profile URL</p>
            </div>
          </div>
          <Input
            value={settings?.tiktok_url || ""}
            onChange={(e) => setSettings({ ...settings!, tiktok_url: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="https://tiktok.com/@username"
          />
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">X (Twitter)</h3>
              <p className="text-white/40 text-sm">Your X profile URL</p>
            </div>
          </div>
          <Input
            value={settings?.x_twitter_url || ""}
            onChange={(e) => setSettings({ ...settings!, x_twitter_url: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="https://x.com/username"
          />
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Social Links"}
        </Button>
      </div>
    </div>
  );
};

export default SocialLinksSettings;
