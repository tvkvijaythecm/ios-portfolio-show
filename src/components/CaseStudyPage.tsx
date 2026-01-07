import { motion } from "framer-motion";
import { ChevronLeft, LucideIcon } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

interface CaseStudyPageProps {
  title: string;
  icon: LucideIcon;
  iconUrl?: string;
  htmlContent?: string;
  onClose: () => void;
}

const CaseStudyPage = ({ title, icon: Icon, iconUrl, htmlContent, onClose }: CaseStudyPageProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        mass: 0.8
      }}
    >
      {/* Header - iOS style */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200/30 bg-white/95 backdrop-blur-xl">
        <motion.button
          onClick={onClose}
          className="flex items-center"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-7 h-7 text-blue-500" strokeWidth={2.5} />
          <span className="text-blue-500 text-lg">Back</span>
        </motion.button>
        
        <h1 className="text-gray-800 text-lg font-semibold absolute left-1/2 -translate-x-1/2">{title}</h1>
        
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {htmlContent ? (
          <div 
            className="prose prose-sm max-w-none prose-invert bg-white/10 backdrop-blur-md rounded-2xl p-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Icon className="w-10 h-10 text-white/60" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-white/70">Content coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CaseStudyPage;
