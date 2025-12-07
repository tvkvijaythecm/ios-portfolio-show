import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, Save } from "lucide-react";

interface ContactSettings {
  id: string;
  phone_number: string | null;
  whatsapp_number: string | null;
  email_address: string | null;
}

const ContactSettingsPage = () => {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load contact settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("contact_settings")
        .update({
          phone_number: settings.phone_number,
          whatsapp_number: settings.whatsapp_number,
          email_address: settings.email_address,
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Contact settings saved");
    } catch (error) {
      toast.error("Failed to save contact settings");
    } finally {
      setSaving(false);
    }
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Contact Settings</h2>
        <p className="text-white/60">Manage phone, WhatsApp, and email settings for the dock apps</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Phone Number</h3>
              <p className="text-white/40 text-sm">For the Phone app in dock</p>
            </div>
          </div>
          <Input
            value={settings?.phone_number || ""}
            onChange={(e) => setSettings({ ...settings!, phone_number: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="+1234567890"
          />
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">WhatsApp Number</h3>
              <p className="text-white/40 text-sm">For the WhatsApp app in dock</p>
            </div>
          </div>
          <Input
            value={settings?.whatsapp_number || ""}
            onChange={(e) => setSettings({ ...settings!, whatsapp_number: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="+1234567890"
          />
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Email Address</h3>
              <p className="text-white/40 text-sm">For the Mail app in dock</p>
            </div>
          </div>
          <Input
            value={settings?.email_address || ""}
            onChange={(e) => setSettings({ ...settings!, email_address: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="email@example.com"
          />
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Contact Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ContactSettingsPage;
