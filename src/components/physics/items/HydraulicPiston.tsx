import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function HydraulicPiston() {
  const [disp, setDisp] = useState(0); // Displacement parameter (-20 to 20)
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      let direction = 1;
      interval = setInterval(() => {
        setDisp((d) => {
          if (d >= 20) direction = -1;
          if (d <= -20) direction = 1;
          return d + direction * 1.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Left Piston Y position: baseline is y=80. As disp increases, left goes down (+disp), right goes up (-disp/3)
  const leftPistonY = 80 + disp;
  const rightPistonY = 80 - disp / 2.5; // Area ratio is 2.5x

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setDisp(0);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Advantage: 2.5x • Pascal: constant
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 180" className="w-36 h-40 overflow-visible">
          {/* Hydraulic Fluid in U-Tube (animated height/curves) */}
          <motion.path
            d={`
              M 20 ${leftPistonY}
              L 20 140
              Q 20 160 40 160
              L 160 160
              Q 180 160 180 140
              L 180 ${rightPistonY}
              L 125 ${rightPistonY}
              L 125 120
              Q 125 110 115 110
              L 85 110
              Q 75 110 75 120
              L 75 ${leftPistonY}
              Z
            `}
            fill="#3b82f6"
            fillOpacity="0.75"
            stroke="#2563eb"
            strokeWidth="2"
            transition={{ type: "tween", ease: "linear" }}
          />

          {/* Connectors/Grid Lines */}
          <line x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-white/10" />

          {/* Left Cylinder wall (narrow: width = 55px) */}
          <path
            d="M 20 30 L 20 140 Q 20 160 40 160 L 75 160 L 75 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-deep/20 dark:text-white/20"
          />

          {/* Right Cylinder wall (wide: width = 55px, offset) */}
          <path
            d="M 125 30 L 125 120 L 180 120 L 180 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-deep/20 dark:text-white/20"
            style={{ display: "none" }} /* using compound path below instead */
          />

          {/* Unified Outer Frame Wall */}
          <path
            d="
              M 20 30 L 20 140 Q 20 160 40 160 L 160 160 Q 180 160 180 140 L 180 30
              M 125 30 L 125 120 Q 125 110 115 110 L 85 110 Q 75 110 75 120 L 75 30
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-deep/20 dark:text-white/20"
          />

          {/* Left Piston (Narrow, moves down) */}
          <motion.g
            animate={{ y: disp }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Shaft */}
            <line x1="47.5" y1="20" x2="47.5" y2="80" stroke="currentColor" strokeWidth="5" className="text-slate-deep/50 dark:text-white/40" />
            <rect x="35" y="10" width="25" height="10" rx="2" fill="currentColor" className="text-slate-deep dark:text-white" />
            {/* Plunger */}
            <rect x="21" y="75" width="53" height="12" rx="2" fill="currentColor" className="text-gold" />
          </motion.g>

          {/* Right Piston (Wide, moves up) */}
          <motion.g
            animate={{ y: -disp / 2.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Shaft */}
            <line x1="152.5" y1="10" x2="152.5" y2="80" stroke="currentColor" strokeWidth="8" className="text-slate-deep/50 dark:text-white/40" />
            <rect x="135" y="0" width="35" height="12" rx="2" fill="currentColor" className="text-slate-deep dark:text-white" />
            {/* Plunger */}
            <rect x="126.5" y="75" width="52" height="15" rx="2" fill="currentColor" className="text-gold" />
          </motion.g>

          {/* Force multiplier visual indicators */}
          {isHovered && (
            <>
              {/* Force arrow left (thin downward) */}
              <motion.path
                d="M 47.5 -5 L 47.5 15 M 42.5 10 L 47.5 15 L 52.5 10"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: disp }}
              />
              <motion.text
                x="47.5"
                y="-10"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="11"
                fontWeight="bold"
                animate={{ y: disp }}
              >
                F
              </motion.text>

              {/* Force arrow right (thick upward) */}
              <motion.path
                d="M 152.5 -5 L 152.5 -30 M 147.5 -25 L 152.5 -30 L 157.5 -25"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: -disp / 2.5 }}
              />
              <motion.text
                x="152.5"
                y="-35"
                textAnchor="middle"
                fill="#10b981"
                fontSize="11"
                fontWeight="bold"
                animate={{ y: -disp / 2.5 }}
              >
                2.5F
              </motion.text>
            </>
          )}
        </svg>
      </div>

      {/* Manual Controller */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="-20"
          max="20"
          value={disp}
          onChange={(e) => setDisp(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${(disp + 20) / 40 * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default HydraulicPiston;
