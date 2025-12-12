import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Share, Plus, MoreVertical, Check, ArrowLeft, Apple, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    
    // Check if already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-white">Install App</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 pb-12">
        {/* App Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="w-32 h-32 rounded-[28%] overflow-hidden shadow-2xl">
            <img src="/app-icon.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Suresh App</h2>
          <p className="text-white/70">Install for the best experience</p>
        </motion.div>

        {/* Already Installed or Standalone */}
        {(isInstalled || isStandalone) && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500/20 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-green-400/30"
          >
            <div className="flex items-center gap-3 text-green-300">
              <Check className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">Already Installed!</h3>
                <p className="text-green-300/70 text-sm">You're using the app in standalone mode</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Install Button (for supported browsers) */}
        {deferredPrompt && !isInstalled && !isStandalone && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Button
              onClick={handleInstallClick}
              className="w-full py-6 text-lg font-semibold bg-white text-purple-700 hover:bg-white/90 rounded-2xl shadow-xl"
            >
              <Download className="w-6 h-6 mr-3" />
              Install Now
            </Button>
          </motion.div>
        )}

        {/* iOS Instructions */}
        {isIOS && !isStandalone && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Apple className="w-8 h-8 text-white" />
              <h3 className="text-xl font-semibold text-white">Install on iPhone/iPad</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Share className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 1</p>
                  <p className="text-white/70 text-sm">Tap the Share button in Safari's toolbar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 2</p>
                  <p className="text-white/70 text-sm">Scroll down and tap "Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 3</p>
                  <p className="text-white/70 text-sm">Tap "Add" in the top right corner</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Android Instructions */}
        {isAndroid && !deferredPrompt && !isStandalone && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Chrome className="w-8 h-8 text-white" />
              <h3 className="text-xl font-semibold text-white">Install on Android</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MoreVertical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 1</p>
                  <p className="text-white/70 text-sm">Tap the menu (three dots) in Chrome</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 2</p>
                  <p className="text-white/70 text-sm">Tap "Add to Home screen" or "Install app"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Step 3</p>
                  <p className="text-white/70 text-sm">Confirm by tapping "Install" or "Add"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Why Install?</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-300" />
              </div>
              <p className="text-white/80">Launch instantly from home screen</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-300" />
              </div>
              <p className="text-white/80">Full screen experience without browser UI</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-300" />
              </div>
              <p className="text-white/80">Faster loading and better performance</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-300" />
              </div>
              <p className="text-white/80">Works offline for cached content</p>
            </div>
          </div>
        </motion.div>

        {/* Back to App */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Install;