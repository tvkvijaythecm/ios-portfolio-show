import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Grid3X3, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

interface AppItem {
  id: string;
  name: string;
  icon_url: string | null;
  icon_type: string;
  lucide_icon: string | null;
  gradient: string;
  app_type: string;
  sort_order: number;
  is_visible: boolean;
  is_dock_item: boolean;
  external_url: string | null;
}

const defaultApp: Partial<AppItem> = {
  name: "",
  icon_url: null,
  icon_type: "lucide",
  lucide_icon: "Grid",
  gradient: "from-blue-500 to-purple-600",
  app_type: "custom",
  sort_order: 0,
  is_visible: true,
  is_dock_item: false,
  external_url: null,
};

const AppManager = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<AppItem> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("app_items")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      console.error("Error loading apps:", error);
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
        // Update existing
        const { error } = await supabase
          .from("app_items")
          .update(editingApp)
          .eq("id", editingApp.id);

        if (error) throw error;
        toast.success("App updated!");
      } else {
        // Create new
        const { error } = await supabase
          .from("app_items")
          .insert([{
            name: editingApp.name!,
            app_type: editingApp.app_type || "custom",
            gradient: editingApp.gradient || "from-blue-500 to-purple-600",
            icon_url: editingApp.icon_url,
            external_url: editingApp.external_url,
            is_dock_item: editingApp.is_dock_item,
            sort_order: apps.length,
          }]);

        if (error) throw error;
        toast.success("App created!");
      }

      setDialogOpen(false);
      setEditingApp(null);
      loadApps();
    } catch (error: any) {
      toast.error(error.message || "Failed to save app");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;

    try {
      const { error } = await supabase
        .from("app_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("App deleted!");
      loadApps();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete app");
    }
  };

  const handleToggleVisibility = async (app: AppItem) => {
    try {
      const { error } = await supabase
        .from("app_items")
        .update({ is_visible: !app.is_visible })
        .eq("id", app.id);

      if (error) throw error;
      loadApps();
    } catch (error: any) {
      toast.error(error.message || "Failed to update visibility");
    }
  };

  const openEditDialog = (app?: AppItem) => {
    setEditingApp(app || { ...defaultApp });
    setDialogOpen(true);
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
            <h2 className="text-2xl font-bold text-white">App Manager</h2>
            <p className="text-white/60">Add, edit, or remove apps from the home screen</p>
          </div>
          <Button
            onClick={() => openEditDialog()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add App
          </Button>
        </div>

        {apps.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Grid3X3 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No apps configured yet</p>
              <p className="text-white/40 text-sm">Click "Add App" to create your first app</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="py-4 flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-white/20 cursor-grab" />
                    
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-6 h-6" />
                      ) : (
                        <Grid3X3 className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-medium">{app.name}</h3>
                      <p className="text-white/40 text-sm">{app.app_type}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-4">
                        <span className="text-white/40 text-sm">Visible</span>
                        <Switch
                          checked={app.is_visible}
                          onCheckedChange={() => handleToggleVisibility(app)}
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(app)}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(app.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-slate-800 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingApp?.id ? "Edit App" : "Add New App"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">App Name</Label>
                <Input
                  value={editingApp?.name || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                  placeholder="My App"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">App Type</Label>
                <Input
                  value={editingApp?.app_type || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, app_type: e.target.value })}
                  placeholder="about, education, custom, etc."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Gradient (Tailwind classes)</Label>
                <Input
                  value={editingApp?.gradient || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, gradient: e.target.value })}
                  placeholder="from-blue-500 to-purple-600"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Icon URL (optional)</Label>
                <Input
                  value={editingApp?.icon_url || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, icon_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">External URL (for embedded apps)</Label>
                <Input
                  value={editingApp?.external_url || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, external_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white/80">Show in Dock</Label>
                <Switch
                  checked={editingApp?.is_dock_item || false}
                  onCheckedChange={(checked) => setEditingApp({ ...editingApp, is_dock_item: checked })}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {saving ? "Saving..." : "Save App"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default AppManager;
