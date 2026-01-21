import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, Loader2, Award, University } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

interface EducationAppProps {
  onClose: () => void;
}

interface EducationItem {
  id: string;
  title: string;
  issuer: string;
  category: string;
  image_url: string | null;
  year: string | null;
  sort_order: number;
}

const EducationApp = ({ onClose }: EducationAppProps) => {
  const [activeTab, setActiveTab] = useState<"online" | "institute">("online");
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [popupCaption, setPopupCaption] = useState<string>("");
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from('education_items')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      
      if (data && !error) {
        setItems(data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const instituteItems = items.filter(item => item.category === 'institute');
  const onlineItems = items.filter(item => item.category === 'online');
  const displayItems = activeTab === "online" ? onlineItems : instituteItems;

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
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "#121212" }}
      initial={{ scale: 0.5, opacity: 0, borderRadius: "22%" }}
      animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
      exit={{ scale: 0.5, opacity: 0, borderRadius: "22%" }}
      transition={{ type: "spring", stiffness: 400, damping: 15, mass: 0.8 }}
    >
      {/* Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 relative z-10"
        style={{ 
          background: "linear-gradient(315deg, #FFAA00 40%, #FF5800 20%, #ff0000 100%)",
          boxShadow: "0 15px 15px rgba(0, 0, 0, 0.5)"
        }}
      >
        <motion.button
          onClick={onClose}
          className="flex items-center text-white"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
        </motion.button>
        <h1 
          className="text-2xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "'Bruno Ace', sans-serif", letterSpacing: "-0.5px" }}
        >
          myCERTS
        </h1>
        <div className="w-8" />
      </header>

      {/* Info Section */}
      <section 
        className="flex gap-5 p-6 flex-wrap"
        style={{
          background: "#1a2a1a",
          backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 2000 1400%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cfilter id=%22b%22 x=%22-200%25%22 y=%22-200%25%22 width=%22500%25%22 height=%22500%25%22%3E%3CfeGaussianBlur in=%22SourceGraphic%22 stdDeviation=%2220%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cpath fill=%22%23121212%22 d=%22M0 0h2000v1400H0z%22%2F%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="w-24 h-52 rounded-xl overflow-hidden border border-gray-600 bg-gray-800 p-2 shadow-lg flex-shrink-0">
          <LazyImage 
            src="https://pub-b7063e985df64ddcba4ecd5e89b94954.r2.dev/cert/images/me2.png" 
            alt="Profile" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-[220px]">
          <h2 
            className="text-3xl font-bold mb-2 tracking-widest"
            style={{ 
              fontFamily: "'Callahan', sans-serif", 
              color: "#ff4d4d",
              textShadow: "0 4px 18px rgba(0,0,0,0.3)"
            }}
          >
            Suresh Kaleyannan
          </h2>
          <div className="flex gap-4 mb-3 text-sm" style={{ color: "#ff6b35" }}>
            <div><span className="font-semibold">10k+</span> Design</div>
            <div><span className="font-semibold">500+</span> Development</div>
            <div><span className="font-semibold">15+</span> Years</div>
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "#e0e0e0" }}>
            <strong>ACHIEVEMENTS & CREDENTIALS</strong><br /><br />
            Explore my professional achievements and certifications, showcasing my dedication to continuous learning and skill development. This page highlights my qualifications across various fields, providing verified credentials that reflect my expertise and commitment to growth.
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div 
        className="flex w-full cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(30,30,30,0.25) 100%, rgba(30,30,30,0.05) 0%)",
          backdropFilter: "blur(5px)",
          borderTop: "1px solid #333333",
          boxShadow: "7px 7px 20px 0px rgba(0,0,0,0.5), 4px 4px 5px 0px rgba(0,0,0,0.3)"
        }}
      >
        <button
          onClick={() => setActiveTab("online")}
          className={`flex-1 py-4 text-lg font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
            activeTab === "online" 
              ? "text-red-400" 
              : "text-gray-500 hover:text-gray-400"
          }`}
          style={{
            transform: activeTab === "online" ? "translateZ(-8px) scaleY(0.94)" : undefined,
            boxShadow: activeTab === "online" ? "inset 0 0 40px rgba(30,30,30,0.3), inset 0 -5px 15px rgba(0,0,0,0.3)" : undefined
          }}
        >
          <Award className="w-5 h-5" />
          <span className="hidden sm:inline">Online ({onlineItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("institute")}
          className={`flex-1 py-4 text-lg font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
            activeTab === "institute" 
              ? "text-red-400" 
              : "text-gray-500 hover:text-gray-400"
          }`}
          style={{
            transform: activeTab === "institute" ? "translateZ(-8px) scaleY(0.94)" : undefined,
            boxShadow: activeTab === "institute" ? "inset 0 0 40px rgba(30,30,30,0.3), inset 0 -5px 15px rgba(0,0,0,0.3)" : undefined
          }}
        >
          <University className="w-5 h-5" />
          <span className="hidden sm:inline">Institute ({instituteItems.length})</span>
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: "#121212" }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.image_url && openPopup(item.image_url, `${item.title} – ${item.year || ''}`)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{
                  border: "4px solid transparent",
                  background: `linear-gradient(#000000, #000000) padding-box, linear-gradient(315deg, #FFAA00 40%, #FF5800 20%, #ff0000 100%) border-box`,
                  boxShadow: "0 2px 6px rgba(0,0,0,.2)"
                }}
              >
                {item.image_url ? (
                  <LazyImage
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer 
        className="text-center py-4 text-sm"
        style={{ color: "#aaaaaa", borderTop: "1px solid #333333" }}
      >
        © 2024 Suresh. All rights reserved.
      </footer>

      {/* Popup Modal */}
      <AnimatePresence>
        {popupImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: "rgba(0,0,0,.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.button
              onClick={closePopup}
              className="absolute top-5 right-6 text-white text-4xl leading-none hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popupImage}
                alt="Certificate"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.7)" }}
              />
              <div 
                className="absolute bottom-8 left-8 px-4 py-2 rounded-full text-white text-sm"
                style={{ 
                  background: "rgba(0,0,0,.75)", 
                  backdropFilter: "blur(4px)" 
                }}
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
