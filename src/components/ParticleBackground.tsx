import { motion } from "framer-motion";

const ParticleBackground = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  const purpleParticles = Array.from({ length: 15 }, (_, i) => ({
    id: `purple-${i}`,
    size: Math.random() * 300 + 150,
    x: Math.random() * 40,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, rgba(138, 100, 255, 0.15) 0%, rgba(100, 180, 255, 0.08) 50%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          ease: "easeInOut",
        }}
      />
    ))}
    
    {/* Purple particles on the left */}
    {purpleParticles.map((particle) => (
      <motion.div
        key={particle.id}
        className="absolute rounded-full"
        style={{
          width: particle.size,
          height: particle.size,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          background: `radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, Math.random() * 80 - 40, 0],
          y: [0, Math.random() * 120 - 60, 0],
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: particle.duration,
          repeat: Infinity,
          delay: particle.delay,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
  );
};

export default ParticleBackground;
