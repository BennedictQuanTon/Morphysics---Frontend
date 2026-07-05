import { useRef, useState } from "react";
import {
  useSimCanvas,
  drawGrid,
  drawArrow,
  hudText,
  ControlSlider,
  DemoButton,
  GOLD,
  BLUE,
  GREEN,
} from "./shared";

interface SimState {
  running: boolean;
  t: number;
  trail: { x: number; y: number }[];
  landed: boolean;
  range: number;
  maxH: number;
  flightTime: number;
}

export function ProjectileDemo() {
  const [angle, setAngle] = useState(45);
  const [v0, setV0] = useState(15);
  const [g, setG] = useState(9.8);

  const params = useRef({ angle, v0, g });
  params.current = { angle, v0, g };

  const sim = useRef<SimState>({
    running: false,
    t: 0,
    trail: [],
    landed: false,
    range: 0,
    maxH: 0,
    flightTime: 0,
  });

  const launch = () => {
    const { angle: a, v0: v, g: gg } = params.current;
    const rad = (a * Math.PI) / 180;
    sim.current = {
      running: true,
      t: 0,
      trail: [],
      landed: false,
      range: (v * v * Math.sin(2 * rad)) / gg,
      maxH: (v * v * Math.sin(rad) ** 2) / (2 * gg),
      flightTime: (2 * v * Math.sin(rad)) / gg,
    };
  };

  const reset = () => {
    sim.current = {
      running: false,
      t: 0,
      trail: [],
      landed: false,
      range: 0,
      maxH: 0,
      flightTime: 0,
    };
  };

  const canvasRef = useSimCanvas((ctx, w, h, dt) => {
    const s = sim.current;
    const { angle: aDeg, v0: v, g: gg } = params.current;
    const rad = (aDeg * Math.PI) / 180;

    // World-to-screen scale sized to the predicted trajectory
    const predRange = Math.max((v * v * Math.sin(2 * rad)) / gg, 10);
    const predH = Math.max((v * v * Math.sin(rad) ** 2) / (2 * gg), 5);
    const originX = 50;
    const groundY = h - 46;
    const scale = Math.min(
      (w - 130) / predRange,
      (groundY - 60) / predH,
      18,
    );

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Ground
    ctx.fillStyle = "rgba(69,76,112,0.7)";
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Goal post at predicted range
    const goalX = originX + predRange * scale;
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(goalX - 4, groundY - 52, 42, 52);

    // Physics step
    if (s.running && !s.landed) {
      s.t += dt;
      if (s.t >= s.flightTime) {
        s.t = s.flightTime;
        s.landed = true;
      }
    }

    const px = v * Math.cos(rad) * s.t;
    const py = v * Math.sin(rad) * s.t - 0.5 * gg * s.t * s.t;
    const ballX = originX + px * scale;
    const ballY = groundY - py * scale;

    if (s.running) s.trail.push({ x: ballX, y: ballY });
    if (s.trail.length > 600) s.trail.shift();

    // Dotted trajectory trail
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgba(255,200,0,0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    s.trail.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.stroke();
    ctx.restore();

    // Launch direction preview when idle
    if (!s.running) {
      drawArrow(
        ctx,
        originX,
        groundY,
        Math.cos(rad) * 62,
        -Math.sin(rad) * 62,
        "rgba(255,255,255,0.4)",
        `${aDeg}°`,
      );
    }

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 11, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // panels of a football
    ctx.beginPath();
    ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.stroke();

    // Velocity component vectors
    if (s.running && !s.landed) {
      const vx = v * Math.cos(rad);
      const vy = v * Math.sin(rad) - gg * s.t;
      drawArrow(ctx, ballX, ballY, vx * 3.4, 0, BLUE, "Vₓ");
      drawArrow(ctx, ballX, ballY, 0, -vy * 3.4, GREEN, "Vᵧ");
    }

    // Max height marker
    if (s.running) {
      const apexY = groundY - predH * scale;
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = "rgba(91,227,155,0.5)";
      ctx.beginPath();
      ctx.moveTo(0, apexY);
      ctx.lineTo(w, apexY);
      ctx.stroke();
      ctx.restore();
    }

    // Landing marker
    if (s.landed) {
      ctx.fillStyle = GREEN;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("⬇", ballX, groundY - 18);
    }

    hudText(
      ctx,
      [
        `Range: ${s.running ? s.range.toFixed(1) : "—"} m`,
        `Max height: ${s.running ? s.maxH.toFixed(1) : "—"} m`,
        `Time: ${s.t.toFixed(2)} s`,
      ],
      14,
      24,
    );
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <canvas
        ref={canvasRef}
        className="physics-grid-bg h-[340px] w-full rounded-2xl border border-white/10 bg-slate-ink sm:h-[400px]"
      />
      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-slate-ink p-5">
        <p className="text-xs italic leading-relaxed text-white/50">
          "You kick a football at an angle toward the goal. How far does it
          travel? How high does it go?"
        </p>
        <ControlSlider
          label="Launch Angle θ"
          value={angle}
          min={0}
          max={90}
          unit="°"
          onChange={setAngle}
        />
        <ControlSlider
          label="Initial Speed v₀"
          value={v0}
          min={5}
          max={30}
          unit=" m/s"
          onChange={setV0}
        />
        <ControlSlider
          label="Gravity g"
          value={g}
          min={1}
          max={15}
          step={0.1}
          unit=" m/s²"
          onChange={setG}
          hint="Try 1.6 — that's the Moon."
        />
        <div className="mt-auto flex gap-2">
          <DemoButton onClick={launch}>Launch 🚀</DemoButton>
          <DemoButton onClick={reset} variant="ghost">
            Reset
          </DemoButton>
        </div>
        <p className="rounded-xl bg-gold/10 p-3 text-[11px] leading-relaxed text-gold">
          💡 Try launching at exactly 45°. Why does that give the maximum
          range? R = v₀² sin(2θ) / g
        </p>
      </div>
    </div>
  );
}
