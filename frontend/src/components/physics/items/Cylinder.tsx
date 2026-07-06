import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Cylinder() {
  const [volume, setVolume] = useState(60); // Percentage volume (40 to 100)
  const [isHovered, setIsHovered] = useState(false);

  // Auto compression cycle on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      let direction = -1;
      interval = setInterval(() => {
        setVolume((v) => {
          if (v <= 40) direction = 1;
          if (v >= 90) direction = -1;
          return v + direction * 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Generate particles based on volume (higher density when compressed)
  const particlesCount = 25;
  const tempFactor = 100 / volume; // Higher temp (speed) when compressed

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setVolume(60);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Vol: {volume}% • Pres: {Math.round(1000 / volume)} kPa
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        {/* SVG Container */}
        <svg viewBox="0 0 160 200" className="w-28 h-40 overflow-visible">
          {/* Cylinder glass walls */}
          <rect
            x="30"
            y="20"
            width="100"
            height="150"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-deep/20 dark:text-white/20"
          />
          {/* Fluid/Gas chamber back grid */}
          <path
            d="M 30 20 L 130 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-slate-deep/10 dark:text-white/10"
          />

          {/* Gas Particle Group - restricted to current chamber height */}
          <g>
            {Array.from({ length: particlesCount }).map((_, i) => {
              // Deterministic paths based on index
              const angle = (i * 2 * Math.PI) / particlesCount;
              const radiusX = 40;
              const radiusY = (150 * (volume / 100)) / 2 - 10;
              const centerX = 80;
              const centerY = 170 - (150 * (volume / 100)) / 2;

              return (
                <motion.circle
                  key={i}
                  r="3.5"
                  fill={isHovered ? "var(--gold)" : "#6366f1"}
                  initial={{
                    cx: centerX + Math.cos(angle) * radiusX * 0.5,
                    cy: centerY + Math.sin(angle) * radiusY * 0.5,
                  }}
                  animate={
                    isHovered
                      ? {
                          cx: [
                            centerX - radiusX + 5 + Math.random() * (radiusX * 2 - 10),
                            centerX - radiusX + 5 + Math.random() * (radiusX * 2 - 10),
                          ],
                          cy: [
                            170 - 150 * (volume / 100) + 10 + Math.random() * (150 * (volume / 100) - 20),
                            170 - 150 * (volume / 100) + 10 + Math.random() * (150 * (volume / 100) - 20),
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5 + Math.random() * 0.5 / tempFactor,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                />
              );
            })}
          </g>

          {/* Piston plunger shaft & handle */}
          <motion.g
            animate={{
              y: 170 - 150 * (volume / 100) - 20, // Align with volume height
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Shaft */}
            <line
              x1="80"
              y1="-30"
              x2="80"
              y2="20"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-deep/50 dark:text-white/40"
            />
            {/* Handle */}
            <rect
              x="50"
              y="-35"
              width="60"
              height="8"
              rx="4"
              fill="currentColor"
              className="text-slate-deep dark:text-white"
            />
            {/* Piston head */}
            <rect
              x="31.5"
              y="20"
              width="97"
              height="15"
              rx="2"
              fill="currentColor"
              className="text-gold"
            />
            {/* Seal ring */}
            <rect x="31.5" y="24" width="97" height="4" fill="#6366f1" />
          </motion.g>

          {/* Base of cylinder */}
          <rect
            x="25"
            y="170"
            width="110"
            height="8"
            rx="4"
            fill="currentColor"
            className="text-slate-deep dark:text-white"
          />
        </svg>

        {/* Ambient glow under compression */}
        {isHovered && (
          <div
            className="absolute inset-0 bg-gold/5 rounded-full filter blur-2xl transition-all duration-300"
            style={{ opacity: (100 - volume) / 100 }}
          />
        )}
      </div>

      {/* Manual interactive slider */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="30"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${(volume - 30) / 70 * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default Cylinder;
