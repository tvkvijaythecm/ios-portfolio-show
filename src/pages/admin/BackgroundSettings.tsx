import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Image, Upload, Link, Check } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

const BackgroundSettings = () => {
  const [bgType, setBgType] = useState<"image" | "url">("image");
  const [bgValue, setBgValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "background")
        .maybeSingle();

      if (data?.value) {
        const value = data.value as { type: string; value: string };
        setBgType(value.type as "image" | "url");
        setBgValue(value.value);
        setPreviewUrl(value.value);
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
        .update({ value: { type: bgType, value: bgValue } })
        .eq("key", "background");

      if (error) throw error;
      toast.success("Background settings saved!");
      setPreviewUrl(bgValue);
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, convert to base64 (in production, upload to Supabase Storage)
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBgValue(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
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
      <AdminHeader title="Background Settings" description="Customize the homescreen wallpaper" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image className="w-5 h-5" />
                Background Source
              </CardTitle>
              <CardDescription className="text-white/60">
                Choose how to set your background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={bgType === "image" ? "default" : "outline"}
                  onClick={() => setBgType("image")}
                  className={bgType === "image" ? "bg-purple-500 hover:bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant={bgType === "url" ? "default" : "outline"}
                  onClick={() => setBgType("url")}
                  className={bgType === "url" ? "bg-purple-500 hover:bg-purple-600" : "border-white/20 text-white hover:bg-white/10"}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Image URL
                </Button>
              </div>

              {bgType === "image" ? (
                <div className="space-y-2">
                  <Label className="text-white/80">Upload Background</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="bg-white/10 border-white/20 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-white/80">Image URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={bgValue}
                    onChange={(e) => {
                      setBgValue(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={saving || !bgValue}
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
                How the background will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] max-h-96 rounded-2xl overflow-hidden border border-white/20 bg-slate-800">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewUrl("")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    No preview available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default BackgroundSettings;
