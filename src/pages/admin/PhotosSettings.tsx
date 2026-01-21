import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, EyeOff, Upload, Loader2 } from "lucide-react";

interface Photo {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

const defaultPhoto: Partial<Photo> = {
  title: "",
  image_url: "",
  link_url: "",
  sort_order: 0,
  is_visible: true,
};

const PhotosSettings = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<Photo> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);

    try {
      // Get the current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please login to upload photos');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-to-cloudflare`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Set the uploaded URL to the form
      setEditingPhoto(prev => ({ ...prev, image_url: result.url }));
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!editingPhoto?.image_url) {
      toast.error("Image URL is required");
      return;
    }

    setSaving(true);
    try {
      if (editingPhoto.id) {
        const { error } = await supabase
          .from("photos")
          .update({
            title: editingPhoto.title,
            image_url: editingPhoto.image_url,
            link_url: editingPhoto.link_url,
            sort_order: editingPhoto.sort_order,
            is_visible: editingPhoto.is_visible,
          })
          .eq("id", editingPhoto.id);

        if (error) throw error;
        toast.success("Photo updated");
      } else {
        const { error } = await supabase.from("photos").insert({
          title: editingPhoto.title,
          image_url: editingPhoto.image_url,
          link_url: editingPhoto.link_url,
          sort_order: editingPhoto.sort_order,
          is_visible: editingPhoto.is_visible,
        });

        if (error) throw error;
        toast.success("Photo added");
      }

      setDialogOpen(false);
      setEditingPhoto(null);
      loadPhotos();
    } catch (error) {
      toast.error("Failed to save photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;

    try {
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
      toast.success("Photo deleted");
      loadPhotos();
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  const openEditDialog = (photo?: Photo) => {
    setEditingPhoto(photo || { ...defaultPhoto });
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
          <h2 className="text-2xl font-bold text-white">Photos</h2>
          <p className="text-white/60">Manage photos for the Photo app</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="bg-white/5 border-white/10 overflow-hidden">
            <div className="aspect-video bg-gray-800 relative">
              <img
                src={photo.image_url}
                alt={photo.title || "Photo"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              {!photo.is_visible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <EyeOff className="w-8 h-8 text-white/50" />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white font-medium truncate">{photo.title || "Untitled"}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(photo)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(photo.id)}>
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
              {editingPhoto?.id ? "Edit Photo" : "Add Photo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Title</Label>
              <Input
                value={editingPhoto?.title || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Photo title"
              />
            </div>
            <div>
              <Label className="text-white">Image *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={editingPhoto?.image_url || ""}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, image_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white flex-1"
                    placeholder="https://example.com/image.jpg"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-white/40 text-xs">
                  Enter URL or upload an image (JPEG, PNG, GIF, WebP - max 10MB)
                </p>
                {editingPhoto?.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={editingPhoto.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label className="text-white">Link URL (optional)</Label>
              <Input
                value={editingPhoto?.link_url || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, link_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label className="text-white">Sort Order</Label>
              <Input
                type="number"
                value={editingPhoto?.sort_order || 0}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, sort_order: parseInt(e.target.value) })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingPhoto?.is_visible ?? true}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, is_visible: e.target.checked })}
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

export default PhotosSettings;
