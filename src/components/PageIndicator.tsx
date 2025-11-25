import { motion } from "framer-motion";

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

const PageIndicator = ({ currentPage, totalPages }: PageIndicatorProps) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {Array.from({ length: totalPages }).map((_, index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: index === currentPage ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)",
            scale: index === currentPage ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

export default PageIndicator;
