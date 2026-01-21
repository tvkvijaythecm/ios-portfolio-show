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
    technologies?: string[];
  };
  onClose: () => void;
}

const techColors: Record<string, string> = {
  react: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  typescript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  javascript: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  nodejs: "bg-green-500/20 text-green-300 border-green-500/30",
  python: "bg-yellow-600/20 text-yellow-200 border-yellow-600/30",
  tailwind: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  nextjs: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  supabase: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  firebase: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  mongodb: "bg-green-600/20 text-green-300 border-green-600/30",
  postgresql: "bg-blue-600/20 text-blue-300 border-blue-600/30",
  graphql: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  docker: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  aws: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  figma: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  vue: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  angular: "bg-red-500/20 text-red-300 border-red-500/30",
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const getTechColor = (tech: string) => {
  const key = tech.toLowerCase().replace(/[^a-z]/g, "");
  return techColors[key] || techColors.default;
};

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
        
        {/* Technology Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getTechColor(tech)}`}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
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
