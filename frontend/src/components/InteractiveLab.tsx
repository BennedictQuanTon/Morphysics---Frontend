import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Send,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";
import Lottie from "lottie-react";
import mascotData from "../Images/demo.json";
import Matter from "matter-js";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  file?: {
    name: string;
    type: "image" | "document";
  };
}

export function InteractiveLab({
  isLightTheme = false,
}: {
  isLightTheme?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: "Hi there! 👋 I am your MorPhysics AI Assistant. I can build and explore interactive physics models in real time. \n\nChoose one of the quick setups below or describe a custom physics problem to get started!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    gravity: "9.8 m/s²",
    bodies: 0,
    energy: "0.0 J",
    fps: 60,
  });

  // MatterJS Refs
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const renderRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Clean up MatterJS
  const cleanUpPhysics = () => {
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
      renderRef.current.textures = {};
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    engineRef.current = null;
    renderRef.current = null;
    runnerRef.current = null;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => cleanUpPhysics();
  }, []);

  // Re-initialize physics when theme toggles
  useEffect(() => {
    if (activeSim) {
      initPhysics(activeSim);
    }
  }, [isLightTheme]);

  // Set up telemetry updates
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;

    const updateTelemetry = () => {
      const engine = engineRef.current;
      if (engine) {
        // Calculate kinetic energy
        let totalEnergy = 0;
        const bodies = Matter.Composite.allBodies(engine.world);

        bodies.forEach((body: any) => {
          if (!body.isStatic) {
            const speed = body.speed;
            const mass = body.mass;
            totalEnergy += 0.5 * mass * speed * speed;
          }
        });

        // Calculate FPS
        const now = performance.now();
        frameCount++;
        let fps = telemetry.fps;
        if (now - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (now - lastTime));
          frameCount = 0;
          lastTime = now;
        }

        setTelemetry({
          gravity:
            activeSim === "collisions" || activeSim === "orbit"
              ? "0.0 m/s²"
              : "9.8 m/s²",
          bodies: bodies.filter((b: any) => !b.isStatic).length,
          energy: `${totalEnergy.toFixed(1)} J`,
          fps: fps,
        });
      }
      animId = requestAnimationFrame(updateTelemetry);
    };

    animId = requestAnimationFrame(updateTelemetry);
    return () => cancelAnimationFrame(animId);
  }, [activeSim]);

  // Play / Pause controls
  const togglePlay = () => {
    if (!runnerRef.current || !engineRef.current) return;
    if (isRunning) {
      Matter.Runner.stop(runnerRef.current);
      setIsRunning(false);
    } else {
      Matter.Runner.run(runnerRef.current, engineRef.current);
      setIsRunning(true);
    }
  };

  // Initialize MatterJS simulation
  const initPhysics = (type: string) => {
    cleanUpPhysics();
    if (!sceneRef.current) return;

    const container = sceneRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

    const engine = Engine.create({
      gravity: { y: type === "collisions" || type === "orbit" ? 0 : 1 },
    });
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: isLightTheme ? "#f8fafc" : "#151726",
      },
    });
    renderRef.current = render;

    // Boundary walls (glass style transparent)
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: isLightTheme ? "#cbd5e1" : "#2a2e44" },
    };
    const ground = Bodies.rectangle(
      width / 2,
      height - 10,
      width,
      20,
      wallOptions,
    );
    const ceiling = Bodies.rectangle(width / 2, 10, width, 20, wallOptions);
    const leftWall = Bodies.rectangle(10, height / 2, 20, height, wallOptions);
    const rightWall = Bodies.rectangle(
      width - 10,
      height / 2,
      20,
      height,
      wallOptions,
    );
    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Populate based on type
    if (type === "projectile") {
      // Launcher base
      const launcher = Bodies.rectangle(80, height - 80, 60, 20, {
        isStatic: true,
        angle: -Math.PI / 4,
        render: { fillStyle: "#ffc800" },
      });
      Composite.add(engine.world, launcher);

      // Pile of block targets
      const targetX = width - 180;
      const targetBaseY = height - 20;
      const targetWidth = 30;
      const targetHeight = 80;
      const targets = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3 - row; col++) {
          const x = targetX + col * 45 + row * 20;
          const y = targetBaseY - row * 85 - 40;
          targets.push(
            Bodies.rectangle(x, y, targetWidth, targetHeight, {
              restitution: 0.3,
              friction: 0.8,
              render: { fillStyle: row % 2 === 0 ? "#598bff" : "#ffc800" },
            }),
          );
        }
      }
      Composite.add(engine.world, targets);

      // Fire projectile ball
      setTimeout(() => {
        const ball = Bodies.circle(80, height - 100, 16, {
          restitution: 0.6,
          density: 0.05,
          render: {
            fillStyle: "#e11d48",
            strokeStyle: "#ffffff",
            lineWidth: 2,
          },
        });
        Matter.Body.setVelocity(ball, { x: 20, y: -20 });
        Composite.add(engine.world, ball);
      }, 800);
    } else if (type === "pendulum") {
      const pinX = width / 2;
      const pinY = 160;
      const r1 = 120;
      const r2 = 120;

      const pin = Bodies.circle(pinX, pinY, 8, {
        isStatic: true,
        render: { fillStyle: "#ffc800" },
      });
      const bob1 = Bodies.circle(pinX + r1, pinY, 22, {
        restitution: 0.9,
        density: 0.015,
        render: { fillStyle: "#598bff" },
      });
      const bob2 = Bodies.circle(pinX + r1 + r2, pinY, 18, {
        restitution: 0.9,
        density: 0.012,
        render: { fillStyle: "#ffc800" },
      });

      const joint1 = Constraint.create({
        bodyA: pin,
        bodyB: bob1,
        stiffness: 0.9,
        render: {
          strokeStyle: isLightTheme
            ? "rgba(15, 23, 42, 0.3)"
            : "rgba(255, 255, 255, 0.4)",
          lineWidth: 4,
        },
      });

      const joint2 = Constraint.create({
        bodyA: bob1,
        bodyB: bob2,
        stiffness: 0.9,
        render: {
          strokeStyle: isLightTheme
            ? "rgba(217, 119, 6, 0.5)"
            : "rgba(255, 200, 0, 0.4)",
          lineWidth: 3,
        },
      });

      Composite.add(engine.world, [pin, bob1, bob2, joint1, joint2]);
    } else if (type === "collisions") {
      const balls = [];
      const colors = [
        "#ffc800",
        "#598bff",
        "#10b981",
        "#ef4444",
        "#a855f7",
        "#ec4899",
      ];
      for (let i = 0; i < 15; i++) {
        const radius = 15 + Math.random() * 20;
        const x = 50 + Math.random() * (width - 100);
        const y = 50 + Math.random() * (height - 100);
        const ball = Bodies.circle(x, y, radius, {
          restitution: 0.95,
          friction: 0.02,
          frictionAir: 0,
          render: { fillStyle: colors[i % colors.length] },
        });
        Matter.Body.setVelocity(ball, {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
        });
        balls.push(ball);
      }
      Composite.add(engine.world, balls);
    } else if (type === "orbit") {
      // Central Sun
      const sun = Bodies.circle(width / 2, height / 2, 40, {
        isStatic: true,
        render: { fillStyle: "#ffc800" },
      });

      // Planet 1
      const p1Dist = 130;
      const planet1 = Bodies.circle(width / 2, height / 2 - p1Dist, 10, {
        frictionAir: 0,
        render: { fillStyle: "#598bff" },
      });
      Matter.Body.setVelocity(planet1, { x: 5.2, y: 0 });

      // Planet 2
      const p2Dist = 200;
      const planet2 = Bodies.circle(width / 2, height / 2 + p2Dist, 14, {
        frictionAir: 0,
        render: { fillStyle: "#10b981" },
      });
      Matter.Body.setVelocity(planet2, { x: -4.0, y: 0 });

      Composite.add(engine.world, [sun, planet1, planet2]);

      const G = 135;
      Events.on(engine, "beforeUpdate", () => {
        const sunPos = sun.position;
        [planet1, planet2].forEach((planet) => {
          const deltaX = sunPos.x - planet.position.x;
          const deltaY = sunPos.y - planet.position.y;
          const distSq = deltaX * deltaX + deltaY * deltaY;
          const dist = Math.sqrt(distSq);
          if (dist > 5) {
            const forceMag = (G * planet.mass) / distSq;
            const force = {
              x: (deltaX / dist) * forceMag,
              y: (deltaY / dist) * forceMag,
            };
            Matter.Body.applyForce(planet, planet.position, force);
          }
        });
      });
    }

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Mouse drag controls
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        render: {
          visible: true,
          lineWidth: 1.5,
          strokeStyle: isLightTheme
            ? "rgba(15, 23, 42, 0.25)"
            : "rgba(255, 200, 0, 0.4)",
        },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    setIsRunning(true);
  };

  // Run simulation setup triggered by message
  const triggerSimulation = (type: string, descName: string) => {
    setActiveSim(type);
    setIsGenerating(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: `Simulation for **${descName}** generated successfully! \n\nYou can click the **Run** button to control the simulation execution, or click and drag objects on the canvas to interact with them in real time!`,
        },
      ]);
      setIsGenerating(false);
      initPhysics(type);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: "user", text },
    ]);
    setInputText("");

    // Detect type based on keywords
    let matchType = "collisions";
    let matchName = "Elastic Collisions";
    if (
      text.toLowerCase().includes("project") ||
      text.toLowerCase().includes("launch")
    ) {
      matchType = "projectile";
      matchName = "Projectile Motion";
    } else if (
      text.toLowerCase().includes("pendulum") ||
      text.toLowerCase().includes("swing")
    ) {
      matchType = "pendulum";
      matchName = "Double Pendulum Chaos";
    } else if (
      text.toLowerCase().includes("orbit") ||
      text.toLowerCase().includes("gravity") ||
      text.toLowerCase().includes("planet")
    ) {
      matchType = "orbit";
      matchName = "Planetary Orbit";
    }

    triggerSimulation(matchType, matchName);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "user",
        text: `Uploaded a ${type}: **${file.name}**`,
        file: { name: file.name, type },
      },
    ]);

    setIsGenerating(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: `I have parsed the ${
            type === "image" ? "image features" : "document data"
          } from **${file.name}**. Creating a custom physics configuration modeled on your source data...`,
        },
      ]);
      setIsGenerating(false);
      triggerSimulation(
        type === "image" ? "projectile" : "collisions",
        type === "image"
          ? "Projectile Motion (Custom)"
          : "Elastic Collisions (Custom)",
      );
    }, 1500);
  };

  const suggestions = [
    { label: "Projectile Launcher", icon: "☄️", type: "projectile" },
    { label: "Double Pendulum", icon: "⛓️", type: "pendulum" },
    { label: "Elastic Collisions", icon: "💥", type: "collisions" },
    { label: "Planetary Orbit", icon: "🪐", type: "orbit" },
  ];

  return (
    <div className="w-full lg:h-[calc(100vh-76px)] p-4 md:p-6 flex flex-col justify-between overflow-y-auto lg:overflow-hidden">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, "image")}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={(e) => handleFileChange(e, "document")}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-auto lg:h-full flex-grow overflow-visible lg:overflow-hidden pb-4 lg:pb-0">
        {/* Sleek Conversational AI Chatbot Panel */}
        <div
          className={`lg:col-span-5 ${isLightTheme ? "bg-white/80 border-slate-200/80 shadow-md" : "bg-[#1f2236]/80 border-[#ffc800]/10 shadow-2xl"} backdrop-blur-xl border rounded-2xl flex flex-col h-[550px] lg:h-full relative overflow-hidden`}
        >
          {/* Chatbot Header */}
          <div
            className={`p-4 bg-gradient-to-r from-[#ffc800]/5 to-transparent border-b ${isLightTheme ? "border-slate-100" : "border-white/5"} flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full border ${isLightTheme ? "border-slate-200" : "border-[#ffc800]/30"} overflow-hidden bg-white/5`}
              >
                <Lottie
                  animationData={mascotData}
                  loop={true}
                  className="w-full h-full scale-125"
                />
              </div>
              <div>
                <h3
                  className={`font-semibold ${isLightTheme ? "text-slate-800" : "text-white"} text-base`}
                >
                  MorPhysics Bot
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span
                    className={`text-xs ${isLightTheme ? "text-slate-500" : "text-gray-400"}`}
                  >
                    Online Physicist
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "init",
                    sender: "ai",
                    text: "Chat history cleared. Tell me what physics simulation you would like to run!",
                  },
                ])
              }
              className={`p-2 transition-colors rounded-lg ${isLightTheme ? "text-slate-400 hover:text-red-500 hover:bg-slate-100" : "text-gray-400 hover:text-red-400 hover:bg-white/5"}`}
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Log */}
          <div
            className={`flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin ${isLightTheme ? "scrollbar-thumb-slate-200" : "scrollbar-thumb-white/10"}`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in-up ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden border ${isLightTheme ? "border-slate-200" : "border-[#ffc800]/20"} flex-shrink-0 bg-white/5`}
                  >
                    <Lottie
                      animationData={mascotData}
                      loop={true}
                      className="w-full h-full scale-125"
                    />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#ffc800] to-[#ffa600] text-[#1c1e2e] font-medium rounded-tr-none shadow-lg"
                      : isLightTheme
                        ? "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                        : "bg-[#23273d] border border-white/5 text-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.file && (
                    <div
                      className={`flex items-center gap-2 mb-2 p-2 ${isLightTheme ? "bg-slate-200/50" : "bg-black/10"} rounded-lg`}
                    >
                      {msg.file.type === "image" ? (
                        <ImageIcon className="w-4 h-4 text-[#ffc800]" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#ffc800]" />
                      )}
                      <span className="font-semibold text-xs truncate max-w-[150px]">
                        {msg.file.name}
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3 justify-start animate-fade-in-up">
                <div
                  className={`w-8 h-8 rounded-full overflow-hidden border ${isLightTheme ? "border-slate-200" : "border-[#ffc800]/20"} flex-shrink-0 bg-white/5`}
                >
                  <Lottie
                    animationData={mascotData}
                    loop={true}
                    className="w-full h-full scale-125"
                  />
                </div>
                <div
                  className={`border rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-1.5 ${isLightTheme ? "bg-slate-100 border-slate-200" : "bg-[#23273d] border-white/10"}`}
                >
                  <div
                    className="w-2 h-2 bg-[#ffc800] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-[#ffc800] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-[#ffc800] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions scroll row */}
          <div
            className={`px-4 py-2 border-t ${isLightTheme ? "border-slate-100" : "border-white/5"} flex gap-2 overflow-x-auto scrollbar-none`}
          >
            {suggestions.map((sug) => (
              <button
                key={sug.type}
                onClick={() => triggerSimulation(sug.type, sug.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 ${
                  isLightTheme
                    ? "bg-slate-100 hover:bg-[#ffc800]/25 border-slate-200 text-slate-700 hover:text-slate-900"
                    : "bg-[#23273d] hover:bg-[#ffc800]/10 border-white/5 hover:border-[#ffc800]/30 text-gray-300 hover:text-white"
                } border rounded-full text-xs transition-all cursor-pointer flex-shrink-0`}
              >
                <span>{sug.icon}</span>
                <span>{sug.label}</span>
              </button>
            ))}
          </div>

          {/* Chat input box */}
          <div
            className={`p-4 border-t ${isLightTheme ? "border-slate-200 bg-slate-50" : "border-white/5 bg-[#151726]/40"} flex gap-2`}
          >
            <div className="flex gap-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className={`p-3 border rounded-xl transition-all cursor-pointer ${
                  isLightTheme
                    ? "bg-white border-slate-200 text-slate-600 hover:text-[#ffc800] hover:bg-[#ffc800]/10"
                    : "bg-[#23273d] border-white/5 hover:border-[#ffc800]/30 text-gray-300 hover:text-[#ffc800] hover:bg-[#ffc800]/10"
                }`}
                title="Upload Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => documentInputRef.current?.click()}
                className={`p-3 border rounded-xl transition-all cursor-pointer ${
                  isLightTheme
                    ? "bg-white border-slate-200 text-slate-600 hover:text-[#ffc800] hover:bg-[#ffc800]/10"
                    : "bg-[#23273d] border-white/5 hover:border-[#ffc800]/30 text-gray-300 hover:text-[#ffc800] hover:bg-[#ffc800]/10"
                }`}
                title="Upload Document"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI or type 'projectile motion'..."
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all pr-12 ${
                  isLightTheme
                    ? "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#ffc800]/70 focus:shadow-[0_0_15px_rgba(255,200,0,0.05)]"
                    : "bg-[#23273d] border-white/5 text-white placeholder-gray-500 focus:border-[#ffc800]/50 focus:shadow-[0_0_15px_rgba(255,200,0,0.1)]"
                }`}
              />
              <button
                onClick={handleSend}
                className="absolute right-1.5 top-1.5 p-1.5 bg-[#ffc800] hover:bg-[#ffa600] text-[#1c1e2e] rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Physics Canvas View */}
        <div
          className={`lg:col-span-7 ${isLightTheme ? "bg-white/80 border-slate-200 shadow-md" : "bg-[#1f2236]/80 border-[#ffc800]/10 shadow-2xl"} backdrop-blur-xl border rounded-2xl flex flex-col h-[450px] lg:h-full overflow-hidden mt-6 lg:mt-0`}
        >
          {/* Canvas Header Controls */}
          <div
            className={`p-4 bg-gradient-to-r from-transparent to-[#ffc800]/5 border-b ${isLightTheme ? "border-slate-100" : "border-white/5"} flex items-center justify-between`}
          >
            <h3
              className={`font-semibold ${isLightTheme ? "text-slate-800" : "text-white"} flex items-center gap-2 text-base`}
            >
              <Sparkles className="w-4 h-4 text-[#ffc800]" />
              Simulation Canvas
            </h3>
            <div className="flex items-center gap-3">
              {activeSim && (
                <>
                  <button
                    onClick={togglePlay}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                      isRunning
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                        : "bg-[#ffc800] text-[#1c1e2e] hover:bg-[#ffa600]"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Run
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => initPhysics(activeSim)}
                    className={`p-2 border rounded-lg transition-all cursor-pointer ${
                      isLightTheme
                        ? "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                        : "bg-[#23273d] border-white/5 hover:border-[#ffc800]/30 text-gray-300 hover:text-white"
                    }`}
                    title="Reset Physics"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Live MatterJS viewport */}
          <div
            className={`flex-grow ${isLightTheme ? "bg-[#f8fafc]" : "bg-[#151726]"} relative overflow-hidden flex items-center justify-center`}
          >
            {activeSim ? (
              <div ref={sceneRef} className="w-full h-full" />
            ) : (
              <div className="text-center space-y-4 p-8 max-w-sm animate-fade-in-up">
                <div
                  className={`w-16 h-16 mx-auto ${isLightTheme ? "bg-[#ffc800]/10 border-[#ffc800]/30" : "bg-[#ffc800]/5 border-[#ffc800]/20"} border rounded-2xl flex items-center justify-center shadow-lg relative`}
                >
                  <Play className="w-8 h-8 text-[#ffc800] fill-current animate-pulse" />
                  <div className="absolute inset-0 bg-[#ffc800]/10 blur-xl rounded-full" />
                </div>
                <div>
                  <h4
                    className={`font-semibold ${isLightTheme ? "text-slate-800" : "text-white"} text-base`}
                  >
                    Simulation is Idle
                  </h4>
                  <p
                    className={`text-sm ${isLightTheme ? "text-slate-500" : "text-gray-400"} mt-2`}
                  >
                    Enter a prompt or click one of the quick suggestions in the
                    chat to generate and run a live physics simulation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Dashboard */}
          <div
            className={`grid grid-cols-4 gap-px ${isLightTheme ? "bg-slate-200 border-t border-slate-200" : "bg-white/5 border-t border-white/5"}`}
          >
            <div
              className={`p-3 ${isLightTheme ? "bg-white" : "bg-[#151726]/80"} text-center`}
            >
              <span
                className={`block text-[10px] uppercase tracking-wider ${isLightTheme ? "text-slate-500" : "text-gray-400"} font-semibold`}
              >
                Gravity
              </span>
              <span className="block text-sm font-bold text-[#ffc800] mt-1">
                {telemetry.gravity}
              </span>
            </div>
            <div
              className={`p-3 ${isLightTheme ? "bg-white" : "bg-[#151726]/80"} text-center`}
            >
              <span
                className={`block text-[10px] uppercase tracking-wider ${isLightTheme ? "text-slate-500" : "text-gray-400"} font-semibold`}
              >
                Active Bodies
              </span>
              <span className="block text-sm font-bold text-[#598bff] mt-1">
                {telemetry.bodies}
              </span>
            </div>
            <div
              className={`p-3 ${isLightTheme ? "bg-white" : "bg-[#151726]/80"} text-center`}
            >
              <span
                className={`block text-[10px] uppercase tracking-wider ${isLightTheme ? "text-slate-500" : "text-gray-400"} font-semibold`}
              >
                Total Energy
              </span>
              <span className="block text-sm font-bold text-emerald-400 mt-1">
                {telemetry.energy}
              </span>
            </div>
            <div
              className={`p-3 ${isLightTheme ? "bg-white" : "bg-[#151726]/80"} text-center`}
            >
              <span
                className={`block text-[10px] uppercase tracking-wider ${isLightTheme ? "text-slate-500" : "text-gray-400"} font-semibold`}
              >
                Engine FPS
              </span>
              <span className="block text-sm font-bold text-purple-400 mt-1">
                {telemetry.fps}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
