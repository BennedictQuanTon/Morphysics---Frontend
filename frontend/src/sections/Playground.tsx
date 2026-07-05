import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { RadialGlowButton } from "@/components/ui/RadialGlowButton";
import { ProjectileDemo } from "@/components/playground/ProjectileDemo";
import { InclinedPlaneDemo } from "@/components/playground/InclinedPlaneDemo";
import { PendulumDemo } from "@/components/playground/PendulumDemo";
import { CollisionDemo } from "@/components/playground/CollisionDemo";
import { FreeFallDemo } from "@/components/playground/FreeFallDemo";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "projectile", label: "Projectile Motion", emoji: "⚽" },
  { id: "incline", label: "Inclined Plane", emoji: "📦" },
  { id: "pendulum", label: "Simple Pendulum", emoji: "🕰" },
  { id: "collision", label: "Collision Lab", emoji: "🎱" },
  { id: "freefall", label: "Free Fall & Gravity", emoji: "🪶" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Playground() {
  const [active, setActive] = useState<TabId>("projectile");

  return (
    <section
      id="playground"
      className="relative overflow-hidden bg-slate-deep py-24 text-white sm:py-28"
    >
      <div className="aurora-blob left-[-10%] top-[20%] h-[400px] w-[400px] bg-gold/10" />
      <div className="aurora-blob bottom-[5%] right-[-10%] h-[420px] w-[420px] bg-indigo-500/15" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Interactive Demo Lab"
          title="Physics in Your Hands"
          subtitle="Pick a scenario from your textbook. Adjust the values. Watch real physics play out — right here, no sign-up needed."
        />

        {/* Tab bar */}
        <Reveal className="mt-12" delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
                  active === tab.id
                    ? "text-slate-deep"
                    : "text-white/60 hover:text-white",
                )}
              >
                {active === tab.id && (
                  <motion.span
                    layoutId="playground-tab"
                    className="absolute inset-0 rounded-full bg-gold shadow-lg shadow-gold/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">
                  {tab.emoji} {tab.label}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Active canvas */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {active === "projectile" && <ProjectileDemo />}
              {active === "incline" && <InclinedPlaneDemo />}
              {active === "pendulum" && <PendulumDemo />}
              {active === "collision" && <CollisionDemo />}
              {active === "freefall" && <FreeFallDemo />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <Reveal className="mt-16 flex flex-col items-center gap-5" delay={0.1}>
          <p className="max-w-xl text-center text-white/60">
            These are just 5 of the infinite scenarios Morphysics can generate
            from your own problems.
          </p>
          <RadialGlowButton>Generate My Own Simulation</RadialGlowButton>
        </Reveal>
      </div>
    </section>
  );
}
