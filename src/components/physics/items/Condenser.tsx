import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Condenser() {
  const [flowRate, setFlowRate] = useState(50); // Flow rate (0 to 100)
  const [isHovered, setIsHovered] = useState(false);
  const [droplets, setDroplets] = useState<{ id: number; y: number }[]>([]);

  // Periodically generate dripping droplets based on flowRate
  useEffect(() => {
    if (!isHovered || flowRate === 0) return;
    const interval = setInterval(() => {
      setDroplets((prev) => [...prev, { id: Math.random(), y: 0 }]);
    }, 1500 - (flowRate / 100) * 1200);

    return () => clearInterval(interval);
  }, [isHovered, flowRate]);

  // Animate the droplets going down
  useEffect(() => {
    const frame = requestAnimationFrame(function update() {
      setDroplets((prev) =>
        prev
          .map((d) => ({ ...d, y: d.y + 2 }))
          .filter((d) => d.y < 80) // Limit height
      );
      requestAnimationFrame(update);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeFlow = isHovered ? flowRate : 0;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setDroplets([]);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Temp: 15°C • Flow: {activeFlow} L/m
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 160 180" className="w-28 h-44 overflow-visible">
          {/* Water coolant inlet/outlet ports */}
          <rect x="25" y="50" width="12" height="6" rx="1.5" fill="currentColor" className="text-slate-deep/30 dark:text-white/20" />
          <rect x="123" y="120" width="12" height="6" rx="1.5" fill="currentColor" className="text-slate-deep/30 dark:text-white/20" />

          {/* Coolant outer jacket cylinder */}
          <rect
            x="35"
            y="40"
            width="90"
            height="100"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-slate-deep/20 dark:text-white/20"
          />
          {/* Coolant Fluid (light blue filling) */}
          <rect
            x="37"
            y="42"
            width="86"
            height="96"
            rx="6"
            fill="#60a5fa"
            fillOpacity={activeFlow > 0 ? 0.25 : 0.05}
            style={{ transition: "fill-opacity 0.4s ease" }}
          />

          {/* Core glass tube going straight down */}
          <line
            x1="80"
            y1="15"
            x2="80"
            y2="155"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-deep/10 dark:text-white/10"
            strokeLinecap="round"
          />

          {/* Spiral glass tube wrapping the core tube */}
          <path
            d="
              M 80 20
              Q 95 30 80 40
              T 80 60
              T 80 80
              T 80 100
              T 80 120
              T 80 140
              L 80 155
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-deep/30 dark:text-white/30"
          />

          {/* Dynamic flowing vapor (pulsing dotted path inside spiral) */}
          {activeFlow > 0 && (
            <motion.path
              d="
                M 80 20
                Q 95 30 80 40
                T 80 60
                T 80 80
                T 80 100
                T 80 120
                T 80 140
                L 80 155
              "
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: -20 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}

          {/* Dripping condensed droplets at the bottom outlet */}
          <g transform="translate(80, 155)">
            {/* Base drip output */}
            <path d="M -5 0 Q 0 8 5 0 Z" fill="#60a5fa" />

            {/* Falling Droplets */}
            {droplets.map((d) => (
              <circle key={d.id} cx="0" cy={d.y} r="2.5" fill="#3b82f6" />
            ))}
          </g>
        </svg>

        {/* Cold glow effect */}
        {activeFlow > 0 && (
          <div className="absolute inset-0 bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none" />
        )}
      </div>

      {/* Manual Controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={flowRate}
          onChange={(e) => setFlowRate(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${flowRate}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default Condenser;
