import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import SEOHead from "./components/SEOHead";
import Index from "./pages/Index";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResetPassword from "./pages/AdminResetPassword";
import BackgroundSettings from "./pages/admin/BackgroundSettings";
import AppManager from "./pages/admin/AppManager";
import AboutSettings from "./pages/admin/AboutSettings";
import EducationSettings from "./pages/admin/EducationSettings";
import CaseStudySettings from "./pages/admin/CaseStudySettings";
import WelcomeSettings from "./pages/admin/WelcomeSettings";
import ControlCentreSettings from "./pages/admin/ControlCentreSettings";
import NotesSettings from "./pages/admin/NotesSettings";
import PhotosSettings from "./pages/admin/PhotosSettings";
import VideosSettings from "./pages/admin/VideosSettings";
import GithubSettings from "./pages/admin/GithubSettings";
import WorkSettings from "./pages/admin/WorkSettings";
import ContactSettings from "./pages/admin/ContactSettings";
import SocialLinksSettings from "./pages/admin/SocialLinksSettings";
import CustomAppsSettings from "./pages/admin/CustomAppsSettings";
import IframeAppsSettings from "./pages/admin/IframeAppsSettings";
import SiteSettings from "./pages/admin/SiteSettings";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <SEOHead />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/install" element={<Install />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route path="background" element={<BackgroundSettings />} />
                <Route path="apps" element={<AppManager />} />
                <Route path="about" element={<AboutSettings />} />
                <Route path="education" element={<EducationSettings />} />
                <Route path="case-studies" element={<CaseStudySettings />} />
                <Route path="welcome" element={<WelcomeSettings />} />
                <Route path="control-centre" element={<ControlCentreSettings />} />
                <Route path="notes" element={<NotesSettings />} />
                <Route path="photos" element={<PhotosSettings />} />
                <Route path="videos" element={<VideosSettings />} />
                <Route path="github" element={<GithubSettings />} />
                <Route path="work" element={<WorkSettings />} />
                <Route path="contact" element={<ContactSettings />} />
                <Route path="social-links" element={<SocialLinksSettings />} />
                <Route path="custom-apps" element={<CustomAppsSettings />} />
                <Route path="iframe-apps" element={<IframeAppsSettings />} />
                <Route path="site-settings" element={<SiteSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
