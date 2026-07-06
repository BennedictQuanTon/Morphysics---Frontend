import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  className?: string;
  children: string;
  duration?: number;
  delay?: number;
}

/**
 * 3D character flip-in text using native CSS transitions for optimal performance on all browsers (including Safari).
 */
export function FlipText({
  className,
  children,
  duration = 2.6,
  delay = 0,
}: FlipTextProps) {
  const words = useMemo(() => children.split(" "), [children]);
  const totalChars = children.length;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Trigger transition shortly after mount to ensure the DOM is painted
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) index += words[i].length + 1;
    return index + charIndex;
  };

  return (
    <span
      className={cn("inline-block leading-none", className)}
      style={{ perspective: "1000px", WebkitPerspective: "1000px" }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
        >
          {word.split("").map((char, charIndex) => {
            const globalIndex = getCharIndex(wordIndex, charIndex);
            const normalized = globalIndex / totalChars;
            const sine = Math.sin(normalized * (Math.PI / 2));
            const calculatedDelay = sine * (duration * 0.25) + delay;

            const activeDuration = duration * 0.18;

            return (
              <span
                key={charIndex}
                className="relative inline-block origin-center"
                style={{
                  opacity: isReady ? 1 : 0,
                  transform: isReady ? "rotateX(0deg)" : "rotateX(-90deg)",
                  WebkitTransform: isReady ? "rotateX(0deg)" : "rotateX(-90deg)",
                  
                  // Native transition setup for smooth performance
                  transitionProperty: "transform, opacity",
                  transitionDuration: `${activeDuration}s`,
                  transitionDelay: `${calculatedDelay}s`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  
                  WebkitTransitionProperty: "-webkit-transform, opacity",
                  WebkitTransitionDuration: `${activeDuration}s`,
                  WebkitTransitionDelay: `${calculatedDelay}s`,
                  WebkitTransitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                }}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default FlipText;
