import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function MaglevTrain() {
  const [speed, setSpeed] = useState(30); // Glide speed percentage
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState(0);
  const [bobY, setBobY] = useState(0);

  // Bobbing and gliding animation loop
  useEffect(() => {
    let animationFrameId: number;
    let start: number = performance.now();
    const update = () => {
      const elapsed = (performance.now() - start) / 1000;
      // Bobbing up/down at 1.5 Hz
      setBobY(Math.sin(elapsed * 2 * Math.PI * 1.5) * 2.5);
      // Gliding back/forth
      if (isHovered && speed > 0) {
        const moveRange = 30; // Max horizontal shift
        setOffset(Math.sin(elapsed * (speed / 100) * 3) * moveRange);
      } else {
        setOffset((prev) => prev * 0.9); // Damp back to center
      }
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, speed]);

  // Suspension height: higher when hovered/active
  const hoverHeight = isHovered ? -14 + bobY : -6;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Levitation: {isHovered ? "8.5" : "2.0"} mm • Glide Speed: {speed}%
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 160" className="w-40 h-36 overflow-visible">
          {/* Electromagnetic guide track (bottom) */}
          <rect x="20" y="110" width="160" height="15" rx="3" fill="currentColor" className="text-slate-deep/50 dark:text-white/30" />
          {/* Metal rail lines */}
          <line x1="20" y1="114" x2="180" y2="114" stroke="currentColor" strokeWidth="2.5" className="text-slate-deep dark:text-white" />
          <line x1="20" y1="121" x2="180" y2="121" stroke="var(--gold)" strokeWidth="2" />

          {/* Magnetic poles markings along the track (N S N S) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 32 + i * 27;
            const isNorth = i % 2 === 0;
            return (
              <text key={i} x={x} y="138" fontSize="9" fontWeight="bold" textAnchor="middle" fill={isNorth ? "#ef4444" : "#3b82f6"}>
                {isNorth ? "N" : "S"}
              </text>
            );
          })}

          {/* Levitation force magnetic waves (pulsing arcs under carriage) */}
          {isHovered && (
            <g opacity="0.8">
              {/* Left magnet wave */}
              <motion.path
                d="M 50 110 Q 60 102 70 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                animate={{ scaleY: [1, 1.8, 1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ originX: "60px", originY: "110px" }}
              />
              {/* Right magnet wave */}
              <motion.path
                d="M 130 110 Q 140 102 150 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                animate={{ scaleY: [1, 1.8, 1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                style={{ originX: "140px", originY: "110px" }}
              />
            </g>
          )}

          {/* Hovering Train Coach */}
          <motion.g
            animate={{
              x: offset,
              y: hoverHeight,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Coach body */}
            <path
              d="
                M 35 100
                L 45 65
                Q 50 60 60 60
                L 140 60
                Q 150 60 155 65
                L 165 100
                Z
              "
              className="fill-slate-deep dark:fill-slate-800 stroke-slate-deep/10 dark:stroke-white/15"
              strokeWidth="2.5"
            />
            {/* Aerodynamic streamline stripe */}
            <path d="M 37 92 Q 80 82 163 92 L 164 96 Q 80 86 36 96 Z" fill="var(--gold)" />

            {/* Windows (3 rounded rectangles) */}
            <rect x="60" y="68" width="22" height="10" rx="2" fill="#1e293b" />
            <rect x="89" y="68" width="22" height="10" rx="2" fill="#1e293b" />
            <rect x="118" y="68" width="22" height="10" rx="2" fill="#1e293b" />

            {/* Magnets attached under train body */}
            <rect x="50" y="100" width="20" height="6" rx="1" fill="#ef4444" /> {/* North */}
            <rect x="130" y="100" width="20" height="6" rx="1" fill="#3b82f6" /> {/* South */}
          </motion.g>
        </svg>
      </div>

      {/* Manual speed slider */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${speed}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default MaglevTrain;
