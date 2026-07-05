import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { personas } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Personas() {
  return (
    <section className="relative overflow-hidden bg-cloud dark:bg-slate-ink py-24 sm:py-28 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob left-[-10%] top-[-10%] h-[480px] w-[480px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob bottom-[-10%] right-[-5%] h-[500px] w-[500px] bg-indigo-500/20 dark:bg-indigo-500/15" />
      <div className="aurora-blob left-[35%] top-[25%] h-[350px] w-[350px] bg-rose-400/5 dark:bg-rose-400/10" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <Reveal>
          <div className="text-left">
            <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
              The Problem We Solve
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                Physics the Way It{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Should Be Learned.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />

        <div className="flex flex-col gap-24">
          {personas.map((persona, i) => (
            <div
              key={persona.headline}
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
              )}
            >
              {/* Image */}
              <Reveal
                delay={0.1}
                className={cn(
                  persona.imageSide === "left" ? "lg:order-1" : "lg:order-2",
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 0.6 : -0.6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-deep/20"
                >
                  <img
                    src={persona.image}
                    alt={persona.imageAlt}
                    loading="lazy"
                    className={cn(
                      "w-full object-cover transition-transform duration-700 group-hover:scale-105",
                      persona.wideCrop ? "aspect-[16/8]" : "aspect-[16/10]",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-deep/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-slate-deep shadow-lg">
                    {persona.badge}
                  </div>
                </motion.div>
              </Reveal>

              {/* Text */}
              <Reveal
                delay={0.2}
                className={cn(
                  persona.imageSide === "left" ? "lg:order-2" : "lg:order-1",
                )}
              >
                <h3 className="display-headline text-3xl sm:text-4xl lg:text-5xl">
                  {persona.headline}
                </h3>

                <div className="mt-7 space-y-5">
                  <div className="border-l-4 border-red-400/70 pl-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-400">
                      The problem
                    </p>
                    <p className="text-muted text-sm leading-relaxed sm:text-base">
                      {persona.problem}
                    </p>
                  </div>
                  <div className="border-l-4 border-gold pl-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold-hover dark:text-gold">
                      The Morphysics way
                    </p>
                    <p className="text-muted text-sm leading-relaxed sm:text-base">
                      {persona.solution}
                    </p>
                  </div>
                </div>

                <p className="text-muted mt-6 rounded-2xl border border-dashed p-4 text-sm italic" style={{ borderColor: "var(--border)" }}>
                  📊 {persona.stat}
                </p>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group mt-7 inline-flex items-center gap-2 font-bold text-gold-hover transition-colors hover:text-gold dark:text-gold dark:hover:text-gold-hover"
                >
                  {persona.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Personas;
