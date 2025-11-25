import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, Share2, Facebook, Instagram, Music } from "lucide-react";
import { useState } from "react";
import AppIcon from "./AppIcon";
import LoadingScreen from "./LoadingScreen";
import ExternalLinkDialog from "./ExternalLinkDialog";

const Dock = () => {
  const [showSocial, setShowSocial] = useState(false);
  const [loadingApp, setLoadingApp] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<{ app: string; url: string } | null>(null);

  const handleCommunicationAppClick = (appName: string, url: string) => {
    setLoadingApp(appName);
    setTimeout(() => {
      setLoadingApp(null);
      setShowDialog({ app: appName, url });
    }, 3000);
  };

  const handleConfirm = () => {
    if (showDialog) {
      window.open(showDialog.url, "_blank");
      setShowDialog(null);
    }
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", gradient: "#1877F2, #0C63D4", url: "#" },
    { icon: Instagram, label: "Instagram", gradient: "#E1306C, #C13584", url: "#" },
    { icon: Music, label: "TikTok", gradient: "#FE2C55, #000000", url: "#" },
  ];

  return (
    <>
      <AnimatePresence>
        {loadingApp && (
          <LoadingScreen
            onClose={() => setLoadingApp(null)}
            appName={loadingApp}
          />
        )}

        {showDialog && (
          <ExternalLinkDialog
            onConfirm={handleConfirm}
            onCancel={() => setShowDialog(null)}
            appName={showDialog.app}
          />
        )}

        {showSocial && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSocial(false)}
            />
            <motion.div
              className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-3xl p-4 z-50 shadow-2xl border border-white/20"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <AppIcon
                    key={social.label}
                    icon={social.icon}
                    label={social.label}
                    gradient={social.gradient}
                    onClick={() => window.open(social.url, "_blank")}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30">
        <motion.div
          className="ios-glass dark:bg-gray-800/30 rounded-[28px] px-5 py-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex gap-5 items-center">
            <AppIcon
              icon={MessageCircle}
              label="WhatsApp"
              gradient="#25D366, #128C7E"
              onClick={() => handleCommunicationAppClick("WhatsApp", "https://wa.me/")}
            />
            <AppIcon
              icon={Phone}
              label="Phone"
              gradient="#34C759, #30D158"
              onClick={() => handleCommunicationAppClick("Phone", "tel:")}
            />
            <AppIcon
              icon={Mail}
              label="Mail"
              gradient="#007AFF, #0051D5"
              onClick={() => handleCommunicationAppClick("Mail", "mailto:")}
            />
            <AppIcon
              icon={Share2}
              label="Social"
              gradient="#FF375F, #FF2D55"
              onClick={() => setShowSocial(!showSocial)}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dock;
