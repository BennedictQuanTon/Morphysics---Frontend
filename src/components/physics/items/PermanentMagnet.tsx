import { useState } from "react";
import { motion } from "framer-motion";

export function PermanentMagnet() {
  const [reversed, setReversed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Field line SVG paths looping from North to South
  // North is on the left (x=60, y=90) and South is on the right (x=140, y=90)
  // Reversing switches N/S positions
  const northX = reversed ? 135 : 65;
  const southX = reversed ? 65 : 135;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Strength: 0.5 T • Polarity: {reversed ? "S-N" : "N-S"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 160" className="w-44 h-36 overflow-visible">
          {/* Animated Magnetic Field Lines (outer loops) */}
          {isHovered && (
            <g>
              {/* Inner loop top */}
              <motion.path
                d="M 65 80 C 65 30, 135 30, 135 80"
                fill="none"
                stroke="rgba(250, 204, 21, 0.45)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: reversed ? -20 : 20 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              {/* Inner loop bottom */}
              <motion.path
                d="M 65 80 C 65 130, 135 130, 135 80"
                fill="none"
                stroke="rgba(250, 204, 21, 0.45)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: reversed ? 20 : -20 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              {/* Mid loop top */}
              <motion.path
                d="M 65 80 C 50 10, 150 10, 135 80"
                fill="none"
                stroke="rgba(250, 204, 21, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: reversed ? -25 : 25 }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              />
              {/* Mid loop bottom */}
              <motion.path
                d="M 65 80 C 50 150, 150 150, 135 80"
                fill="none"
                stroke="rgba(250, 204, 21, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: reversed ? 25 : -25 }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              />

              {/* End magnetic flux arrows entering/leaving poles */}
              <g stroke="rgba(250, 204, 21, 0.4)" strokeWidth="1.5" fill="none">
                {/* Left side field indicators */}
                <line x1="20" y1="80" x2="65" y2="80" strokeDasharray="3 3" />
                <path d="M 15 60 C 25 70, 50 78, 65 80" strokeDasharray="3 3" />
                <path d="M 15 100 C 25 90, 50 82, 65 80" strokeDasharray="3 3" />
                {/* Right side field indicators */}
                <line x1="135" y1="80" x2="180" y2="80" strokeDasharray="3 3" />
                <path d="M 135 80 C 150 82, 175 90, 185 100" strokeDasharray="3 3" />
                <path d="M 135 80 C 150 78, 175 70, 185 60" strokeDasharray="3 3" />
              </g>
            </g>
          )}

          {/* Bar Magnet */}
          <g>
            {/* North half (Red) */}
            <rect
              x={reversed ? "100" : "50"}
              y="68"
              width="50"
              height="24"
              fill="#ef4444"
              stroke="#ef4444"
              strokeWidth="1"
              style={{ transition: "x 0.5s ease" }}
            />
            {/* South half (Blue) */}
            <rect
              x={reversed ? "50" : "100"}
              y="68"
              width="50"
              height="24"
              fill="#3b82f6"
              stroke="#3b82f6"
              strokeWidth="1"
              style={{ transition: "x 0.5s ease" }}
            />

            {/* Labels N & S */}
            <text
              x={northX}
              y="85"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="black"
              style={{ transition: "x 0.5s ease" }}
            >
              N
            </text>
            <text
              x={southX}
              y="85"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="black"
              style={{ transition: "x 0.5s ease" }}
            >
              S
            </text>
          </g>

          {/* Core field strength vectors when hovered */}
          {isHovered && (
            <g fill="var(--gold)">
              {/* Arrow left */}
              <polygon points={reversed ? "45,77 45,83 37,80" : "41,77 41,83 49,80"} />
              {/* Arrow right */}
              <polygon points={reversed ? "151,77 151,83 159,80" : "155,77 155,83 147,80"} />
            </g>
          )}
        </svg>

        {/* Ambient glow on magnet */}
        <div className="absolute inset-0 bg-yellow-500/5 rounded-full filter blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Control buttons */}
      <div className="w-full px-2 mt-auto">
        <button
          onClick={() => setReversed(!reversed)}
          className="w-full py-1.5 px-3 rounded-lg border border-slate-deep/10 dark:border-white/10 hover:border-gold dark:hover:border-gold hover:text-gold transition-all duration-300 font-bold text-[11px] tracking-wider uppercase bg-white/50 dark:bg-white/[0.02] flex justify-center items-center"
        >
          Reverse Polarity
        </button>
      </div>
    </div>
  );
}

export default PermanentMagnet;
