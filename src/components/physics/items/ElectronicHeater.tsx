import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ElectronicHeater() {
  const [power, setPower] = useState(1000); // 0W to 2000W
  const [isHovered, setIsHovered] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(25); // Celsius

  // Temp changes according to power setting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && power > 0) {
      const targetTemp = 25 + (power / 2000) * 450; // max 475C
      interval = setInterval(() => {
        setCurrentTemp((t) => {
          if (t < targetTemp) return Math.min(targetTemp, t + 4);
          if (t > targetTemp) return Math.max(targetTemp, t - 4);
          return t;
        });
      }, 30);
    } else {
      interval = setInterval(() => {
        setCurrentTemp((t) => {
          if (t <= 25) {
            clearInterval(interval);
            return 25;
          }
          return Math.max(25, t - 3);
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isHovered, power]);

  // Glow color interpolator (from gray/cold to bright orange-red)
  const ratio = (currentTemp - 25) / 450;
  const coilColor = ratio > 0.05
    ? `rgb(${Math.round(100 + ratio * 155)}, ${Math.round(50 + ratio * 80)}, ${Math.round(20 * (1 - ratio))})`
    : "currentColor";

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Wattage: {power}W • Temp: {Math.round(currentTemp)}°C
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        {/* Animated heat wave lines */}
        {currentTemp > 80 && (
          <div className="absolute inset-x-0 top-6 bottom-16 flex justify-center gap-6 pointer-events-none z-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.path
                key={i}
                d="M0,0 Q10,-10 -10,-20 T0,-40"
                fill="none"
                stroke="rgba(239, 68, 68, 0.25)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="w-4"
                animate={{
                  y: [10, -50],
                  opacity: [0, 0.8, 0],
                  scaleX: [1, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: "easeInOut",
                }}
                style={{
                  transformOrigin: "center bottom",
                  position: "absolute",
                  left: `${45 + i * 15}%`,
                }}
              />
            ))}
          </div>
        )}

        <svg viewBox="0 0 180 160" className="w-36 h-36 overflow-visible relative z-10">
          {/* Heater chassis */}
          <rect x="25" y="100" width="130" height="35" rx="5" className="fill-slate-deep dark:fill-slate-800 stroke-slate-deep/20 dark:stroke-white/10" strokeWidth="2.5" />

          {/* Electronic LCD power panel */}
          <rect x="40" y="110" width="45" height="16" rx="2" fill="#0c1a14" />
          <text x="62.5" y="122" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
            {Math.round(currentTemp)}°C
          </text>

          {/* Control Dial Knobs */}
          <circle cx="115" cy="118" r="7.5" fill="currentColor" className="text-slate-deep/50 dark:text-white/30" />
          <line x1="115" y1="118" x2="115" y2="111" stroke="currentColor" strokeWidth="2" className="text-gold" />

          <circle cx="135" cy="118" r="6" fill="currentColor" className="text-slate-deep/50 dark:text-white/30" />
          <line x1="135" y1="118" x2="135" y2="113" stroke="currentColor" strokeWidth="1.5" className="text-gold" />

          {/* Heat plate base (metallic) */}
          <rect x="20" y="85" width="140" height="15" rx="3" fill="currentColor" className="text-slate-deep/30 dark:text-white/20" />

          {/* Serpentine heating coil on plate */}
          <path
            d="
              M 35 85
              L 35 70
              A 10 10 0 0 1 55 70
              L 55 85
              M 65 85
              L 65 62
              A 10 10 0 0 1 85 62
              L 85 85
              M 95 85
              L 95 62
              A 10 10 0 0 1 115 62
              L 115 85
              M 125 85
              L 125 70
              A 10 10 0 0 1 145 70
              L 145 85
            "
            fill="none"
            stroke={coilColor}
            strokeWidth="4"
            strokeLinecap="round"
            className={ratio === 0 ? "text-slate-deep/60 dark:text-white/40" : ""}
            style={{ transition: "stroke 0.4s ease" }}
          />

          {/* Plate feet */}
          <rect x="35" y="135" width="15" height="6" rx="2" fill="currentColor" className="text-slate-deep dark:text-white/50" />
          <rect x="130" y="135" width="15" height="6" rx="2" fill="currentColor" className="text-slate-deep dark:text-white/50" />
        </svg>
      </div>

      {/* Manual Temp Controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="2000"
          step="100"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${(power / 2000) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default ElectronicHeater;
