import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, EyeOff, Github, ExternalLink } from "lucide-react";

interface GithubProject {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  source_url: string | null;
  demo_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

const defaultProject: Partial<GithubProject> = {
  title: "",
  description: "",
  cover_image_url: "",
  source_url: "",
  demo_url: "",
  sort_order: 0,
  is_visible: true,
};

const GithubSettings = () => {
  const [projects, setProjects] = useState<GithubProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<GithubProject> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("github_projects")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingProject?.title) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      if (editingProject.id) {
        const { error } = await supabase
          .from("github_projects")
          .update({
            title: editingProject.title,
            description: editingProject.description,
            cover_image_url: editingProject.cover_image_url,
            source_url: editingProject.source_url,
            demo_url: editingProject.demo_url,
            sort_order: editingProject.sort_order,
            is_visible: editingProject.is_visible,
          })
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase.from("github_projects").insert({
          title: editingProject.title,
          description: editingProject.description,
          cover_image_url: editingProject.cover_image_url,
          source_url: editingProject.source_url,
          demo_url: editingProject.demo_url,
          sort_order: editingProject.sort_order,
          is_visible: editingProject.is_visible,
        });

        if (error) throw error;
        toast.success("Project added");
      }

      setDialogOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      const { error } = await supabase.from("github_projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted");
      loadProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const openEditDialog = (project?: GithubProject) => {
    setEditingProject(project || { ...defaultProject });
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
          <h2 className="text-2xl font-bold text-white">GitHub Projects</h2>
          <p className="text-white/60">Manage projects for the GitHub app</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10 overflow-hidden">
            <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
              {project.cover_image_url ? (
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Github className="w-12 h-12 text-white/30" />
              )}
              {!project.is_visible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <EyeOff className="w-8 h-8 text-white/50" />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white font-medium">{project.title}</p>
              <p className="text-white/40 text-sm mt-1 line-clamp-2">{project.description}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(project)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                {project.source_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(project.source_url!, "_blank")}>
                    <Github className="w-4 h-4" />
                  </Button>
                )}
                {project.demo_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(project.demo_url!, "_blank")}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProject?.id ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Title *</Label>
              <Input
                value={editingProject?.title || ""}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Project title"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={editingProject?.description || ""}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Project description"
              />
            </div>
            <div>
              <Label className="text-white">Cover Image URL</Label>
              <Input
                value={editingProject?.cover_image_url || ""}
                onChange={(e) => setEditingProject({ ...editingProject, cover_image_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div>
              <Label className="text-white">Source URL (GitHub)</Label>
              <Input
                value={editingProject?.source_url || ""}
                onChange={(e) => setEditingProject({ ...editingProject, source_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <Label className="text-white">Demo URL</Label>
              <Input
                value={editingProject?.demo_url || ""}
                onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label className="text-white">Sort Order</Label>
              <Input
                type="number"
                value={editingProject?.sort_order || 0}
                onChange={(e) => setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value) })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingProject?.is_visible ?? true}
                onChange={(e) => setEditingProject({ ...editingProject, is_visible: e.target.checked })}
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

export default GithubSettings;
