import { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import {
  Circle,
  Square,
  Triangle,
  Pin,
  Pause,
  Play,
  Timer,
  RotateCcw,
  Trash2,
  Eraser,
  HelpCircle,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GOLD = "#FFC800";
const SLATE = "#454C70";
const WHITE_SOFT = "#EDEFF7";
const ACCENT_BLUE = "#6C8CFF";
const ACCENT_ROSE = "#FF7A9E";

const DYNAMIC_COLORS = [GOLD, ACCENT_BLUE, ACCENT_ROSE, WHITE_SOFT];

const PLANETS = [
  { label: "🌙 Moon", g: 1.6 },
  { label: "🌍 Earth", g: 9.8 },
  { label: "🪐 Jupiter", g: 24.8 },
];

const HINTS = [
  "Drag any object with your mouse",
  "Right-click + drag to apply a force",
  "Try slow-motion to study collisions",
  "Lower gravity — welcome to the Moon",
];

type SpawnTool = "circle" | "box" | "triangle" | "anchor";

interface SelectedInfo {
  mass: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
  ke: number;
}

interface GlobalInfo {
  bodies: number;
  time: number;
  totalKE: number;
}

/** px per simulated metre — used for readout conversion only */
const PX_PER_M = 40;

export function HeroSandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const selectedBodyRef = useRef<Matter.Body | null>(null);
  const impulseRef = useRef<{
    body: Matter.Body | null;
    start: Matter.Vector;
    current: Matter.Vector;
  } | null>(null);
  const simTimeRef = useRef(0);

  const [paused, setPaused] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [gravity, setGravity] = useState(9.8);
  const [restitution, setRestitution] = useState(0.5);
  const [airDrag, setAirDrag] = useState(0.01);
  const [tool, setTool] = useState<SpawnTool | null>(null);
  const [selected, setSelected] = useState<SelectedInfo | null>(null);
  const [globalInfo, setGlobalInfo] = useState<GlobalInfo>({
    bodies: 0,
    time: 0,
    totalKE: 0,
  });
  const [hintIndex, setHintIndex] = useState(0);
  const [showHints, setShowHints] = useState(true);

  const restitutionRef = useRef(restitution);
  const airDragRef = useRef(airDrag);
  const toolRef = useRef(tool);
  restitutionRef.current = restitution;
  airDragRef.current = airDrag;
  toolRef.current = tool;

  const colorAt = (i: number) => DYNAMIC_COLORS[i % DYNAMIC_COLORS.length];

  const makeDynamicBody = useCallback(
    (kind: SpawnTool, x: number, y: number, seed: number): Matter.Body => {
      const common = {
        restitution: restitutionRef.current,
        friction: 0.35,
        frictionAir: airDragRef.current,
        render: {
          fillStyle: colorAt(seed),
          strokeStyle: "rgba(35,39,61,0.55)",
          lineWidth: 1.5,
        },
      };
      switch (kind) {
        case "circle":
          return Matter.Bodies.circle(x, y, 16 + (seed % 3) * 6, common);
        case "triangle":
          return Matter.Bodies.polygon(x, y, 3, 24, common);
        case "anchor":
          return Matter.Bodies.rectangle(x, y, 46, 46, {
            isStatic: true,
            render: {
              fillStyle: "rgba(69,76,112,0.9)",
              strokeStyle: GOLD,
              lineWidth: 2,
            },
          });
        case "box":
        default:
          return Matter.Bodies.rectangle(
            x,
            y,
            34 + (seed % 3) * 10,
            34 + ((seed + 1) % 3) * 8,
            common,
          );
      }
    },
    [],
  );

  const buildDefaultScene = useCallback(
    (world: Matter.World, w: number, h: number) => {
      Matter.World.clear(world, false);

      const wallOpts: Matter.IChamferableBodyDefinition = {
        isStatic: true,
        render: { fillStyle: "rgba(69,76,112,0.55)" },
      };

      // Boundaries
      const ground = Matter.Bodies.rectangle(w / 2, h - 12, w, 24, wallOpts);
      const left = Matter.Bodies.rectangle(-10, h / 2, 20, h * 2, wallOpts);
      const right = Matter.Bodies.rectangle(w + 10, h / 2, 20, h * 2, wallOpts);
      const ceiling = Matter.Bodies.rectangle(w / 2, -60, w, 20, wallOpts);

      // Platform + stacked boxes
      const platform = Matter.Bodies.rectangle(
        w * 0.22,
        h * 0.62,
        w * 0.3,
        16,
        {
          isStatic: true,
          render: { fillStyle: "rgba(69,76,112,0.8)" },
        },
      );
      const stack = Matter.Composites.stack(
        w * 0.14,
        h * 0.62 - 8 - 3 * 30,
        2,
        3,
        6,
        4,
        (x: number, y: number) =>
          Matter.Bodies.rectangle(x, y, 30, 30, {
            restitution: 0.3,
            friction: 0.4,
            render: {
              fillStyle: colorAt(Math.round(x + y)),
              strokeStyle: "rgba(35,39,61,0.55)",
              lineWidth: 1.5,
            },
          }),
      );

      // Ramp + rolling ball
      const ramp = Matter.Bodies.rectangle(w * 0.68, h * 0.52, w * 0.34, 14, {
        isStatic: true,
        angle: 0.42,
        render: { fillStyle: "rgba(69,76,112,0.8)" },
      });
      const ball = Matter.Bodies.circle(w * 0.58, h * 0.3, 18, {
        restitution: 0.55,
        friction: 0.05,
        render: {
          fillStyle: GOLD,
          strokeStyle: "rgba(35,39,61,0.55)",
          lineWidth: 1.5,
        },
      });

      // Pendulum on a pin joint
      const pinX = w * 0.42;
      const bob = Matter.Bodies.circle(pinX + 90, h * 0.22, 16, {
        density: 0.004,
        frictionAir: 0.0,
        render: {
          fillStyle: ACCENT_ROSE,
          strokeStyle: "rgba(35,39,61,0.55)",
          lineWidth: 1.5,
        },
      });
      const pendulum = Matter.Constraint.create({
        pointA: { x: pinX, y: h * 0.08 },
        bodyB: bob,
        stiffness: 1,
        length: 120,
        render: { strokeStyle: SLATE, lineWidth: 2, type: "line" },
      });

      Matter.World.add(world, [
        ground,
        left,
        right,
        ceiling,
        platform,
        stack,
        ramp,
        ball,
        bob,
        pendulum,
      ]);
    },
    [],
  );

  // ---------- Engine bootstrap ----------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const engine = Matter.Engine.create();
    engine.gravity.y = 1; // Matter default scale; slider maps 9.8 -> 1
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: container,
      engine,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: "transparent",
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      },
    });
    renderRef.current = render;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    buildDefaultScene(engine.world, w, h);

    // Drag & drop
    const mouse = Matter.Mouse.create(render.canvas);
    mouse.pixelRatio = render.options.pixelRatio ?? 1;
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Selection on click
    Matter.Events.on(mouseConstraint, "mousedown", () => {
      const found = Matter.Query.point(
        Matter.Composite.allBodies(engine.world),
        mouse.position,
      ).filter((b) => !b.isStatic);
      selectedBodyRef.current = found[0] ?? null;
      if (found[0]) setShowHints(false);
    });

    // Spawn on click with active tool (empty space only)
    Matter.Events.on(mouseConstraint, "mouseup", () => {
      const activeTool = toolRef.current;
      if (!activeTool) return;
      const under = Matter.Query.point(
        Matter.Composite.allBodies(engine.world),
        mouse.position,
      );
      if (under.length > 0) return;
      const body = makeDynamicBody(
        activeTool,
        mouse.position.x,
        mouse.position.y,
        Math.floor(Math.random() * 10),
      );
      Matter.World.add(engine.world, body);
    });

    // Right-click impulse
    const canvas = render.canvas;
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return;
      const rect = canvas.getBoundingClientRect();
      const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const found = Matter.Query.point(
        Matter.Composite.allBodies(engine.world),
        p,
      ).filter((b) => !b.isStatic);
      impulseRef.current = { body: found[0] ?? null, start: p, current: p };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!impulseRef.current) return;
      const rect = canvas.getBoundingClientRect();
      impulseRef.current.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 2 || !impulseRef.current) return;
      const { body, start, current } = impulseRef.current;
      if (body) {
        const scale = 0.0004 * body.mass;
        Matter.Body.applyForce(body, body.position, {
          x: (current.x - start.x) * scale,
          y: (current.y - start.y) * scale,
        });
        setShowHints(false);
      }
      impulseRef.current = null;
    };
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Delete key removes selected body
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedBodyRef.current
      ) {
        Matter.World.remove(engine.world, selectedBodyRef.current);
        selectedBodyRef.current = null;
      }
      if (e.code === "Space" && document.activeElement === document.body) {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Overlay drawing: velocity vectors, mass labels, selection ring, impulse arrow
    Matter.Events.on(render, "afterRender", () => {
      const ctx = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      ctx.save();
      ctx.font =
        "10px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textAlign = "center";

      for (const body of bodies) {
        if (body.isStatic) continue;

        // Velocity vector
        const v = body.velocity;
        const speed = Math.hypot(v.x, v.y);
        if (speed > 0.4) {
          const len = Math.min(speed * 6, 70);
          const nx = v.x / speed;
          const ny = v.y / speed;
          const ex = body.position.x + nx * len;
          const ey = body.position.y + ny * len;
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(body.position.x, body.position.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          // arrowhead
          const a = Math.atan2(ny, nx);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 7 * Math.cos(a - 0.45), ey - 7 * Math.sin(a - 0.45));
          ctx.lineTo(ex - 7 * Math.cos(a + 0.45), ey - 7 * Math.sin(a + 0.45));
          ctx.closePath();
          ctx.fillStyle = GOLD;
          ctx.fill();
        }

        // Mass label
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.strokeStyle = "rgba(35,39,61,0.7)";
        ctx.lineWidth = 3;
        const label = `${body.mass.toFixed(1)} kg`;
        ctx.strokeText(label, body.position.x, body.position.y + 3);
        ctx.fillText(label, body.position.x, body.position.y + 3);
      }

      // Selection ring
      const sel = selectedBodyRef.current;
      if (sel) {
        const r =
          Math.max(
            sel.bounds.max.x - sel.bounds.min.x,
            sel.bounds.max.y - sel.bounds.min.y,
          ) /
            2 +
          8;
        ctx.strokeStyle = GOLD;
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sel.position.x, sel.position.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Impulse arrow while right-dragging
      const imp = impulseRef.current;
      if (imp?.body) {
        ctx.strokeStyle = ACCENT_ROSE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(imp.start.x, imp.start.y);
        ctx.lineTo(imp.current.x, imp.current.y);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Track sim time + HUD info (throttled)
    let frame = 0;
    Matter.Events.on(engine, "afterUpdate", () => {
      simTimeRef.current += engine.timing.lastDelta / 1000;
      frame++;
      if (frame % 12 !== 0) return;

      const bodies = Matter.Composite.allBodies(engine.world).filter(
        (b) => !b.isStatic,
      );
      let totalKE = 0;
      for (const b of bodies) {
        const sp = Math.hypot(b.velocity.x, b.velocity.y) / PX_PER_M;
        totalKE += 0.5 * b.mass * sp * sp * 60 * 60; // scale to readable J
      }
      setGlobalInfo({
        bodies: bodies.length,
        time: simTimeRef.current,
        totalKE,
      });

      const sel = selectedBodyRef.current;
      if (sel) {
        const sx = sel.velocity.x / PX_PER_M;
        const sy = sel.velocity.y / PX_PER_M;
        const sp = Math.hypot(sx, sy) * 60;
        setSelected({
          mass: sel.mass,
          vx: sx * 60,
          vy: sy * 60,
          x: sel.position.x / PX_PER_M,
          y: (h - sel.position.y) / PX_PER_M,
          ke: 0.5 * sel.mass * sp * sp,
        });
      } else {
        setSelected(null);
      }
    });

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [buildDefaultScene, makeDynamicBody]);

  // ---------- Control wiring ----------
  useEffect(() => {
    const engine = engineRef.current;
    if (engine) engine.gravity.y = gravity / 9.8;
  }, [gravity]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    for (const b of Matter.Composite.allBodies(engine.world)) {
      if (!b.isStatic) {
        b.restitution = restitution;
        b.frictionAir = airDrag;
      }
    }
  }, [restitution, airDrag]);

  useEffect(() => {
    const runner = runnerRef.current;
    if (runner) runner.enabled = !paused;
  }, [paused]);

  useEffect(() => {
    const engine = engineRef.current;
    if (engine) engine.timing.timeScale = slowMo ? 0.25 : 1;
  }, [slowMo]);

  // Hint carousel
  useEffect(() => {
    if (!showHints) return;
    const id = setInterval(
      () => setHintIndex((i) => (i + 1) % HINTS.length),
      3400,
    );
    return () => clearInterval(id);
  }, [showHints]);

  const resetScene = () => {
    const engine = engineRef.current;
    const container = containerRef.current;
    const render = renderRef.current;
    if (!engine || !container || !render) return;
    buildDefaultScene(
      engine.world,
      render.options.width ?? container.clientWidth,
      render.options.height ?? container.clientHeight,
    );
    // Re-add mouse constraint after clear
    const mouse = Matter.Mouse.create(render.canvas);
    mouse.pixelRatio = render.options.pixelRatio ?? 1;
    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.World.add(engine.world, mc);
    render.mouse = mouse;
    simTimeRef.current = 0;
    selectedBodyRef.current = null;
  };

  const clearAll = () => {
    const engine = engineRef.current;
    const render = renderRef.current;
    const container = containerRef.current;
    if (!engine || !render || !container) return;
    Matter.World.clear(engine.world, false);
    const w = render.options.width ?? container.clientWidth;
    const h = render.options.height ?? container.clientHeight;
    const wallOpts: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { fillStyle: "rgba(69,76,112,0.55)" },
    };
    Matter.World.add(engine.world, [
      Matter.Bodies.rectangle(w / 2, h - 12, w, 24, wallOpts),
      Matter.Bodies.rectangle(-10, h / 2, 20, h * 2, wallOpts),
      Matter.Bodies.rectangle(w + 10, h / 2, 20, h * 2, wallOpts),
    ]);
    const mouse = Matter.Mouse.create(render.canvas);
    mouse.pixelRatio = render.options.pixelRatio ?? 1;
    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.World.add(engine.world, mc);
    render.mouse = mouse;
    selectedBodyRef.current = null;
  };

  const deleteSelected = () => {
    const engine = engineRef.current;
    if (engine && selectedBodyRef.current) {
      Matter.World.remove(engine.world, selectedBodyRef.current);
      selectedBodyRef.current = null;
    }
  };

  const toolButton = (
    t: SpawnTool,
    Icon: typeof Circle,
    label: string,
  ) => (
    <button
      key={t}
      type="button"
      title={label}
      onClick={() => setTool((cur) => (cur === t ? null : t))}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
        tool === t
          ? "border-gold bg-gold text-slate-deep shadow-md shadow-gold/40"
          : "border-white/15 bg-white/5 text-white/70 hover:border-gold/60 hover:text-gold",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-ink shadow-2xl shadow-black/40">
      {/* Canvas area */}
      <div
        ref={containerRef}
        className="physics-grid-bg relative h-[380px] w-full sm:h-[440px] lg:h-[480px] [&_canvas]:!h-full [&_canvas]:!w-full"
      />

      {/* Gravity direction indicator */}
      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-[10px] font-bold text-gold backdrop-blur-sm">
        <ArrowDown className="h-3 w-3" />
        g = {gravity.toFixed(1)} m/s²
      </div>

      {/* Global HUD */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/40 px-3 py-2 font-mono text-[10px] leading-relaxed text-white/80 backdrop-blur-sm">
        <div>
          objects <span className="text-gold">{globalInfo.bodies}</span>
        </div>
        <div>
          t = <span className="text-gold">{globalInfo.time.toFixed(1)}s</span>
        </div>
        <div>
          ΣKE ≈{" "}
          <span className="text-gold">{globalInfo.totalKE.toFixed(0)} J</span>
        </div>
      </div>

      {/* Selected object panel */}
      {selected && (
        <div className="pointer-events-none absolute bottom-[74px] left-3 rounded-lg border border-gold/30 bg-black/50 px-3 py-2 font-mono text-[10px] leading-relaxed text-white/90 backdrop-blur-sm">
          <div className="mb-0.5 font-bold text-gold">SELECTED BODY</div>
          <div>m = {selected.mass.toFixed(2)} kg</div>
          <div>
            v = ({selected.vx.toFixed(1)}, {selected.vy.toFixed(1)}) m/s
          </div>
          <div>
            pos = ({selected.x.toFixed(1)}, {selected.y.toFixed(1)}) m
          </div>
          <div>KE = {selected.ke.toFixed(1)} J</div>
        </div>
      )}

      {/* Hints */}
      {showHints && (
        <div className="pointer-events-none absolute bottom-[74px] right-3 max-w-[190px] rounded-xl border border-gold/40 bg-gold/95 px-3 py-2 text-xs font-bold text-slate-deep shadow-lg">
          💡 {HINTS[hintIndex]}
        </div>
      )}

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 border-t border-white/10 bg-black/45 px-3 py-3 backdrop-blur-md">
        {/* Spawn tools */}
        <div className="flex items-center gap-1.5">
          {toolButton("circle", Circle, "Spawn circle")}
          {toolButton("box", Square, "Spawn box")}
          {toolButton("triangle", Triangle, "Spawn triangle")}
          {toolButton("anchor", Pin, "Spawn static anchor")}
        </div>

        <div className="mx-1 h-6 w-px bg-white/15" />

        {/* Playback */}
        <button
          type="button"
          title={paused ? "Resume (Space)" : "Pause (Space)"}
          onClick={() => setPaused((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all hover:border-gold/60 hover:text-gold"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button
          type="button"
          title="Slow motion (0.25×)"
          onClick={() => setSlowMo((s) => !s)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
            slowMo
              ? "border-gold bg-gold text-slate-deep"
              : "border-white/15 bg-white/5 text-white/70 hover:border-gold/60 hover:text-gold",
          )}
        >
          <Timer className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Delete selected"
          onClick={deleteSelected}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all hover:border-red-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Reset scene"
          onClick={resetScene}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all hover:border-gold/60 hover:text-gold"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Clear all"
          onClick={clearAll}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all hover:border-red-400 hover:text-red-400"
        >
          <Eraser className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Show hints"
          onClick={() => {
            setShowHints(true);
            setHintIndex(0);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all hover:border-gold/60 hover:text-gold"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />

        {/* Environment sliders */}
        <div className="flex min-w-[130px] flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-white/60">
            <span>Gravity</span>
            <span className="text-gold">{gravity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={26}
            step={0.1}
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="control-slider"
            style={
              { "--progress": `${(gravity / 26) * 100}%` } as React.CSSProperties
            }
          />
        </div>
        <div className="hidden min-w-[110px] flex-1 flex-col gap-0.5 md:flex">
          <div className="flex items-center justify-between text-[10px] font-bold text-white/60">
            <span>Bounce</span>
            <span className="text-gold">{restitution.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={restitution}
            onChange={(e) => setRestitution(Number(e.target.value))}
            className="control-slider"
            style={
              { "--progress": `${restitution * 100}%` } as React.CSSProperties
            }
          />
        </div>
        <div className="hidden min-w-[110px] flex-1 flex-col gap-0.5 md:flex">
          <div className="flex items-center justify-between text-[10px] font-bold text-white/60">
            <span>Air drag</span>
            <span className="text-gold">{airDrag.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.2}
            step={0.01}
            value={airDrag}
            onChange={(e) => setAirDrag(Number(e.target.value))}
            className="control-slider"
            style={
              { "--progress": `${(airDrag / 0.2) * 100}%` } as React.CSSProperties
            }
          />
        </div>

        {/* Planet presets */}
        <div className="flex items-center gap-1">
          {PLANETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setGravity(p.g)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-bold transition-all",
                Math.abs(gravity - p.g) < 0.05
                  ? "bg-gold text-slate-deep"
                  : "bg-white/10 text-white/60 hover:bg-white/20",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
