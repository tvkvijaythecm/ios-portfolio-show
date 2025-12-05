import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResetPassword from "./pages/AdminResetPassword";
import BackgroundSettings from "./pages/admin/BackgroundSettings";
import BootSettings from "./pages/admin/BootSettings";
import AppManager from "./pages/admin/AppManager";
import AboutSettings from "./pages/admin/AboutSettings";
import EducationSettings from "./pages/admin/EducationSettings";
import CaseStudySettings from "./pages/admin/CaseStudySettings";
import WelcomeSettings from "./pages/admin/WelcomeSettings";
import ControlCentreSettings from "./pages/admin/ControlCentreSettings";
import NotesSettings from "./pages/admin/NotesSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route path="background" element={<BackgroundSettings />} />
              <Route path="boot" element={<BootSettings />} />
              <Route path="apps" element={<AppManager />} />
              <Route path="about" element={<AboutSettings />} />
              <Route path="education" element={<EducationSettings />} />
              <Route path="case-studies" element={<CaseStudySettings />} />
              <Route path="welcome" element={<WelcomeSettings />} />
              <Route path="control-centre" element={<ControlCentreSettings />} />
              <Route path="notes" element={<NotesSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
