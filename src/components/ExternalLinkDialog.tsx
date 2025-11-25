import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ExternalLinkDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  appName: string;
}

const ExternalLinkDialog = ({ onConfirm, onCancel, appName }: ExternalLinkDialogProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/30" onClick={onCancel} />
      
      {/* Dialog */}
      <motion.div
        className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Leave App?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            You are about to open {appName}. This will take you outside the app.
          </p>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700" />
        
        {/* Actions */}
        <div className="grid grid-cols-2">
          <button
            onClick={onCancel}
            className="p-4 text-blue-600 dark:text-blue-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="p-4 text-blue-600 dark:text-blue-400 font-semibold border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExternalLinkDialog;
