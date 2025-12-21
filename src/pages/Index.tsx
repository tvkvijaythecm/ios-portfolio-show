import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Info,
  Image,
  Youtube,
  Github,
  Calendar as CalendarIcon,
  Clock,
  Cloud,
  Briefcase,
  FileText,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Folder,
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Award,
  Lightbulb,
  Layers,
  RotateCcw,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import profileImage from "@/assets/profile.jpeg";
import aboutIcon from "@/assets/about-icon.png";
import backgroundImage from "@/assets/background.png";
import homescreenBg from "@/assets/homescreen-bg.jpg";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";
import photo5 from "@/assets/photo5.jpg";
import photo6 from "@/assets/photo6.jpg";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import sureshIcon from "@/assets/icons/suresh.png";
import photosIcon from "@/assets/icons/photos.png";
import videoIcon from "@/assets/icons/video.png";
import githubIcon from "@/assets/icons/github.png";
import workIcon from "@/assets/icons/work.png";
import notesIcon from "@/assets/icons/notes.png";
import infoIcon from "@/assets/icons/info.png";
import clockIcon from "@/assets/icons/clock.png";
import weatherIcon from "@/assets/icons/weather.png";
import caseStudyIcon from "@/assets/icons/casestudy.png";
import goipIcon from "@/assets/icons/goip.png";
import calendarIcon from "@/assets/icons/calendar.png";
import BootScreen from "@/components/BootScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import Dock from "@/components/Dock";
import ProfileWidget from "@/components/ProfileWidget";
import AppPage from "@/components/AppPage";
import PhotoViewer from "@/components/PhotoViewer";
import VideoEmbed from "@/components/VideoEmbed";
import CaseStudyFolder from "@/components/CaseStudyFolder";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import CaseStudyPage from "@/components/CaseStudyPage";
import AboutApp from "@/components/AboutApp";
import WelcomeNotification from "@/components/WelcomeNotification";
import EducationApp from "@/components/EducationApp";
import ControlCentre from "@/components/ControlCentre";
import NotesApp from "@/components/NotesApp";
import IframeApp from "@/components/IframeApp";
import { useCaseStudyApps, getIconForApp, CaseStudyApp } from "@/hooks/useCaseStudyApps";

interface IframeSettings {
  calendar_url: string;
  weather_url: string;
  goip_url: string;
  clock_url: string;
  suresh_url: string;
}

interface InfoAppSettings {
  app_name: string;
  version: string;
  codebase: string;
  established_year: string;
  license: string;
  origin: string;
  privacy_label: string;
  license_label: string;
  logs_label: string;
  acknowledgements_label: string;
}

type AppType = "profile" | "photos" | "youtube" | "github" | "calendar" | "clock" | "weather" | "case-study" | "briefcase" | "notes" | "education" | "privacy" | "private-info" | "schedule" | "linked-accounts" | "about" | null;

