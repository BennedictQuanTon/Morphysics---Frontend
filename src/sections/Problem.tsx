import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Atom, Lightbulb, FlaskConical, Compass, Magnet, Ruler, Flame, Gauge, Wrench } from "lucide-react";
import { problems } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

const CARD_ICONS = [
  [
    { Icon: Atom, position: "-top-2.5 -left-2.5", color: "bg-blue-500 text-white" },
    { Icon: FlaskConical, position: "-top-2.5 -right-2.5", color: "bg-pink-500 text-white" },
    { Icon: Lightbulb, position: "-bottom-2.5 -right-2.5", color: "bg-yellow-500 text-slate-ink" },
  ],
  [
    { Icon: Compass, position: "-top-2.5 -right-2.5", color: "bg-emerald-500 text-white" },
    { Icon: Magnet, position: "-bottom-2.5 -left-2.5", color: "bg-red-500 text-white" },
    { Icon: Ruler, position: "-top-2.5 -left-2.5", color: "bg-indigo-500 text-white" },
  ],
  [
    { Icon: Flame, position: "-top-2.5 -left-2.5", color: "bg-orange-500 text-white" },
    { Icon: Gauge, position: "-bottom-2.5 -right-2.5", color: "bg-cyan-500 text-white" },
    { Icon: Wrench, position: "-top-2.5 -right-2.5", color: "bg-violet-500 text-white" },
  ]
];

const getTooltipStyle = (position: string) => {
  if (position.includes("-left-2.5")) {
    if (position.includes("-top-2.5")) return { left: "2.5rem", top: "-0.25rem" };
    if (position.includes("-bottom-2.5")) return { left: "2.5rem", bottom: "-0.25rem" };
  }
  if (position.includes("-right-2.5")) {
    if (position.includes("-top-2.5")) return { right: "2.5rem", top: "-0.25rem" };
    if (position.includes("-bottom-2.5")) return { right: "2.5rem", bottom: "-0.25rem" };
  }
  return { left: "2.5rem" };
};

interface Point {
  text: React.ReactNode;
  tooltip: string;
}

