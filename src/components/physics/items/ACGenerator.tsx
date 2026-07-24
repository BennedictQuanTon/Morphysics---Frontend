import { useState, useEffect } from "react";

export function ACGenerator() {
  const [rpm, setRpm] = useState(60); // Rotations per minute (30 to 120)
  const [isHovered, setIsHovered] = useState(false);
  const [angle, setAngle] = useState(0);

  // Rotate coil
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const update = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isHovered) {
        const speed = (rpm / 60) * 180; // degrees per second
        setAngle((a) => (a + speed * dt) % 360);
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, rpm]);

  // Sine wave output value: V = Vmax * sin(omega * t)
  const sinVal = Math.sin((angle * Math.PI) / 180);
  const cosVal = Math.cos((angle * Math.PI) / 180);

  // Generate oscilloscope path
  const points = [];
  const width = 80;
  const height = 40;
  for (let x = 0; x <= width; x += 2) {
    // Phase offset along horizontal axis
    const tAngle = angle - (x / width) * 360;
    const y = height / 2 + Math.sin((tAngle * Math.PI) / 180) * (height / 2 - 4);
    points.push(`${x === 0 ? "M" : "L"} ${75 + x} ${100 + y}`);
  }
  const wavePath = points.join(" ");

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
        Freq: {isHovered ? (rpm / 60).toFixed(1) : 0} Hz • Amplitude: {isHovered ? (rpm * 0.1).toFixed(1) : 0} V
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 180 160" className="w-40 h-36 overflow-visible">
          {/* North pole (left) & South pole (right) magnets */}
          <rect x="5" y="30" width="30" height="45" rx="2" fill="#ef4444" opacity="0.8" />
          <text x="18" y="58" fill="white" fontWeight="black" fontSize="12" textAnchor="middle">N</text>

          <rect x="145" y="30" width="30" height="45" rx="2" fill="#3b82f6" opacity="0.8" />
          <text x="160" y="58" fill="white" fontWeight="black" fontSize="12" textAnchor="middle">S</text>

          {/* Rotating induction loop (skewed to simulate 3D) */}
          <g transform={`translate(90, 52) scale(${cosVal}, 1)`}>
            {/* Coil wire */}
            <rect x="-30" y="-18" width="60" height="36" fill="none" stroke="var(--gold)" strokeWidth="3" />
            {/* Direction arrows */}
            {isHovered && (
              <line x1="-30" y1="-18" x2="30" y2="-18" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" />
            )}
          </g>

          {/* Core shaft & slip rings */}
          <line x1="90" y1="20" x2="90" y2="85" stroke="currentColor" strokeWidth="2" className="text-slate-deep/50 dark:text-white/40" />
          <circle cx="90" cy="72" r="6" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
          <circle cx="90" cy="80" r="6" fill="none" stroke="var(--gold)" strokeWidth="2.5" />

          {/* Oscilloscope Chassis box (bottom right) */}
          <rect x="70" y="95" width="90" height="50" rx="4" fill="#0d1b15" stroke="currentColor" strokeWidth="2" className="text-slate-deep dark:text-white/10" />
          {/* Grid lines inside oscilloscope */}
          <line x1="70" y1="120" x2="160" y2="120" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
          <line x1="115" y1="95" x2="115" y2="145" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />

          {/* Live oscilloscope plot output */}
          {isHovered ? (
            <path d={wavePath} fill="none" stroke="#34d399" strokeWidth="2" />
          ) : (
            <line x1="70" y1="120" x2="160" y2="120" stroke="#34d399" strokeWidth="2" />
          )}

          {/* Indicator light bulb connected (bottom left) */}
          <g transform="translate(35, 115)">
            {/* Wire connections */}
            <path d="M 0 5 L 35 5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-deep/30 dark:text-white/30" />
            {/* Socket */}
            <rect x="-10" y="10" width="20" height="10" fill="currentColor" className="text-slate-deep/50 dark:text-white/40" />
            {/* Bulb glass */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-deep/40 dark:text-white/40" />
            {/* Bulb glow overlay */}
            <circle
              cx="0"
              cy="0"
              r="9"
              fill={isHovered ? "var(--gold)" : "transparent"}
              opacity={Math.abs(sinVal) * 0.75}
              style={{ transition: "fill-opacity 0.1s ease" }}
            />
            {/* Filament */}
            <path d="M -4 3 L -2 -3 L 2 -3 L 4 3" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-deep/80 dark:text-white/80" />
          </g>
        </svg>
      </div>

      {/* Manual rpm slider */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="30"
          max="120"
          step="5"
          value={rpm}
          onChange={(e) => setRpm(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${((rpm - 30) / 90) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default ACGenerator;
