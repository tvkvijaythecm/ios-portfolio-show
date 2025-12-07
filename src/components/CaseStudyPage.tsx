import { motion } from "framer-motion";
import { ChevronLeft, LucideIcon } from "lucide-react";

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
      className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Header */}
      <div className="h-20 flex items-end justify-between px-6 pb-3 border-b border-gray-200 dark:border-gray-800">
        <motion.button
          onClick={onClose}
          className="flex items-center"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-8 h-8 text-blue-500" strokeWidth={2.5} />
          <span className="text-blue-500 text-lg ml-1">Back</span>
        </motion.button>
        
        <div className="flex items-center gap-3">
          {iconUrl ? (
            <img src={iconUrl} alt={title} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Icon className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
            </div>
          )}
          <h1 className="text-gray-900 dark:text-white text-xl font-bold">{title}</h1>
        </div>
        
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {htmlContent ? (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon className="w-10 h-10 text-gray-400 dark:text-gray-600" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-gray-500 dark:text-gray-400">Content coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CaseStudyPage;
