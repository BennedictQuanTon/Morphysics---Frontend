import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function PressureGauge() {
  const [pressure, setPressure] = useState(30); // 0 to 100 psi
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      let direction = 1;
      interval = setInterval(() => {
        setPressure((p) => {
          if (p >= 95) direction = -1.2;
          if (p <= 5) direction = 1.2;
          return p + direction * 2.5;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Map 0-100 pressure to needle angle: -135deg (0 psi) to +135deg (100 psi)
  const needleAngle = -135 + (pressure / 100) * 270;

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPressure(30);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Pressure: {Math.round(pressure * 0.0689 * 10) / 10} bar • {pressure > 80 ? "DANGER" : "NORMAL"}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 180 180" className="w-36 h-36 overflow-visible">
          {/* External casing */}
          <circle cx="90" cy="90" r="75" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-deep/30 dark:text-white/20" />
          <circle cx="90" cy="90" r="72" fill="currentColor" className="text-slate-deep/[0.03] dark:text-white/[0.03]" />

          {/* Dial ring ticks (0 to 10) */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = -135 + idx * 27;
            const rad = (angle * Math.PI) / 180;
            const x1 = 90 + Math.cos(rad) * 60;
            const y1 = 90 + Math.sin(rad) * 60;
            const x2 = 90 + Math.cos(rad) * (idx % 2 === 0 ? 50 : 54);
            const y2 = 90 + Math.sin(rad) * (idx % 2 === 0 ? 50 : 54);

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={idx % 2 === 0 ? "2.5" : "1.5"}
                className="text-slate-deep/40 dark:text-white/40"
              />
            );
          })}

          {/* Danger zone arc (80 to 100) */}
          <path
            d="M 132.4 132.4 A 60 60 0 0 0 148.4 60"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Pressure inlet stem (bottom) */}
          <rect x="84" y="158" width="12" height="15" fill="currentColor" className="text-slate-deep/40 dark:text-white/30" />
          <line x1="90" y1="158" x2="90" y2="173" stroke="currentColor" strokeWidth="2" className="text-gold" />

          {/* Digital reading label */}
          <text x="90" y="132" textAnchor="middle" fontSize="13" fontWeight="bold" className="fill-slate-deep/50 dark:fill-white/50 font-mono">
            PSI
          </text>
          <text x="90" y="115" textAnchor="middle" fontSize="18" fontWeight="black" className="fill-slate-deep dark:fill-white font-mono">
            {Math.round(pressure)}
          </text>

          {/* Golden Pointer Needle */}
          <motion.g
            animate={{ rotate: needleAngle }}
            style={{ originX: "90px", originY: "90px" }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
          >
            {/* Needle shaft */}
            <line x1="90" y1="90" x2="90" y2="35" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
            {/* Needle pointer tip */}
            <polygon points="87,38 90,26 93,38" fill="var(--gold)" />
            {/* Counterbalance tail */}
            <line x1="90" y1="90" x2="90" y2="105" stroke="currentColor" strokeWidth="2" className="text-slate-deep/40 dark:text-white/40" />
          </motion.g>

          {/* Center cap */}
          <circle cx="90" cy="90" r="10" fill="currentColor" className="text-slate-deep dark:text-white" />
          <circle cx="90" cy="90" r="5" fill="var(--gold)" />
        </svg>

        {/* Ambient indicator lights based on pressure */}
        {pressure > 80 && (
          <div className="absolute top-6 right-6 h-3.5 w-3.5 rounded-full bg-red-500 animate-pulse border border-white dark:border-slate-800" />
        )}
      </div>

      {/* Manual Input */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={pressure}
          onChange={(e) => setPressure(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${pressure}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default PressureGauge;
