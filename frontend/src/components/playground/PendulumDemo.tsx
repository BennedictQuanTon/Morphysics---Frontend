import { useRef, useState } from "react";
import {
  useSimCanvas,
  drawGrid,
  drawArrow,
  hudText,
  ControlSlider,
  DemoButton,
  GOLD,
  GREEN,
  BLUE,
} from "./shared";

export function PendulumDemo() {
  const [length, setLength] = useState(1);
  const [theta0, setTheta0] = useState(20);
  const [mass, setMass] = useState(0.5);
  const [g, setG] = useState(9.8);
  const [paused, setPaused] = useState(false);

  const params = useRef({ length, mass, g, paused });
  params.current = { length, mass, g, paused };

  const sim = useRef({
    theta: (20 * Math.PI) / 180,
    omega: 0,
    trace: [] as { x: number; y: number; age: number }[],
  });

  const reset = () => {
    sim.current = {
      theta: (theta0 * Math.PI) / 180,
      omega: 0,
      trace: [],
    };
  };

  const canvasRef = useSimCanvas((ctx, w, h, dt) => {
    const { length: L, mass: m, g: gg, paused: isPaused } = params.current;
    const st = sim.current;

    // Semi-implicit Euler on θ'' = -(g/L)·sinθ
    if (!isPaused) {
      const steps = 4;
      const sub = dt / steps;
      for (let i = 0; i < steps; i++) {
        st.omega += -(gg / L) * Math.sin(st.theta) * sub;
        st.theta += st.omega * sub;
      }
    }

    const anchorX = w / 2;
    const anchorY = 46;
    const scale = Math.min((h - 130) / 5, 90); // fit up to 5 m string
    const bobX = anchorX + Math.sin(st.theta) * L * scale;
    const bobY = anchorY + Math.cos(st.theta) * L * scale;
    const bobR = 10 + m * 4;

    if (!isPaused) {
      st.trace.push({ x: bobX, y: bobY, age: 0 });
      if (st.trace.length > 90) st.trace.shift();
    }
    st.trace.forEach((p) => (p.age += dt));

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Ceiling
    ctx.fillStyle = "rgba(69,76,112,0.8)";
    ctx.fillRect(anchorX - 60, anchorY - 14, 120, 10);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(anchorX - 55 + i * 20, anchorY - 14);
      ctx.lineTo(anchorX - 45 + i * 20, anchorY - 4);
      ctx.stroke();
    }

    // Fading trajectory arc
    for (const p of st.trace) {
      const alpha = Math.max(0, 0.5 - p.age * 0.35);
      if (alpha <= 0) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,200,0,${alpha})`;
      ctx.fill();
    }

    // Vertical reference + angle arc
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.lineTo(anchorX, anchorY + L * scale + 20);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 40, Math.PI / 2, Math.PI / 2 - st.theta, st.theta > 0);
    ctx.strokeStyle = GREEN;
    ctx.stroke();

    // String with L bracket
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pin
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Bob
    const grad = ctx.createRadialGradient(
      bobX - 3,
      bobY - 3,
      2,
      bobX,
      bobY,
      bobR,
    );
    grad.addColorStop(0, "#FFE580");
    grad.addColorStop(1, GOLD);
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity arrow (tangential)
    const vMag = st.omega * L * scale * 0.25;
    drawArrow(
      ctx,
      bobX,
      bobY,
      Math.cos(st.theta) * vMag,
      -Math.sin(st.theta) * vMag,
      BLUE,
      "v",
    );

    // Energy bar
    const thetaMax = Math.max(
      Math.abs(st.theta),
      Math.sqrt(
        st.theta * st.theta + (st.omega * st.omega * L) / gg,
      ),
    );
    const hNow = L * (1 - Math.cos(st.theta));
    const hMax = L * (1 - Math.cos(thetaMax)) || 0.0001;
    const pe = Math.min(hNow / hMax, 1);
    const ke = 1 - pe;
    const barW = Math.min(w - 40, 260);
    const barX = (w - barW) / 2;
    const barY = h - 34;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(barX - 4, barY - 16, barW + 8, 30);
    ctx.fillStyle = BLUE;
    ctx.fillRect(barX, barY - 10, barW * ke, 10);
    ctx.fillStyle = GREEN;
    ctx.fillRect(barX + barW * ke, barY - 10, barW * pe, 10);
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.textAlign = "left";
    ctx.fillText("Kinetic", barX, barY + 12);
    ctx.textAlign = "right";
    ctx.fillText("Potential", barX + barW, barY + 12);

    const period = 2 * Math.PI * Math.sqrt(L / gg);
    hudText(
      ctx,
      [
        `T = ${period.toFixed(2)} s`,
        `θ = ${((st.theta * 180) / Math.PI).toFixed(1)}°`,
        `L = ${L.toFixed(1)} m · m = ${m.toFixed(1)} kg`,
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
          "Why does a longer swing take more time to go back and forth? Does
          the weight of the child matter?"
        </p>
        <ControlSlider
          label="String Length L"
          value={length}
          min={0.5}
          max={5}
          step={0.1}
          unit=" m"
          onChange={setLength}
        />
        <ControlSlider
          label="Initial Angle θ₀"
          value={theta0}
          min={5}
          max={60}
          unit="°"
          onChange={setTheta0}
        />
        <ControlSlider
          label="Mass of Bob m"
          value={mass}
          min={0.1}
          max={5}
          step={0.1}
          unit=" kg"
          onChange={setMass}
          hint="Watch the period — mass has no effect!"
        />
        <ControlSlider
          label="Gravity g"
          value={g}
          min={1}
          max={15}
          step={0.1}
          unit=" m/s²"
          onChange={setG}
        />
        <div className="mt-auto flex gap-2">
          <DemoButton onClick={() => setPaused((p) => !p)} variant="ghost" active={paused}>
            {paused ? "Resume" : "Pause"}
          </DemoButton>
          <DemoButton onClick={reset}>Reset</DemoButton>
        </div>
        <p className="rounded-xl bg-gold/10 p-3 text-[11px] leading-relaxed text-gold">
          💡 Change the mass from 0.1 kg to 5 kg. Did the period change? Why
          not? T = 2π √(L/g)
        </p>
      </div>
    </div>
  );
}
