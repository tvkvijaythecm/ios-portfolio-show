import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import profileImage from "@/assets/profile.jpeg";
import aboutIcon from "@/assets/about-icon.png";
import backgroundImage from "@/assets/background.png";
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
import BootScreen from "@/components/BootScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import Dock from "@/components/Dock";
import ProfileWidget from "@/components/ProfileWidget";
import AppPage from "@/components/AppPage";
import CalendarView from "@/components/CalendarView";
import WeatherApp from "@/components/WeatherApp";
import ClockApp from "@/components/ClockApp";
import PhotoViewer from "@/components/PhotoViewer";
import VideoEmbed from "@/components/VideoEmbed";
import CaseStudyFolder from "@/components/CaseStudyFolder";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import CaseStudyPage from "@/components/CaseStudyPage";
import AboutApp from "@/components/AboutApp";
import WelcomeNotification from "@/components/WelcomeNotification";
import EducationApp from "@/components/EducationApp";
import ParticleBackground from "@/components/ParticleBackground";

type AppType = "profile" | "photos" | "youtube" | "github" | "calendar" | "clock" | "weather" | "case-study" | "briefcase" | "notes" | "education" | "privacy" | "private-info" | "schedule" | "linked-accounts" | "about" | null;
type CaseStudyAppType = "analytics" | "growth" | "performance" | "insights" | "metrics" | "goals" | "achievements" | "innovation" | "strategy" | null;

