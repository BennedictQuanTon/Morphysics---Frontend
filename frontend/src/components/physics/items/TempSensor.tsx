import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function TempSensor() {
  const [targetTemp, setTargetTemp] = useState(37.0);
  const [isHovered, setIsHovered] = useState(false);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // Readout fluctuation simulation
  const [currentReadout, setCurrentReadout] = useState(37.0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        const jitter = (Math.random() - 0.5) * 0.4;
        setCurrentReadout(targetTemp + jitter);
      }, 150);
    } else {
      setCurrentReadout(targetTemp);
    }
    return () => clearInterval(interval);
  }, [isHovered, targetTemp]);

  const displayTemp = unit === "C" ? currentReadout : (currentReadout * 9) / 5 + 32;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Target: {targetTemp}°C • Output: {(targetTemp * 0.05).toFixed(2)}V
      </div>

      {/* Unit toggle clicker overlay in top-right */}
      <button
        onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
        className="absolute top-3 right-3 z-30 rounded bg-gold/15 hover:bg-gold/30 text-gold font-bold px-2 py-0.5 text-[10px] tracking-wide border border-gold/30 transition-all active:scale-95"
      >
        UNIT: {unit}
      </button>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        {/* Signal pulses */}
        {isHovered && (
          <div className="absolute left-6 bottom-16 w-16 h-16 pointer-events-none z-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-gold/40"
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        <svg viewBox="0 0 180 160" className="w-36 h-36 overflow-visible relative z-10">
          {/* Connecting cable */}
          <path
            d="M 50 100 Q 80 130 110 90 T 140 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-slate-deep/30 dark:text-white/20"
          />

          {/* Temperature Probe (pointing bottom-left) */}
          <g transform="translate(10, 60) rotate(-45)">
            {/* Metal sleeve tip */}
            <rect x="0" y="0" width="12" height="50" rx="3" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
            <rect x="0" y="0" width="12" height="12" rx="2" fill="var(--gold)" />
            {/* Cable joint */}
            <rect x="3" y="48" width="6" height="8" fill="currentColor" className="text-slate-deep/20 dark:text-white/20" />
          </g>

          {/* Digital Readout Screen (top-right) */}
          <g transform="translate(90, 20)">
            {/* Screen border/chassis */}
            <rect x="0" y="0" width="85" height="55" rx="6" className="fill-slate-deep dark:fill-slate-800 stroke-slate-deep/15 dark:stroke-white/10" strokeWidth="2.5" />
            {/* LCD Screen background */}
            <rect x="5" y="5" width="75" height="45" rx="4" fill="#0d1f18" />

            {/* LED Status dot */}
            <circle cx="15" cy="40" r="3" fill={isHovered ? "#10b981" : "#ef4444"} />

            {/* Temperature readout digits */}
            <text x="72" y="32" textAnchor="end" fill="#34d399" fontSize="18" fontWeight="bold" fontFamily="monospace" className="tracking-tight">
              {displayTemp.toFixed(1)}°
            </text>

            <text x="74" y="30" textAnchor="start" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
              {unit}
            </text>

            {/* Minor label */}
            <text x="30" y="43" fill="#34d399" opacity="0.6" fontSize="7" fontFamily="monospace">
              {isHovered ? "SAMPLING" : "STANDBY"}
            </text>
          </g>
        </svg>
      </div>

      {/* Manual Temp Controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={targetTemp}
          onChange={(e) => setTargetTemp(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${targetTemp}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default TempSensor;
