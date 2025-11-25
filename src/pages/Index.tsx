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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BootScreen from "@/components/BootScreen";
import StatusBar from "@/components/StatusBar";
import AppIcon from "@/components/AppIcon";
import Dock from "@/components/Dock";
import ProfileWidget from "@/components/ProfileWidget";
import AppPage from "@/components/AppPage";

type AppType = "settings" | "photos" | "youtube" | "github" | "calendar" | "clock" | "weather" | "music" | "briefcase" | "notes" | "education" | "privacy" | "private-info" | "schedule" | "linked-accounts" | null;

const Index = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [openApp, setOpenApp] = useState<AppType>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden ios-gradient">
      <AnimatePresence>
        {showBoot && <BootScreen onComplete={() => setShowBoot(false)} />}
      </AnimatePresence>

      {!showBoot && (
        <>
          <StatusBar />
          
          {/* Main content area */}
          <div className="absolute inset-0 pt-14 pb-32 px-6 overflow-auto">
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

          {/* Fixed elements */}
          <Dock />

          {/* App Pages */}
          <AnimatePresence>
            {openApp === "settings" && (
              <AppPage
                title="Settings"
                icon={Settings}
                onClose={() => setOpenApp(null)}
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">thephotomaniak</h2>
                      <button className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                        Change profile picture
                      </button>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4 pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Name</span>
                      <span className="text-gray-900 font-medium">Jonathan</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Username</span>
                      <span className="text-gray-900 font-medium">thephotomaniak</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Job</span>
                      <span className="text-gray-900 font-medium">Photographer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Location</span>
                      <span className="text-pink-500 font-medium">Rotterdam, NL</span>
                    </div>
                  </div>

                  {/* Settings Menu */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => setOpenApp("privacy")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium">Privacy settings</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("private-info")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium">Private information</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("schedule")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium">Posting schedule settings</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => setOpenApp("linked-accounts")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-400 flex items-center justify-center flex-shrink-0">
                        <Github className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium">Linked accounts</span>
                      <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
                    </button>
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
                onClose={() => setOpenApp(null)}
              >
                <div className="min-h-full bg-black/80 backdrop-blur-sm rounded-3xl p-6">
                  {/* Year Header */}
                  <div className="mb-8">
                    <h2 className="text-5xl font-bold text-red-500">2025</h2>
                    <div className="h-px bg-white/20 mt-4" />
                  </div>

                  {/* Year Overview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, monthIndex) => {
                      const isCurrentMonth = monthIndex === new Date().getMonth();
                      const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
                      const firstDay = new Date(2025, monthIndex, 1).getDay();
                      const today = new Date().getDate();
                      const currentMonth = new Date().getMonth();
                      
                      return (
                        <div key={month} className="text-white">
                          <h3 className={`text-2xl font-bold mb-3 ${isCurrentMonth ? 'text-red-500' : ''}`}>
                            {month}
                          </h3>
                          <div className="grid grid-cols-7 gap-1 text-sm">
                            {/* Days */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                              const day = dayIndex + 1;
                              const isToday = monthIndex === currentMonth && day === today;
                              
                              return (
                                <div
                                  key={day}
                                  className={`aspect-square flex items-center justify-center rounded-full text-center ${
                                    isToday 
                                      ? 'bg-red-500 text-white font-bold' 
                                      : 'text-white/80'
                                  }`}
                                >
                                  {day}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "clock" && (
              <AppPage
                title="Clock"
                icon={Clock}
                onClose={() => setOpenApp(null)}
              >
                <div className="flex flex-col items-center justify-start pt-8 pb-12 min-h-full">
                  {/* Main Clock */}
                  <div className="relative w-80 h-80 mb-16">
                    {/* Gradient Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                      <defs>
                        <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
                          <stop offset="25%" style={{ stopColor: '#FF8E53', stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: '#9B59B6', stopOpacity: 1 }} />
                          <stop offset="75%" style={{ stopColor: '#3498DB', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#2980B9', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="url(#clockGradient)"
                        strokeWidth="8"
                      />
                    </svg>

                    {/* Clock Face */}
                    <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
                      {/* Hour Markers */}
                      {[0, 3, 6, 9].map((hour) => {
                        const angle = (hour * 30 - 90) * (Math.PI / 180);
                        const x = 50 + 42 * Math.cos(angle);
                        const y = 50 + 42 * Math.sin(angle);
                        return (
                          <div
                            key={hour}
                            className="absolute w-2 h-2 bg-white rounded-full"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        );
                      })}

                      {/* Clock Hands */}
                      <div className="absolute inset-0">
                        {/* Hour Hand */}
                        <div
                          className="absolute left-1/2 top-1/2 w-1 bg-white rounded-full origin-bottom"
                          style={{
                            height: '25%',
                            transform: `translate(-50%, -100%) rotate(${(new Date().getHours() % 12) * 30 + new Date().getMinutes() * 0.5}deg)`,
                          }}
                        />
                        {/* Minute Hand */}
                        <div
                          className="absolute left-1/2 top-1/2 w-1 bg-white rounded-full origin-bottom"
                          style={{
                            height: '35%',
                            transform: `translate(-50%, -100%) rotate(${new Date().getMinutes() * 6}deg)`,
                          }}
                        />
                        {/* Center Dot */}
                        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                      </div>

                      {/* Digital Time */}
                      <div className="text-center">
                        <p className="text-white text-5xl font-light tracking-wider">
                          {new Date().toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </p>
                        <p className="text-white/60 text-sm mt-2 tracking-wide">
                          {new Date().toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* World Clocks */}
                  <div className="w-full max-w-md space-y-6">
                    <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-6">
                      <p className="text-gray-900 text-4xl font-light tracking-wide">
                        {new Date().toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'America/Los_Angeles'
                        })}
                      </p>
                      <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">San Francisco</p>
                    </div>

                    <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-6">
                      <p className="text-gray-900 text-4xl font-light tracking-wide">
                        {new Date().toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Europe/London'
                        })}
                      </p>
                      <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">London</p>
                    </div>
                  </div>
                </div>
              </AppPage>
            )}

            {openApp === "weather" && (
              <AppPage
                title="Weather"
                icon={Cloud}
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
                onClose={() => setOpenApp(null)}
              >
                <div className="text-white text-center">
                  <p className="text-xl">Now Playing</p>
                  <p className="text-3xl font-bold mt-4">No music playing</p>
                </div>
              </AppPage>
            )}

            {openApp === "privacy" && (
              <AppPage
                title="Privacy Settings"
                icon={Settings}
                onClose={() => setOpenApp("settings")}
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Account Privacy</h3>
                      <p className="text-gray-600 text-sm">Control who can see your content and interact with you</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 font-medium">Private Account</p>
                        <p className="text-gray-500 text-sm">Only approved followers can see your posts</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div>
                        <p className="text-gray-900 font-medium">Activity Status</p>
                        <p className="text-gray-500 text-sm">Show when you are active</p>
                      </div>
                      <div className="w-12 h-7 bg-gray-300 rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div>
                        <p className="text-gray-900 font-medium">Story Sharing</p>
                        <p className="text-gray-500 text-sm">Allow others to share your story</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 rounded-full"></div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Data & History</h3>
                      <p className="text-gray-600 text-sm mb-4">Manage your data and viewing history</p>
                      
                      <button className="w-full p-4 rounded-xl bg-gray-50 text-left">
                        <p className="text-gray-900 font-medium">Download Your Data</p>
                        <p className="text-gray-500 text-sm mt-1">Request a copy of your information</p>
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
                onClose={() => setOpenApp("settings")}
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Information</h3>
                      <p className="text-gray-600 text-sm">Your personal contact details</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">Email Address</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-900">jonathan@example.com</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Phone Number</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-900">+31 6 1234 5678</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Birth Date</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-900">January 15, 1995</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Gender</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-900">Male</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors">
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
                onClose={() => setOpenApp("settings")}
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Your Posts</h3>
                      <p className="text-gray-600 text-sm">Automatically publish your content at optimal times</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 font-medium">Auto-Schedule</p>
                        <p className="text-gray-500 text-sm">Post at the best times for engagement</p>
                      </div>
                      <div className="w-12 h-7 bg-blue-500 rounded-full"></div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Preferred Posting Times</h3>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-900 font-medium">Monday - Friday</p>
                            <p className="text-gray-600">9:00 AM, 3:00 PM</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-900 font-medium">Saturday - Sunday</p>
                            <p className="text-gray-600">11:00 AM, 6:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="w-full py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors">
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
                onClose={() => setOpenApp("settings")}
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Connected Accounts</h3>
                      <p className="text-gray-600 text-sm">Manage your social media connections</p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Github className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">Instagram</p>
                            <p className="text-gray-500 text-sm">@thephotomaniak</p>
                          </div>
                        </div>
                        <button className="text-blue-500 font-medium text-sm">Connected</button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">YouTube</p>
                            <p className="text-gray-500 text-sm">Not connected</p>
                          </div>
                        </div>
                        <button className="text-gray-500 font-medium text-sm">Connect</button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                            <Github className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">GitHub</p>
                            <p className="text-gray-500 text-sm">@jonathan_dev</p>
                          </div>
                        </div>
                        <button className="text-blue-500 font-medium text-sm">Connected</button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">Twitter</p>
                            <p className="text-gray-500 text-sm">Not connected</p>
                          </div>
                        </div>
                        <button className="text-gray-500 font-medium text-sm">Connect</button>
                      </div>
                    </div>
                  </div>
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
