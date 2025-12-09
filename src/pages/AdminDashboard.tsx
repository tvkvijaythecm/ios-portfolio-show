import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  Smartphone,
  Grid3X3,
  User,
  GraduationCap,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  StickyNote,
  Camera,
  Video,
  Github,
  Briefcase,
  Phone,
  Share2,
  Code,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Image, label: "Background", path: "/admin/dashboard/background" },
  { icon: Smartphone, label: "Boot Screen", path: "/admin/dashboard/boot" },
  { icon: Grid3X3, label: "App Manager", path: "/admin/dashboard/apps" },
  { icon: User, label: "About Content", path: "/admin/dashboard/about" },
  { icon: GraduationCap, label: "Education", path: "/admin/dashboard/education" },
  { icon: FolderOpen, label: "Other Apps", path: "/admin/dashboard/case-studies" },
  { icon: Bell, label: "Welcome Screen", path: "/admin/dashboard/welcome" },
  { icon: Settings, label: "Control Centre", path: "/admin/dashboard/control-centre" },
  { icon: StickyNote, label: "Public Notes", path: "/admin/dashboard/notes" },
  { icon: Camera, label: "Photos", path: "/admin/dashboard/photos" },
  { icon: Video, label: "Videos", path: "/admin/dashboard/videos" },
  { icon: Github, label: "GitHub Projects", path: "/admin/dashboard/github" },
  { icon: Briefcase, label: "Work Experience", path: "/admin/dashboard/work" },
  { icon: Phone, label: "Contact Settings", path: "/admin/dashboard/contact" },
  { icon: Share2, label: "Social Links", path: "/admin/dashboard/social-links" },
  { icon: Code, label: "Custom Apps", path: "/admin/dashboard/custom-apps" },
  { icon: Grid3X3, label: "Iframe Apps", path: "/admin/dashboard/iframe-apps" },
  { icon: Settings2, label: "Site Settings", path: "/admin/dashboard/site-settings" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin");
        return;
      }

      // Verify admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        toast.error("Admin access required");
        navigate("/admin");
        return;
      }

      setUser(session.user);
    } catch (error) {
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;
  const isOverviewPage = location.pathname === "/admin/dashboard";

  return (
    <div className="h-screen bg-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0, width: !isMobile && sidebarOpen ? 280 : !isMobile ? 80 : 280 }}
            exit={isMobile ? { x: -280 } : undefined}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "bg-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col z-50",
              isMobile ? "fixed inset-y-0 left-0 w-[280px] pt-16" : "relative"
            )}
          >
            {/* Desktop Header */}
            <div className="hidden md:flex p-4 border-b border-white/10 items-center justify-between">
              {sidebarOpen && (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Admin Panel
                </motion.h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm md:text-base",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(sidebarOpen || isMobile) && (
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                  )}
                  {(sidebarOpen || isMobile) && isActive(item.path) && (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </nav>

            {/* User section */}
            <div className="p-3 md:p-4 border-t border-white/10">
              <div className={cn("flex items-center gap-3", !sidebarOpen && !isMobile && "justify-center")}>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                {(sidebarOpen || isMobile) && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-white/40 text-xs">Administrator</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm",
                  (sidebarOpen || isMobile) ? "w-full justify-start" : "w-full justify-center"
                )}
              >
                <LogOut className="w-4 h-4" />
                {(sidebarOpen || isMobile) && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-0 h-full pb-20 md:pb-0">
        {isOverviewPage ? (
          <div className="p-4 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-white/60 mb-6 md:mb-8 text-sm md:text-base">Manage your portfolio app from here.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {menuItems.slice(1).map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(item.path)}
                  className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all group text-left"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-0.5 md:mb-1 text-sm md:text-base truncate">{item.label}</h3>
                  <p className="text-white/40 text-xs md:text-sm hidden sm:block">Manage {item.label.toLowerCase()}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
