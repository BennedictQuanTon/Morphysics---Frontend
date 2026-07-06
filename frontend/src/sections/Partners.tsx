import { useState, useEffect } from "react";
import { partnerLogos } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { useTheme } from "@/hooks/useTheme";

export function Partners() {
  const { isDark } = useTheme();
  const [showSecondSet, setShowSecondSet] = useState(false);
  const [isScaling, setIsScaling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsScaling(true);
      setTimeout(() => {
        setShowSecondSet((prev) => !prev);
        setTimeout(() => {
          setIsScaling(false);
        }, 600);
      }, 450);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const cardStyle = {
    perspective: "1000px",
  };

  const innerStyle = (flipped: boolean, scaling: boolean) => ({
    position: "relative" as const,
    width: "100%",
    height: "100%",
    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    transformStyle: "preserve-3d" as const,
    transform: `${flipped ? "rotateX(180deg)" : "rotateX(0deg)"} ${scaling ? "scale(1.12)" : "scale(1)"}`,
  });

  const faceStyle = (isBack = false) => ({
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    transform: isBack ? "rotateX(180deg)" : "rotateX(0deg)",
  });

  return (
    <section className="relative overflow-hidden bg-cloud dark:bg-slate-ink pt-2 pb-10 transition-colors duration-500">
      {/* Aurora background */}
      {/* Left side blobs */}
      <div className="aurora-blob left-[-10%] top-[5%] h-[300px] w-[300px] bg-indigo-500/15 dark:bg-indigo-500/8" />
      <div className="aurora-blob left-[-5%] bottom-[5%] h-[280px] w-[280px] bg-gold/20 dark:bg-gold/10" />

      {/* Right side blobs */}
      <div className="aurora-blob right-[-10%] top-[5%] h-[300px] w-[300px] bg-gold/20 dark:bg-gold/10" />
      <div className="aurora-blob right-[-5%] bottom-[5%] h-[280px] w-[280px] bg-indigo-500/15 dark:bg-indigo-500/8" />

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
              Trusted By
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                Global academic{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Partners.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />

        <div className="grid grid-cols-3 gap-12 sm:gap-20 md:gap-28 lg:gap-36 items-center justify-items-center">
          {/* Card 1: UTS -> HCMUE */}
          <div style={cardStyle} className="w-full max-w-[260px] h-28 md:h-36">
            <div style={innerStyle(showSecondSet, isScaling)}>
              <div style={faceStyle(false)}>
                <img
                  src={partnerLogos[0].src}
                  alt={partnerLogos[0].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-0 invert" : ""
                    }`}
                />
              </div>
              <div style={faceStyle(true)}>
                <img
                  src={partnerLogos[1].src}
                  alt={partnerLogos[1].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-125" : ""
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Card 2: HCMUT -> IUH */}
          <div style={cardStyle} className="w-full max-w-[260px] h-28 md:h-36">
            <div style={innerStyle(showSecondSet, isScaling)}>
              <div style={faceStyle(false)}>
                <img
                  src={partnerLogos[3].src}
                  alt={partnerLogos[3].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-125" : ""
                    }`}
                />
              </div>
              <div style={faceStyle(true)}>
                <img
                  src={partnerLogos[4].src}
                  alt={partnerLogos[4].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-125" : ""
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Card 3: HCMUS -> UIT */}
          <div style={cardStyle} className="w-full max-w-[260px] h-28 md:h-36">
            <div style={innerStyle(showSecondSet, isScaling)}>
              <div style={faceStyle(false)}>
                <img
                  src={partnerLogos[2].src}
                  alt={partnerLogos[2].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-0 invert" : ""
                    }`}
                />
              </div>
              <div style={faceStyle(true)}>
                <img
                  src={partnerLogos[5].src}
                  alt={partnerLogos[5].alt}
                  className={`max-h-20 md:max-h-24 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${isDark ? "brightness-125" : ""
                    }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Partners;
