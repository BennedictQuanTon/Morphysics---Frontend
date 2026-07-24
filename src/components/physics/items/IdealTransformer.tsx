import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function IdealTransformer() {
  const [turnsRatio, setTurnsRatio] = useState(2); // Secondary / Primary turns ratio: 0.5 (step-down) to 2 (step-up)
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);

  // Time ticker for AC frequency animation
  useEffect(() => {
    let frameId: number;
    const start = performance.now();
    const update = () => {
      setTime((performance.now() - start) / 1000);
      frameId = requestAnimationFrame(update);
    };
    if (isHovered) {
      frameId = requestAnimationFrame(update);
    } else {
      setTime(0);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  const Vp = 6.0; // Input Primary voltage amplitude (V)
  const Vs = Vp * (isHovered ? turnsRatio : 0); // Output Secondary voltage
  const sinTime = Math.sin(time * 2 * Math.PI * 1.5); // 1.5 Hz AC frequency

  // Magnetic flux density in core (circulating arrows/dots)
  const activeFlux = isHovered ? sinTime : 0;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Ratio: 1:{turnsRatio} • {turnsRatio > 1 ? "Step-Up" : turnsRatio < 1 ? "Step-Down" : "1:1 Isolation"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 160" className="w-44 h-36 overflow-visible">
          {/* Rectangular Iron Core (magnetic circuit) */}
          <rect
            x="40"
            y="30"
            width="120"
            height="100"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-slate-deep/30 dark:text-white/20"
          />
          {/* Inner core boundary line */}
          <rect x="48" y="38" width="104" height="84" rx="2" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />

          {/* Circulating magnetic flux path (flowing dashed line inside the core) */}
          {isHovered && (
            <motion.rect
              x="40"
              y="30"
              width="120"
              height="100"
              rx="6"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeDasharray="6 12"
              animate={{ strokeDashoffset: activeFlux > 0 ? 30 : -30 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}

          {/* Primary Windings (Left: Np = 10 turns) */}
          <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.95">
            {/* Windings overlaying the iron core */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 42 + i * 15;
              return (
                <path key={i} d={`M 30 ${y} L 50 ${y - 4} M 30 ${y + 6} L 50 ${y + 2}`} />
              );
            })}
            {/* Primary terminal leads */}
            <path d="M 15 42 L 30 42" strokeWidth="2" />
            <path d="M 15 117 L 30 117" strokeWidth="2" />
          </g>

          {/* Secondary Windings (Right: Ns = Np * turnsRatio) */}
          <g stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.95">
            {/* Windings density depends on turnsRatio */}
            {Array.from({ length: turnsRatio === 0.5 ? 3 : turnsRatio === 1 ? 6 : 10 }).map((_, i) => {
              const count = turnsRatio === 0.5 ? 3 : turnsRatio === 1 ? 6 : 10;
              const spacing = 80 / (count - 1);
              const y = 42 + i * spacing;
              return (
                <path key={i} d={`M 150 ${y - 4} L 170 ${y} M 150 ${y + 2} L 170 ${y + 6}`} />
              );
            })}
            {/* Secondary terminal leads */}
            <path d="M 170 42 L 185 42" strokeWidth="2" />
            <path d="M 170 117 L 185 117" strokeWidth="2" />
          </g>

          {/* Primary AC Input Source Indicator */}
          <text x="12" y="84" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">
            AC IN
          </text>
          {isHovered && (
            <motion.circle
              cx="12"
              cy="70"
              r="4"
              fill="#f59e0b"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          {/* Secondary Light Bulb Output Load */}
          <g transform="translate(185, 80)">
            {/* Socket */}
            <rect x="-2" y="-12" width="4" height="24" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
            {/* Filament wires */}
            <line x1="2" y1="-8" x2="8" y2="-4" stroke="currentColor" strokeWidth="1" className="text-slate-deep/50 dark:text-white/40" />
            <line x1="2" y1="8" x2="8" y2="4" stroke="currentColor" strokeWidth="1" className="text-slate-deep/50 dark:text-white/40" />
            {/* Bulb Glass */}
            <circle cx="12" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-deep/40 dark:text-white/40" />
            {/* Bulb Glow overlay */}
            <circle
              cx="12"
              cy="0"
              r="9"
              fill="var(--gold)"
              opacity={isHovered ? Math.abs(Vs / 12) * Math.abs(sinTime) * 0.95 : 0}
              style={{ transition: "opacity 0.15s ease" }}
            />
            {/* Filament */}
            <path d="M 6 -3 L 12 3 L 12 -3 L 18 3" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-deep/80 dark:text-white/80" />
          </g>

          {/* Live text readings */}
          <text x="58" y="148" fontSize="8" fontWeight="bold" fill="currentColor" className="text-slate-deep/50 dark:text-white/40 font-mono">
            {isHovered ? `Vp: ${(Vp * sinTime).toFixed(1)}V` : "Vp: 0V"}
          </text>
          <text x="142" y="148" fontSize="8" fontWeight="bold" fill="currentColor" className="text-slate-deep/50 dark:text-white/40 font-mono" textAnchor="end">
            {isHovered ? `Vs: ${(Vs * sinTime).toFixed(1)}V` : "Vs: 0V"}
          </text>
        </svg>
      </div>

      {/* Mode settings */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.5"
          value={turnsRatio}
          onChange={(e) => setTurnsRatio(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${((turnsRatio - 0.5) / 1.5) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default IdealTransformer;
