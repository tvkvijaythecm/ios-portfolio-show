import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, Share2, Facebook, Instagram, Music } from "lucide-react";
import { useState } from "react";
import AppIcon from "./AppIcon";

const Dock = () => {
  const [showSocial, setShowSocial] = useState(false);

  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "bg-blue-600", url: "#" },
    { icon: Instagram, label: "Instagram", gradient: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", url: "#" },
    { icon: Music, label: "TikTok", color: "bg-black", url: "#" },
  ];

  return (
    <>
      <AnimatePresence>
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
              className="fixed bottom-32 left-1/2 -translate-x-1/2 ios-glass rounded-3xl p-6 z-50"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex gap-6">
                {socialLinks.map((social) => (
                  <AppIcon
                    key={social.label}
                    icon={social.icon}
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

      <motion.div
        className="fixed bottom-6 left-1/2 ios-glass rounded-[28px] px-5 py-3 z-30"
        style={{ transform: "translateX(-50%)" }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex gap-5 items-center justify-center min-w-max">
          <AppIcon
            icon={MessageCircle}
            label="WhatsApp"
            gradient="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
            onClick={() => window.open("https://wa.me/", "_blank")}
          />
          <AppIcon
            icon={Phone}
            label="Phone"
            gradient="linear-gradient(135deg, #34C759 0%, #30D158 100%)"
            onClick={() => window.open("tel:", "_blank")}
          />
          <AppIcon
            icon={Mail}
            label="Mail"
            gradient="linear-gradient(135deg, #007AFF 0%, #0051D5 100%)"
            onClick={() => window.open("mailto:", "_blank")}
          />
          <AppIcon
            icon={Share2}
            label="Social"
            gradient="linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)"
            onClick={() => setShowSocial(!showSocial)}
          />
        </div>
      </motion.div>
    </>
  );
};

export default Dock;
