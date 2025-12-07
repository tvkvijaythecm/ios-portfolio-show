import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FolderOpen, ExternalLink, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseStudyApp {
  id: string;
  name: string;
  icon_url: string | null;
  gradient: string;
  embed_url: string | null;
  description: string | null;
  html_content: string | null;
  sort_order: number;
  is_visible: boolean;
}

const defaultItem: Partial<CaseStudyApp> = {
  name: "",
  icon_url: null,
  gradient: "from-blue-500 to-purple-600",
  embed_url: null,
  description: null,
  html_content: "",
  sort_order: 0,
  is_visible: true,
};

const CaseStudySettings = () => {
  const [items, setItems] = useState<CaseStudyApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CaseStudyApp> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("case_study_apps")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem?.name) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("case_study_apps")
          .update({
            name: editingItem.name,
            icon_url: editingItem.icon_url,
            gradient: editingItem.gradient,
            embed_url: editingItem.embed_url,
            description: editingItem.description,
            html_content: editingItem.html_content,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Case study updated!");
      } else {
        const { error } = await supabase
          .from("case_study_apps")
          .insert([{
            name: editingItem.name!,
            icon_url: editingItem.icon_url,
            gradient: editingItem.gradient || "from-blue-500 to-purple-600",
            embed_url: editingItem.embed_url,
            description: editingItem.description,
            html_content: editingItem.html_content || "",
            sort_order: items.length,
          }]);

        if (error) throw error;
        toast.success("Case study created!");
      }

      setDialogOpen(false);
      setEditingItem(null);
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const { error } = await supabase
        .from("case_study_apps")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Case study deleted!");
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const openEditDialog = (item?: CaseStudyApp) => {
    setEditingItem(item || { ...defaultItem });
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
            <h2 className="text-2xl font-bold text-white">Case Studies</h2>
            <p className="text-white/60">Manage your portfolio case study apps</p>
          </div>
          <Button
            onClick={() => openEditDialog()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Button>
        </div>

        {items.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No case studies yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className={`h-32 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    {item.icon_url ? (
                      <img src={item.icon_url} alt={item.name} className="w-16 h-16 object-contain" />
                    ) : (
                      <FolderOpen className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {item.embed_url && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Embed</span>
                          )}
                          {item.html_content && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">HTML</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-slate-800 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? "Edit Case Study" : "Add Case Study"}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="basic" className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="content" className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  <Code className="w-4 h-4 mr-2" />
                  HTML Content
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Name *</Label>
                  <Input
                    value={editingItem?.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="App name"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Icon URL</Label>
                  <Input
                    value={editingItem?.icon_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Gradient (Tailwind)</Label>
                  <Input
                    value={editingItem?.gradient || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, gradient: e.target.value })}
                    placeholder="from-blue-500 to-purple-600"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Embed URL (optional - for iframe)</Label>
                  <Input
                    value={editingItem?.embed_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, embed_url: e.target.value })}
                    placeholder="https://example.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-white/40 text-xs">If set, app will open as embedded iframe. Otherwise, HTML content below will be used.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Description</Label>
                  <Textarea
                    value={editingItem?.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Brief description..."
                    className="bg-white/10 border-white/20 text-white resize-none"
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-white/80">HTML Content</Label>
                  <p className="text-white/40 text-xs mb-2">
                    Add custom HTML content for this app. This is used when no Embed URL is set.
                  </p>
                  <Textarea
                    value={editingItem?.html_content || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, html_content: e.target.value })}
                    placeholder={`<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">My App</h1>
  <p>Add your content here...</p>
</div>`}
                    className="bg-white/10 border-white/20 text-white font-mono text-sm resize-none"
                    rows={15}
                  />
                </div>

                {editingItem?.html_content && (
                  <div className="space-y-2">
                    <Label className="text-white/80">Preview</Label>
                    <div className="bg-white rounded-lg p-4 max-h-48 overflow-auto">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: editingItem.html_content }}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default CaseStudySettings;
