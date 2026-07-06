import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useVelocity, useSpring } from "framer-motion";

export function SolenoidTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = useMemo(() => [
    { name: "red", hex: "#ff5c5c" },
    { name: "blue", hex: "#3b82f6" },
    { name: "green", hex: "#10b981" },
  ], []);

  // Track scroll progress of this container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Flow direction is scroll-linked:
  // Scroll down -> scrollYProgress increases -> offset goes from 300 to -300 (left-to-right flow)
  // Scroll up -> scrollYProgress decreases -> offset goes from -300 to 300 (right-to-left flow)
  const dashOffset = useTransform(scrollYProgress, [0, 1], [300, -300]);

  // Initially, no magnetic field lines. They grow (penetrate) as the user scrolls.
  // Start growing when the container starts entering the viewport, fully grown when centered.
  const rawPathLength = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const rawLineOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 0.85]);

  const linePathLength = useSpring(rawPathLength, { stiffness: 50, damping: 15 });
  const lineOpacity = useSpring(rawLineOpacity, { stiffness: 50, damping: 15 });

  // Track scroll velocity for electromagnetic induction glow (Faraday's Law)
  const scrollVelocity = useVelocity(scrollYProgress);

  // Map absolute velocity to induction glow opacity [0, 0.8]
  const glowOpacity = useTransform(scrollVelocity, (v) => {
    const absV = Math.abs(v);
    const minGlow = 0.0;
    const maxGlow = 0.8;
    const boost = Math.min(maxGlow - minGlow, absV * 0.25);
    return minGlow + boost;
  });

  // Map absolute velocity to coil stroke expansion (dynamic visual induction)
  const glowWidth = useTransform(scrollVelocity, (v) => {
    const absV = Math.abs(v);
    return 6.5 + Math.min(4, absV * 2);
  });

  // Smooth the animation values so they don't jump abruptly on jerky scrolls
  const smoothedGlow = useSpring(glowOpacity, { stiffness: 75, damping: 20 });
  const smoothedWidth = useSpring(glowWidth, { stiffness: 75, damping: 20 });

  // Generate the 3D Solenoid Coil geometry:
  // Width: 1300 (from -50 to 1250), Height: 200, Center: Y=100
  const coilGeom = useMemo(() => {
    const startX = -50;
    const endX = 1250;
    const numTurns = 24; // Increased turns to maintain coil density across full width
    const step = (endX - startX) / numTurns;
    const halfStep = step / 2;
    const ctrlOffset = step * 0.24;

    const turns = [];
    for (let i = 0; i < numTurns; i++) {
      const x = startX + i * step;
      turns.push({
        // Back of the loop (drawn behind the core & field lines)
        back: `M ${x + halfStep},145 C ${x + halfStep + ctrlOffset},145 ${x + step - ctrlOffset},55 ${x + step},55`,
        // Front of the loop (drawn in front of the core & field lines)
        front: `M ${x},55 C ${x + ctrlOffset},55 ${x + halfStep - ctrlOffset},145 ${x + halfStep},145`,
      });
    }
    return turns;
  }, []);

  // Diverging magnetic field lines running through the core of the solenoid (extended edge-to-edge)
  const fieldLines = [
    // Center axis
    "M -120,100 L 1320,100",
    // Inner field lines (gently curved)
    "M -120,85 C 100,92 1100,92 1320,85",
    "M -120,115 C 100,108 1100,108 1320,115",
    // Outer field lines (flaring outward at the poles)
    "M -120,65 C 100,82 1100,82 1320,65",
    "M -120,135 C 100,118 1100,118 1320,135",
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-44 sm:h-52 overflow-hidden bg-cloud dark:bg-slate-ink transition-colors duration-500 flex items-center justify-center"
    >
      {/* Dotted texture to seamlessly continue the pattern from above and below */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,200,255,0.05)_0%,transparent_75%)] pointer-events-none" />

      {/* Physics Solenoid Vector Layer */}
      <div className="w-full h-full relative z-10">
        <svg
          viewBox="-50 0 1300 200"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Defs for gradients and glow filters */}
          <defs>
            {/* Front metallic silver wire gradient */}
            <linearGradient id="solenoid-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#dce2ec" />
              <stop offset="50%" stopColor="#8c9ba5" />
              <stop offset="80%" stopColor="#4a535e" />
              <stop offset="100%" stopColor="#222830" />
            </linearGradient>

            {/* Back wire gradient */}
            <linearGradient id="solenoid-silver-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#606b78" />
              <stop offset="50%" stopColor="#38404a" />
              <stop offset="100%" stopColor="#1a1e24" />
            </linearGradient>

            {/* Glowing magnetic core gradient (ice blue/silver) */}
            <linearGradient id="core-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="15%" stopColor="rgba(165, 200, 255, 0.08)" />
              <stop offset="50%" stopColor="rgba(220, 235, 255, 0.4)" />
              <stop offset="85%" stopColor="rgba(165, 200, 255, 0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Dynamic Arrow markers for flux lines */}
            {colors.map((c) => (
              <marker
                key={`flux-arrow-${c.name}`}
                id={`flux-arrow-${c.name}`}
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 1 2 L 8 5 L 1 8 Z" fill={c.hex} className="opacity-95" />
              </marker>
            ))}
          </defs>

          {/* 1. DRAW BACK COIL TURNS (behind field lines) */}
          <g>
            {coilGeom.map((turn, i) => (
              <g key={`back-group-${i}`}>
                {/* Back Wire Outline */}
                <path
                  d={turn.back}
                  fill="none"
                  stroke="#11151a"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="opacity-90"
                />
                {/* Back Wire Metallic Body */}
                <path
                  d={turn.back}
                  fill="none"
                  stroke="url(#solenoid-silver-dark)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="opacity-90"
                />
              </g>
            ))}
          </g>

          {/* 2. GLOWING ELECTROMAGNETIC CORE */}
          <motion.rect
            x="-60"
            y="90"
            width="1320"
            height="20"
            rx="10"
            fill="url(#core-glow)"
            style={{ opacity: smoothedGlow }}
            className="filter blur-[3px]"
          />

          {/* 3. DRAW MAGNETIC FIELD (FLUX) LINES (in between layers) */}
          <g>
            {fieldLines.map((d, i) => {
              const colorInfo = colors[i % colors.length];
              return (
                <motion.path
                  key={`flux-${i}`}
                  d={d}
                  fill="none"
                  stroke={colorInfo.hex}
                  strokeWidth={i === 0 ? "2.5" : "1.8"}
                  strokeDasharray="14 10"
                  style={{
                    strokeDashoffset: dashOffset,
                    pathLength: linePathLength,
                    opacity: lineOpacity
                  }}
                  className="filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_1px_2.5px_rgba(0,0,0,0.9)]"
                  markerEnd={`url(#flux-arrow-${colorInfo.name})`}
                  markerStart={`url(#flux-arrow-${colorInfo.name})`}
                />
              );
            })}
          </g>

          {/* 4. DRAW FRONT COIL TURNS (in front of field lines & core) */}
          <g>
            {/* Ambient Shadow Overlay for 3D realism */}
            {coilGeom.map((turn, i) => (
              <path
                key={`front-shadow-${i}`}
                d={turn.front}
                fill="none"
                stroke="rgba(0, 0, 0, 0.25)"
                strokeWidth="9"
                strokeLinecap="round"
                className="blur-[2px] pointer-events-none"
              />
            ))}

            {/* Dynamic Induction Glow (Scales strokeWidth based on scroll velocity) */}
            {coilGeom.map((turn, i) => (
              <motion.path
                key={`front-glow-${i}`}
                d={turn.front}
                fill="none"
                stroke="#d0e0ff"
                style={{
                  strokeWidth: smoothedWidth,
                  opacity: smoothedGlow,
                }}
                strokeLinecap="round"
                className="filter blur-[4px] pointer-events-none"
              />
            ))}

            {/* Main Wire Outline (Crisp Dark Edge) */}
            {coilGeom.map((turn, i) => (
              <path
                key={`front-outline-${i}`}
                d={turn.front}
                fill="none"
                stroke="#1e232b"
                strokeWidth="8.5"
                strokeLinecap="round"
              />
            ))}

            {/* Main Wire Metallic Body */}
            {coilGeom.map((turn, i) => (
              <path
                key={`front-wire-${i}`}
                d={turn.front}
                fill="none"
                stroke="url(#solenoid-silver)"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            ))}

            {/* Specular Highlight */}
            {coilGeom.map((turn, i) => (
              <path
                key={`front-specular-${i}`}
                d={turn.front}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-75 pointer-events-none"
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default SolenoidTransition;
