import { motion } from "framer-motion";

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
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      
      {/* Dialog */}
      <motion.div
        className="relative z-10 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl max-w-[220px] w-full"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Content */}
        <div className="px-4 py-5 text-center">
          <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white mb-2">
            {appName}
          </h3>
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
            Do you want to open this link?
          </p>
        </div>
        
        {/* Divider */}
        <div className="h-[0.5px] bg-gray-300 dark:bg-gray-600" />
        
        {/* Actions */}
        <div className="grid grid-cols-2 divide-x divide-gray-300 dark:divide-gray-600">
          <button
            onClick={onCancel}
            className="py-[11px] text-[17px] text-blue-500 dark:text-blue-400 font-normal active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-[11px] text-[17px] text-blue-500 dark:text-blue-400 font-semibold active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExternalLinkDialog;
