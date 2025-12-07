import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";

interface EducationItem {
  id: string;
  title: string;
  issuer: string;
  year: string | null;
  image_url: string | null;
  category: string;
  sort_order: number;
  is_visible: boolean;
}

const defaultItem: Partial<EducationItem> = {
  title: "",
  issuer: "",
  year: "",
  image_url: null,
  category: "institute",
  sort_order: 0,
  is_visible: true,
};

const EducationSettings = () => {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<EducationItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("education_items")
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
    if (!editingItem?.title || !editingItem?.issuer) {
      toast.error("Title and issuer are required");
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("education_items")
          .update(editingItem)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Item updated!");
      } else {
        const { error } = await supabase
          .from("education_items")
          .insert([{
            title: editingItem.title!,
            issuer: editingItem.issuer!,
            year: editingItem.year,
            image_url: editingItem.image_url,
            category: editingItem.category || "institute",
            sort_order: items.length,
          }]);

        if (error) throw error;
        toast.success("Item created!");
      }

      setDialogOpen(false);
      setEditingItem(null);
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase
        .from("education_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Item deleted!");
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  const openEditDialog = (item?: EducationItem) => {
    setEditingItem(item || { ...defaultItem });
    setDialogOpen(true);
  };

  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.category === filter);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <AdminHeader title="Education & Credentials" description="Manage your educational background and certifications" />
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="institute">Institute</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => openEditDialog()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

        {filteredItems.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No education items yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video bg-slate-700">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-purple-400 uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="text-white font-medium truncate">{item.title}</h3>
                        <p className="text-white/60 text-sm truncate">{item.issuer}</p>
                        {item.year && (
                          <p className="text-white/40 text-xs mt-1">{item.year}</p>
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
          <DialogContent className="bg-slate-800 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Title</Label>
                <Input
                  value={editingItem?.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Certificate/Degree name"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Issuer</Label>
                <Input
                  value={editingItem?.issuer || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                  placeholder="Institution name"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Year</Label>
                  <Input
                    value={editingItem?.year || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="2024"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Category</Label>
                  <Select
                    value={editingItem?.category || "institute"}
                    onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="institute">Institute</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Image URL</Label>
                <Input
                  value={editingItem?.image_url || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {saving ? "Saving..." : "Save Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default EducationSettings;
