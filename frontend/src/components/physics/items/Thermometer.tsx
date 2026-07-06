import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Thermometer() {
  const [temp, setTemp] = useState(25); // Celsius (0 to 100)
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      let direction = 1;
      interval = setInterval(() => {
        setTemp((t) => {
          if (t >= 98) direction = -1;
          if (t <= 5) direction = 1;
          return t + direction * 2;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Capillary column height: 0°C corresponds to y=120, 100°C corresponds to y=30
  const mercuryY = 120 - (temp / 100) * 90;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTemp(25);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Temp: {Math.round(temp)}°C • {Math.round(temp + 273.15)}K • {temp > 60 ? "Hot" : temp < 15 ? "Cold" : "Room"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        {/* Animated heat wave vectors */}
        {temp > 50 && (
          <div className="absolute inset-x-0 bottom-12 flex justify-center gap-6 pointer-events-none z-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-10 bg-red-400/20 dark:bg-red-500/20 rounded-full blur-[2px]"
                animate={{
                  y: [-10, -50],
                  x: [0, i % 2 === 0 ? 5 : -5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <svg viewBox="0 0 100 180" className="w-24 h-40 overflow-visible relative z-10">
          {/* Glass stem outline */}
          <path
            d="
              M 44 20
              L 56 20
              L 56 120
              A 18 18 0 1 1 44 120
              Z
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-slate-deep/20 dark:text-white/20"
          />

          {/* Graduations ticks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const yPos = 120 - i * 9;
            return (
              <g key={i}>
                <line
                  x1="58"
                  y1={yPos}
                  x2={i % 5 === 0 ? "68" : "63"}
                  y2={yPos}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-slate-deep/30 dark:text-white/30"
                />
                {i % 5 === 0 && (
                  <text
                    x="74"
                    y={yPos + 3.5}
                    fontSize="9.5"
                    fontWeight="semibold"
                    className="fill-slate-deep/50 dark:fill-white/40 font-mono"
                  >
                    {i * 10}
                  </text>
                )}
              </g>
            );
          })}

          {/* Bulb filled reservoir (always red) */}
          <circle cx="50" cy="138" r="13" fill="#ef4444" />
          {/* Glass glare overlay on bulb */}
          <circle cx="47" cy="134" r="5" fill="white" opacity="0.35" />

          {/* Mercury liquid column inside capillary */}
          <motion.line
            x1="50"
            y1="130"
            x2="50"
            y2={mercuryY}
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />

          {/* Temperature status fire/ice glow */}
          {isHovered && (
            <motion.path
              d="M 50 162 L 45 168 L 55 168 Z"
              fill={temp > 60 ? "#ef4444" : "#60a5fa"}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </svg>
      </div>

      {/* Manual Input Slider */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${temp}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default Thermometer;
