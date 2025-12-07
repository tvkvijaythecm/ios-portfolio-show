import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  site_title: string;
  site_description: string;
  site_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  robots: string;
  author: string;
  theme_color: string;
}

const defaultSettings: SiteSettings = {
  site_title: "eMobile OS",
  site_description: "A creative portfolio showcasing innovative web projects and designs.",
  site_keywords: "portfolio, developer, web design, react, creative",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_card: "summary_large_image",
  twitter_title: "",
  twitter_description: "",
  twitter_image: "",
  canonical_url: "",
  robots: "index, follow",
  author: "",
  theme_color: "#667EEA",
};

const SEOHead = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("*")
          .eq("key", "site_seo")
          .maybeSingle();

        if (error) {
          console.error("Error loading SEO settings:", error);
          return;
        }

        if (data?.value) {
          const value = data.value as unknown as SiteSettings;
          setSettings({
            ...defaultSettings,
            ...value,
          });
        }
      } catch (error) {
        console.error("Error loading SEO settings:", error);
      }
    };

    loadSettings();
  }, []);

  const title = settings.site_title || defaultSettings.site_title;
  const description = settings.site_description || defaultSettings.site_description;
  const ogTitle = settings.og_title || title;
  const ogDescription = settings.og_description || description;
  const twitterTitle = settings.twitter_title || ogTitle;
  const twitterDescription = settings.twitter_description || ogDescription;
  const twitterImage = settings.twitter_image || settings.og_image;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {settings.site_keywords && <meta name="keywords" content={settings.site_keywords} />}
      {settings.author && <meta name="author" content={settings.author} />}
      <meta name="robots" content={settings.robots} />
      
      {/* Theme Color */}
      <meta name="theme-color" content={settings.theme_color} />
      <meta name="msapplication-TileColor" content={settings.theme_color} />
      
      {/* Canonical URL */}
      {settings.canonical_url && <link rel="canonical" href={settings.canonical_url} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      {settings.og_image && <meta property="og:image" content={settings.og_image} />}
      {settings.canonical_url && <meta property="og:url" content={settings.canonical_url} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={settings.twitter_card} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  );
};

export default SEOHead;
