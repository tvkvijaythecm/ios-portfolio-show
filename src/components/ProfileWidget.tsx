import { motion } from "framer-motion";
import { User } from "lucide-react";

const ProfileWidget = () => {
  return (
    <motion.div
      className="w-full ios-glass rounded-[28px] p-4 backdrop-blur-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center app-shadow">
          <User className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">Your Name</h3>
          <p className="text-white/80 text-sm">Portfolio & Designer</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileWidget;