const Index = () => {
  const navigate = useNavigate();
  const [showBoot, setShowBoot] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [openApp, setOpenApp] = useState<AppType>(null);
  const [selectedGradient, setSelectedGradient] = useState("ios-gradient");
  const { theme, setTheme } = useTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showCaseStudyGrid, setShowCaseStudyGrid] = useState(false);
  const [openCaseStudyApp, setOpenCaseStudyApp] = useState<CaseStudyApp | null>(null);
  const [showControlCentre, setShowControlCentre] = useState(false);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [dbPhotos, setDbPhotos] = useState<Array<{ id: string; title: string | null; image_url: string; link_url: string | null }>>([]);
  const [dbVideos, setDbVideos] = useState<Array<{ id: string; title: string | null; video_url: string; thumbnail_url: string | null }>>([]);
  const [dbProjects, setDbProjects] = useState<Array<{ id: string; title: string; description: string | null; cover_image_url: string | null; source_url: string | null; demo_url: string | null }>>([]);
  const [dbWork, setDbWork] = useState<Array<{ id: string; company_name: string; job_title: string; job_description: string | null; year_start: string; year_end: string | null }>>([]);
  const [iframeSettings, setIframeSettings] = useState<IframeSettings>({ calendar_url: "", weather_url: "", goip_url: "", clock_url: "", suresh_url: "" });
  const [infoAppSettings, setInfoAppSettings] = useState<InfoAppSettings>({
    app_name: "SNetOS",
    version: "1.5",
    codebase: "Javascript",
    established_year: "2024",
    license: "SNet Cloud Nexus",
    origin: "Kuala Lumpur, MY",
    privacy_label: "Privacy Policy",
    license_label: "GNU AGPLv3",
    logs_label: "System Logs",
    acknowledgements_label: "Acknowledgements",
  });

  // Fetch case study apps from Supabase
  const { apps: dbCaseStudyApps } = useCaseStudyApps();

  // Fetch all dynamic content from Supabase
  useEffect(() => {
    const loadAllContent = async () => {
      try {
        const [bgRes, photosRes, videosRes, projectsRes, workRes, iframeRes, infoAppRes] = await Promise.all([
          supabase.from("app_settings").select("value").eq("key", "background").maybeSingle(),
          supabase.from("photos").select("*").eq("is_visible", true).order("sort_order"),
          supabase.from("videos").select("*").eq("is_visible", true).order("sort_order"),
          supabase.from("github_projects").select("*").eq("is_visible", true).order("sort_order"),
          supabase.from("work_experience").select("*").eq("is_visible", true).order("sort_order"),
          supabase.from("app_settings").select("value").eq("key", "iframe_apps").maybeSingle(),
          supabase.from("info_app_settings").select("*").limit(1).maybeSingle()
        ]);

        if (bgRes.data?.value) {
          const value = bgRes.data.value as { type: string; value: string };
          if (value.value) {
            setCustomBackground(value.value);
          }
        }
        
        if (photosRes.data) setDbPhotos(photosRes.data);
        if (videosRes.data) setDbVideos(videosRes.data);
        if (projectsRes.data) setDbProjects(projectsRes.data);
        if (workRes.data) setDbWork(workRes.data);
        
        if (iframeRes.data?.value) {
          const value = iframeRes.data.value as unknown as IframeSettings;
          setIframeSettings({
            calendar_url: value.calendar_url || "",
            weather_url: value.weather_url || "",
            goip_url: value.goip_url || "",
            clock_url: value.clock_url || "",
            suresh_url: value.suresh_url || "",
          });
        }

        if (infoAppRes.data) {
          setInfoAppSettings({
            app_name: infoAppRes.data.app_name || "SNetOS",
            version: infoAppRes.data.version || "1.5",
            codebase: infoAppRes.data.codebase || "Javascript",
            established_year: infoAppRes.data.established_year || "2024",
            license: infoAppRes.data.license || "SNet Cloud Nexus",
            origin: infoAppRes.data.origin || "Kuala Lumpur, MY",
            privacy_label: infoAppRes.data.privacy_label || "Privacy Policy",
            license_label: infoAppRes.data.license_label || "GNU AGPLv3",
            logs_label: infoAppRes.data.logs_label || "System Logs",
            acknowledgements_label: infoAppRes.data.acknowledgements_label || "Acknowledgements",
          });
        }
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };
    loadAllContent();
  }, []);

  // Fallback photos from assets
  const fallbackPhotos = [photo1, photo2, photo3, photo4, photo5, photo6];
  const photos = dbPhotos.length > 0 ? dbPhotos.map(p => p.image_url) : fallbackPhotos;
  
  // Fallback projects
  const fallbackProjects = [
    { 
      name: "Project Alpha", 
      description: "A mobile-first e-commerce platform with real-time inventory management",
      thumbnail: project1,
      tech: "React Native, Node.js, MongoDB"
    },
    { 
      name: "Project Beta", 
      description: "Analytics dashboard for tracking social media engagement and growth",
      thumbnail: project2,
      tech: "React, TypeScript, D3.js"
    },
    { 
      name: "Project Gamma", 
      description: "Creative portfolio website with custom animations and interactions",
      thumbnail: project3,
      tech: "Next.js, Framer Motion, Tailwind"
    },
  ];
  
  const projects = dbProjects.length > 0 
    ? dbProjects.map(p => ({
        name: p.title,
        description: p.description || "",
        thumbnail: p.cover_image_url || project1,
        sourceUrl: p.source_url,
        demoUrl: p.demo_url
      }))
    : fallbackProjects;

  // Fallback videos
  const fallbackVideos = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Creative Showcase Reel" },
    { url: "https://vimeo.com/148751763", title: "Design Process Documentary" },
    { url: "https://www.youtube.com/watch?v=9bZkp7q19f0", title: "Project Walkthrough" },
  ];
  
  const videos = dbVideos.length > 0 
    ? dbVideos.map(v => ({ url: v.video_url, title: v.title || "Untitled" }))
    : fallbackVideos;

  // Fallback work experience
  const fallbackWork = [
    { company: "Company A", position: "Senior Designer", period: "2022 - Present", description: "" },
    { company: "Company B", position: "Designer", period: "2020 - 2022", description: "" },
  ];
  
  const workExperience = dbWork.length > 0 
    ? dbWork.map(w => ({
        company: w.company_name,
        position: w.job_title,
        period: `${w.year_start} - ${w.year_end || "Present"}`,
        description: w.job_description || ""
      }))
    : fallbackWork;

  const caseStudyMiniApps = [
    { icon: TrendingUp, gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)" },
    { icon: BarChart, gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)" },
    { icon: PieChart, gradient: "linear-gradient(135deg, #FFA502 0%, #FF6348 100%)" },
    { icon: LineChart, gradient: "linear-gradient(135deg, #5F27CD 0%, #341F97 100%)" },
  ];

  // Convert database apps to UI format
  const caseStudyApps = dbCaseStudyApps.length > 0 
    ? dbCaseStudyApps.map(app => {
        return {
          icon: getIconForApp(app.name),
          label: app.name,
          imageIcon: app.icon_url || undefined,
          gradient: app.gradient,
          onClick: () => setOpenCaseStudyApp(app)
        };
      })
    : [];
  
  useEffect(() => {
    document.body.className = selectedGradient;
  }, [selectedGradient]);

  // Show notification 3 seconds after home screen appears
  useEffect(() => {
    if (!showBoot && !showWelcome) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showBoot, showWelcome]);

    return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Homescreen Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${customBackground || homescreenBg})` }}
      />
      
      <AnimatePresence>
        {showBoot && (
          <BootScreen 
            onComplete={() => {
              setShowBoot(false);
              setShowWelcome(true);
            }} 
          />
        )}
        {showWelcome && (
          <WelcomeScreen onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showBoot && !showWelcome && (
        <>
          {showNotification && (
            <WelcomeNotification onDismiss={() => setShowNotification(false)} />
          )}
          <StatusBar onControlCentreOpen={() => setShowControlCentre(true)} />
          
          <AnimatePresence>
            {showControlCentre && (
              <ControlCentre 
                isOpen={showControlCentre}
                onClose={() => setShowControlCentre(false)}
                onOpenWeather={() => setOpenApp("weather")}
                onOpenInfo={() => setOpenApp("privacy")}
              />
            )}
          </AnimatePresence>
          
          {/* Main content area */}
          <div className="absolute inset-0 pt-14 pb-32 px-6 overflow-auto z-10">
            <div className="flex flex-col gap-6 h-full">
                    {/* Profile Widget */}
                    <ProfileWidget />

                    {/* App Grid */}
                    <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-4">
                      <AppIcon
                        imageIcon={infoIcon}
                        label="Info"
                        gradient="linear-gradient(135deg, #8E8E93 0%, #636366 100%)"
                        onClick={() => setOpenApp("profile")}
                      />
                      <AppIcon
                        imageIcon={photosIcon}
                        label="Photos"
                        gradient="linear-gradient(135deg, #FF9500 0%, #FF6B00 50%, #FF3B30 100%)"
                        onClick={() => setOpenApp("photos")}
                      />
                      <AppIcon
                        imageIcon={videoIcon}
                        label="Video"
                        gradient="linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
                        onClick={() => setOpenApp("youtube")}
                      />
                      <AppIcon
                        imageIcon={githubIcon}
                        label="GitHub"
                        bgColor="bg-black"
                        onClick={() => setOpenApp("github")}
                      />
                      <AppIcon
                        imageIcon="https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/appicon/education.png"
                        label="Education"
                        gradient="linear-gradient(135deg, #5856D6 0%, #3634A3 100%)"
                        onClick={() => setOpenApp("education")}
                      />
                      <AppIcon
                        imageIcon={workIcon}
                        label="Work"
                        gradient="linear-gradient(135deg, #007AFF 0%, #0051D5 100%)"
                        onClick={() => setOpenApp("briefcase")}
                      />
                      <AppIcon
                        imageIcon={notesIcon}
                        label="Notes"
                        gradient="linear-gradient(135deg, #FFD60A 0%, #FFC107 100%)"
                        onClick={() => setOpenApp("notes")}
                      />
                      <AppIcon
                        imageIcon={sureshIcon}
                        label="Suresh"
                        gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
                        onClick={() => setOpenApp("about")}
                      />
                      
                      {/* Basic Apps Row */}
                      <AppIcon
                        imageIcon={calendarIcon}
                        label="Calendar"
                        bgColor="bg-white"
                        iconColor="text-red-500"
                        onClick={() => setOpenApp("calendar")}
                      />
                      <AppIcon
                        imageIcon={clockIcon}
                        label="Clock"
                        bgColor="bg-black"
                        onClick={() => setOpenApp("clock")}
                      />
                      <AppIcon
                        imageIcon={weatherIcon}
                        label="Weather"
                        gradient="linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)"
                        onClick={() => setOpenApp("weather")}
                      />
                      <AppIcon
                        imageIcon={caseStudyIcon}
                        label="Other Apps"
                        gradient="linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
                        onClick={() => {
                          setShowCaseStudyGrid(true);
                          setOpenApp("case-study");
                        }}
                      />
                  </div>
                </div>
              </div>

          {/* Fixed elements */}
          <Dock />

          {/* App Pages */}
          <AnimatePresence>
            {openApp === "profile" && (
              <AppPage
                title="Info"
                icon={Info}
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  {/* Profile Section */}
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                      <img 
                        src={profileImage} 
                        alt="thephotomaniak"
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{infoAppSettings.app_name}</h2>
                        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          Version {infoAppSettings.version}
                        </button>
                      </div>
                    </div>

                    {/* Profile Info Fields */}
                    <div className="space-y-4">
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Codebase</span>
                        <span className="text-gray-900 dark:text-white font-medium">{infoAppSettings.codebase}</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Est.</span>
                        <span className="text-gray-900 dark:text-white font-medium">{infoAppSettings.established_year}</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">License</span>
                        <span className="text-gray-900 dark:text-white font-medium">{infoAppSettings.license}</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Origin</span>
                        <span className="text-red-500 font-medium">{infoAppSettings.origin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Settings Menu */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => setOpenApp("privacy")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">{infoAppSettings.privacy_label}</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("private-info")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">{infoAppSettings.license_label}</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("schedule")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">{infoAppSettings.logs_label}</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("linked-accounts")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-400 flex items-center justify-center flex-shrink-0">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">{infoAppSettings.acknowledgements_label}</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>
                  </div>

                  {/* Authorise Login Button */}
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <LogIn className="w-5 h-5 text-white" />
                    </div>
                    <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">Authorise Login</span>
                    <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                  </button>

                  {/* Reboot Slider */}
                  <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <motion.div
                        className="relative h-14 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 dark:from-red-500/30 dark:to-red-600/30 backdrop-blur-md border border-red-500/30 overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          drag="x"
                          dragConstraints={{ left: 0, right: 200 }}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => {
                            if (info.offset.x > 150) {
                              // Clear all app data
                              localStorage.clear();
                              sessionStorage.clear();
                              document.cookie.split(";").forEach((c) => {
                                document.cookie = c
                                  .replace(/^ +/, "")
                                  .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                              });
                              // Reload the page
                              window.location.reload();
                            }
                          }}
                          className="absolute left-1 top-1 h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
                        >
                          <RotateCcw className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-red-600 dark:text-red-400 font-semibold text-sm tracking-wide">
                            Slide to Reboot
                          </span>
                        </div>
                      </motion.div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                        Reboot will clear all data, cookies, and cache
                      </p>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "photos" && (
              <AppPage
                title="Portfolio"
                icon={Image}
                onClose={() => setOpenApp(null)}
              >
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-2xl overflow-hidden cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPhotoIndex(i)}
                    >
                      <img 
                        src={photo} 
                        alt={`Portfolio ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </AppPage>
            )}

            <AnimatePresence>
              {selectedPhotoIndex !== null && (
                <PhotoViewer
                  photos={photos}
                  initialIndex={selectedPhotoIndex}
                  onClose={() => setSelectedPhotoIndex(null)}
                />
              )}
            </AnimatePresence>

            {openApp === "youtube" && (
              <AppPage
                title="Videos"
                icon={Youtube}
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-6">
                  {videos.map((video, i) => (
                    <div key={i} className="space-y-2">
                      <VideoEmbed url={video.url} title={video.title} />
                      <p className="text-white dark:text-gray-200 font-medium px-1">{video.title}</p>
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "github" && (
              <AppPage
                title="Projects"
                icon={Github}
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-6">
                  {projects.map((project, i) => (
                    <motion.div 
                      key={i} 
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {project.thumbnail && (
                        <img 
                          src={project.thumbnail} 
                          alt={project.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-gray-900 dark:text-white text-xl font-bold">{project.name}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                        <div className="flex gap-3">
                          {'sourceUrl' in project && project.sourceUrl && (
                            <button 
                              onClick={() => window.open(project.sourceUrl, "_blank")}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              Source
                            </button>
                          )}
                          {'demoUrl' in project && project.demoUrl && (
                            <button 
                              onClick={() => window.open(project.demoUrl, "_blank")}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </button>
                          )}
                          {'tech' in project && project.tech && (
                            <div className="inline-block px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{project.tech}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "education" && (
              <EducationApp onClose={() => setOpenApp(null)} />
            )}

            {openApp === "briefcase" && (
              <AppPage
                title="Work History"
                icon={Briefcase}
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-4">
                  {workExperience.map((work, i) => (
                    <div key={i} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{work.company}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{work.position}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{work.period}</p>
                      {work.description && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "notes" && (
              <NotesApp onClose={() => setOpenApp(null)} />
            )}

            {openApp === "calendar" && (
              <AppPage
                title="Calendar"
                icon={CalendarIcon}
                onClose={() => setOpenApp(null)}
              >
                {iframeSettings.calendar_url ? (
                  <IframeApp url={iframeSettings.calendar_url} title="Calendar" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8">
                      <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Calendar App</h3>
                      <p className="text-gray-500 dark:text-gray-400">Configure iframe URL in Admin Panel → Iframe Apps</p>
                    </div>
                  </div>
                )}
              </AppPage>
            )}

            {openApp === "clock" && (
              <AppPage
                title="Clock"
                icon={Clock}
                onClose={() => setOpenApp(null)}
              >
                {iframeSettings.clock_url ? (
                  <IframeApp url={iframeSettings.clock_url} title="Clock" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clock App</h3>
                      <p className="text-gray-500 dark:text-gray-400">Configure iframe URL in Admin Panel → Iframe Apps</p>
                    </div>
                  </div>
                )}
              </AppPage>
            )}

            {openApp === "weather" && (
              <AppPage
                title="Weather"
                icon={Cloud}
                onClose={() => setOpenApp(null)}
              >
                {iframeSettings.weather_url ? (
                  <IframeApp url={iframeSettings.weather_url} title="Weather" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8">
                      <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Weather App</h3>
                      <p className="text-gray-500 dark:text-gray-400">Configure iframe URL in Admin Panel → Iframe Apps</p>
                    </div>
                  </div>
                )}
              </AppPage>
            )}

            {openApp === "about" && (
              <AppPage
                title="Suresh"
                icon={User}
                onClose={() => setOpenApp(null)}
              >
                {iframeSettings.suresh_url ? (
                  <IframeApp url={iframeSettings.suresh_url} title="Suresh" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8">
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Suresh App</h3>
                      <p className="text-gray-500 dark:text-gray-400">Configure iframe URL in Admin Panel → Iframe Apps</p>
                    </div>
                  </div>
                )}
              </AppPage>
            )}

            {openApp === "privacy" && (
              <AppPage
                title="Privacy Settings"
                icon={Info}
                onClose={() => setOpenApp("profile")}
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Account Privacy</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Control who can see your content and interact with you</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Private Account</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Only approved followers can see your posts</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 dark:bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Activity Status</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Show when you are active</p>
                      </div>
                      <div className="w-12 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Story Sharing</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Allow others to share your story</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 dark:bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Data & History</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Manage your data and viewing history</p>
                      
                      <button className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-left">
                        <p className="text-gray-900 dark:text-white font-medium">Download Your Data</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Request a copy of your information</p>
                      </button>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "private-info" && (
              <AppPage
                title="Private Information"
                icon={User}
                onClose={() => setOpenApp("profile")}
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Your personal contact details</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-900 dark:text-white">jonathan@example.com</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-900 dark:text-white">+31 6 1234 5678</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-900 dark:text-white">January 15, 1990</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Address</label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-900 dark:text-white">Rotterdam, Netherlands</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                        Edit Information
                      </button>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "schedule" && (
              <AppPage
                title="Posting Schedule"
                icon={CalendarIcon}
                onClose={() => setOpenApp("profile")}
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Schedule Your Posts</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically publish your content at optimal times</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Auto-Schedule</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Post at the best times for engagement</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 dark:bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Preferred Posting Times</h3>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-900 dark:text-white font-medium">Monday - Friday</p>
                            <p className="text-gray-600 dark:text-gray-300">9:00 AM, 3:00 PM</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-900 dark:text-white font-medium">Saturday - Sunday</p>
                            <p className="text-gray-600 dark:text-gray-300">11:00 AM, 6:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full py-3 bg-orange-500 dark:bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors">
                        Customize Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "linked-accounts" && (
              <AppPage
                title="Linked Accounts"
                icon={Github}
                onClose={() => setOpenApp("profile")}
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Connected Accounts</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your social media connections</p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Github className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Instagram</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">@thephotomaniak</p>
                          </div>
                        </div>
                        <button className="text-blue-500 dark:text-blue-400 font-medium text-sm">Connected</button>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">YouTube</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Not connected</p>
                          </div>
                        </div>
                        <button className="text-gray-500 dark:text-gray-400 font-medium text-sm">Connect</button>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black dark:bg-gray-700 flex items-center justify-center">
                            <Github className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">GitHub</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">@jonathan_dev</p>
                          </div>
                        </div>
                        <button className="text-blue-500 dark:text-blue-400 font-medium text-sm">Connected</button>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Twitter</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Not connected</p>
                          </div>
                        </div>
                        <button className="text-gray-500 dark:text-gray-400 font-medium text-sm">Connect</button>
                      </div>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}
          </AnimatePresence>

          {/* Case Study Grid (Other Apps) */}
          <AnimatePresence>
            {showCaseStudyGrid && (
              <CaseStudyGrid
                apps={caseStudyApps}
                onClose={() => {
                  setShowCaseStudyGrid(false);
                  setOpenApp(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* Case Study Individual Pages */}
          <AnimatePresence>
            {openCaseStudyApp && openCaseStudyApp.embed_url && (
              <motion.div
                className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="h-20 flex items-end justify-between px-6 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <motion.button
                    onClick={() => {
                      setOpenCaseStudyApp(null);
                      setShowCaseStudyGrid(true);
                    }}
                    className="flex items-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-8 h-8 text-blue-500" strokeWidth={2.5} />
                    <span className="text-blue-500 text-lg ml-1">Back</span>
                  </motion.button>
                  
                  <div className="flex items-center gap-3">
                    {openCaseStudyApp.icon_url ? (
                      <img src={openCaseStudyApp.icon_url} alt={openCaseStudyApp.name} className="w-10 h-10 rounded-xl" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        {(() => {
                          const Icon = getIconForApp(openCaseStudyApp.name);
                          return <Icon className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />;
                        })()}
                      </div>
                    )}
                    <h1 className="text-gray-900 dark:text-white text-xl font-bold">{openCaseStudyApp.name}</h1>
                  </div>
                  
                  <div className="w-20" />
                </div>
                <iframe 
                  src={openCaseStudyApp.embed_url}
                  className="flex-1 w-full border-0"
                  title={openCaseStudyApp.name}
                  allow="geolocation"
                />
              </motion.div>
            )}
            {openCaseStudyApp && !openCaseStudyApp.embed_url && (
              <CaseStudyPage
                title={openCaseStudyApp.name}
                icon={getIconForApp(openCaseStudyApp.name)}
                iconUrl={openCaseStudyApp.icon_url || undefined}
                htmlContent={openCaseStudyApp.html_content || undefined}
                onClose={() => {
                  setOpenCaseStudyApp(null);
                  setShowCaseStudyGrid(true);
                }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Index;
