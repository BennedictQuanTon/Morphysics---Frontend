import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { stats } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Count-up stat band using NumberFlow, triggered when scrolled into view
 * (user-provided animated-number effect).
 */
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
      className="flex flex-col items-center gap-2 text-center"
    >
      <Reveal delay={index * 0.1}>
        <div className="font-display text-5xl font-black tracking-tighter text-gold sm:text-6xl">
          {stat.customText ? (
            <span>{stat.customText}</span>
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
        <p className="text-muted mx-auto mt-2 max-w-[220px] text-sm leading-snug">
          {stat.label}
        </p>
      </Reveal>
    </motion.div>
  );
}
export function Stats() {
  return (
    <section className="relative overflow-hidden bg-cloud dark:bg-slate-ink py-20 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 sm:px-8 lg:grid-cols-4 lg:px-12 relative z-10">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
