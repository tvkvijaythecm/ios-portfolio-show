import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Import all images to preload
import profileImage from "@/assets/profile.jpeg";
import backgroundImage from "@/assets/background.png";
import homescreenBg from "@/assets/homescreen-bg.jpg";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import photo4 from "@/assets/photo4.jpg";
import photo5 from "@/assets/photo5.jpg";
import photo6 from "@/assets/photo6.jpg";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import aboutIcon from "@/assets/about-icon.png";
import sureshIcon from "@/assets/icons/suresh.png";
import photosIcon from "@/assets/icons/photos.png";
import videoIcon from "@/assets/icons/video.png";
import githubIcon from "@/assets/icons/github.png";
import workIcon from "@/assets/icons/work.png";
import notesIcon from "@/assets/icons/notes.png";
import infoIcon from "@/assets/icons/info.png";
import clockIcon from "@/assets/icons/clock.png";
import weatherIcon from "@/assets/icons/weather.png";
import caseStudyIcon from "@/assets/icons/casestudy.png";
import goipIcon from "@/assets/icons/goip.png";

const imagesToPreload = [
  profileImage, backgroundImage, homescreenBg,
  photo1, photo2, photo3, photo4, photo5, photo6,
  project1, project2, project3, aboutIcon,
  sureshIcon, photosIcon, videoIcon, githubIcon,
  workIcon, notesIcon, infoIcon, clockIcon,
  weatherIcon, caseStudyIcon, goipIcon
];

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // Wait for animation to complete (10s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Complete when both animation is done AND images are loaded
  useEffect(() => {
    if (animationDone && imagesLoaded) {
      setIsComplete(true);
    }
  }, [animationDone, imagesLoaded]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        if (isComplete) onComplete();
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundColor: '#242424',
          backgroundImage: 'url(https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/image2vector.svg)'
        }}
      />

      {/* Loader Container */}
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[400px] text-center">
        {/* Progress Bar */}
        <div className="w-full h-[30px] bg-black rounded-[18px] overflow-hidden shadow-md relative">
          <motion.div
            className="h-full rounded-[10px]"
            style={{ 
              backgroundColor: '#ffcc00',
              boxShadow: '10px 0 10px #ffcc00, 0 10px 20px #ffcc00'
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 10,
              ease: [0.4, 0.0, 0.2, 1],
              times: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
            }}
          />
        </div>

        {/* Loading Text */}
        <div 
          className="mt-[13px] text-2xl tracking-[2px] font-semibold opacity-90"
          style={{ 
            color: '#ffcc00',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontFamily: "'GOSTRUS', sans-serif"
          }}
        >
          <i>Hello World!</i>
        </div>
      </div>

      {/* Google Font */}
      <link href="https://fonts.cdnfonts.com/css/gostrus" rel="stylesheet" />
    </motion.div>
  );
};

export default BootScreen;
