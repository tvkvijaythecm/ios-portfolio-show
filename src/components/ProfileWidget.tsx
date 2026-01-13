import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

interface ProfileWidgetConfig {
  enabled: boolean;
  name: string;
  title: string;
  profileImage: string;
}

const ProfileWidget = () => {
  const [config, setConfig] = useState<ProfileWidgetConfig>({
    enabled: true,
    name: "Suresh Kaleyannan",
    title: "Creative Developer, Malaysia",
    profileImage: ""
  });

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "widget_profile")
        .maybeSingle();
      
      if (data?.value) {
        setConfig(prev => ({ ...prev, ...(data.value as unknown as ProfileWidgetConfig) }));
      }
    };
    loadConfig();
  }, []);

  if (!config.enabled) return null;

  return (
    <motion.div
      className="w-full rounded-[20px] sm:rounded-3xl overflow-hidden border border-white/30"
      style={{
        background: `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(240,245,250,0.9) 100%)`,
        boxShadow: `
          0 20px 50px rgba(0,0,0,0.35),
          0 10px 20px rgba(0,0,0,0.25),
          0 4px 8px rgba(0,0,0,0.15),
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.05)
        `,
        transform: "perspective(800px) rotateX(2deg) rotateY(2deg)",
        transformStyle: "preserve-3d"
      }}
      initial={{ scale: 0.9, opacity: 0, rotateX: 10, rotateY: 5 }}
      animate={{ scale: 1, opacity: 1, rotateX: 2, rotateY: 2 }}
      whileHover={{ 
        scale: 1.02, 
        rotateX: 0, 
        rotateY: 0,
        boxShadow: `
          0 30px 60px rgba(0,0,0,0.4),
          0 15px 30px rgba(0,0,0,0.3),
          0 5px 10px rgba(0,0,0,0.2),
          inset 0 2px 4px rgba(255,255,255,0.35),
          inset 0 -2px 4px rgba(0,0,0,0.05)
        `
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-orange-400 ring-offset-2 ring-offset-white/50">
            <LazyImage 
              src={config.profileImage || "https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/cert/images/me2.png"} 
              alt={config.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 font-bold text-lg tracking-tight">{config.name}</h3>
          <p className="text-gray-600 text-sm">{config.title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileWidget;