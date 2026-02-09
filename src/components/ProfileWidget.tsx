import { motion } from "framer-motion";
import profileImage from "@/assets/profile.jpeg";
import LazyImage from "@/components/ui/lazy-image";

const ProfileWidget = () => {
  return (
    <motion.div
      className="w-full backdrop-blur-3xl rounded-[32px] p-4 border border-white/30 overflow-hidden relative"
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -1px 1px rgba(255, 255, 255, 0.1)',
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <LazyImage 
          src={profileImage} 
          alt="Suresh Kaleyannan"
          className="w-16 h-16 rounded-full app-shadow"
        />
        <div className="flex-1">
          <h3 className="text-white dark:text-gray-200 font-semibold text-lg">Suresh Kaleyannan</h3>
          <p className="text-white/80 dark:text-gray-400 text-sm">Creative Developer, Malaysia</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileWidget;
