import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Image, label: "Background", path: "/admin/dashboard/background" },
  { icon: Smartphone, label: "Boot Screen", path: "/admin/dashboard/boot" },
  { icon: Grid3X3, label: "App Manager", path: "/admin/dashboard/apps" },
  { icon: User, label: "About Content", path: "/admin/dashboard/about" },
  { icon: GraduationCap, label: "Education", path: "/admin/dashboard/education" },
  { icon: FolderOpen, label: "Case Studies", path: "/admin/dashboard/case-studies" },
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
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

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
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-slate-800/50 backdrop-blur-xl border-r border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                isActive(item.path)
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 text-left"
                >
                  {item.label}
                </motion.span>
              )}
              {sidebarOpen && isActive(item.path) && (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
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
              "mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10",
              sidebarOpen ? "w-full justify-start" : "w-full justify-center"
            )}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {isOverviewPage ? (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-white/60 mb-8">Manage your portfolio app from here.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.slice(1).map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(item.path)}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.label}</h3>
                  <p className="text-white/40 text-sm">Manage {item.label.toLowerCase()}</p>
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
