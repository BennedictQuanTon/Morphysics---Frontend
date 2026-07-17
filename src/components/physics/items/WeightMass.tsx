import { useState, useEffect } from "react";

export function WeightMass() {
  const [mass, setMass] = useState(200); // mass in grams (50 to 500)
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);

  // Harmonic oscillation logic
  useEffect(() => {
    let animationFrameId: number;
    if (isHovered) {
      const startTime = performance.now();
      const update = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        setTime(elapsed);
        animationFrameId = requestAnimationFrame(update);
      };
      animationFrameId = requestAnimationFrame(update);
    } else {
      setTime(0);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Physics params:
  const k = 15; // Spring constant
  const m = mass / 1000; // mass in kg
  const omega = Math.sqrt(k / m); // Angular frequency
  const amplitude = isHovered ? 18 : 0; // Amplitude of oscillation

  // Spring extension at rest: elongation = m * g / k
  // Baseline stretch = 30 + elongation * scale
  const elongation = (m * 9.8) / k;
  const equilibriumY = 50 + elongation * 120;
  const currentY = equilibriumY + amplitude * Math.sin(omega * time);

  // Generate spring paths (zig-zag coil)
  const coilCount = 14;
  const springTopY = 15;
  const springBottomY = currentY - 12;
  const springHeight = springBottomY - springTopY;
  const points = [];
  points.push(`M 90 ${springTopY}`);
  for (let i = 0; i <= coilCount; i++) {
    const y = springTopY + (i / coilCount) * springHeight;
    const x = i === 0 || i === coilCount ? 90 : 90 + (i % 2 === 0 ? 10 : -10);
    points.push(`L ${x} ${y}`);
  }
  const springPath = points.join(" ");

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parameter readout badge in corner */}
      <div className="absolute top-3 left-3 bg-white/80 dark:bg-slate-ink/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-deep dark:text-white/85 border border-slate-deep/10 dark:border-white/10 shadow-sm z-20 pointer-events-none uppercase tracking-wide">
        Elongation: {Math.round(elongation * 100)} mm • Freq: {Math.round((omega / (2 * Math.PI)) * 10) / 10} Hz
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 180 180" className="w-36 h-40 overflow-visible">
          {/* Top support hook/bar */}
          <line x1="60" y1="15" x2="120" y2="15" stroke="currentColor" strokeWidth="4" className="text-slate-deep dark:text-white" />
          <circle cx="90" cy="15" r="3.5" fill="currentColor" className="text-slate-deep dark:text-white" />

          {/* Spring (Zig-zag path) */}
          <path
            d={springPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-deep/50 dark:text-white/40"
          />

          {/* Mass calibration block hanging */}
          <g transform={`translate(0, ${currentY})`}>
            {/* Hanging Hook */}
            <path
              d="M 90 -12 Q 90 -4 86 -4 Q 82 -4 82 -8 Q 82 -12 90 -12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-deep dark:text-white"
            />
            {/* Weight block Body */}
            <rect
              x="70"
              y="-4"
              width="40"
              height="30"
              rx="4"
              className="fill-gold stroke-[#b45309]"
              strokeWidth="1.5"
            />
            {/* Top cap hook attachment */}
            <rect x="80" y="-8" width="20" height="4" fill="currentColor" className="text-gold-hover" />

            {/* Mass Label */}
            <text x="90" y="16" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="currentColor" className="text-slate-deep font-sans">
              {mass}g
            </text>

            {/* Force vector arrows */}
            {isHovered && (
              <>
                {/* Gravity Vector (downward red arrow) */}
                <path d="M 90 26 L 90 56 M 85 50 L 90 56 L 95 50" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <text x="100" y="46" fill="#ef4444" fontSize="10" fontWeight="bold">Fg</text>

                {/* Spring Tension Vector (upward blue arrow) */}
                <path d="M 90 -16 L 90 -46 M 85 -40 L 90 -46 L 95 -40" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                <text x="100" y="-34" fill="#3b82f6" fontSize="10" fontWeight="bold">Ft</text>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Manual Weight controls */}
      <div className="w-full px-2 mt-auto">
        <input
          type="range"
          min="50"
          max="500"
          value={mass}
          onChange={(e) => setMass(Number(e.target.value))}
          className="control-slider"
          style={{ "--progress": `${((mass - 50) / 450) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default WeightMass;
