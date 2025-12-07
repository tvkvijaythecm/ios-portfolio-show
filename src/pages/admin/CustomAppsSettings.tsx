import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Code } from "lucide-react";

interface CustomAppContent {
  id: string;
  app_key: string;
  app_name: string;
  html_content: string | null;
}

const defaultApp: Partial<CustomAppContent> = {
  app_key: "",
  app_name: "",
  html_content: "",
};

const CustomAppsSettings = () => {
  const [apps, setApps] = useState<CustomAppContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<CustomAppContent> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const { data, error } = await supabase
        .from("custom_app_content")
        .select("*")
        .order("app_name");

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      toast.error("Failed to load custom apps");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingApp?.app_key || !editingApp?.app_name) {
      toast.error("App key and name are required");
      return;
    }

    setSaving(true);
    try {
      if (editingApp.id) {
        const { error } = await supabase
          .from("custom_app_content")
          .update({
            app_key: editingApp.app_key,
            app_name: editingApp.app_name,
            html_content: editingApp.html_content,
          })
          .eq("id", editingApp.id);

        if (error) throw error;
        toast.success("Custom app updated");
      } else {
        const { error } = await supabase.from("custom_app_content").insert({
          app_key: editingApp.app_key,
          app_name: editingApp.app_name,
          html_content: editingApp.html_content,
        });

        if (error) throw error;
        toast.success("Custom app added");
      }

      setDialogOpen(false);
      setEditingApp(null);
      loadApps();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("App key already exists");
      } else {
        toast.error("Failed to save custom app");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this custom app?")) return;

    try {
      const { error } = await supabase.from("custom_app_content").delete().eq("id", id);
      if (error) throw error;
      toast.success("Custom app deleted");
      loadApps();
    } catch (error) {
      toast.error("Failed to delete custom app");
    }
  };

  const openEditDialog = (app?: CustomAppContent) => {
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
          <h2 className="text-2xl font-bold text-white">Custom App Content</h2>
          <p className="text-white/60">Add HTML content for custom apps</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Custom App
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="bg-white/5 border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{app.app_name}</p>
                  <p className="text-white/40 text-sm">Key: {app.app_key}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {app.html_content ? `${app.html_content.length} characters` : "No content"}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingApp?.id ? "Edit Custom App" : "Add Custom App"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">App Key *</Label>
                <Input
                  value={editingApp?.app_key || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, app_key: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="privacy-policy"
                  disabled={!!editingApp?.id}
                />
                <p className="text-white/40 text-xs mt-1">Unique identifier (cannot be changed)</p>
              </div>
              <div>
                <Label className="text-white">App Name *</Label>
                <Input
                  value={editingApp?.app_name || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, app_name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Privacy Policy"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">HTML Content</Label>
              <Textarea
                value={editingApp?.html_content || ""}
                onChange={(e) => setEditingApp({ ...editingApp, html_content: e.target.value })}
                className="bg-white/10 border-white/20 text-white font-mono text-sm min-h-[300px]"
                placeholder="<div>Your HTML content here...</div>"
              />
              <p className="text-white/40 text-xs mt-1">Enter raw HTML that will be rendered in the app</p>
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
