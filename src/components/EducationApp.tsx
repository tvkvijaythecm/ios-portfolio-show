import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, GraduationCap, X } from "lucide-react";
import { useState } from "react";

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
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500"
      initial={{ scale: 0.8, opacity: 0, borderRadius: "22%" }}
      animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
      exit={{ scale: 0.8, opacity: 0, borderRadius: "22%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-20 flex items-end justify-between px-6 pb-3 relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <motion.button
            onClick={onClose}
            className="relative z-10 flex items-center"
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-9 h-9 text-white drop-shadow-lg" strokeWidth={3} />
          </motion.button>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-white text-2xl font-bold drop-shadow-lg">Education</h1>
          </div>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Combined Profile & Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-lg"
            >
              {/* Profile Section */}
              <div className="flex items-start gap-6 mb-8">
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src="https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/cert/images/me2.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tight">
                    Suresh Kaleyannan
                  </h2>
                  <p className="text-xl text-gray-500 dark:text-gray-400 mb-1">Creative Developer</p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">Kuala Lumpur, Malaysia</p>
                </div>
              </div>

              {/* Stats Pills */}
              <div className="flex gap-3 flex-wrap justify-center mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-white">10,000+ DESIGNS.</span>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-white">500+ DEVELOPMENT.</span>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-white">15+ YEARS.</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

              {/* Description Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                  Achievements & Credentials
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Explore my professional achievements and certifications, showcasing my dedication to continuous learning and skill development across design, development, and technology.
                </p>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-2 shadow-lg flex gap-2"
            >
              <button
                onClick={() => setActiveTab("online")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all relative ${
                  activeTab === "online"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {activeTab === "online" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Online Certifications</span>
              </button>
              <button
                onClick={() => setActiveTab("institute")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all relative ${
                  activeTab === "institute"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {activeTab === "institute" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Institute Credentials</span>
              </button>
            </motion.div>

            {/* Credentials Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6"
            >
              {activeTab === "institute" &&
                captions.institute.map((caption, index) => (
                  <motion.div
                    key={`inst-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openPopup(`https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/cert/images/inst${index + 1}.jpg`, caption)}
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                      <img
                        src={`images/inst${index + 1}.jpg`}
                        alt={caption}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2">
                        {caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              {activeTab === "online" &&
                captions.online.map((caption, index) => (
                  <motion.div
                    key={`onc-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openPopup(`https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/cert/images/onc${index + 1}.jpg`, caption)}
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                      <img
                        src={`images/onc${index + 1}.jpg`}
                        alt={caption}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2">
                        {caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Certificate Popup Modal */}
      <AnimatePresence>
        {popupImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/80 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={popupImage}
                alt="Certificate"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6 bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
                <p className="text-center text-gray-900 dark:text-white font-semibold text-lg">
                  {popupCaption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EducationApp;
