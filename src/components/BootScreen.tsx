import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/* Image preloading (UNCHANGED) */
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

  /* Preload images */
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  /* Boot animation duration (10s) */
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  /* Finish only when both are done */
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
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
      />

      {/* GSAP */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>

      {/* Background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "url(https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/sn.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,.2), rgba(0,0,0,.85))",
        }}
      />

      {/* Content */}
      <div
        className="flex flex-col items-center justify-center h-full text-center"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        {/* Decoder Title */}
        <h1
          id="thankYouText"
          className="mb-6 text-white uppercase select-none"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 8rem)",
            textShadow:
              "0 0 5px #d5cfc7, 0 0 15px #ede3e6, 0 0 30px #b7b8af",
          }}
        />

        {/* Neon Loader */}
        <div className="flex flex-col items-center w-[220px]">
          <div
            className="w-full h-[3px] rounded overflow-hidden"
            style={{
              background: "rgba(183,184,175,.15)",
              boxShadow:
                "inset 0 0 6px rgba(183,184,175,.6), 0 0 10px rgba(183,184,175,.4)",
            }}
          >
            <div
              id="loaderFill"
              className="h-full w-0"
              style={{
                background:
                  "linear-gradient(225deg,#f8f4ff,#ede3e6,#d5cfc7,#b7b8af,#989f9d)",
                boxShadow:
                  "0 0 6px #f8f4ff, 0 0 14px #ede3e6, 0 0 28px #d5cfc7",
                transition: "width .2s linear",
              }}
            />
          </div>

          <div
            id="loaderPercent"
            className="mt-2 text-[10px] tracking-widest"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: "#f8f4ff",
              textShadow: "0 0 5px #d5cfc7, 0 0 10px #ede3e6",
            }}
          >
            0%
          </div>
        </div>
      </div>

      {/* Boot Scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
document.addEventListener('DOMContentLoaded', () => {
  /* Loader */
  let progress = 0;
  const fill = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 4) + 1;
    if (progress >= 100) {
      progress = 100;
      fill.style.width = '100%';
      percent.textContent = '100%';
      clearInterval(interval);
      setTimeout(() => {
        percent.textContent = 'SNET SYSTEM - OK';
      }, 2000);
      return;
    }
    fill.style.width = progress + '%';
    percent.textContent = progress + '%';
  }, 120);

  /* Decoder Animation */
  const textElement = document.getElementById('thankYouText');
  const originalText = 'SNET OS';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_-+=[]{}|;:,.<>?';

  originalText.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerHTML = char === ' ' ? '&nbsp;' : char;
    textElement.appendChild(span);
  });

  const letters = Array.from(textElement.children);
  const tl = gsap.timeline();

  letters.forEach((letter, i) => {
    const originalChar = letter.innerHTML;
    if (originalChar === '&nbsp;') return;
    tl.to({}, {
      duration: 5.2,
      onUpdate: () => {
        letter.textContent = chars[Math.floor(Math.random() * chars.length)];
      },
      onComplete: () => {
        letter.textContent = originalChar;
      }
    }, i * 0.1);
  });
});
          `,
        }}
      />
    </motion.div>
  );
};

export default BootScreen;
