import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, EyeOff, Video } from "lucide-react";

interface VideoItem {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

const defaultVideo: Partial<VideoItem> = {
  title: "",
  video_url: "",
  thumbnail_url: "",
  sort_order: 0,
  is_visible: true,
};

const VideosSettings = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingVideo?.video_url) {
      toast.error("Video URL is required");
      return;
    }

    setSaving(true);
    try {
      if (editingVideo.id) {
        const { error } = await supabase
          .from("videos")
          .update({
            title: editingVideo.title,
            video_url: editingVideo.video_url,
            thumbnail_url: editingVideo.thumbnail_url,
            sort_order: editingVideo.sort_order,
            is_visible: editingVideo.is_visible,
          })
          .eq("id", editingVideo.id);

        if (error) throw error;
        toast.success("Video updated");
      } else {
        const { error } = await supabase.from("videos").insert({
          title: editingVideo.title,
          video_url: editingVideo.video_url,
          thumbnail_url: editingVideo.thumbnail_url,
          sort_order: editingVideo.sort_order,
          is_visible: editingVideo.is_visible,
        });

        if (error) throw error;
        toast.success("Video added");
      }

      setDialogOpen(false);
      setEditingVideo(null);
      loadVideos();
    } catch (error) {
      toast.error("Failed to save video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;

    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      toast.success("Video deleted");
      loadVideos();
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  const openEditDialog = (video?: VideoItem) => {
    setEditingVideo(video || { ...defaultVideo });
    setDialogOpen(true);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Videos</h2>
          <p className="text-white/60">Manage videos for the Video app</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="bg-white/5 border-white/10 overflow-hidden">
            <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title || "Video"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Video className="w-12 h-12 text-white/30" />
              )}
              {!video.is_visible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <EyeOff className="w-8 h-8 text-white/50" />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white font-medium truncate">{video.title || "Untitled"}</p>
              <p className="text-white/40 text-sm truncate mt-1">{video.video_url}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(video)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(video.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingVideo?.id ? "Edit Video" : "Add Video"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Title</Label>
              <Input
                value={editingVideo?.title || ""}
                onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Video title"
              />
            </div>
            <div>
              <Label className="text-white">Video URL *</Label>
              <Input
                value={editingVideo?.video_url || ""}
                onChange={(e) => setEditingVideo({ ...editingVideo, video_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label className="text-white">Thumbnail URL (optional)</Label>
              <Input
                value={editingVideo?.thumbnail_url || ""}
                onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div>
              <Label className="text-white">Sort Order</Label>
              <Input
                type="number"
                value={editingVideo?.sort_order || 0}
                onChange={(e) => setEditingVideo({ ...editingVideo, sort_order: parseInt(e.target.value) })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingVideo?.is_visible ?? true}
                onChange={(e) => setEditingVideo({ ...editingVideo, is_visible: e.target.checked })}
                className="w-4 h-4"
              />
              <Label className="text-white">Visible</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700">
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideosSettings;
