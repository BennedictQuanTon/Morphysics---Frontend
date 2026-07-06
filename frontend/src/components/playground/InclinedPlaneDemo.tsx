import { useRef, useState } from "react";
import {
  useSimCanvas,
  drawGrid,
  drawArrow,
  hudText,
  ControlSlider,
  DemoButton,
  BLUE,
  GREEN,
  ORANGE,
  RED,
  GOLD,
} from "./shared";

export function InclinedPlaneDemo() {
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [mu, setMu] = useState(0.3);
  const [pushOn, setPushOn] = useState(false);
  const [pushForce, setPushForce] = useState(60);

  const params = useRef({ angle, mass, mu, pushOn, pushForce });
  params.current = { angle, mass, mu, pushOn, pushForce };

  // s = distance along ramp from bottom (m), v = velocity along ramp (m/s)
  const sim = useRef({ s: 4, v: 0 });

  const reset = () => {
    sim.current = { s: 4, v: 0 };
  };

  const canvasRef = useSimCanvas((ctx, w, h, dt) => {
    const { angle: aDeg, mass: m, mu: muK, pushOn: push, pushForce: F } =
      params.current;
    const g = 9.8;
    const rad = (aDeg * Math.PI) / 180;
    const st = sim.current;

    // Forces along ramp (+ = up the ramp)
    const N = m * g * Math.cos(rad);
    const gravAlong = -m * g * Math.sin(rad);
    const applied = push ? F : 0;
    const driving = gravAlong + applied;

    let a = 0;
    let friction = 0;
    let state: "STATIC" | "SLIDING ↓" | "ACCELERATING ↑" | "DECELERATING" =
      "STATIC";

    if (Math.abs(st.v) < 0.01 && Math.abs(driving) <= muK * N) {
      st.v = 0;
      friction = -driving; // static friction balances
      state = "STATIC";
    } else {
      const vDir = Math.abs(st.v) > 0.01 ? Math.sign(st.v) : Math.sign(driving);
      friction = -vDir * muK * N;
      a = (driving + friction) / m;
      state = st.v > 0.01 ? "ACCELERATING ↑" : st.v < -0.01 ? "SLIDING ↓" : "STATIC";
      if (st.v > 0.01 && a < 0) state = "DECELERATING";
    }

    st.v += a * dt;
    st.s += st.v * dt;

    // Ramp geometry (screen space)
    const rampLen = 12; // metres of ramp
    st.s = Math.max(0.6, Math.min(st.s, rampLen - 0.6));
    if (st.s <= 0.61 || st.s >= rampLen - 0.61) st.v = 0;

    const baseX = 60;
    const baseY = h - 50;
    const scale = Math.min((w - 150) / (rampLen * Math.cos(rad)), 34);
    const topX = baseX + rampLen * Math.cos(rad) * scale;
    const topY = baseY - rampLen * Math.sin(rad) * scale;

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Ground
    ctx.fillStyle = "rgba(69,76,112,0.7)";
    ctx.fillRect(0, baseY, w, h - baseY);

    // Ramp
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(topX, topY);
    ctx.lineTo(topX, baseY);
    ctx.closePath();
    ctx.fillStyle = "rgba(69,76,112,0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle arc
    ctx.beginPath();
    ctx.arc(baseX, baseY, 34, -rad, 0);
    ctx.strokeStyle = GOLD;
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillText(`θ=${aDeg}°`, baseX + 44, baseY - 8);

    // Block position on ramp
    const bx = baseX + st.s * Math.cos(rad) * scale;
    const by = baseY - st.s * Math.sin(rad) * scale;
    const size = 18 + m; // visual size grows with mass

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-rad);
    ctx.fillStyle = GOLD;
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.fillRect(-size / 2, -size, size, size);
    ctx.strokeRect(-size / 2, -size, size, size);
    ctx.fillStyle = "#23273D";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${m}kg`, 0, -size / 2 + 3);
    ctx.restore();

    // Force vectors from block centre
    const cx = bx - (size / 2) * Math.sin(rad) * 0; // block centre approx
    const cy = by - (size / 2) * Math.cos(rad) - size / 3;
    const fScale = 0.9;

    drawArrow(ctx, cx, cy, 0, m * g * fScale, BLUE, "W");
    drawArrow(
      ctx,
      cx,
      cy,
      -Math.sin(rad) * N * fScale,
      -Math.cos(rad) * N * fScale,
      GREEN,
      "N",
    );
    if (Math.abs(friction) > 0.5) {
      drawArrow(
        ctx,
        cx,
        cy,
        Math.cos(rad) * friction * fScale,
        -Math.sin(rad) * friction * fScale,
        ORANGE,
        "f",
      );
    }
    if (push && applied > 0) {
      drawArrow(
        ctx,
        cx,
        cy,
        Math.cos(rad) * applied * fScale,
        -Math.sin(rad) * applied * fScale,
        RED,
        "F",
      );
    }
    const net = driving + friction;
    if (Math.abs(net) > 0.5) {
      drawArrow(
        ctx,
        cx,
        cy - 4,
        Math.cos(rad) * net * fScale * 1.2,
        -Math.sin(rad) * net * fScale * 1.2,
        "#FFFFFF",
        "ΣF",
      );
    }

    hudText(
      ctx,
      [
        `State: ${state}`,
        `a = ${a.toFixed(2)} m/s²`,
        `v = ${st.v.toFixed(2)} m/s`,
        `N = ${N.toFixed(1)} N · f = ${Math.abs(friction).toFixed(1)} N`,
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
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-ink p-5">
        <p className="text-xs italic leading-relaxed text-white/50">
          "A crate is pushed up a ramp to load into a truck. Does it slide back
          down if you let go?"
        </p>
        <ControlSlider
          label="Ramp Angle θ"
          value={angle}
          min={5}
          max={75}
          unit="°"
          onChange={setAngle}
        />
        <ControlSlider
          label="Mass m"
          value={mass}
          min={1}
          max={20}
          unit=" kg"
          onChange={setMass}
        />
        <ControlSlider
          label="Friction μ"
          value={mu}
          min={0}
          max={0.9}
          step={0.05}
          onChange={setMu}
          hint="Smooth ←——→ Rough"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/70">Push force</span>
          <DemoButton
            onClick={() => setPushOn((p) => !p)}
            variant="ghost"
            active={pushOn}
          >
            {pushOn ? "ON" : "OFF"}
          </DemoButton>
        </div>
        {pushOn && (
          <ControlSlider
            label="Applied Force F"
            value={pushForce}
            min={0}
            max={200}
            unit=" N"
            onChange={setPushForce}
          />
        )}
        <div className="mt-auto flex gap-2">
          <DemoButton onClick={reset} variant="ghost">
            Reset
          </DemoButton>
        </div>
        <p className="rounded-xl bg-gold/10 p-3 text-[11px] leading-relaxed text-gold">
          💡 Find the minimum μ that keeps the block still at 40°. Condition:
          tanθ &gt; μ means it slides.
        </p>
      </div>
    </div>
  );
}
