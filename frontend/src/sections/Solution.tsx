import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { solutions } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

/* ── Back-face bullet points with bold-italic gold keywords ── */
const CLOUD_POINTS: { icon: React.ReactNode; text: React.ReactNode }[][] = [
  [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      text: <>Input homework directly and watch <strong className="font-display italic text-gold">physics concepts</strong> come alive on screen.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10M18 20V4M6 20v-4" />
        </svg>
      ),
      text: <>Adjust <strong className="font-display italic text-gold">gravity, velocity, friction</strong> in real time and see instant results.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      text: <>Build deep <strong className="font-display italic text-gold">visual intuition</strong> — ace exams without rote memorization.</>,
    },
  ],
  [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      text: <><strong className="font-display italic text-gold">Zero setup time</strong> — launch interactive models in seconds.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      text: <>Demonstrate <strong className="font-display italic text-gold">complex scenarios safely</strong> with zero preparation overhead.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      text: <>Keep students <strong className="font-display italic text-gold">highly engaged</strong> on any screen or projector.</>,
    },
  ],
  [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      text: <>Virtual labs at only <strong className="font-display italic text-gold">10,000–13,000 VND</strong> per student annually.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      text: <>Zero <strong className="font-display italic text-gold">hardware wear-and-tear</strong> or laboratory safety risks.</>,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" stroke="#cea945" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      text: <>Deploy <strong className="font-display italic text-gold">cutting-edge technology</strong> school-wide with minimal budget.</>,
    },
  ],
];

