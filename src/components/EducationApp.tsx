import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface EducationAppProps {
  onClose: () => void;
}

const EducationApp = ({ onClose }: EducationAppProps) => {
  const [activeTab, setActiveTab] = useState<"online" | "institute">("online");
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [popupCaption, setPopupCaption] = useState<string>("");

  const captions = {
    institute: [
      "Bachelor Degree in Information Technology",
      "Msc Malaysia Undergraduate Skills Programme",
      "Photoshop & Blogging Instructor",
      "Certificate in Ethical Hacking Fundamentals",
      "Certificate in Computer Forensics Fundamentals",
      "Certificate in Network Security Fundamentals"
    ],
    online: [
      "Gemini Certified Educator",
      "Gemini Certified Student",
      "Certified in Advertising with Meta",
      "Google Analytics For Beginners",
      "Advance Google Analytics",
      "Introduction of Data Studio",
      "Google Analytics 360",
      "Google Ads Measurement Certification",
      "Google Analytics Certification",
      "Google Tag Manager Fundamentals",
      "Google Analytics For Power Users",
      "Foundations of Cybersecurity",
      "AI Fluency by MyDigital",
      "Block Chain Untuk Rakyat by MyDigital",
      "AI Cloud Untuk Rakyat by MyDigital",
      "CyberSafe Untuk Rakyat by MyDigital",
      "Introduction to Generative AI",
      "Explore Ai Basics",
      "Explore Internet Search & Beyond",
      "Explore Responsible Ai"
    ]
  };

  const gradients = [
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)"
  ];

  useEffect(() => {
    // Create colorful floating particles
    const createParticles = () => {
      const particlesContainer = document.getElementById('edu-particles');
      if (!particlesContainer) return;
      
      const colors = [
        'radial-gradient(circle at 30% 30%, rgba(255, 105, 180, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(30, 144, 255, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(50, 205, 50, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(255, 69, 0, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.8), transparent 70%)',
        'radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.8), transparent 70%)'
      ];

      for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'edu-particle';
        
        const size = Math.random() * 60 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
    
    return () => {
      const particlesContainer = document.getElementById('edu-particles');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  const openPopup = (image: string, caption: string) => {
    setPopupImage(image);
    setPopupCaption(caption);
  };

  const closePopup = () => {
    setPopupImage(null);
    setPopupCaption("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-[#121212] text-[#e0e0e0]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <style>{`
        .edu-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .edu-particle {
          position: absolute;
          border-radius: 50%;
          animation: edu-float 15s infinite linear;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        @keyframes edu-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }

        .edu-glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .edu-thumb-card {
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .edu-thumb-card:hover {
          transform: scale(1.08) translateY(-10px) rotateX(5deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      {/* Particles Background */}
      <div id="edu-particles" className="edu-particles" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 edu-glass border-b border-white/10">
        <motion.button
          onClick={onClose}
          className="flex items-center"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-9 h-9 text-white" strokeWidth={3} />
        </motion.button>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Trajan Pro', sans-serif" }}>
          CREDENTIALS
        </h1>
        <div className="w-9" />
      </div>

      {/* Info Section */}
      <div className="relative z-10 flex gap-6 p-6 flex-wrap">
        <div className="absolute inset-0 edu-glass rounded-3xl m-3 -z-10" />
        <img 
          src="me2.png" 
          alt="avatar" 
          className="w-32 h-32 rounded-full object-cover border-2 border-white/15 shadow-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="flex-1 min-w-[220px]">
          <h2 
            className="text-2xl font-bold mb-3 text-white" 
            style={{ fontFamily: "'Trajan Pro', sans-serif" }}
          >
            Suresh Kaleyannan
          </h2>
          <div className="flex gap-4 mb-4 text-sm flex-wrap">
            <div className="edu-glass px-4 py-2 rounded-2xl" style={{ fontFamily: "'Trajan Pro', sans-serif" }}>
              <strong>10k+</strong> Design
            </div>
            <div className="edu-glass px-4 py-2 rounded-2xl" style={{ fontFamily: "'Trajan Pro', sans-serif" }}>
              <strong>500+</strong> Development
            </div>
            <div className="edu-glass px-4 py-2 rounded-2xl" style={{ fontFamily: "'Trajan Pro', sans-serif" }}>
              <strong>15+</strong> Years
            </div>
          </div>
          <div 
            className="edu-glass p-4 rounded-2xl text-sm leading-relaxed" 
            style={{ fontFamily: "'Trajan Pro', sans-serif" }}
          >
            ACHIEVEMENTS & CREDENTIALS<br /><br />
            Explore my professional achievements and certifications, showcasing my dedication to continuous learning and skill development.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex edu-glass border-b border-white/10">
        <button
          className={`flex-1 py-5 text-xl transition-all relative ${
            activeTab === "online" ? "text-white" : "text-[#aaa]"
          }`}
          onClick={() => setActiveTab("online")}
        >
          <i className="fa fa-certificate" />
          {activeTab === "online" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-white rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          className={`flex-1 py-5 text-xl transition-all relative ${
            activeTab === "institute" ? "text-white" : "text-[#aaa]"
          }`}
          onClick={() => setActiveTab("institute")}
        >
          <i className="fa fa-university" />
          {activeTab === "institute" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-white rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Grid Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {activeTab === "institute" &&
            captions.institute.map((caption, index) => (
              <motion.div
                key={`inst-${index}`}
                className="edu-thumb-card aspect-square rounded-3xl overflow-hidden cursor-pointer edu-glass relative"
                style={{ background: gradients[index % gradients.length] }}
                onClick={() => openPopup(`images/inst${index + 1}.jpg`, caption)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <img
                  src={`images/inst${index + 1}.jpg`}
                  alt={caption}
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                  onLoad={(e) => e.currentTarget.classList.add("!opacity-100")}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          {activeTab === "online" &&
            captions.online.map((caption, index) => (
              <motion.div
                key={`onc-${index}`}
                className="edu-thumb-card aspect-square rounded-3xl overflow-hidden cursor-pointer edu-glass relative"
                style={{ background: gradients[index % gradients.length] }}
                onClick={() => openPopup(`images/onc${index + 1}.jpg`, caption)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <img
                  src={`images/onc${index + 1}.jpg`}
                  alt={caption}
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                  onLoad={(e) => e.currentTarget.classList.add("!opacity-100")}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="relative z-10 text-center py-5 text-sm text-[#aaa] edu-glass border-t border-white/10" 
        style={{ fontFamily: "'Trajan Pro', sans-serif" }}
      >
        &copy; 2024 Suresh. All rights reserved.
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popupImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] edu-glass rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-5 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-3xl hover:bg-red-500/70 transition-all z-10"
              >
                &times;
              </button>
              <img
                src={popupImage}
                alt="popup"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div 
                className="p-5 bg-black/60 text-white text-center text-lg" 
                style={{ fontFamily: "'Trajan Pro', sans-serif" }}
              >
                {popupCaption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EducationApp;
