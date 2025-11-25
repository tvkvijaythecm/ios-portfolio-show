import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Settings,
  Image,
  Youtube,
  Github,
  Calendar as CalendarIcon,
  Clock,
  Cloud,
  Music,
  Briefcase,
  FileText,
  BookOpen,
  User,
} from "lucide-react";
import BootScreen from "@/components/BootScreen";
import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import Dock from "@/components/Dock";
import ProfileWidget from "@/components/ProfileWidget";
import PageIndicator from "@/components/PageIndicator";
import AppPage from "@/components/AppPage";

type AppType = "settings" | "photos" | "youtube" | "github" | "calendar" | "clock" | "weather" | "music" | "briefcase" | "notes" | "education" | null;

const Index = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [openApp, setOpenApp] = useState<AppType>(null);

  const handleSwipe = (direction: number) => {
    if (direction > 0 && currentPage < 1) {
      setCurrentPage(1);
    } else if (direction < 0 && currentPage > 0) {
      setCurrentPage(0);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden ios-gradient">
      <AnimatePresence>
        {showBoot && <BootScreen onComplete={() => setShowBoot(false)} />}
      </AnimatePresence>

      {!showBoot && (
        <>
          <StatusBar />
          
          {/* Swipeable content area - excludes dock */}
          <div className="absolute inset-0 pt-14 pb-32 overflow-hidden">
            <motion.div
              className="h-full px-6"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                const swipeVelocity = Math.abs(info.velocity.x);
                
                // Enhanced swipe detection
                if (Math.abs(info.offset.x) > swipeThreshold || swipeVelocity > 500) {
                  handleSwipe(info.offset.x);
                }
              }}
            >
              <motion.div
                animate={{ x: currentPage === 0 ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full flex"
                style={{ width: "200%" }}
              >
                {/* Page 1 - Main Portfolio */}
                <div className="w-1/2 flex-shrink-0 h-full pr-6">
                  <div className="flex flex-col gap-6 h-full">
                    {/* Profile Widget */}
                    <ProfileWidget />

                    {/* App Grid */}
                    <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-4">
                      <AppIcon
                        icon={Settings}
                        label="Settings"
                        gradient="linear-gradient(135deg, #8E8E93 0%, #636366 100%)"
                        onClick={() => setOpenApp("settings")}
                      />
                      <AppIcon
                        icon={Image}
                        label="Photos"
                        gradient="linear-gradient(135deg, #FF9500 0%, #FF6B00 50%, #FF3B30 100%)"
                        onClick={() => setOpenApp("photos")}
                      />
                      <AppIcon
                        icon={Youtube}
                        label="YouTube"
                        gradient="linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
                        onClick={() => setOpenApp("youtube")}
                      />
                      <AppIcon
                        icon={Github}
                        label="GitHub"
                        bgColor="bg-black"
                        onClick={() => setOpenApp("github")}
                      />
                      <AppIcon
                        icon={BookOpen}
                        label="Education"
                        gradient="linear-gradient(135deg, #5856D6 0%, #3634A3 100%)"
                        onClick={() => setOpenApp("education")}
                      />
                      <AppIcon
                        icon={Briefcase}
                        label="Work"
                        gradient="linear-gradient(135deg, #007AFF 0%, #0051D5 100%)"
                        onClick={() => setOpenApp("briefcase")}
                      />
                      <AppIcon
                        icon={FileText}
                        label="Notes"
                        gradient="linear-gradient(135deg, #FFD60A 0%, #FFC107 100%)"
                        onClick={() => setOpenApp("notes")}
                      />
                      <AppIcon
                        icon={User}
                        label="Profile"
                        gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
                      />
                      
                      {/* Basic Apps Row */}
                      <AppIcon
                        icon={CalendarIcon}
                        label="Calendar"
                        bgColor="bg-white"
                        iconColor="text-red-500"
                        onClick={() => setOpenApp("calendar")}
                      />
                      <AppIcon
                        icon={Clock}
                        label="Clock"
                        bgColor="bg-black"
                        onClick={() => setOpenApp("clock")}
                      />
                      <AppIcon
                        icon={Cloud}
                        label="Weather"
                        gradient="linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)"
                        onClick={() => setOpenApp("weather")}
                      />
                      <AppIcon
                        icon={Music}
                        label="Music"
                        gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
                        onClick={() => setOpenApp("music")}
                      />
                    </div>
                  </div>
                </div>

                {/* Page 2 - Additional Apps */}
                <div className="w-1/2 flex-shrink-0 h-full pr-6">
                  <div className="grid grid-cols-4 gap-x-4 gap-y-6 pt-6">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <AppIcon
                        key={i}
                        icon={Settings}
                        label={`App ${i + 1}`}
                        bgColor="bg-gray-400"
                        onClick={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Fixed elements - outside swipeable area */}
          <PageIndicator currentPage={currentPage} totalPages={2} />
          <Dock />

          {/* App Pages */}
          <AnimatePresence>
            {openApp === "settings" && (
              <AppPage
                title="Profile"
                icon={Settings}
                gradient="linear-gradient(135deg, #8E8E93 0%, #636366 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Name</h2>
                      <p className="text-gray-600">Designer & Developer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">your.email@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 font-medium">+1 234 567 8900</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900 font-medium">San Francisco, CA</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-900">Passionate about creating beautiful and functional designs.</p>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "photos" && (
              <AppPage
                title="Portfolio"
                icon={Image}
                gradient="linear-gradient(135deg, #FF9500 0%, #FF3B30 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Image className="w-12 h-12 text-white/50" />
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "youtube" && (
              <AppPage
                title="Videos"
                icon={Youtube}
                gradient="linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Youtube className="w-16 h-16 text-white/50" />
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "github" && (
              <AppPage
                title="Case Studies"
                icon={Github}
                bgColor="bg-gray-900"
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-4">
                  {["Project Alpha", "Project Beta", "Project Gamma"].map((project, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-white text-xl font-bold mb-2">{project}</h3>
                      <p className="text-white/70">A detailed case study of {project.toLowerCase()}...</p>
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "education" && (
              <AppPage
                title="Education"
                icon={BookOpen}
                gradient="linear-gradient(135deg, #5856D6 0%, #3634A3 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-4">
                  {[
                    { school: "University Name", degree: "Bachelor's Degree", year: "2018 - 2022" },
                    { school: "High School", degree: "High School Diploma", year: "2014 - 2018" },
                  ].map((edu, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900">{edu.school}</h3>
                      <p className="text-gray-600 mt-1">{edu.degree}</p>
                      <p className="text-gray-500 text-sm mt-2">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "briefcase" && (
              <AppPage
                title="Work History"
                icon={Briefcase}
                gradient="linear-gradient(135deg, #007AFF 0%, #0051D5 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="space-y-4">
                  {[
                    { company: "Company A", position: "Senior Designer", period: "2022 - Present" },
                    { company: "Company B", position: "Designer", period: "2020 - 2022" },
                  ].map((work, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900">{work.company}</h3>
                      <p className="text-gray-600 mt-1">{work.position}</p>
                      <p className="text-gray-500 text-sm mt-2">{work.period}</p>
                    </div>
                  ))}
                </div>
              </AppPage>
            )}

            {openApp === "notes" && (
              <AppPage
                title="Guest Book"
                icon={FileText}
                gradient="linear-gradient(135deg, #FFD60A 0%, #FFC107 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6">
                  <p className="text-gray-700 mb-4">Leave a message in the guest book!</p>
                  <textarea
                    className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none resize-none"
                    placeholder="Write your message here..."
                  />
                  <button className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                    Submit
                  </button>
                </div>
              </AppPage>
            )}

            {openApp === "calendar" && (
              <AppPage
                title="Calendar"
                icon={CalendarIcon}
                bgColor="bg-white"
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700">Calendar functionality coming soon...</p>
                </div>
              </AppPage>
            )}

            {openApp === "clock" && (
              <AppPage
                title="Clock"
                icon={Clock}
                bgColor="bg-black"
                onClose={() => setOpenApp(null)}
              >
                <div className="text-white text-center">
                  <p className="text-6xl font-thin">{new Date().toLocaleTimeString()}</p>
                </div>
              </AppPage>
            )}

            {openApp === "weather" && (
              <AppPage
                title="Weather"
                icon={Cloud}
                gradient="linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="text-white text-center">
                  <p className="text-7xl font-thin mb-4">22°</p>
                  <p className="text-2xl">Sunny</p>
                </div>
              </AppPage>
            )}

            {openApp === "music" && (
              <AppPage
                title="Music"
                icon={Music}
                gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
                onClose={() => setOpenApp(null)}
              >
                <div className="text-white text-center">
                  <p className="text-xl">Now Playing</p>
                  <p className="text-3xl font-bold mt-4">No music playing</p>
                </div>
              </AppPage>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Index;
