import { useState, useRef } from "react";
import { motion } from "framer-motion";

export function CompassNeedle() {
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse move handler to calculate angle pointing to cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Center coordinates
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Calculate angle in degrees
    let theta = (Math.atan2(dy, dx) * 180) / Math.PI;
    // Convert to offset from pointing up (which is -90 degrees in polar coord)
    theta = theta + 90;
    setAngle(theta);
  };

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center justify-between h-full p-4 select-none cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setAngle(0); // Snap back pointing North
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Heading: {Math.round(((angle % 360) + 360) % 360)}° • {isHovered ? "Attracted" : "North"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 160 160" className="w-36 h-36 overflow-visible">
          {/* Compass housing casing */}
          <circle cx="80" cy="80" r="65" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-deep/20 dark:text-white/20" />
          <circle cx="80" cy="80" r="60" fill="currentColor" className="text-slate-deep/[0.02] dark:text-white/[0.02]" />

          {/* Compass ticks every 30 degrees */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const tickAngle = idx * 30;
            const rad = (tickAngle * Math.PI) / 180;
            const x1 = 80 + Math.cos(rad) * 56;
            const y1 = 80 + Math.sin(rad) * 56;
            const x2 = 80 + Math.cos(rad) * (idx % 3 === 0 ? 48 : 52);
            const y2 = 80 + Math.sin(rad) * (idx % 3 === 0 ? 48 : 52);

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={idx % 3 === 0 ? "2" : "1"}
                className="text-slate-deep/30 dark:text-white/30"
              />
            );
          })}

          {/* Cardinal Directions Text */}
          <text x="80" y="32" textAnchor="middle" fontSize="13" fontWeight="bold" fill="currentColor" className="text-red-500 font-sans">N</text>
          <text x="80" y="138" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" className="text-slate-deep/50 dark:text-white/40 font-sans">S</text>
          <text x="133" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" className="text-slate-deep/50 dark:text-white/40 font-sans">E</text>
          <text x="27" y="84" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" className="text-slate-deep/50 dark:text-white/40 font-sans">W</text>

          {/* Rotating needle */}
          <motion.g
            animate={{ rotate: angle }}
            style={{ originX: "80px", originY: "80px" }}
            transition={isHovered ? { type: "spring", stiffness: 120, damping: 10 } : { type: "spring", stiffness: 80, damping: 12 }}
          >
            {/* North pointer (Red triangle) */}
            <polygon points="80,18 73,80 87,80" fill="#ef4444" />
            <polygon points="80,18 80,80 87,80" fill="#f87171" /> {/* Glare */}

            {/* South pointer (Blue/Silver triangle) */}
            <polygon points="80,142 73,80 87,80" fill="#3b82f6" />
            <polygon points="80,142 80,80 87,80" fill="#60a5fa" /> {/* Glare */}

            {/* Pivot pin */}
            <circle cx="80" cy="80" r="5" fill="#f59e0b" />
          </motion.g>

          {/* Pivot pin outer glass reflection cap */}
          <circle cx="80" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-deep/20 dark:text-white/20" />
        </svg>

        {/* Floating instruction text */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-gray/60 dark:text-white/30 bg-white/80 dark:bg-slate-ink/80 px-2 py-1 rounded shadow-sm border border-slate-deep/5">
              Hover to attract
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompassNeedle;
