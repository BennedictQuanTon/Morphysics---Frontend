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
} from "./shared";

type CollisionType = "elastic" | "inelastic" | "partial";

const LABELS: Record<CollisionType, string> = {
  elastic: "Elastic",
  inelastic: "Perfectly Inelastic",
  partial: "Partial (e = 0.5)",
};

interface SimState {
  running: boolean;
  slowMo: boolean;
  xA: number;
  xB: number;
  vA: number;
  vB: number;
  collided: boolean;
  merged: boolean;
  pBefore: number;
  keBefore: number;
  pAfter: number | null;
  keAfter: number | null;
}

export function CollisionDemo() {
  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(5);
  const [v1, setV1] = useState(10);
  const [v2, setV2] = useState(0);
  const [type, setType] = useState<CollisionType>("elastic");

  const params = useRef({ m1, m2, type });
  params.current = { m1, m2, type };

  const makeInitial = (): SimState => ({
    running: false,
    slowMo: false,
    xA: 6,
    xB: 24,
    vA: v1,
    vB: v2,
    collided: false,
    merged: false,
    pBefore: m1 * v1 + m2 * v2,
    keBefore: 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2,
    pAfter: null,
    keAfter: null,
  });

  const sim = useRef<SimState>(makeInitial());

  const launch = () => {
    sim.current = { ...makeInitial(), running: true };
  };
  const reset = () => {
    sim.current = makeInitial();
  };
  const toggleSlowMo = () => {
    sim.current.slowMo = !sim.current.slowMo;
  };

  const canvasRef = useSimCanvas((ctx, w, h, rawDt) => {
    const { m1: mA, m2: mB, type: cType } = params.current;
    const st = sim.current;
    const dt = st.slowMo ? rawDt * 0.25 : rawDt;

    const worldW = 30; // metres
    const scale = (w - 60) / worldW;
    const groundY = h - 60;
    const rA = 12 + mA * 0.9;
    const rB = 12 + mB * 0.9;

    if (st.running) {
      st.xA += st.vA * dt;
      st.xB += st.vB * dt;

      // Collision detection (1D)
      const gap = st.xB - st.xA - (rA + rB) / scale;
      if (!st.collided && gap <= 0) {
        st.collided = true;
        const e = cType === "elastic" ? 1 : cType === "partial" ? 0.5 : 0;
        const { vA, vB } = st;
        const vAf =
          (mA * vA + mB * vB - mB * e * (vA - vB)) / (mA + mB);
        const vBf =
          (mA * vA + mB * vB + mA * e * (vA - vB)) / (mA + mB);
        st.vA = vAf;
        st.vB = vBf;
        st.merged = cType === "inelastic";
        st.pAfter = mA * st.vA + mB * st.vB;
        st.keAfter = 0.5 * mA * st.vA ** 2 + 0.5 * mB * st.vB ** 2;
      }

      // Walls
      if (st.xA < rA / scale && st.vA < 0) st.vA = -st.vA * 0.9;
      if (st.xB > worldW - rB / scale && st.vB > 0) st.vB = -st.vB * 0.9;
      if (st.xA > worldW || st.xB < 0) st.running = false;
    }

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Table surface
    ctx.fillStyle = "rgba(27,94,63,0.55)"; // billiard felt
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    const ax = 30 + st.xA * scale;
    const bx = 30 + st.xB * scale;

    // Ball A
    ctx.beginPath();
    ctx.arc(ax, groundY - rA, rA, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#23273D";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${mA}kg`, ax, groundY - rA + 4);

    // Ball B
    ctx.beginPath();
    ctx.arc(bx, groundY - rB, rB, 0, Math.PI * 2);
    ctx.fillStyle = BLUE;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillText(`${mB}kg`, bx, groundY - rB + 4);

    // Velocity arrows
    if (Math.abs(st.vA) > 0.05)
      drawArrow(ctx, ax, groundY - rA * 2 - 14, st.vA * 4, 0, GOLD, "v₁");
    if (Math.abs(st.vB) > 0.05)
      drawArrow(ctx, bx, groundY - rB * 2 - 14, st.vB * 4, 0, BLUE, "v₂");

    // Impact flash
    if (st.collided && Math.abs(ax - bx) < rA + rB + 6 && st.running) {
      ctx.beginPath();
      ctx.arc((ax + bx) / 2, groundY - (rA + rB) / 2, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();
    }

    const lines = [
      `p before = ${st.pBefore.toFixed(1)} kg·m/s`,
      `KE before = ${st.keBefore.toFixed(1)} J`,
    ];
    if (st.pAfter !== null && st.keAfter !== null) {
      lines.push(`p after = ${st.pAfter.toFixed(1)} kg·m/s`);
      lines.push(`KE after = ${st.keAfter.toFixed(1)} J`);
      lines.push(
        Math.abs(st.keAfter - st.keBefore) < 0.5
          ? "✅ Momentum & KE conserved"
          : "✅ Momentum conserved · ⚠ KE lost",
      );
    }
    hudText(ctx, lines, 14, 24);

    if (st.slowMo) {
      ctx.fillStyle = GOLD;
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("SLOW-MO 0.25×", w - 14, 24);
    }
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <canvas
        ref={canvasRef}
        className="physics-grid-bg h-[340px] w-full rounded-2xl border border-white/10 bg-slate-ink sm:h-[400px]"
      />
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-ink p-5">
        <p className="text-xs italic leading-relaxed text-white/50">
          "Two billiard balls collide. What happens to speed and direction
          after the crash?"
        </p>
        <ControlSlider label="Mass A (m₁)" value={m1} min={1} max={20} unit=" kg" onChange={setM1} />
        <ControlSlider label="Mass B (m₂)" value={m2} min={1} max={20} unit=" kg" onChange={setM2} />
        <ControlSlider label="Velocity A (v₁)" value={v1} min={-20} max={20} unit=" m/s" onChange={setV1} />
        <ControlSlider label="Velocity B (v₂)" value={v2} min={-20} max={20} unit=" m/s" onChange={setV2} />
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(LABELS) as CollisionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={
                type === t
                  ? "rounded-md bg-gold px-2.5 py-1.5 text-[11px] font-bold text-slate-deep"
                  : "rounded-md bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white/60 hover:bg-white/20"
              }
            >
              {LABELS[t]}
            </button>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <DemoButton onClick={launch}>Launch</DemoButton>
          <DemoButton onClick={toggleSlowMo} variant="ghost">
            Slow-Mo
          </DemoButton>
          <DemoButton onClick={reset} variant="ghost">
            Reset
          </DemoButton>
        </div>
        <p className="rounded-xl bg-gold/10 p-3 text-[11px] leading-relaxed text-gold">
          💡 Make both masses equal and give A all the speed. What happens to B
          after an elastic hit? (Spoiler: they swap.)
        </p>
      </div>
    </div>
  );
}
