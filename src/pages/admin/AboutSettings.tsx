import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Check } from "lucide-react";
import { motion } from "framer-motion";

interface AboutContent {
  id?: string;
  profile_image: string | null;
  name: string;
  title: string | null;
  followers: number | null;
  experience_years: number | null;
  about_text: string | null;
  skills: any[];
  technologies: any[];
  social_links: any[];
  carousel_images: any[];
}

const AboutSettings = () => {
  const [content, setContent] = useState<AboutContent>({
    profile_image: null,
    name: "Suresh",
    title: "UI/UX Designer",
    followers: 1200,
    experience_years: 5,
    about_text: "",
    skills: [],
    technologies: [],
    social_links: [],
    carousel_images: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .maybeSingle();

      if (data) {
        setContent({
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : [],
          technologies: Array.isArray(data.technologies) ? data.technologies : [],
          social_links: Array.isArray(data.social_links) ? data.social_links : [],
          carousel_images: Array.isArray(data.carousel_images) ? data.carousel_images : [],
        });
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (content.id) {
        const { error } = await supabase
          .from("about_content")
          .update(content)
          .eq("id", content.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("about_content")
          .insert(content);

        if (error) throw error;
      }

      toast.success("About content saved!");
      loadContent();
    } catch (error: any) {
      toast.error(error.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setContent({ ...content, profile_image: reader.result as string });
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
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">About Content</h2>
        <p className="text-white/60 mb-6">Manage your profile and about section</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-white/60">
                Basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white/10 border-white/20 text-white file:bg-purple-500 file:text-white file:border-0 file:rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Name</Label>
                <Input
                  value={content.name}
                  onChange={(e) => setContent({ ...content, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Title</Label>
                <Input
                  value={content.title || ""}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Followers</Label>
                  <Input
                    type="number"
                    value={content.followers || 0}
                    onChange={(e) => setContent({ ...content, followers: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Years Experience</Label>
                  <Input
                    type="number"
                    value={content.experience_years || 0}
                    onChange={(e) => setContent({ ...content, experience_years: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Text */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">About Me Text</CardTitle>
              <CardDescription className="text-white/60">
                Your bio and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">About Text</Label>
                <Textarea
                  value={content.about_text || ""}
                  onChange={(e) => setContent({ ...content, about_text: e.target.value })}
                  rows={6}
                  className="bg-white/10 border-white/20 text-white resize-none"
                  placeholder="Write about yourself..."
                />
              </div>

              {/* Preview */}
              {content.profile_image && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-2">Profile Preview</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={content.profile_image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">{content.name}</p>
                      <p className="text-white/60 text-sm">{content.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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

export default AboutSettings;
