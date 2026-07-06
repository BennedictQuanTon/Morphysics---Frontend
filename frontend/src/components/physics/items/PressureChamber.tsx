import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function PressureChamber() {
  const [pressure, setPressure] = useState(1); // 1 atm to 10 atm
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      let direction = 1;
      interval = setInterval(() => {
        setPressure((p) => {
          if (p >= 10) direction = -1;
          if (p <= 1) direction = 1;
          return Math.round((p + direction * 0.3) * 10) / 10;
        });
      }, 50);
    } else {
      setPressure(1);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const pRatio = (pressure - 1) / 9; // 0 to 1

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Press: {pressure.toFixed(1)} atm • State: {pressure > 7 ? "CRITICAL" : "OK"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        {/* Warning pulse aura */}
        {pressure > 7 && (
          <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-full filter blur-xl pointer-events-none" />
        )}

        <svg viewBox="0 0 180 180" className="w-36 h-36 overflow-visible">
          {/* Outer bolted steel ring */}
          <circle cx="90" cy="90" r="70" className="fill-slate-deep dark:fill-slate-800 stroke-slate-deep/15 dark:stroke-white/10" strokeWidth="3" />

          {/* Bolts around the vault (8 bolts) */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const angle = idx * 45;
            const rad = (angle * Math.PI) / 180;
            const cx = 90 + Math.cos(rad) * 60;
            const cy = 90 + Math.sin(rad) * 60;
            return (
              <circle key={idx} cx={cx} cy={cy} r="3.5" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
            );
          })}

          {/* Thick glass viewport frame */}
          <circle cx="90" cy="90" r="48" fill="#1e293b" stroke="currentColor" strokeWidth="4.5" className="text-slate-deep/60 dark:text-white/20" />

          {/* Glowing gas background inside chamber based on pressure */}
          <circle
            cx="90"
            cy="90"
            r="44"
            fill={pressure > 6 ? "#7f1d1d" : "#0f172a"}
            style={{ transition: "fill 0.3s ease" }}
          />

          {/* Bouncing Gas Particles */}
          <g>
            {Array.from({ length: 15 }).map((_, i) => {
              const angle = (i * 2.4) % (2 * Math.PI);
              const r = 32; // bounds
              const speed = 0.5 + pRatio * 1.8;

              return (
                <motion.circle
                  key={i}
                  r="3"
                  fill={pressure > 6 ? "#ef4444" : "var(--gold)"}
                  initial={{
                    cx: 90 + Math.cos(angle) * r * 0.5,
                    cy: 90 + Math.sin(angle) * r * 0.5,
                  }}
                  animate={
                    isHovered
                      ? {
                          cx: [
                            90 - r + Math.random() * r * 2,
                            90 - r + Math.random() * r * 2,
                          ],
                          cy: [
                            90 - r + Math.random() * r * 2,
                            90 - r + Math.random() * r * 2,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6 / speed,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                />
              );
            })}
          </g>

          {/* Glare line on window glass */}
          <path
            d="M 60 60 A 42 42 0 0 1 120 60"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.15"
          />

          {/* Pressure indicator gauge overlay */}
          <rect x="70" y="10" width="40" height="20" rx="3" fill="#1e293b" stroke="currentColor" strokeWidth="1.5" className="text-white/10" />
          <text x="90" y="24" textAnchor="middle" fill={pressure > 7 ? "#ef4444" : "#10b981"} fontSize="11" fontFamily="monospace" fontWeight="bold">
            {pressure.toFixed(1)} atm
          </text>
        </svg>
      </div>

      {/* Manual Input Slider */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={pressure}
          onChange={(e) => setPressure(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${pRatio * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default PressureChamber;
