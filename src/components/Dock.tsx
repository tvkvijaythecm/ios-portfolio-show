import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, Share2, Facebook, Instagram, Music } from "lucide-react";
import { useState } from "react";
import AppIcon from "./AppIcon";
import LoadingScreen from "./LoadingScreen";
import ExternalLinkDialog from "./ExternalLinkDialog";
import whatsappIcon from "@/assets/icons/whatsapp.png";
import callIcon from "@/assets/icons/call.png";
import mailIcon from "@/assets/icons/mail.png";
import socialIcon from "@/assets/icons/social.png";
import facebookIcon from "@/assets/icons/facebook.png";
import instagramIcon from "@/assets/icons/instagram.png";
import tiktokIcon from "@/assets/icons/tiktok.png";

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
    { imageIcon: facebookIcon, label: "Facebook", color: "bg-blue-600", url: "#" },
    { imageIcon: instagramIcon, label: "Instagram", gradient: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", url: "#" },
    { imageIcon: tiktokIcon, label: "TikTok", color: "bg-black", url: "#" },
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
                    imageIcon={social.imageIcon}
                    label={social.label}
                    bgColor={social.color}
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
              imageIcon={whatsappIcon}
              label="WhatsApp"
              gradient="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
              onClick={() => handleCommunicationAppClick("WhatsApp", "https://wa.me/")}
            />
            <AppIcon
              imageIcon={callIcon}
              label="Call"
              gradient="linear-gradient(135deg, #34C759 0%, #30D158 100%)"
              onClick={() => handleCommunicationAppClick("Phone", "tel:")}
            />
            <AppIcon
              imageIcon={mailIcon}
              label="Mail"
              gradient="linear-gradient(135deg, #007AFF 0%, #0051D5 100%)"
              onClick={() => handleCommunicationAppClick("Mail", "mailto:")}
            />
            <AppIcon
              imageIcon={socialIcon}
              label="Social"
              gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
              onClick={() => setShowSocial(!showSocial)}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dock;
