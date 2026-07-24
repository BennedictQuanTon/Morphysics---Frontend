import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function GasValve() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto toggle on hover for exhibition effect
  useEffect(() => {
    if (isHovered) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isHovered]);

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Flow: {isOpen ? "Active" : "None"} • Loss: {isOpen ? "0.1" : "3.5"} bar
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 160" className="w-40 h-36 overflow-visible">
          {/* Main pipes */}
          <rect x="15" y="65" width="70" height="30" className="fill-slate-deep/30 dark:fill-white/10 stroke-slate-deep/50 dark:stroke-white/20" strokeWidth="2.5" />
          <rect x="115" y="65" width="70" height="30" className="fill-slate-deep/30 dark:fill-white/10 stroke-slate-deep/50 dark:stroke-white/20" strokeWidth="2.5" />

          {/* Pipe flanges (bolts) */}
          <rect x="75" y="60" width="10" height="40" rx="2" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
          <rect x="115" y="60" width="10" height="40" rx="2" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />

          {/* Valve central core box */}
          <rect x="83" y="55" width="34" height="50" rx="4" className="fill-slate-deep/60 dark:fill-slate-800 stroke-slate-deep dark:stroke-white/10" strokeWidth="2" />

          {/* Gas molecules flowing */}
          {isOpen ? (
            // Open: flowing particles through the whole pipe
            <g>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={i}
                  r="3"
                  fill="var(--gold)"
                  initial={{ cx: 20 + i * 15, cy: 72 + (i % 3) * 6 }}
                  animate={{
                    cx: [20 + i * 15, 20 + i * 15 + 40],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </g>
          ) : (
            // Closed: particles stopped on the left side
            <g>
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={i}
                  r="3"
                  fill="#94a3b8"
                  animate={{
                    cx: [20 + (i * 8) % 40, 25 + (i * 8) % 40],
                    cy: [72 + (i * 7) % 15, 75 - (i * 7) % 15],
                  }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </g>
          )}

          {/* Valve stem pivot */}
          <circle cx="100" cy="80" r="10" fill="currentColor" className="text-slate-deep dark:text-white" />

          {/* Red Rotary Lever Handle */}
          <motion.g
            animate={{ rotate: isOpen ? 90 : 0 }}
            style={{ originX: "100px", originY: "80px" }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
          >
            {/* Knob connection */}
            <rect x="96" y="55" width="8" height="25" fill="currentColor" className="text-slate-deep dark:text-white" />
            {/* The lever */}
            <rect x="92" y="10" width="16" height="50" rx="8" fill="#ef4444" />
            <circle cx="100" cy="20" r="4.5" fill="white" />
          </motion.g>
        </svg>
      </div>

      {/* Manual toggle clicker */}
      <div className="w-full px-2 mt-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-1.5 px-3 rounded-lg border border-slate-deep/10 dark:border-white/10 hover:border-gold dark:hover:border-gold hover:text-gold transition-all duration-300 font-bold text-[11px] tracking-wider uppercase bg-white/50 dark:bg-white/[0.02] flex justify-center items-center"
        >
          Toggle Valve: {isOpen ? "Close" : "Open"}
        </button>
      </div>
    </div>
  );
}

export default GasValve;
