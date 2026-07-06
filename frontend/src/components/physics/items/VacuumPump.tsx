import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function VacuumPump() {
  const [speed, setSpeed] = useState(50); // Speed in percentage (0 to 100)
  const [isHovered, setIsHovered] = useState(false);
  const [pressure, setPressure] = useState(101.3); // kPa (Atmospheric)

  // Suction effect on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setPressure((p) => {
          const suctionPower = speed / 100 * 4;
          return Math.max(0.5, p - suctionPower);
        });
      }, 50);
    } else {
      interval = setInterval(() => {
        setPressure((p) => {
          if (p >= 101.3) {
            clearInterval(interval);
            return 101.3;
          }
          return Math.min(101.3, p + 2);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isHovered, speed]);

  const activeSpeed = isHovered ? speed : 0;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Pressure: {pressure.toFixed(1)} kPa • Suction: {activeSpeed}%
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 160" className="w-40 h-36 overflow-visible">
          {/* Suction connecting tube */}
          <path
            d="M 60 125 L 60 140 L 120 140 L 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-slate-deep/30 dark:text-white/20"
          />

          {/* Exhaust flow (bubble lines at the pump outlet) */}
          {activeSpeed > 0 && (
            <g transform="translate(155, 120)">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.circle
                  key={i}
                  r="3.5"
                  fill="var(--gold)"
                  initial={{ cx: 0, cy: 0, opacity: 0.8 }}
                  animate={{
                    cx: [0, 20 + i * 5],
                    cy: [0, -10 + i * 8],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeOut",
                  }}
                />
              ))}
            </g>
          )}

          {/* Glass Bell Jar (Left) */}
          <g>
            {/* Bell jar base */}
            <rect x="25" y="115" width="70" height="10" rx="3" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
            {/* Jar dome */}
            <path
              d="M 30 115 L 30 50 A 30 30 0 0 1 90 50 L 90 115 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-deep/20 dark:text-white/20"
            />
            <path
              d="M 30 115 L 30 50 A 30 30 0 0 1 90 50 L 90 115 Z"
              fill="currentColor"
              className="text-slate-deep/[0.02] dark:text-white/[0.02]"
            />

            {/* Suction inlet hook inside jar */}
            <line x1="60" y1="115" x2="60" y2="100" stroke="currentColor" strokeWidth="2.5" className="text-slate-deep dark:text-white" />

            {/* Bouncing gas molecules inside jar (density decreases with pressure) */}
            {Array.from({ length: 20 }).map((_, i) => {
              // Only render molecule if index matches pressure ratio
              const show = i < (pressure / 101.3) * 20;
              if (!show) return null;

              const speedFactor = 0.5 + (101.3 - pressure) / 50;

              return (
                <motion.circle
                  key={i}
                  r="2.5"
                  fill="#3b82f6"
                  initial={{
                    cx: 35 + (i * 17) % 50,
                    cy: 45 + (i * 11) % 60,
                  }}
                  animate={
                    activeSpeed > 0
                      ? {
                          cx: [
                            35 + Math.random() * 50,
                            35 + Math.random() * 50,
                          ],
                          cy: [
                            45 + Math.random() * 60,
                            45 + Math.random() * 60,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6 / speedFactor,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                />
              );
            })}
          </g>

          {/* Vacuum Pump Unit (Right) */}
          <g transform="translate(100, 80)">
            {/* Pump body */}
            <rect x="10" y="20" width="55" height="35" rx="4" className="fill-slate-deep dark:fill-slate-800 stroke-slate-deep/15 dark:stroke-white/10" strokeWidth="2" />
            <rect x="15" y="15" width="20" height="8" rx="2" fill="var(--gold)" />

            {/* Fan housing (vent circles) */}
            <circle cx="37.5" cy="37.5" r="13" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-deep/30 dark:text-white/30" />

            {/* Rotating Fan Blades */}
            <motion.g
              animate={activeSpeed > 0 ? { rotate: 360 } : {}}
              transition={
                activeSpeed > 0
                  ? {
                      repeat: Infinity,
                      duration: 40 / activeSpeed,
                      ease: "linear",
                    }
                  : {}
              }
              style={{ originX: "37.5px", originY: "37.5px" }}
            >
              <line x1="37.5" y1="26.5" x2="37.5" y2="48.5" stroke="currentColor" strokeWidth="2.5" className="text-slate-deep dark:text-white" />
              <line x1="26.5" y1="37.5" x2="48.5" y2="37.5" stroke="currentColor" strokeWidth="2.5" className="text-slate-deep dark:text-white" />
            </motion.g>

            {/* Exhaust tube nozzle */}
            <path d="M 58 40 L 68 40" stroke="currentColor" strokeWidth="4" className="text-slate-deep dark:text-white" />
          </g>
        </svg>
      </div>

      {/* Manual Input Slider */}
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

export default VacuumPump;
