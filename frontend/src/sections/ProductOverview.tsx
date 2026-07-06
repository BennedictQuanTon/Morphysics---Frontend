import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrainCircuit, Orbit, SlidersHorizontal } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RadialGlowButton } from "@/components/ui/RadialGlowButton";
import { TransparentHand } from "@/components/ui/TransparentHand";
import NumberFlow from "@number-flow/react";
import { stats } from "@/data/content";

const ICONS = {
  brain: BrainCircuit,
  canvas: Orbit,
  sliders: SlidersHorizontal,
};

const OVERVIEW_CARDS = [
  {
    icon: "brain" as const,
    title: "AI Problem Extraction",
    body: (
      <>
        Upload any physics problem via text or photo. Our AI{" "}
        <span className="font-display italic font-bold text-slate-ink dark:text-white">
          instantly extracts
        </span>{" "}
        all physical variables without manual effort.
      </>
    ),
  },
  {
    icon: "canvas" as const,
    title: "Dynamic 2D Simulation",
    body: (
      <>
        Forget rigid templates. Every simulation is{" "}
        <span className="font-display italic font-bold text-slate-ink dark:text-white">
          generated on-the-fly
        </span>
        , ensuring forces and energy behave exactly as they should.
      </>
    ),
  },
  {
    icon: "sliders" as const,
    title: "Interactive Variable Control",
    body: (
      <>
        Tweak variables like gravity or mass in{" "}
        <span className="font-display italic font-bold text-slate-ink dark:text-white">
          real time
        </span>
        . Watch how single adjustments cascade through the entire simulation.
      </>
    ),
  },
];

function StatItem({
  stat,
  index,
}: {
  stat: any;
  index: number;
}) {
  const [value, setValue] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
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

  useEffect(() => {
    if (fontsReady && isIntersectingRef.current && stat.value !== undefined) {
      setValue(stat.value);
    }
  }, [fontsReady, stat.value]);

  return (
    <motion.div
      onViewportEnter={() => {
        isIntersectingRef.current = true;
        if (fontsReady && stat.value !== undefined) {
          setValue(stat.value);
        }
      }}
      onViewportLeave={() => {
        isIntersectingRef.current = false;
        setValue(0);
      }}
      viewport={{ margin: "-60px" }}
      className="flex flex-col items-center text-center h-full"
    >
      <Reveal delay={index * 0.1} className="h-full flex flex-col justify-start w-full">
        {/* Main Number/Text Container - aligned baseline */}
        <div className="min-h-[5.5rem] sm:min-h-[6.5rem] flex items-end justify-center font-display text-6xl font-black tracking-tighter text-gold sm:text-7xl">
          {stat.customText ? (
            <span className="relative -top-[4px]">{stat.customText}</span>
          ) : (
            <span className="inline-block tracking-normal flex-shrink-0" style={{ letterSpacing: "normal" }}>
              <NumberFlow
                key={fontsReady ? "ready" : "loading"}
                value={value}
                prefix={stat.prefix || ""}
                suffix={stat.suffix || ""}
                format={{
                  minimumFractionDigits: stat.decimals || 0,
                  maximumFractionDigits: stat.decimals || 0,
                }}
                transformTiming={{ duration: 1200, easing: "ease-out" }}
              />
            </span>
          )}
        </div>

        {/* Subtitle Container - min-height to keep labels aligned */}
        <div className="min-h-[4.5rem] sm:min-h-[5.5rem] mt-2 flex items-center justify-center">
          {stat.subtitle ? (
            <span className="text-2xl font-extrabold text-gold sm:text-3xl text-center leading-tight max-w-[240px] block">
              {stat.subtitle}
            </span>
          ) : (
            <span className="invisible text-2xl font-extrabold sm:text-3xl block">&nbsp;</span>
          )}
        </div>

        {/* Label Container */}
        <div className="mt-2">
          <p className="text-slate-deep/80 dark:text-white/80 font-black mx-auto max-w-[280px] text-xl sm:text-2xl leading-snug">
            {stat.label}
          </p>
        </div>
      </Reveal>
    </motion.div>
  );
}

export function ProductOverview() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the CTA button container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animate left hand sliding in from left to point at the button
  const leftX = useTransform(scrollYProgress, [0.1, 0.4], [-140, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  // Animate right hand sliding in from right to point at the button (scaled/mirrored)
  const rightX = useTransform(scrollYProgress, [0.1, 0.4], [140, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <section className="relative overflow-x-clip bg-cloud dark:bg-slate-ink pt-10 pb-0 sm:pt-12 sm:pb-0 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob right-[-10%] top-[5%] h-[500px] w-[500px] bg-gold/20 dark:bg-gold/10" />
      <div className="aurora-blob left-[-15%] bottom-[10%] h-[400px] w-[400px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob right-[20%] bottom-[-10%] h-[350px] w-[350px] bg-indigo-500/10 dark:bg-indigo-500/8" />

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
              Product Overview
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                Your AI-Powered{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Physics Lab.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />

        {/* STATS BAND */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 w-full mb-20 relative z-10 border-b border-slate-deep/10 dark:border-white/10 pb-16">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {OVERVIEW_CARDS.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <Reveal key={card.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="card-surface group relative h-full overflow-hidden rounded-3xl p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-gold/10"
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/0 blur-3xl transition-all duration-500 group-hover:bg-gold/20" />

                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-hover transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110 dark:text-gold">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-bold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-gray dark:text-white/70 text-base sm:text-[1.05rem] leading-relaxed">
                    {card.body}
                  </p>

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA Container with dynamic 3D hands pointing effect */}
        <div ref={containerRef} className="relative mt-10 flex flex-col items-center justify-center w-full">
          {/* Text */}
          <Reveal className="relative z-20 mb-0" delay={0.1}>
            <p className="font-display italic font-semibold text-2xl sm:text-3xl lg:text-4xl tracking-wide text-slate-ink dark:text-white text-center">
              Ready to see your problem come alive?
            </p>
          </Reveal>

          {/* Button + Hands — same horizontal band */}
          <div className="relative z-20 flex items-center justify-center w-full">
            {/* Left pointing hand */}
            <motion.div
              style={{ x: leftX, opacity: leftOpacity }}
              className="relative z-10 pointer-events-none hidden lg:block flex-shrink-0"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.2,
                  ease: "easeInOut",
                }}
                className="flex items-center"
              >
                <div className="w-[36rem] h-[14rem] overflow-hidden">
                  <TransparentHand
                    src="/assets/hand_left_adam.png"
                    className="w-full h-full object-cover object-[70%_45%]"
                    alt="3D Left Hand pointing to Start for Free button"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Button — center */}
            <Reveal delay={0.2} className="relative z-30 flex-shrink-0 mx-[-2rem]">
              <RadialGlowButton>Start for Free</RadialGlowButton>
            </Reveal>

            {/* Right pointing hand */}
            <motion.div
              style={{ x: rightX, opacity: rightOpacity }}
              className="relative z-10 pointer-events-none hidden lg:block flex-shrink-0"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.2,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="flex items-center"
              >
                <div className="w-[36rem] h-[14rem] overflow-hidden">
                  <TransparentHand
                    src="/assets/hand_right_adam.png"
                    className="w-full h-full object-cover object-[30%_45%]"
                    alt="3D Right Hand pointing to Start for Free button"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductOverview;
