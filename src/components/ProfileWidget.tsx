import { motion } from "framer-motion";
import profileImage from "@/assets/profile.jpeg";

const ProfileWidget = () => {
  return (
    <motion.div
      className="w-full backdrop-blur-xl rounded-[28px] p-4 border border-white/10"
      style={{ backgroundColor: 'rgba(18, 18, 18, 0.85)' }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <img 
          src={profileImage} 
          alt="Suresh Kaleyannan"
          className="w-16 h-16 rounded-full object-cover app-shadow"
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
