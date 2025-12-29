import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

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
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_-+=[]{}|;:,.<>?';
  const originalText = "SNET OS";

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

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 4) + 1;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Text animation with GSAP
  useEffect(() => {
    if (!textRef.current) return;

    // Clear existing content
    textRef.current.innerHTML = '';

    // Create span elements for each character
    originalText.split('').forEach(char => {
      const span = document.createElement('span');
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      textRef.current?.appendChild(span);
    });

    const letters = Array.from(textRef.current.children);

    function createDecoderAnimation() {
      const tl = gsap.timeline();

      letters.forEach((letter, i) => {
        const originalChar = letter.innerHTML;
        if (originalChar === '&nbsp;') return;

        let proxy = { charIndex: 0 };

        tl.to(proxy, {
          charIndex: chars.length - 1,
          duration: 5.2,
          ease: "power2.inOut",
          onUpdate: () => {
            const randomIndex = Math.floor(Math.random() * chars.length);
            letter.textContent = chars[randomIndex];
          },
          onComplete: () => {
            letter.textContent = originalChar === '&nbsp;' ? '\u00A0' : originalChar;
          }
        }, i * 0.1);
      });

      // Pause at the end
      tl.to({}, { duration: 1 });
    }

    createDecoderAnimation();
  }, []);

  // Complete when progress is 100% AND images are loaded
  useEffect(() => {
    if (progress === 100 && imagesLoaded) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 2000); // Wait 2 seconds after progress reaches 100%

      return () => clearTimeout(timer);
    }
  }, [progress, imagesLoaded]);

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
          backgroundImage: "url('https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/sn.webp')"
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/85" />

      {/* Main Content */}
      <div className="relative h-screen w-full flex items-center justify-center p-5">
        <div className="text-center w-full max-w-6xl">
          {/* Animated Text */}
          <h1 
            ref={textRef}
            className="thank-you-text mb-5"
          />

          {/* Neon Loader */}
          <div className="neon-loader">
            <div className="neon-loader-track">
              <motion.div 
                className="neon-loader-fill"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="neon-percent">
              {progress === 100 ? "SNET SYSTEM - OK" : `${progress}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Share Tech Mono', monospace;
          background: #000;
          color: #ff6a00;
          overflow: hidden;
        }

        .thank-you-text {
          font-weight: 400;
          font-size: clamp(2.5rem, 10vw, 8rem);
          position: relative;
          color: #fff;
          text-shadow: 0 0 5px #d5cfc7, 0 0 15px #ede3e6, 0 0 30px #b7b8af;
          cursor: default;
          text-transform: uppercase;
          white-space: nowrap;
          margin-bottom: 20px;
          font-family: 'Share Tech Mono', monospace;
        }

        .thank-you-text span {
          position: relative;
          min-width: 0.5ch;
          will-change: contents;
        }

        /* Neon Loader (SHORT) */
        .neon-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 220px;
          text-align: center;
          margin: 0 auto;
        }

        .neon-loader-track {
          height: 3px;
          width: 100%;
          border-radius: 6px;
          background: rgba(183, 184, 175,.15);
          box-shadow:
              inset 0 0 6px rgba(183, 184, 175,.6),
              0 0 10px rgba(183, 184, 175,.4);
          overflow: hidden;
        }

        .neon-loader-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(225deg, #f8f4ff 0.000%, #ede3e6 25.000%, #d5cfc7 50.000%, #b7b8af 75.000%, #989f9d 100.000%);
          box-shadow:
              0 0 6px #f8f4ff,
              0 0 14px #ede3e6,
              0 0 28px #d5cfc7;
          transition: width .2s linear;
        }

        .neon-percent {
          margin-top: 8px;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 1px;
          color: #f8f4ff;
          text-shadow:
              0 0 5px #d5cfc7,
              0 0 10px #ede3e6;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .thank-you-text { 
              font-size: 36px; 
              margin-bottom: 10px;
          }
          .neon-loader { 
              width: 170px; 
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BootScreen;
