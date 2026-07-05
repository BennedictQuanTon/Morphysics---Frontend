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
  RED,
} from "./shared";

interface FallingObject {
  y: number; // height above ground (m)
  v: number; // downward speed (m/s)
  landed: boolean;
  impactTime: number | null;
  t: number;
}

export function FreeFallDemo() {
  const [height, setHeight] = useState(50);
  const [m1, setM1] = useState(0.05);
  const [cd1, setCd1] = useState(1.5);
  const [m2, setM2] = useState(5);
  const [cd2, setCd2] = useState(0.47);
  const [vacuum, setVacuum] = useState(false);

  const params = useRef({ height, m1, cd1, m2, cd2, vacuum });
  params.current = { height, m1, cd1, m2, cd2, vacuum };

  const makeObj = (): FallingObject => ({
    y: params.current.height,
    v: 0,
    landed: false,
    impactTime: null,
    t: 0,
  });

  const sim = useRef({
    running: false,
    a: makeObj(),
    b: makeObj(),
  });

  const drop = () => {
    sim.current = { running: true, a: makeObj(), b: makeObj() };
  };
  const reset = () => {
    sim.current = { running: false, a: makeObj(), b: makeObj() };
  };

  const canvasRef = useSimCanvas((ctx, w, h, dt) => {
    const g = 9.8;
    const rho = 1.225;
    const area = 0.05;
    const { height: H, m1: mA, cd1: cA, m2: mB, cd2: cB, vacuum: vac } =
      params.current;
    const st = sim.current;

    const step = (o: FallingObject, m: number, cd: number) => {
      if (!st.running || o.landed) return;
      o.t += dt;
      const drag = vac ? 0 : (0.5 * rho * cd * area * o.v * o.v) / m;
      o.v += (g - drag) * dt;
      o.y -= o.v * dt;
      if (o.y <= 0) {
        o.y = 0;
        o.landed = true;
        o.impactTime = o.t;
      }
    };
    step(st.a, mA, cA);
    step(st.b, mB, cB);

    const groundY = h - 44;
    const scale = (groundY - 60) / H;
    const xA = w * 0.32;
    const xB = w * 0.68;

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    // Height markers
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "left";
    const markStep = H > 60 ? 20 : 10;
    for (let hm = 0; hm <= H; hm += markStep) {
      const y = groundY - hm * scale;
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y);
      ctx.stroke();
      ctx.fillText(`${hm} m`, 6, y + 3);
    }

    // Ground
    ctx.fillStyle = "rgba(69,76,112,0.7)";
    ctx.fillRect(0, groundY, w, h - groundY);

    const vt = (m: number, cd: number) =>
      Math.sqrt((2 * m * g) / (rho * cd * area));

    const drawObj = (
      o: FallingObject,
      x: number,
      m: number,
      cd: number,
      color: string,
      emoji: string,
    ) => {
      const y = groundY - o.y * scale - 16;
      // Body
      ctx.font = "26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(emoji, x, y + 8);

      // Force arrows
      const dragMag = vac ? 0 : 0.5 * rho * cd * area * o.v * o.v;
      if (dragMag > 0.05 && !o.landed) {
        drawArrow(ctx, x, y - 18, 0, -Math.min(dragMag * 6, 55), RED, "F_d");
      }
      if (!o.landed) {
        drawArrow(ctx, x, y + 18, 0, Math.min(m * g * 3, 55), BLUE, "mg");
      }

      // Speed readout
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = color;
      ctx.fillText(`v = ${o.v.toFixed(1)} m/s`, x, y - 34);

      // Terminal velocity glow
      const vTerm = vt(m, cd);
      if (!vac && !o.landed && o.v > vTerm * 0.97) {
        ctx.fillStyle = GOLD;
        ctx.fillText(`TERMINAL v_t=${vTerm.toFixed(1)}`, x, y - 50);
      }

      // Impact splash
      if (o.landed) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(x + i * 8, groundY - 2);
          ctx.lineTo(x + i * 12, groundY - 12);
          ctx.stroke();
        }
      }
    };

    drawObj(st.a, xA, mA, cA, GREEN, "🪶");
    drawObj(st.b, xB, mB, cB, GOLD, "🎳");

    const lines = [
      vac ? "Mode: VACUUM (no drag)" : "Mode: NORMAL AIR",
      `Feather: ${
        st.a.impactTime !== null
          ? st.a.impactTime.toFixed(2) + " s"
          : st.a.t.toFixed(1) + " s…"
      }`,
      `Ball: ${
        st.b.impactTime !== null
          ? st.b.impactTime.toFixed(2) + " s"
          : st.b.t.toFixed(1) + " s…"
      }`,
    ];
    if (
      st.a.impactTime !== null &&
      st.b.impactTime !== null &&
      Math.abs(st.a.impactTime - st.b.impactTime) < 0.05
    ) {
      lines.push("🎉 Same time — Galileo was right!");
    }
    hudText(ctx, lines, 14, 24);
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <canvas
        ref={canvasRef}
        className="physics-grid-bg h-[340px] w-full rounded-2xl border border-white/10 bg-slate-ink sm:h-[400px]"
      />
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-ink p-5">
        <p className="text-xs italic leading-relaxed text-white/50">
          "A feather and a hammer are dropped from the same height. Which hits
          first — and why does the answer change in a vacuum?"
        </p>
        <ControlSlider
          label="Drop Height H"
          value={height}
          min={10}
          max={100}
          unit=" m"
          onChange={setHeight}
        />
        <ControlSlider
          label="🪶 Mass"
          value={m1}
          min={0.01}
          max={10}
          step={0.01}
          unit=" kg"
          onChange={setM1}
        />
        <ControlSlider
          label="🪶 Drag Cd"
          value={cd1}
          min={0.01}
          max={2}
          step={0.01}
          onChange={setCd1}
          hint="Sphere: 0.47 · Feather: ~1.5"
        />
        <ControlSlider
          label="🎳 Mass"
          value={m2}
          min={0.01}
          max={10}
          step={0.01}
          unit=" kg"
          onChange={setM2}
        />
        <ControlSlider
          label="🎳 Drag Cd"
          value={cd2}
          min={0.01}
          max={2}
          step={0.01}
          onChange={setCd2}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/70">Air density</span>
          <DemoButton
            onClick={() => setVacuum((v) => !v)}
            variant="ghost"
            active={vacuum}
          >
            {vacuum ? "Vacuum" : "Normal Air"}
          </DemoButton>
        </div>
        <div className="mt-auto flex gap-2">
          <DemoButton onClick={drop}>Drop ⬇</DemoButton>
          <DemoButton onClick={reset} variant="ghost">
            Reset
          </DemoButton>
        </div>
        <p className="rounded-xl bg-gold/10 p-3 text-[11px] leading-relaxed text-gold">
          💡 Set Air Density to Vacuum. Now both objects hit at the exact same
          time. This is what Galileo proved.
        </p>
      </div>
    </div>
  );
}
