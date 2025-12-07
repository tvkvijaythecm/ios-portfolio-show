import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Globe, FileText, Hash, Image, Link, Search } from "lucide-react";
import { motion } from "framer-motion";

interface SiteSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  robots: string;
  author: string;
  theme_color: string;
}

const defaultSettings: SiteSettings = {
  site_title: "",
  site_description: "",
  site_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_card: "summary_large_image",
  twitter_title: "",
  twitter_description: "",
  twitter_image: "",
  canonical_url: "",
  robots: "index, follow",
  author: "",
  theme_color: "#667EEA",
};

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
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
        .eq("key", "site_seo")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const value = data.value as unknown as SiteSettings;
        setSettings({
          ...defaultSettings,
          ...value,
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
      const jsonValue = JSON.parse(JSON.stringify(settings));
      
      const { data: existing } = await supabase
        .from("app_settings")
        .select("id")
        .eq("key", "site_seo")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("app_settings")
          .update({ value: jsonValue })
          .eq("key", "site_seo");

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("app_settings")
          .insert([{ key: "site_seo", value: jsonValue }]);

        if (error) throw error;
      }

      toast.success("Site settings saved!");
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Site Settings & SEO</h2>
            <p className="text-white/60">Configure site metadata and SEO settings</p>
          </div>
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
          {/* Basic Site Info */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Basic Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Site Title</Label>
                <Input
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  placeholder="My Portfolio - Creative Developer"
                  className="bg-white/10 border-white/20 text-white"
                  maxLength={60}
                />
                <p className="text-white/40 text-xs">
                  {settings.site_title.length}/60 characters (recommended max for search results)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Site Description</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="A creative developer portfolio showcasing innovative web projects and designs."
                  className="bg-white/10 border-white/20 text-white resize-none"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-white/40 text-xs">
                  {settings.site_description.length}/160 characters (recommended max for search results)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Keywords / Tags</Label>
                <Input
                  value={settings.site_keywords}
                  onChange={(e) => setSettings({ ...settings, site_keywords: e.target.value })}
                  placeholder="portfolio, developer, web design, react, creative"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Comma-separated keywords for search engines
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Author</Label>
                <Input
                  value={settings.author}
                  onChange={(e) => setSettings({ ...settings, author: e.target.value })}
                  placeholder="Your Name"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Open Graph (Social Sharing) */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Open Graph (Facebook, LinkedIn)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">OG Title</Label>
                <Input
                  value={settings.og_title}
                  onChange={(e) => setSettings({ ...settings, og_title: e.target.value })}
                  placeholder="Leave empty to use site title"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">OG Description</Label>
                <Textarea
                  value={settings.og_description}
                  onChange={(e) => setSettings({ ...settings, og_description: e.target.value })}
                  placeholder="Leave empty to use site description"
                  className="bg-white/10 border-white/20 text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">OG Image URL</Label>
                <Input
                  value={settings.og_image}
                  onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                  placeholder="https://example.com/og-image.jpg"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  Recommended size: 1200x630 pixels
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Twitter Card */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                Twitter Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Card Type</Label>
                <select
                  value={settings.twitter_card}
                  onChange={(e) => setSettings({ ...settings, twitter_card: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="summary" className="bg-slate-800">Summary</option>
                  <option value="summary_large_image" className="bg-slate-800">Summary Large Image</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Twitter Title</Label>
                <Input
                  value={settings.twitter_title}
                  onChange={(e) => setSettings({ ...settings, twitter_title: e.target.value })}
                  placeholder="Leave empty to use OG/site title"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Twitter Description</Label>
                <Textarea
                  value={settings.twitter_description}
                  onChange={(e) => setSettings({ ...settings, twitter_description: e.target.value })}
                  placeholder="Leave empty to use OG/site description"
                  className="bg-white/10 border-white/20 text-white resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Twitter Image URL</Label>
                <Input
                  value={settings.twitter_image}
                  onChange={(e) => setSettings({ ...settings, twitter_image: e.target.value })}
                  placeholder="Leave empty to use OG image"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced SEO */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                Advanced SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Canonical URL</Label>
                <Input
                  value={settings.canonical_url}
                  onChange={(e) => setSettings({ ...settings, canonical_url: e.target.value })}
                  placeholder="https://yourdomain.com"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/40 text-xs">
                  The preferred URL for this page (helps prevent duplicate content issues)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Robots Meta</Label>
                <select
                  value={settings.robots}
                  onChange={(e) => setSettings({ ...settings, robots: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="index, follow" className="bg-slate-800">Index, Follow (Recommended)</option>
                  <option value="index, nofollow" className="bg-slate-800">Index, No Follow</option>
                  <option value="noindex, follow" className="bg-slate-800">No Index, Follow</option>
                  <option value="noindex, nofollow" className="bg-slate-800">No Index, No Follow</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Theme Color</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={settings.theme_color}
                    onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                    className="w-16 h-10 p-1 bg-white/10 border-white/20 rounded-md cursor-pointer"
                  />
                  <Input
                    value={settings.theme_color}
                    onChange={(e) => setSettings({ ...settings, theme_color: e.target.value })}
                    placeholder="#667EEA"
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <p className="text-white/40 text-xs">
                  Browser theme color for mobile devices
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteSettingsPage;
