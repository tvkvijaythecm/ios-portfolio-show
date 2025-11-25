import { motion } from "framer-motion";

const LiveWallpaper = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs - smaller and more subtle */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,107,107,0.5) 0%, rgba(255,71,87,0.3) 50%, transparent 100%)",
          top: "10%",
          left: "-10%",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(78,205,196,0.5) 0%, rgba(68,160,141,0.3) 50%, transparent 100%)",
          top: "60%",
          right: "-5%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(95,39,205,0.5) 0%, rgba(52,31,151,0.3) 50%, transparent 100%)",
          top: "40%",
          left: "50%",
        }}
        animate={{
          x: [-50, 50, -50],
          y: [0, -70, 0],
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
        className="absolute w-[220px] h-[220px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,165,2,0.5) 0%, rgba(255,99,72,0.3) 50%, transparent 100%)",
          bottom: "15%",
          left: "20%",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
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
