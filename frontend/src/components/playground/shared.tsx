import { useEffect, useRef } from "react";

export const CANVAS_BG = "#1A1D2E";
export const GOLD = "#FFC800";
export const BLUE = "#6C8CFF";
export const GREEN = "#5BE39B";
export const ORANGE = "#FF9F45";
export const RED = "#FF6B6B";
export const TEXT_DIM = "rgba(255,255,255,0.55)";

/** Draw a labeled vector arrow. */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: string,
  label?: string,
) {
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const ex = x + dx;
  const ey = y + dy;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  const a = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - 9 * Math.cos(a - 0.42), ey - 9 * Math.sin(a - 0.42));
  ctx.lineTo(ex - 9 * Math.cos(a + 0.42), ey - 9 * Math.sin(a + 0.42));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, ex + (dx / len) * 16, ey + (dy / len) * 16 + 4);
  }
  ctx.restore();
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spacing = 40,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(108,124,166,0.13)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function hudText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
) {
  ctx.save();
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  lines.forEach((line, i) => {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(x - 6, y + i * 20 - 13, ctx.measureText(line).width + 12, 18);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(line, x, y + i * 20);
  });
  ctx.restore();
}

/**
 * requestAnimationFrame canvas loop with device-pixel-ratio handling.
 * The callback receives a CSS-pixel-scaled context.
 */
export function useSimCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const rect = canvas.getBoundingClientRect();
      drawRef.current(ctx, rect.width, rect.height, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return canvasRef;
}

/** Labeled slider used by every demo control panel. */
export function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-bold text-white/70">{label}</span>
        <span className="font-mono text-xs font-bold text-gold">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="control-slider"
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
      />
      {hint && <p className="mt-1 text-[10px] text-white/40">{hint}</p>}
    </div>
  );
}

export function DemoButton({
  children,
  onClick,
  variant = "primary",
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variant === "primary"
          ? "rounded-lg bg-gold px-4 py-2 text-sm font-bold text-slate-deep transition-all hover:bg-gold-hover active:scale-95"
          : `rounded-lg border px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
              active
                ? "border-gold bg-gold/20 text-gold"
                : "border-white/20 text-white/70 hover:border-gold/60 hover:text-gold"
            }`
      }
    >
      {children}
    </button>
  );
}
