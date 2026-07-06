import { useState } from "react";

export function ParallelWires() {
  const [current, setCurrent] = useState(4); // Current in Amperes (0 to 10)
  const [isHovered, setIsHovered] = useState(false);

  const activeCurrent = isHovered ? current : 0;
  // Bending distance proportional to current squared (magnetic force is proportional to I1 * I2)
  const bend = (activeCurrent * activeCurrent) / 10; // max 10px deflection

  // Path for left wire bowing left (curves outward)
  // Normal is a straight line: M 65 15 L 65 145
  // Bowed left: M 65 15 Q (65 - bend) 80 65 145
  const leftWirePath = `M 65 15 Q ${65 - bend} 80 65 145`;

  // Path for right wire bowing right (curves outward)
  // Normal: M 115 15 L 115 145
  // Bowed right: M 115 15 Q (115 + bend) 80 115 145
  const rightWirePath = `M 115 15 Q ${115 + bend} 80 115 145`;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Deflect: {bend.toFixed(1)} mm • Force: {(activeCurrent * activeCurrent * 0.05).toFixed(2)} mN
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 180 160" className="w-36 h-36 overflow-visible">
          {/* Top support bar terminal blocks */}
          <rect x="50" y="10" width="80" height="6" rx="2" fill="currentColor" className="text-slate-deep/50 dark:text-white/30" />
          <rect x="50" y="144" width="80" height="6" rx="2" fill="currentColor" className="text-slate-deep/50 dark:text-white/30" />

          {/* Magnetic Field Concentric Rings around wires */}
          {activeCurrent > 0 && (
            <g stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4">
              {/* Left wire fields */}
              <circle cx={65 - bend / 2} cy="80" r="14" />
              <circle cx={65 - bend / 2} cy="80" r="24" />

              {/* Right wire fields */}
              <circle cx={115 + bend / 2} cy="80" r="14" />
              <circle cx={115 + bend / 2} cy="80" r="24" />
            </g>
          )}

          {/* Left Wire (Current UP) */}
          <path
            d={leftWirePath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s ease" }}
          />

          {/* Right Wire (Current DOWN) */}
          <path
            d={rightWirePath}
            fill="none"
            stroke="#e0a96d"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s ease" }}
          />

          {/* Flowing current dot animations */}
          {activeCurrent > 0 && (
            <g>
              {/* Left wire dots (going UP -> dashoffset negative) */}
              <path
                d={leftWirePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 12"
                strokeLinecap="round"
                style={{
                  animation: `flowing-up ${1.5 / (activeCurrent / 4)}s linear infinite`,
                }}
              />
              {/* Right wire dots (going DOWN -> dashoffset positive) */}
              <path
                d={rightWirePath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 12"
                strokeLinecap="round"
                style={{
                  animation: `flowing-down ${1.5 / (activeCurrent / 4)}s linear infinite`,
                }}
              />
            </g>
          )}

          {/* Current direction vector arrows */}
          {activeCurrent > 0 && (
            <g fontSize="9" fontWeight="bold">
              {/* Left wire direction (UP) */}
              <path d="M 52 35 L 52 23 M 49 27 L 52 23 L 55 27" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="44" y="27" fill="#10b981">I</text>

              {/* Right wire direction (DOWN) */}
              <path d="M 128 23 L 128 35 M 125 31 L 128 35 L 131 31" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <text x="133" y="34" fill="#ef4444">I</text>

              {/* Repulsion Force Vector Arrows (outward) */}
              <path d={`M ${65 - bend} 80 L ${45 - bend} 80 M 51 76 L 45 80 L 51 84`} fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <text x={38 - bend} y="92" fill="#ef4444" fontSize="10">Frepe</text>

              <path d={`M ${115 + bend} 80 L ${135 + bend} 80 M 129 76 L 135 80 L 129 84`} fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <text x={126 + bend} y="92" fill="#ef4444" fontSize="10">Frepe</text>
            </g>
          )}
        </svg>

        <style>{`
          @keyframes flowing-up {
            to {
              stroke-dashoffset: -16;
            }
          }
          @keyframes flowing-down {
            to {
              stroke-dashoffset: 16;
            }
          }
        `}</style>
      </div>

      {/* Manual Controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="10"
          value={current}
          onChange={(e) => setCurrent(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${current * 10}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default ParallelWires;
