import React from "react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    children?: React.ReactNode;
  };

/**
 * Ghost button with a travelling text-shine mask and a border shine sweep.
 * (User-provided effect, adapted to the Morphysics palette.)
 */
export function AnimatedButton({
  children,
  className = "",
  ...rest
}: AnimatedButtonProps) {
  return (
    <motion.button
      {...rest}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border px-7 py-3",
        "border-slate-deep/25 bg-white/60 text-slate-deep dark:border-white/20 dark:bg-white/5 dark:text-white",
        "font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "[--shine:rgba(35,39,61,.66)] dark:[--shine:rgba(255,200,0,.8)]",
        className,
      )}
    >
      <motion.span
        className="relative z-10 flex h-full w-full items-center justify-center gap-2 tracking-wide"
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))",
        }}
        initial={{ ["--mask-x" as string]: "100%" }}
        animate={{ ["--mask-x" as string]: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
          repeatDelay: 1,
        }}
      >
        {children}
      </motion.span>

      <motion.span
        className="absolute inset-0 block rounded-xl p-px"
        style={{
          background:
            "linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
        initial={{ backgroundPosition: "100% 0", opacity: 0 }}
        animate={{ backgroundPosition: ["100% 0", "0% 0"], opacity: [0, 1, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1,
        }}
      />
    </motion.button>
  );
}

export default AnimatedButton;
