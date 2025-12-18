import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Globe } from "lucide-react";

interface CustomApp {
  id: string;
  name: string;
  icon_url: string | null;
  embed_url: string | null;
  gradient: string;
  sort_order: number;
  is_visible: boolean;
}

const defaultApp: Partial<CustomApp> = {
  name: "",
  icon_url: "",
  embed_url: "",
  gradient: "from-blue-500 to-purple-600",
  is_visible: true,
  sort_order: 0,
};

const CustomAppsSettings = () => {
  const [apps, setApps] = useState<CustomApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<CustomApp> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const { data, error } = await supabase
        .from("case_study_apps")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      toast.error("Failed to load custom apps");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingApp?.name) {
      toast.error("App name is required");
      return;
    }

    setSaving(true);
    try {
      if (editingApp.id) {
        const { error } = await supabase
          .from("case_study_apps")
          .update({
            name: editingApp.name,
            icon_url: editingApp.icon_url || null,
            embed_url: editingApp.embed_url || null,
            gradient: editingApp.gradient,
            is_visible: editingApp.is_visible,
          })
          .eq("id", editingApp.id);

        if (error) throw error;
        toast.success("App updated");
      } else {
        const maxSort = apps.length > 0 ? Math.max(...apps.map(a => a.sort_order)) + 1 : 0;
        const { error } = await supabase.from("case_study_apps").insert({
          name: editingApp.name,
          icon_url: editingApp.icon_url || null,
          embed_url: editingApp.embed_url || null,
          gradient: editingApp.gradient || "from-blue-500 to-purple-600",
          is_visible: editingApp.is_visible ?? true,
          sort_order: maxSort,
        });

        if (error) throw error;
        toast.success("App added");
      }

      setDialogOpen(false);
      setEditingApp(null);
      loadApps();
    } catch (error: any) {
      toast.error("Failed to save app");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this app?")) return;

    try {
      const { error } = await supabase.from("case_study_apps").delete().eq("id", id);
      if (error) throw error;
      toast.success("App deleted");
      loadApps();
    } catch (error) {
      toast.error("Failed to delete app");
    }
  };

  const openEditDialog = (app?: CustomApp) => {
    setEditingApp(app || { ...defaultApp });
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
          <h2 className="text-2xl font-bold text-white">Custom Apps</h2>
          <p className="text-white/60">Add apps that appear in "Other Apps" folder</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add App
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="bg-white/5 border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {app.icon_url ? (
                  <img 
                    src={app.icon_url} 
                    alt={app.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-400" />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{app.name}</p>
                  <p className="text-white/40 text-xs mt-1 truncate max-w-[200px]">
                    {app.embed_url || "No URL set"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(app)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="text-center py-12 text-white/40">
          No apps added yet. Click "Add App" to create your first app.
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingApp?.id ? "Edit App" : "Add App"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">App Icon (URL)</Label>
              <Input
                value={editingApp?.icon_url || ""}
                onChange={(e) => setEditingApp({ ...editingApp, icon_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com/icon.png"
              />
            </div>
            <div>
              <Label className="text-white">App Name *</Label>
              <Input
                value={editingApp?.name || ""}
                onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="My App"
              />
            </div>
            <div>
              <Label className="text-white">Iframe Link</Label>
              <Input
                value={editingApp?.embed_url || ""}
                onChange={(e) => setEditingApp({ ...editingApp, embed_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com"
              />
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

export default CustomAppsSettings;