export function Solution() {
  const [activeCard, setActiveCard] = useState(0);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [muzzleFlash, setMuzzleFlash] = useState(false);

  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGGElement>(null);
  const progress = useMotionValue(0.0);
  const rafRef = useRef<number>(0);

  const active = isHovered !== null ? isHovered : activeCard;

  // Bead position updater — uses refs, zero re-renders
  const updateBeadPosition = useCallback((val: number) => {
    if (!pathRef.current || !beadRef.current) return;
    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    const clampedVal = Math.max(0, Math.min(1, val));
    const point = path.getPointAtLength(clampedVal * totalLength);
    const circles = beadRef.current.querySelectorAll("circle");
    circles.forEach((c) => {
      c.setAttribute("cx", String(point.x));
      c.setAttribute("cy", String(point.y));
    });
  }, []);

  // Idle micro-oscillation — ref-based, no state, no re-renders
  useEffect(() => {
    let phase = 0;
    const tick = () => {
      phase += 0.04;
      const currentProgress = progress.get();
      const isLaunching = currentProgress > 0.45 && currentProgress < 0.95;
      if (!isLaunching && pathRef.current && beadRef.current) {
        const oscillation = 0.006 * Math.sin(phase);
        const val = Math.max(0, Math.min(1, currentProgress + oscillation));
        const path = pathRef.current;
        const point = path.getPointAtLength(val * path.getTotalLength());
        const circles = beadRef.current.querySelectorAll("circle");
        circles.forEach((c) => {
          c.setAttribute("cx", String(point.x));
          c.setAttribute("cy", String(point.y));
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  // Track progress changes to update bead position
  useEffect(() => {
    return progress.on("change", updateBeadPosition);
  }, [progress, updateBeadPosition]);

  // Initialize bead position
  useEffect(() => {
    updateBeadPosition(progress.get());
  }, [updateBeadPosition, progress]);

  // Auto-cycle timer (5 seconds)
  useEffect(() => {
    if (isHovered !== null) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Bead progress animation
  useEffect(() => {
    const isManual = isHovered !== null;

    if (isManual) {
      const target = active === 0 ? 0.0 : active === 1 ? 0.171 : 0.342;
      animate(progress, target, { duration: 0.8, ease: "easeOut" });
    } else {
      if (active === 0) {
        if (progress.get() > 0.3) {
          animate(progress, 0.493, { duration: 0.6, ease: "easeOut" }).then(() => {
            setMuzzleFlash(true);
            setTimeout(() => setMuzzleFlash(false), 200);
            animate(progress, 0.848, { duration: 0.4, ease: "linear" }).then(() => {
              animate(progress, 1.0, { duration: 0.8, ease: "easeOut" }).then(() => {
                progress.set(0.0);
              });
            });
          });
        } else {
          animate(progress, 0.0, { duration: 3.8, ease: "easeInOut" });
        }
      } else if (active === 1) {
        animate(progress, 0.171, { duration: 3.8, ease: "easeInOut" });
      } else if (active === 2) {
        animate(progress, 0.342, { duration: 3.8, ease: "easeInOut" });
      }
    }
  }, [active, progress, isHovered]);

  // Front card statements
  const cardStatements = [
    <>
      Study via <strong className="font-display italic font-semibold text-gold">interactive 2D simulations</strong>, replacing textbook memorization.
    </>,
    <>
      Deploy <strong className="font-display italic font-semibold text-gold">instant visual setups</strong>, maximizing instructional classroom time.
    </>,
    <>
      Scale to <strong className="font-display italic font-semibold text-gold">infinite virtual labs</strong>, cutting hardware costs.
    </>,
  ];

  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-cloud dark:bg-slate-ink pt-8 pb-16 sm:pt-12 sm:pb-20 transition-colors duration-500 text-slate-deep dark:text-white"
    >
      {/* Aurora background */}
      <div className="aurora-blob right-[-10%] top-[-10%] h-[480px] w-[480px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[-5%] bottom-[-10%] h-[500px] w-[500px] bg-indigo-500/20 dark:bg-indigo-500/15" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* SVG wave background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <path d="M 0,585 L 1200,585" stroke="rgba(35,39,61,0.08)" strokeWidth="2" className="dark:stroke-white/5" />

          <path
            ref={pathRef}
            d="M 200,300 C 400,300 400,520 600,520 C 800,520 800,300 1000,300 C 1080,300 1120,460 1150,585 L 50,585 C 80,460 120,300 200,300"
            fill="none"
            stroke="url(#solution-wave)"
            strokeWidth="4"
            strokeDasharray="10 8"
            className="opacity-30 dark:opacity-40"
          />
          <path
            d="M 200,300 C 400,300 400,520 600,520 C 800,520 800,300 1000,300 C 1080,300 1120,460 1150,585 L 50,585 C 80,460 120,300 200,300"
            fill="none"
            stroke="url(#solution-glow)"
            strokeWidth="6"
            className="opacity-45 dark:opacity-60 blur-sm"
          />

          {/* Launcher */}
          <g transform="translate(1150, 585)" className="opacity-80 dark:opacity-90">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#cea945" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#cea945" className="animate-pulse" />
            <path d="M -6,-5 L -15,-5 L -15,5 L -6,5 Z" fill="#cea945" />
          </g>

          {/* Receiver */}
          <g transform="translate(50, 585)" className="opacity-80 dark:opacity-90">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#cea945" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#cea945" />
            <path d="M 5,-4 L 12,-9 L 12,9 L 5,4 Z" fill="#cea945" />
          </g>

          {/* Muzzle flash */}
          {muzzleFlash && (
            <motion.circle
              cx="1150"
              cy="585"
              initial={{ r: 10, opacity: 1 }}
              animate={{ r: 35, opacity: 0 }}
              transition={{ duration: 0.25 }}
              fill="#cea945"
              className="filter blur-xs"
            />
          )}

          {/* Bead — positioned via refs, no re-renders */}
          <g ref={beadRef}>
            <circle cx="0" cy="0" r="16" fill="#ffc800" className="opacity-45 blur-sm" />
            <circle cx="0" cy="0" r="10" fill="url(#bead-radial)" className="filter drop-shadow-[0_0_8px_#ffc800]" />
            <circle cx="0" cy="0" r="4" fill="white" />
          </g>

          <defs>
            <linearGradient id="solution-wave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cea945" />
              <stop offset="50%" stopColor="#e8c84a" />
              <stop offset="100%" stopColor="#cea945" />
            </linearGradient>
            <linearGradient id="solution-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cea945" />
              <stop offset="50%" stopColor="#e8c84a" />
              <stop offset="100%" stopColor="#cea945" />
            </linearGradient>
            <radialGradient id="bead-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="30%" stopColor="#ffea70" />
              <stop offset="100%" stopColor="#cea945" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal>
          <div className="text-left">
            <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
              The Solution
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                How Morphysics{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Tackles It.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-6 mb-16 w-full" />

        {/* Staggered flip cards */}
        <div className="relative min-h-[580px] md:min-h-[480px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 relative z-10">
            {solutions.map((sol, index) => {
              const isActive = active === index;

              const verticalOffsetClass =
                index === 0
                  ? "md:translate-y-10"
                  : index === 1
                    ? "md:translate-y-30"
                    : "md:translate-y-10";

              return (
                <div
                  key={index}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`relative ${verticalOffsetClass}`}
                  style={{ perspective: "1200px" }}
                >
                  {/* Flip wrapper — GPU-accelerated, pure CSS */}
                  <div
                    className="relative w-full will-change-transform"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isActive ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    {/* ═══ FRONT FACE ═══ */}
                    <div
                      className="relative w-full"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div
                        className={`card-surface overflow-hidden rounded-3xl p-6 border shadow-sm relative group flex flex-col justify-start transition-all duration-500 ease-out
                          ${isActive
                            ? "bg-white dark:bg-[#1f2236] border-gold/50 shadow-[0_25px_50px_-12px_rgba(206,169,69,0.25)]"
                            : "bg-white/85 dark:bg-[#1f2236]/90 border-slate-deep/10 dark:border-white/5 opacity-65"
                          }`}
                      >
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/0 blur-3xl transition-all duration-500 group-hover:bg-gold/10" />

                        {/* Image */}
                        <div className="h-40 w-full rounded-2xl overflow-hidden mb-6 bg-slate-ink border border-slate-deep/10 dark:border-white/5 shadow-md">
                          <img src={sol.image} alt={sol.imageAlt} className="h-full w-full object-cover" />
                        </div>

                        {/* Title */}
                        <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-deep dark:text-white">
                          {sol.headline}
                        </h3>

                        {/* Statement */}
                        <p className="text-slate-gray dark:text-white/85 text-lg leading-relaxed font-sans">
                          {cardStatements[index]}
                        </p>
                      </div>
                    </div>

                    {/* ═══ BACK FACE ═══ */}
                    <div
                      className="absolute inset-0 w-full"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div
                        className="h-full overflow-hidden rounded-3xl p-7 border border-gold/30 bg-slate-ink/95 dark:bg-[#161829]/95 backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(206,169,69,0.3)] flex flex-col justify-center"
                      >
                        {/* Bullet points with icons */}
                        <ul className="space-y-5">
                          {CLOUD_POINTS[index].map((point, ptIdx) => (
                            <li key={ptIdx} className="flex items-start gap-3.5">
                              <div className="mt-0.5 p-1.5 rounded-xl border border-gold/20 bg-gold/10">
                                {point.icon}
                              </div>
                              <span className="text-white/90 text-base leading-relaxed font-sans">
                                {point.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solution;
