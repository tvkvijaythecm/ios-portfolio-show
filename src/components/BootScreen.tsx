import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create typing sound effect
  const playTypingSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  };

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

  // Progress animation with typing sounds
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 4) + 1;
        const newProgress = prev + increment;
        
        // Play typing sound on progress update
        if (Math.random() > 0.5) {
          playTypingSound();
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, 120);

    return () => clearInterval(interval);
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

      {/* CRT Scanlines Overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-10" />
      <div className="crt-flicker absolute inset-0 pointer-events-none z-10" />

      {/* Main Content */}
      <div className="relative h-screen w-full flex items-center justify-center p-5">
        <div className="text-center w-full max-w-6xl">
          {/* Animated Text */}
          <h1 className="thank-you-text mb-5">
            {Array.from("SNET OS").map((char, index) => (
              <span key={index} className="inline-block min-w-[0.5ch]">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

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
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Share Tech Mono', monospace;
          background: #000;
          color: #00ff41;
          overflow: hidden;
        }

        .thank-you-text {
          font-weight: 400;
          font-size: clamp(2.5rem, 10vw, 8rem);
          position: relative;
          color: #00d4ff;
          text-shadow: 0 0 5px #00d4ff, 0 0 15px #0099cc, 0 0 30px #006699, 0 0 50px #003366;
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
          animation: glitchText 3s infinite;
          animation-delay: calc(var(--char-index, 0) * 0.1s);
        }

        .thank-you-text span:nth-child(1) { --char-index: 0; }
        .thank-you-text span:nth-child(2) { --char-index: 1; }
        .thank-you-text span:nth-child(3) { --char-index: 2; }
        .thank-you-text span:nth-child(4) { --char-index: 3; }
        .thank-you-text span:nth-child(5) { --char-index: 4; }
        .thank-you-text span:nth-child(6) { --char-index: 5; }
        .thank-you-text span:nth-child(7) { --char-index: 6; }

        @keyframes glitchText {
          0%, 90%, 100% {
            opacity: 1;
            text-shadow: 0 0 5px #00d4ff, 0 0 15px #0099cc, 0 0 30px #006699;
          }
          92% {
            opacity: 0.8;
            text-shadow: -2px 0 #ff0000, 2px 0 #00ff00;
            transform: translateX(-2px);
          }
          94% {
            opacity: 1;
            text-shadow: 2px 0 #ff0000, -2px 0 #00ff00;
            transform: translateX(2px);
          }
          96% {
            opacity: 0.9;
            text-shadow: 0 0 10px #00d4ff;
            transform: translateX(0);
          }
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
          background: rgba(0, 153, 204, 0.15);
          box-shadow:
              inset 0 0 6px rgba(0, 212, 255, 0.6),
              0 0 10px rgba(0, 153, 204, 0.4);
          overflow: hidden;
        }

        .neon-loader-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(225deg, #00ffff 0%, #00d4ff 25%, #0099cc 50%, #006699 75%, #003366 100%);
          box-shadow:
              0 0 6px #00ffff,
              0 0 14px #00d4ff,
              0 0 28px #0099cc;
          transition: width .2s linear;
        }

        .neon-percent {
          margin-top: 8px;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          letter-spacing: 1px;
          color: #00d4ff;
          text-shadow:
              0 0 5px #0099cc,
              0 0 10px #00d4ff;
        }

        /* CRT Scanlines */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        }

        .crt-flicker {
          animation: flicker 0.15s infinite;
          background: rgba(0, 212, 255, 0.03);
        }

        @keyframes flicker {
          0% { opacity: 0.27861; }
          5% { opacity: 0.34769; }
          10% { opacity: 0.23604; }
          15% { opacity: 0.90626; }
          20% { opacity: 0.18128; }
          25% { opacity: 0.83891; }
          30% { opacity: 0.65583; }
          35% { opacity: 0.67807; }
          40% { opacity: 0.26559; }
          45% { opacity: 0.84693; }
          50% { opacity: 0.96019; }
          55% { opacity: 0.08594; }
          60% { opacity: 0.20313; }
          65% { opacity: 0.71988; }
          70% { opacity: 0.53455; }
          75% { opacity: 0.37288; }
          80% { opacity: 0.71428; }
          85% { opacity: 0.70419; }
          90% { opacity: 0.7003; }
          95% { opacity: 0.36108; }
          100% { opacity: 0.24387; }
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
      ` }} />
    </motion.div>
  );
};

export default BootScreen;
