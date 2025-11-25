import { motion } from "framer-motion";

const LiveWallpaper = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(255,107,107,0.4) 0%, rgba(255,71,87,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-10%", "110%"],
          y: ["-10%", "50%", "-10%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(78,205,196,0.4) 0%, rgba(68,160,141,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["110%", "-10%"],
          y: ["110%", "30%", "110%"],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(95,39,205,0.4) 0%, rgba(52,31,151,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["50%", "-10%", "50%"],
          y: ["-10%", "110%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(255,165,2,0.4) 0%, rgba(255,99,72,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["80%", "20%", "80%"],
          y: ["80%", "10%", "80%"],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
};

export default LiveWallpaper;
