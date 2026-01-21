import { motion } from "framer-motion";
import { ChevronLeft, Github, ExternalLink } from "lucide-react";

interface ProjectDetailPageProps {
  project: {
    id: string;
    name: string;
    description: string;
    thumbnail?: string;
    sourceUrl?: string;
    demoUrl?: string;
    detailContent?: string;
  };
  onClose: () => void;
}

const ProjectDetailPage = ({ project, onClose }: ProjectDetailPageProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white dark:bg-gray-900"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={onClose}
          className="flex items-center text-blue-500"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </motion.button>
      </header>

      {/* Hero Image */}
      {project.thumbnail && (
        <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {project.name}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.sourceUrl && (
            <motion.button
              onClick={() => window.open(project.sourceUrl, "_blank")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
              View Source
            </motion.button>
          )}
          {project.demoUrl && (
            <motion.button
              onClick={() => window.open(project.demoUrl, "_blank")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5" />
              Live Demo
            </motion.button>
          )}
        </div>

        {/* Detail Content */}
        {project.detailContent && (
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.detailContent }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
