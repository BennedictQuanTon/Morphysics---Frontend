import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  className?: string;
  children: string;
  duration?: number;
  delay?: number;
  loop?: boolean;
}

/**
 * 3D character flip-in text (user-provided effect; CSS lives in globals.css).
 */
export function FlipText({
  className,
  children,
  duration = 2.6,
  delay = 0,
  loop = false,
}: FlipTextProps) {
  const words = useMemo(() => children.split(" "), [children]);
  const totalChars = children.length;

  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) index += words[i].length + 1;
    return index + charIndex;
  };

  return (
    <span
      className={cn("inline-block leading-none", className)}
      style={{ perspective: "1000px" }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word.split("").map((char, charIndex) => {
            const globalIndex = getCharIndex(wordIndex, charIndex);
            const normalized = globalIndex / totalChars;
            const sine = Math.sin(normalized * (Math.PI / 2));
            const calculatedDelay = sine * (duration * 0.25) + delay;

            return (
              <span
                key={charIndex}
                className="flip-char relative inline-block"
                style={
                  {
                    "--flip-duration": `${duration}s`,
                    "--flip-delay": `${calculatedDelay}s`,
                    "--flip-iteration": loop ? "infinite" : "1",
                    transformStyle: "preserve-3d",
                  } as React.CSSProperties
                }
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
