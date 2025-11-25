import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Award, TrendingUp, Facebook, Instagram, Globe, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import profileIcon from "@/assets/about-icon.png";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";
import photo5 from "@/assets/photo5.jpg";

const AboutApp = () => {
  const [showProfile, setShowProfile] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [photo1, photo2, photo3, photo4, photo5];

  const technologies = [
    "HTML", "CSS", "JavaScript", "React", "TypeScript", 
    "Tailwind", "Node.js", "Python", "Swift", "Git"
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "bg-blue-500" },
    { icon: Instagram, label: "Instagram", color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" },
    { icon: Globe, label: "X", color: "bg-black dark:bg-white" },
    { icon: MessageCircle, label: "Threads", color: "bg-gray-800" },
    { icon: Award, label: "Behance", color: "bg-blue-600" },
    { icon: TrendingUp, label: "TikTok", color: "bg-gradient-to-br from-cyan-400 via-pink-500 to-red-500" },
    { icon: MessageCircle, label: "WhatsApp", color: "bg-green-500" },
    { icon: Globe, label: "Website", color: "bg-indigo-600" },
  ];

  const skills = [
    { name: "UI/UX Design", level: 85 },
    { name: "Development", level: 90 },
    { name: "Creativity", level: 95 },
  ];

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
                  src={profileIcon}
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
              <h2 className="text-2xl font-bold text-foreground mb-1">Suresh Kumar</h2>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Followers</p>
                  <p className="font-semibold text-foreground">2.5K</p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-semibold text-foreground">8+ Years</p>
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
            Professional procrastinator who somehow became a designer. I turn coffee into pixels and bugs into features. 
            Warning: May spontaneously talk about design systems for 3 hours. Side effects include pixel-perfect obsessions 
            and an unhealthy relationship with kerning. 🎨✨
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
            {skills.map((skill, index) => (
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
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
              >
                #{tech}
              </motion.span>
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
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
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
            {socialLinks.map((social, index) => (
              <motion.button
                key={social.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`${social.color} aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-white shadow-lg hover:shadow-xl transition-shadow`}
              >
                <social.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{social.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutApp;
