import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Award, TrendingUp, Facebook, Instagram, Globe, MessageCircle, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import profileIcon from "@/assets/about-icon.png";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";
import photo5 from "@/assets/photo5.jpg";

interface AboutContent {
  name: string;
  title: string | null;
  about_text: string | null;
  followers: number | null;
  experience_years: number | null;
  profile_image: string | null;
  skills: { name: string; level: number }[];
  technologies: { name: string; logo: string }[];
  social_links: { icon: string; label: string; color: string; url?: string }[];
  carousel_images: string[];
}

const defaultContent: AboutContent = {
  name: "Suresh Kumar",
  title: "UI/UX Designer",
  about_text: "Professional procrastinator who somehow became a designer. I turn coffee into pixels and bugs into features.",
  followers: 2500,
  experience_years: 8,
  profile_image: null,
  skills: [
    { name: "UI/UX Design", level: 85 },
    { name: "Development", level: 90 },
    { name: "Creativity", level: 95 },
  ],
  technologies: [
    { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Swift", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  ],
  social_links: [
    { icon: "Facebook", label: "Facebook", color: "bg-blue-500" },
    { icon: "Instagram", label: "Instagram", color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" },
    { icon: "Globe", label: "X", color: "bg-black dark:bg-white" },
    { icon: "MessageCircle", label: "Threads", color: "bg-gray-800" },
    { icon: "Award", label: "Behance", color: "bg-blue-600" },
    { icon: "TrendingUp", label: "TikTok", color: "bg-gradient-to-br from-cyan-400 via-pink-500 to-red-500" },
    { icon: "MessageCircle", label: "WhatsApp", color: "bg-green-500" },
    { icon: "Globe", label: "Website", color: "bg-indigo-600" },
  ],
  carousel_images: []
};

const iconMap: Record<string, React.ElementType> = {
  Facebook,
  Instagram,
  Globe,
  MessageCircle,
  Award,
  TrendingUp,
  User
};

const AboutApp = () => {
  const [showProfile, setShowProfile] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const defaultImages = [photo1, photo2, photo3, photo4, photo5];
  const images = content.carousel_images.length > 0 ? content.carousel_images : defaultImages;

  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single();
      
      if (data && !error) {
        setContent({
          name: data.name,
          title: data.title,
          about_text: data.about_text,
          followers: data.followers,
          experience_years: data.experience_years,
          profile_image: data.profile_image,
          skills: (data.skills as { name: string; level: number }[]) || defaultContent.skills,
          technologies: (data.technologies as { name: string; logo: string }[]) || defaultContent.technologies,
          social_links: (data.social_links as { icon: string; label: string; color: string; url?: string }[]) || defaultContent.social_links,
          carousel_images: (data.carousel_images as string[]) || []
        });
      }
      setLoading(false);
    };
    loadContent();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, images.length]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-muted/30 to-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatFollowers = (num: number | null) => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-b from-muted/30 to-background p-4">
      <div className="max-w-2xl mx-auto space-y-4 pb-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Profile</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show Picture</span>
              <Switch checked={showProfile} onCheckedChange={setShowProfile} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {showProfile ? (
                <motion.img
                  key="profile"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  src={content.profile_image || profileIcon}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-md"
                >
                  <User className="w-10 h-10 text-primary/40" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{content.name}</h2>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Followers</p>
                  <p className="font-semibold text-foreground">{formatFollowers(content.followers)}</p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-semibold text-foreground">{content.experience_years}+ Years</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">About Me</h3>
          <p className="text-foreground leading-relaxed">
            {content.about_text || "No description available."}
          </p>
        </motion.div>

        {/* Skills Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">Skills</h3>
          <div className="space-y-6">
            {content.skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Technologies</h3>
          <div className="grid grid-cols-5 gap-4">
            {content.technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-background/50 rounded-2xl flex items-center justify-center p-4 shadow-md border border-border/30 hover:border-primary/30 transition-all"
              >
                <img 
                  src={tech.logo} 
                  alt={tech.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Gallery</h3>
          <div 
            className="relative aspect-video rounded-2xl overflow-hidden bg-muted"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ›
            </button>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-border/50"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Connect</h3>
          <div className="grid grid-cols-4 gap-4">
            {content.social_links.map((social, index) => {
              const IconComponent = iconMap[social.icon] || Globe;
              return (
                <motion.button
                  key={social.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => social.url && window.open(social.url, '_blank')}
                  className={`${social.color} aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-white shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-[10px] font-medium">{social.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutApp;