const Index = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [openApp, setOpenApp] = useState<AppType>(null);
  const [selectedGradient, setSelectedGradient] = useState("ios-gradient");
  const { theme, setTheme } = useTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showCaseStudyGrid, setShowCaseStudyGrid] = useState(false);
  const [openCaseStudyApp, setOpenCaseStudyApp] = useState<CaseStudyAppType>(null);

  const photos = [photo1, photo2, photo3, photo4, photo5, photo6];
  const projects = [
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

  const videos = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Creative Showcase Reel" },
    { url: "https://vimeo.com/148751763", title: "Design Process Documentary" },
    { url: "https://www.youtube.com/watch?v=9bZkp7q19f0", title: "Project Walkthrough" },
  ];

  const caseStudyMiniApps = [
    { icon: TrendingUp, gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)" },
    { icon: BarChart, gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)" },
    { icon: PieChart, gradient: "linear-gradient(135deg, #FFA502 0%, #FF6348 100%)" },
    { icon: LineChart, gradient: "linear-gradient(135deg, #5F27CD 0%, #341F97 100%)" },
  ];

  const caseStudyApps = [
    { icon: TrendingUp, label: "Analytics", gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)", onClick: () => setOpenCaseStudyApp("analytics") },
    { icon: BarChart, label: "Growth", gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)", onClick: () => setOpenCaseStudyApp("growth") },
    { icon: PieChart, label: "Performance", gradient: "linear-gradient(135deg, #FFA502 0%, #FF6348 100%)", onClick: () => setOpenCaseStudyApp("performance") },
    { icon: LineChart, label: "Insights", gradient: "linear-gradient(135deg, #5F27CD 0%, #341F97 100%)", onClick: () => setOpenCaseStudyApp("insights") },
    { icon: Target, label: "Metrics", gradient: "linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%)", onClick: () => setOpenCaseStudyApp("metrics") },
    { icon: Award, label: "Goals", gradient: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)", onClick: () => setOpenCaseStudyApp("goals") },
    { icon: Lightbulb, label: "Achievements", gradient: "linear-gradient(135deg, #FFD89B 0%, #19547B 100%)", onClick: () => setOpenCaseStudyApp("achievements") },
    { icon: Layers, label: "Innovation", gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)", onClick: () => setOpenCaseStudyApp("innovation") },
    { icon: Folder, label: "Strategy", gradient: "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)", onClick: () => setOpenCaseStudyApp("strategy") },
  ];
  
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
      {/* Animated Particle Background */}
      <ParticleBackground />
      
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
          <StatusBar />
          
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
                        imageIcon="https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/appicon/calendar.png"
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
                        label="Case Study"
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
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">thephotomaniak</h2>
                        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          Change profile picture
                        </button>
                      </div>
                    </div>

                    {/* Profile Info Fields */}
                    <div className="space-y-4">
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Name</span>
                        <span className="text-gray-900 dark:text-white font-medium">Jonathan</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Username</span>
                        <span className="text-gray-900 dark:text-white font-medium">thephotomaniak</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Job</span>
                        <span className="text-gray-900 dark:text-white font-medium">Photographer</span>
                      </div>
                      <div className="flex items-center py-3">
                        <span className="text-gray-500 dark:text-gray-400 w-32">Location</span>
                        <span className="text-red-500 font-medium">Rotterdam, NL</span>
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
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">Privacy settings</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("private-info")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">Private information</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("schedule")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">Posting schedule settings</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("linked-accounts")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-400 flex items-center justify-center flex-shrink-0">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 font-medium">Linked accounts</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 dark:text-gray-600 rotate-180" />
                    </button>
                  </div>

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
                title="Case Studies"
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
                      <img 
                        src={project.thumbnail} 
                        alt={project.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-gray-900 dark:text-white text-xl font-bold">{project.name}</h3>
                          <ExternalLink className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
                        <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{project.tech}</p>
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
                  {[
                    { company: "Company A", position: "Senior Designer", period: "2022 - Present" },
                    { company: "Company B", position: "Designer", period: "2020 - 2022" },
                  ].map((work, i) => (
                    <div key={i} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{work.company}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{work.position}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{work.period}</p>
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "notes" && (
              <AppPage
                title="Guest Book"
                icon={FileText}
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Leave a message in the guest book!</p>
                  <textarea
                    className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-yellow-400 dark:focus:border-yellow-500 focus:outline-none resize-none"
                    placeholder="Write your message here..."
                  />
                  <button className="mt-4 w-full bg-yellow-500 dark:bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors">
                    Submit
                  </button>
                </div>
              </AppPage>
            )}

            {openApp === "calendar" && (
              <AppPage
                title="Calendar"
                icon={CalendarIcon}
                onClose={() => setOpenApp(null)}
              >
                <CalendarView />
              </AppPage>
            )}

            {openApp === "clock" && (
              <AppPage
                title="Clock"
                icon={Clock}
                onClose={() => setOpenApp(null)}
              >
                <ClockApp />
              </AppPage>
            )}

            {openApp === "weather" && (
              <AppPage
                title="Weather"
                icon={Cloud}
                onClose={() => setOpenApp(null)}
              >
                <WeatherApp />
              </AppPage>
            )}

            {openApp === "about" && (
              <AppPage
                title="About"
                icon={User}
                onClose={() => setOpenApp(null)}
              >
                <AboutApp />
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

          {/* Case Study Grid */}
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
            {openCaseStudyApp && (
              <CaseStudyPage
                title={caseStudyApps.find(app => 
                  (openCaseStudyApp === "analytics" && app.label === "Analytics") ||
                  (openCaseStudyApp === "growth" && app.label === "Growth") ||
                  (openCaseStudyApp === "performance" && app.label === "Performance") ||
                  (openCaseStudyApp === "insights" && app.label === "Insights") ||
                  (openCaseStudyApp === "metrics" && app.label === "Metrics") ||
                  (openCaseStudyApp === "goals" && app.label === "Goals") ||
                  (openCaseStudyApp === "achievements" && app.label === "Achievements") ||
                  (openCaseStudyApp === "innovation" && app.label === "Innovation") ||
                  (openCaseStudyApp === "strategy" && app.label === "Strategy")
                )?.label || "Case Study"}
                icon={caseStudyApps.find(app => 
                  (openCaseStudyApp === "analytics" && app.label === "Analytics") ||
                  (openCaseStudyApp === "growth" && app.label === "Growth") ||
                  (openCaseStudyApp === "performance" && app.label === "Performance") ||
                  (openCaseStudyApp === "insights" && app.label === "Insights") ||
                  (openCaseStudyApp === "metrics" && app.label === "Metrics") ||
                  (openCaseStudyApp === "goals" && app.label === "Goals") ||
                  (openCaseStudyApp === "achievements" && app.label === "Achievements") ||
                  (openCaseStudyApp === "innovation" && app.label === "Innovation") ||
                  (openCaseStudyApp === "strategy" && app.label === "Strategy")
                )?.icon || Folder}
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
