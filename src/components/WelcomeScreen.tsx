import { motion } from "framer-motion";
import { useEffect } from "react";
import backgroundImage from "@/assets/background.png";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" />

      {/* Animated Welcome Text */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.svg
          width="300"
          height="150"
          viewBox="0 0 300 150"
          className="drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]"
        >
          {/* Handwritten "Welcome" path */}
          <motion.path
            d="M 30 80 Q 35 40, 45 80 Q 50 100, 55 70 Q 58 50, 65 85 L 75 85 Q 80 60, 85 85 Q 90 105, 95 75 M 110 70 L 110 90 Q 110 100, 120 100 Q 130 100, 130 90 L 130 70 Q 130 60, 120 60 Q 110 60, 110 70 M 145 60 L 145 100 M 145 70 Q 155 60, 165 70 L 165 100 M 180 70 Q 180 60, 190 60 Q 200 60, 200 70 L 200 90 Q 200 100, 190 100 Q 180 100, 180 90 M 215 60 L 215 100 M 215 70 Q 225 60, 235 70 Q 240 75, 235 80 Q 230 85, 235 90 Q 240 95, 235 100 M 250 70 Q 250 60, 260 60 Q 270 60, 270 70 L 270 90 Q 270 100, 260 100 Q 250 100, 250 90"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