function FloatingIcons({
  cardIndex,
  hoveredIconIndex,
  setHoveredIconIndex,
  points
}: {
  cardIndex: number;
  hoveredIconIndex: number | null;
  setHoveredIconIndex: (idx: number | null) => void;
  points: Point[];
}) {
  const icons = CARD_ICONS[cardIndex];
  return (
    <>
      {icons.map(({ Icon, position, color }, idx) => {
        const isHovered = hoveredIconIndex === idx;
        return (
          <div key={idx} className={`absolute ${position} z-20`}>
            <motion.button
              onMouseEnter={() => setHoveredIconIndex(idx)}
              onMouseLeave={() => setHoveredIconIndex(null)}
              initial={{ scale: 1, rotate: 0 }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 10 : 0,
                y: isHovered ? 0 : [0, -4, 0]
              }}
              transition={{
                y: { repeat: Infinity, duration: 2.2 + idx * 0.3, ease: "easeInOut", delay: idx * 0.1 }
              }}
              className={`${color} p-2 rounded-xl shadow-lg border border-white/10 flex items-center justify-center cursor-pointer`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2.5} />
            </motion.button>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: position.includes("-left-2.5") ? -5 : 5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute z-30 bg-slate-ink/95 backdrop-blur-md text-white text-[11px] font-bold py-1.5 px-3 rounded-lg border border-white/15 shadow-xl pointer-events-none whitespace-nowrap"
                  style={getTooltipStyle(position)}
                >
                  {points[idx].tooltip}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

function ProblemCard({
  problem,
  index,
  points
}: {
  problem: typeof problems[0];
  index: number;
  points: Point[];
}) {
  const [value, setValue] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [hoveredIconIndex, setHoveredIconIndex] = useState<number | null>(null);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        setFontsReady(true);
      });
    } else {
      setFontsReady(true);
    }
  }, []);

  return (
    <Reveal delay={index * 0.12}>
      <motion.div
        onViewportEnter={() => {
          isIntersectingRef.current = true;
          if (fontsReady) {
            setValue(problem.number);
          }
        }}
        onViewportLeave={() => {
          isIntersectingRef.current = false;
          setValue(0);
        }}
        viewport={{ margin: "-60px" }}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="card-surface group relative h-full overflow-visible rounded-3xl p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-gold/10 flex flex-col justify-start"
      >
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/0 blur-3xl transition-all duration-500 group-hover:bg-gold/10" />

        {/* Permanently Visible Image Frame Container */}
        <div className="relative w-full overflow-visible mb-6">
          <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-ink border border-slate-deep/10 dark:border-white/5 shadow-md">
            <img
              src={problem.image}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              alt={problem.title}
            />
          </div>
          <FloatingIcons
            cardIndex={index}
            hoveredIconIndex={hoveredIconIndex}
            setHoveredIconIndex={setHoveredIconIndex}
            points={points}
          />
        </div>

        {/* Huge stat counter */}
        <div className="mb-3 flex items-baseline font-display text-5xl sm:text-6xl font-black tracking-tighter text-gold">
          <span className="inline-block tracking-normal flex-shrink-0" style={{ letterSpacing: "normal" }}>
            <NumberFlow
              key={fontsReady ? "ready" : "loading"}
              value={value}
              suffix={problem.suffix}
              transformTiming={{ duration: 1200, easing: "ease-out" }}
            />
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-5 font-display text-2xl font-bold tracking-tight text-slate-deep dark:text-white">
          {problem.title}
        </h3>

        {/* Description Bullet Items */}
        <ul className="space-y-4 flex-grow">
          {points.map((pt, idx) => {
            const isHighlighted = hoveredIconIndex === idx;
            const IconComponent = CARD_ICONS[index][idx].Icon;
            return (
              <motion.li
                key={idx}
                onMouseEnter={() => setHoveredIconIndex(idx)}
                onMouseLeave={() => setHoveredIconIndex(null)}
                animate={{
                  x: isHighlighted ? 6 : 0,
                  opacity: hoveredIconIndex === null ? 1 : isHighlighted ? 1 : 0.4
                }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="flex items-start gap-3 cursor-pointer text-base sm:text-lg leading-relaxed font-sans"
              >
                <span className={`mt-1 flex-shrink-0 flex items-center justify-center p-1.5 rounded-lg border transition-all duration-300 ${
                  isHighlighted
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-slate-deep/5 dark:bg-white/5 border-slate-deep/15 dark:border-white/10 text-slate-gray dark:text-white/60"
                }`}>
                  <IconComponent className="h-3.5 w-3.5" />
                </span>
                <span className={`transition-colors duration-300 ${isHighlighted ? "text-slate-deep dark:text-white font-medium" : "text-slate-gray dark:text-white/70"}`}>
                  {pt.text}
                </span>
              </motion.li>
            );
          })}
        </ul>

        {/* Bottom accent indicator */}
        <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${problem.accent} transition-all duration-500 group-hover:w-full`} />
      </motion.div>
    </Reveal>
  );
}

export function Problem() {
  const card0Points: Point[] = [
    {
      text: <>Over <strong className="font-display italic font-semibold text-gold">11 million students</strong> face immense exam pressure.</>,
      tooltip: "11M+ Students facing pressure"
    },
    {
      text: <>Physics learning is restricted to <strong className="font-display italic font-semibold text-gold">memorizing dry formulas</strong>.</>,
      tooltip: "Strict formula memorization"
    },
    {
      text: <>Students completely lack <strong className="font-display italic font-semibold text-gold">real-world physical intuition</strong>.</>,
      tooltip: "No visual intuition of concepts"
    }
  ];

  const card1Points: Point[] = [
    {
      text: <>Strict time limit of <strong className="font-display italic font-semibold text-gold">45 minutes</strong> per class period.</>,
      tooltip: "Strict 45-min constraints"
    },
    {
      text: <>Setting up physics lab equipment is a <strong className="font-display italic font-semibold text-gold">logistical nightmare</strong>.</>,
      tooltip: "Logistical prep overhead"
    },
    {
      text: <>Teachers are forced to <strong className="font-display italic font-semibold text-gold">completely skip hands-on experiments</strong>.</>,
      tooltip: "Experiments completely skipped"
    }
  ];

  const card2Points: Point[] = [
    {
      text: <>Over <strong className="font-display italic font-semibold text-gold">666+ secondary & high schools</strong> in HCMC.</>,
      tooltip: "666+ schools HCMC"
    },
    {
      text: <>Physical lab hardware is <strong className="font-display italic font-semibold text-gold">highly expensive</strong> to construct.</>,
      tooltip: "High-upkeep & cost barriers"
    },
    {
      text: <>Lab setups completely <strong className="font-display italic font-semibold text-gold">fail to scale</strong> to every student.</>,
      tooltip: "Virtual scaling is absent"
    }
  ];

  return (
    <section id="problem" className="relative overflow-hidden bg-cloud dark:bg-slate-ink pt-20 pb-12 sm:pt-24 sm:pb-16 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob left-[-10%] top-[-10%] h-[450px] w-[450px] bg-rose-500/10 dark:bg-rose-500/5" />
      <div className="aurora-blob right-[-10%] bottom-[-10%] h-[450px] w-[450px] bg-gold/10 dark:bg-gold/5" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal>
          <div className="text-left">
            <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                Static textbooks.{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                No real-time visualization.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />

        {/* 3-column Problem cards */}
        <div className="grid gap-8 md:grid-cols-3">
          <ProblemCard problem={problems[0]} index={0} points={card0Points} />
          <ProblemCard problem={problems[1]} index={1} points={card1Points} />
          <ProblemCard problem={problems[2]} index={2} points={card2Points} />
        </div>
      </div>
    </section>
  );
}

export default Problem;
