import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function RectangularCoil() {
  const [current, setCurrent] = useState(2); // Amperes (-5 to 5)
  const [isHovered, setIsHovered] = useState(false);
  const [angle, setAngle] = useState(0);

  // Rotation velocity is proportional to current strength
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const update = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isHovered && current !== 0) {
        // coil spins
        setAngle((a) => (a + current * 45 * dt) % 360);
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, current]);

  // SVG representation of loop rotation using scaling to mimic 3D perspective rotation!
  const cosA = Math.cos((angle * Math.PI) / 180);
  const sinA = Math.sin((angle * Math.PI) / 180);

  // Coil coordinates with perspective mapping
  const widthScale = cosA; // horizontal scaling
  const skewY = sinA * 15; // vertical skewing representing tilt

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setAngle(0);
      }}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Current: {current} A • Torque: {(Math.abs(current) * Math.abs(cosA) * 0.12).toFixed(3)} N·m
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 180 160" className="w-36 h-36 overflow-visible">
          {/* North pole magnet (Left) */}
          <path d="M 15 50 L 40 50 L 45 60 L 45 100 L 40 110 L 15 110 Z" fill="#ef4444" opacity="0.85" />
          <text x="25" y="85" fill="white" fontWeight="black" fontSize="13">N</text>

          {/* South pole magnet (Right) */}
          <path d="M 165 50 L 140 50 L 135 60 L 135 100 L 140 110 L 165 110 Z" fill="#3b82f6" opacity="0.85" />
          <text x="155" y="85" fill="white" fontWeight="black" fontSize="13" textAnchor="end">S</text>

          {/* Magnetic field lines arrows (N to S) */}
          {isHovered && (
            <g stroke="#e2e8f0" strokeWidth="1.2" opacity="0.3" fill="none">
              <line x1="45" y1="65" x2="135" y2="65" strokeDasharray="3 3" />
              <line x1="45" y1="80" x2="135" y2="80" strokeDasharray="3 3" />
              <line x1="45" y1="95" x2="135" y2="95" strokeDasharray="3 3" />
            </g>
          )}

          {/* Center spindle axis shaft */}
          <line x1="90" y1="30" x2="90" y2="130" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" className="text-slate-deep/30 dark:text-white/20" />

          {/* Rotating coil group */}
          <g transform={`translate(90, 80) scale(${widthScale}, 1) skewY(${skewY})`}>
            {/* The wire loop rectangle */}
            <rect
              x="-35"
              y="-30"
              width="70"
              height="60"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Glowing current flow indicators (running dots) */}
            {isHovered && current !== 0 && (
              <motion.rect
                x="-35"
                y="-30"
                width="70"
                height="60"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="8 12"
                animate={{ strokeDashoffset: current > 0 ? -40 : 40 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}

            {/* Force torque vector arrows (vertical arrows at loop edges) */}
            {isHovered && current !== 0 && (
              <g stroke="#f59e0b" strokeWidth="2" fill="none">
                {/* Left force (up or down depending on current & rotation state) */}
                <path
                  d={cosA * current > 0 ? "M -35 -30 L -35 -48 M -39 -43 L -35 -48 L -31 -43" : "M -35 -30 L -35 -12 M -39 -17 L -35 -12 L -31 -17"}
                />
                <text x="-48" y={cosA * current > 0 ? "-48" : "-8"} fill="#f59e0b" fontSize="10" fontWeight="bold">F</text>

                {/* Right force (opposite direction) */}
                <path
                  d={cosA * current > 0 ? "M 35 30 L 35 12 M 31 17 L 35 12 L 39 17" : "M 35 30 L 35 48 M 31 43 L 35 48 L 39 43"}
                />
                <text x="44" y={cosA * current > 0 ? "10" : "50"} fill="#f59e0b" fontSize="10" fontWeight="bold">F</text>
              </g>
            )}
          </g>

          {/* Slip ring terminals */}
          <circle cx="90" cy="120" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-deep/50 dark:text-white/40" />
          <circle cx="90" cy="128" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-deep/50 dark:text-white/40" />
        </svg>
      </div>

      {/* Manual Current Controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="-5"
          max="5"
          step="1"
          value={current}
          onChange={(e) => setCurrent(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${((current + 5) / 10) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default RectangularCoil;
