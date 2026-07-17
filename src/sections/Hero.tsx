import { motion, useScroll, useTransform } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { RadialGlowButton } from "@/components/ui/RadialGlowButton";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { FlipText } from "@/components/ui/FlipText";
import { useTheme } from "@/hooks/useTheme";
import { Physics3DModel } from "@/components/physics/Physics3DModel";

export function Hero() {
  const { isDark } = useTheme();
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, 140]);
  const blobY2 = useTransform(scrollY, [0, 600], [0, -100]);

  const scrollToOverview = () => {
    document
      .querySelector("#overview")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-cloud dark:bg-slate-ink pb-2 pt-28 text-slate-deep dark:text-white lg:pt-24 transition-colors duration-500"
    >
      {/* Aurora background */}
      <motion.div
        style={{ y: blobY }}
        className="aurora-blob left-[-10%] top-[-15%] h-[480px] w-[480px] bg-gold/20 dark:bg-gold/10"
      />
      <motion.div
        style={{ y: blobY2 }}
        className="aurora-blob bottom-[-15%] right-[-5%] h-[550px] w-[550px] bg-indigo-500/25 dark:bg-indigo-500/20"
      />
      <div className="aurora-blob right-[-10%] top-[-5%] h-[450px] w-[450px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[35%] top-[35%] h-[350px] w-[350px] bg-indigo-400/15 dark:bg-indigo-500/10" />
      <div className="aurora-blob left-[38%] top-[45%] h-[300px] w-[300px] bg-rose-400/5 dark:bg-rose-400/10" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:gap-24 2xl:px-24">
        {/* Left column */}
        <div>


          <h1 className="display-headline text-6xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7.5rem] !leading-[1.1] !tracking-normal text-slate-deep dark:text-white">
            <FlipText delay={0.15}>Make the</FlipText>
            <br />
            <span className="text-gold">
              <FlipText delay={0.55}>Static Dynamic.</FlipText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl font-sans font-normal text-xl md:text-2xl !leading-[1.7] tracking-wide text-slate-gray dark:text-white/80"
          >
            <span className="font-display italic font-bold text-[1.15em] text-slate-deep dark:text-white mr-2">Morphysics</span>transforms abstract physics problems into real-time,
            AI-generated interactive 2D simulations — instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <RadialGlowButton onClick={() => window.location.hash = "#dashboard"}>Try it Free</RadialGlowButton>
            <AnimatedButton onClick={scrollToOverview}>
              <MousePointerClick className="h-4 w-4" />
              Watch the Demo
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Right column: 3D Spring-Mass Frame (mascot removed) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[400px] sm:h-[450px] lg:h-[480px]"
        >
          <div className={`w-full h-full rounded-2xl border p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500 group/frame ${
            !isDark 
              ? "bg-white/80 border-slate-deep/10 shadow-slate-deep/5" 
              : "bg-[#1f2236]/40 border-white/5 shadow-black/40"
          }`}>
            {/* Subtle decorative glow in the background of the box */}
            <div className="absolute -inset-10 rounded-2xl opacity-0 group-hover/frame:opacity-100 transition-opacity duration-700 blur-[80px] bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.12)_0%,transparent_70%)] pointer-events-none -z-10" />

            {/* Top Bar of the Frame (like a browser or terminal) */}
            <div className={`flex items-center justify-between pb-3 border-b ${!isDark ? "border-slate-deep/10" : "border-white/5"}`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              </div>
            </div>

            {/* 3D Model Area */}
            <div className="flex-grow w-full relative flex items-center justify-center mt-3 overflow-hidden">
              <Physics3DModel isLightTheme={!isDark} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-slate-deep/25 dark:border-white/25 p-1.5">
          <div className="h-2 w-1 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
}
