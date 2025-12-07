import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, EyeOff, Briefcase } from "lucide-react";

interface WorkExperience {
  id: string;
  company_name: string;
  job_title: string;
  job_description: string | null;
  year_start: string;
  year_end: string | null;
  sort_order: number;
  is_visible: boolean;
}

const defaultWork: Partial<WorkExperience> = {
  company_name: "",
  job_title: "",
  job_description: "",
  year_start: "",
  year_end: "",
  sort_order: 0,
  is_visible: true,
};

const WorkSettings = () => {
  const [workItems, setWorkItems] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Partial<WorkExperience> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWork();
  }, []);

  const loadWork = async () => {
    try {
      const { data, error } = await supabase
        .from("work_experience")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setWorkItems(data || []);
    } catch (error) {
      toast.error("Failed to load work experience");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingWork?.company_name || !editingWork?.job_title || !editingWork?.year_start) {
      toast.error("Company name, job title, and start year are required");
      return;
    }

    setSaving(true);
    try {
      if (editingWork.id) {
        const { error } = await supabase
          .from("work_experience")
          .update({
            company_name: editingWork.company_name,
            job_title: editingWork.job_title,
            job_description: editingWork.job_description,
            year_start: editingWork.year_start,
            year_end: editingWork.year_end,
            sort_order: editingWork.sort_order,
            is_visible: editingWork.is_visible,
          })
          .eq("id", editingWork.id);

        if (error) throw error;
        toast.success("Work experience updated");
      } else {
        const { error } = await supabase.from("work_experience").insert({
          company_name: editingWork.company_name,
          job_title: editingWork.job_title,
          job_description: editingWork.job_description,
          year_start: editingWork.year_start,
          year_end: editingWork.year_end,
          sort_order: editingWork.sort_order,
          is_visible: editingWork.is_visible,
        });

        if (error) throw error;
        toast.success("Work experience added");
      }

      setDialogOpen(false);
      setEditingWork(null);
      loadWork();
    } catch (error) {
      toast.error("Failed to save work experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this work experience?")) return;

    try {
      const { error } = await supabase.from("work_experience").delete().eq("id", id);
      if (error) throw error;
      toast.success("Work experience deleted");
      loadWork();
    } catch (error) {
      toast.error("Failed to delete work experience");
    }
  };

  const openEditDialog = (work?: WorkExperience) => {
    setEditingWork(work || { ...defaultWork });
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
          <h2 className="text-2xl font-bold text-white">Work Experience</h2>
          <p className="text-white/60">Manage work history for the Work app</p>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Work
        </Button>
      </div>

      <div className="space-y-4">
        {workItems.map((work) => (
          <Card key={work.id} className="bg-white/5 border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{work.company_name}</p>
                  <p className="text-purple-400 font-medium">{work.job_title}</p>
                  <p className="text-white/40 text-sm mt-1">
                    {work.year_start} - {work.year_end || "Present"}
                  </p>
                  {work.job_description && (
                    <p className="text-white/60 mt-2 text-sm">{work.job_description}</p>
                  )}
                  {!work.is_visible && (
                    <span className="inline-flex items-center gap-1 text-yellow-400 text-xs mt-2">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(work)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(work.id)}>
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
              {editingWork?.id ? "Edit Work Experience" : "Add Work Experience"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Company Name *</Label>
              <Input
                value={editingWork?.company_name || ""}
                onChange={(e) => setEditingWork({ ...editingWork, company_name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Company name"
              />
            </div>
            <div>
              <Label className="text-white">Job Title *</Label>
              <Input
                value={editingWork?.job_title || ""}
                onChange={(e) => setEditingWork({ ...editingWork, job_title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Job title"
              />
            </div>
            <div>
              <Label className="text-white">Job Description</Label>
              <Textarea
                value={editingWork?.job_description || ""}
                onChange={(e) => setEditingWork({ ...editingWork, job_description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Job description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Year Start *</Label>
                <Input
                  value={editingWork?.year_start || ""}
                  onChange={(e) => setEditingWork({ ...editingWork, year_start: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="2020"
                />
              </div>
              <div>
                <Label className="text-white">Year End</Label>
                <Input
                  value={editingWork?.year_end || ""}
                  onChange={(e) => setEditingWork({ ...editingWork, year_end: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Present"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Sort Order</Label>
              <Input
                type="number"
                value={editingWork?.sort_order || 0}
                onChange={(e) => setEditingWork({ ...editingWork, sort_order: parseInt(e.target.value) })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingWork?.is_visible ?? true}
                onChange={(e) => setEditingWork({ ...editingWork, is_visible: e.target.checked })}
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

export default WorkSettings;
