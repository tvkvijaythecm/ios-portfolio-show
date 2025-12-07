import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  BarChart, 
  PieChart, 
  LineChart, 
  Target, 
  Award, 
  Lightbulb, 
  Layers, 
  Folder,
  LucideIcon 
} from "lucide-react";

export interface CaseStudyApp {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  gradient: string;
  embed_url: string | null;
  html_content: string | null;
  sort_order: number;
  is_visible: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Award,
  Lightbulb,
  Layers,
  Folder
};

export const getIconForApp = (name: string): LucideIcon => {
  // Try to match icon by name
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('calculator')) return Target;
  if (normalizedName.includes('bookmark')) return Layers;
  if (normalizedName.includes('goip')) return TrendingUp;
  if (normalizedName.includes('growth')) return TrendingUp;
  if (normalizedName.includes('performance')) return BarChart;
  if (normalizedName.includes('insights')) return PieChart;
  if (normalizedName.includes('metrics')) return LineChart;
  if (normalizedName.includes('goals')) return Target;
  if (normalizedName.includes('achievements')) return Award;
  if (normalizedName.includes('innovation')) return Lightbulb;
  if (normalizedName.includes('strategy')) return Layers;
  return Folder;
};

export const useCaseStudyApps = () => {
  const [apps, setApps] = useState<CaseStudyApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      const { data, error } = await supabase
        .from('case_study_apps')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      
      if (data && !error) {
        setApps(data);
      }
      setLoading(false);
    };
    loadApps();
  }, []);

  return { apps, loading };
};
