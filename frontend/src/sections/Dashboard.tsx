import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import {
  Atom,
  User,
  Shield,
  LogOut,
  Trash2,
  Send,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

export function Dashboard({ currentHash }: { currentHash: string }) {
  // Determine active tab from routing hash
  const activeTab = currentHash === "#dashboard-user"
    ? "user"
    : currentHash === "#dashboard-policy"
    ? "policy"
    : "lab";

  const setActiveTab = (tab: "lab" | "user" | "policy") => {
    if (tab === "lab") window.location.hash = "#dashboard";
    else if (tab === "user") window.location.hash = "#dashboard-user";
    else if (tab === "policy") window.location.hash = "#dashboard-policy";
  };

  // Tooltip hover states
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! 👋 I am your MorPhysics AI Assistant. I can build and explore interactive physics models in real time.\n\nChoose one of the quick setups below or describe a custom physics problem to get started!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Simulation Canvas State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<
    "none" | "projectile" | "pendulum" | "collisions" | "orbit"
  >("none");
  const [gravity, setGravity] = useState(9.8);
  const [activeBodies, setActiveBodies] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0.0);
  const [fps, setFps] = useState(60);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Physics animation variables
  const projVariables = useRef({
    x: 50,
    y: 250,
    vx: 180,
    vy: -200,
    projectiles: [] as Array<{ x: number; y: number; vx: number; vy: number; age: number }>,
    spawnTimer: 0,
  });

  const pendVariables = useRef({
    theta1: Math.PI / 3,
    theta2: Math.PI / 4,
    omega1: 0.0,
    omega2: 0.0,
    trail: [] as Array<{ x: number; y: number }>,
  });

  const collisionVariables = useRef({
    balls: [] as Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      mass: number;
    }>,
  });

  const orbitVariables = useRef({
    anglePlanet: 0,
    angleMoon: 0,
    trail: [] as Array<{ x: number; y: number }>,
  });

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Scenario trigger
  const handleSelectScenario = (scenario: "projectile" | "pendulum" | "collisions" | "orbit") => {
    setActiveScenario(scenario);
    setIsPlaying(true);

    let scenarioName = "";
    let botReply = "";

    switch (scenario) {
      case "projectile":
        scenarioName = "Projectile Launcher";
        botReply = "Sure! 🚀 Setting up a **Projectile Launcher** scenario for you. You can see the balls firing from a ground launcher on the left and tracking their parabolic trajectories. Adjust gravity below to watch how it impacts flight path!";
        break;
      case "pendulum":
        scenarioName = "Double Pendulum";
        botReply = "Absolutely! 🔬 Initializing a **Double Pendulum** simulation. This exhibits classic deterministic chaos. The gold trail traces the chaotic trajectory of the outer mass. Try pausing or changing gravity parameters!";
        break;
      case "collisions":
        scenarioName = "Elastic Collisions";
        botReply = "Perfect! 💥 Creating a system with **Elastic Collisions**. These spheres exchange momentum during collisions while preserving kinetic energy. The total energy stays conserved!";
        break;
      case "orbit":
        scenarioName = "Planetary Orbit";
        botReply = "Understood! 🪐 Launching **Planetary Orbit** simulation. A central star exerts gravitational force, keeping a planet and its orbiting satellite locked in stable orbit. Check the orbital path lines!";
        break;
    }

    const newMessages: Message[] = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: `Launch the ${scenarioName} simulation`,
        timestamp: new Date(),
      },
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: new Date(),
      },
    ];
    setMessages(newMessages);
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Hi there! 👋 I am your MorPhysics AI Assistant. I can build and explore interactive physics models in real time.\n\nChoose one of the quick setups below or describe a custom physics problem to get started!",
        timestamp: new Date(),
      },
    ]);
  };

  // Send input message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const newMessages: Message[] = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userText,
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);

    // Mock bot reply
    setTimeout(() => {
      let botResponseText = `I've analyzed your prompt: "${userText}". ⚙️ Preparing a simulation model suited for this query... Done! Click play to run the simulation.`;
      
      // Check if they typed keywords
      const lowerText = userText.toLowerCase();
      if (lowerText.includes("projectile") || lowerText.includes("bullet") || lowerText.includes("launch")) {
        setActiveScenario("projectile");
        setIsPlaying(true);
        botResponseText = "Recognized projectile motion command! 🚀 Setting up a Projectile Launcher simulation. Play to start.";
      } else if (lowerText.includes("pendulum") || lowerText.includes("swing")) {
        setActiveScenario("pendulum");
        setIsPlaying(true);
        botResponseText = "Recognized pendulum command! 🔬 Setting up a Double Pendulum simulation. Play to start.";
      } else if (lowerText.includes("collision") || lowerText.includes("bounce") || lowerText.includes("elastic")) {
        setActiveScenario("collisions");
        setIsPlaying(true);
        botResponseText = "Recognized collision command! 💥 Setting up a gas elastic collision container. Play to start.";
      } else if (lowerText.includes("orbit") || lowerText.includes("gravity") || lowerText.includes("planet") || lowerText.includes("space")) {
        setActiveScenario("orbit");
        setIsPlaying(true);
        botResponseText = "Recognized orbital command! 🪐 Setting up a planetary solar gravity loop. Play to start.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponseText,
          timestamp: new Date(),
        },
      ]);
    }, 800);
  };

  // Setup/Reset variables on active scenario changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Reset projectile launcher variables
    projVariables.current = {
      x: 40,
      y: h - 40,
      vx: 190,
      vy: -230,
      projectiles: [],
      spawnTimer: 0,
    };

    // Reset pendulum angles
    pendVariables.current = {
      theta1: Math.PI / 3,
      theta2: Math.PI / 4,
      omega1: 0.0,
      omega2: 0.0,
      trail: [],
    };

    // Initialize collision balls
    const colors = ["#ffc800", "#6C8CFF", "#FF7A9E", "#cea945", "#5eead4", "#c084fc"];
    const balls = [];
    for (let i = 0; i < 9; i++) {
      const radius = 16 + (i % 3) * 4;
      balls.push({
        x: 80 + Math.random() * (w - 160),
        y: 80 + Math.random() * (h - 160),
        r: radius,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: colors[i % colors.length],
        mass: radius * radius * 0.01,
      });
    }
    collisionVariables.current = { balls };

    // Reset orbital values
    orbitVariables.current = {
      anglePlanet: 0,
      angleMoon: 0,
      trail: [],
    };

    // Set stats
    if (activeScenario === "none") {
      setActiveBodies(0);
      setTotalEnergy(0.0);
    } else if (activeScenario === "projectile") {
      setActiveBodies(0);
      setTotalEnergy(0.0);
    } else if (activeScenario === "pendulum") {
      setActiveBodies(2);
      setTotalEnergy(45.2);
    } else if (activeScenario === "collisions") {
      setActiveBodies(9);
      setTotalEnergy(120.5);
    } else if (activeScenario === "orbit") {
      setActiveBodies(3); // Sun, Planet, Moon
      setTotalEnergy(340.8);
    }
  }, [activeScenario]);

  // Physics loop drawing & updating
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = lastTime;

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1); // cap dt at 100ms
      lastTime = now;

      // Calculate FPS
      frameCount++;
      if (now - fpsInterval >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsInterval)));
        frameCount = 0;
        fpsInterval = now;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      if (activeScenario === "none") {
        // Idle view is drawn outside canvas (using DOM elements),
        // but let's draw some ambient grid glow in canvas.
        drawGrid(ctx, w, h);
      } else {
        // Active Scenario Rendering
        drawGrid(ctx, w, h);

        if (activeScenario === "projectile") {
          const vars = projVariables.current;

          // Update physics
          if (isPlaying) {
            vars.spawnTimer += dt;
            if (vars.spawnTimer >= 1.2) {
              vars.projectiles.push({
                x: vars.x,
                y: vars.y - 10,
                vx: vars.vx + (Math.random() - 0.5) * 20,
                vy: vars.vy + (Math.random() - 0.5) * 30,
                age: 0,
              });
              vars.spawnTimer = 0;
            }

            // Update projectiles
            vars.projectiles.forEach((p) => {
              p.vy += gravity * 20 * dt; // gravity in pixels
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.age += dt;
            });

            // Filter out projectiles that hit ground or are too old
            vars.projectiles = vars.projectiles.filter((p) => {
              return p.y < h - 15 && p.x < w && p.x > 0;
            });

            setActiveBodies(vars.projectiles.length);
            
            // Calculate mock energy
            let energy = 0;
            vars.projectiles.forEach((p) => {
              const velocitySq = p.vx * p.vx + p.vy * p.vy;
              energy += 0.5 * 2.5 * (velocitySq / 2000); // normalized
            });
            setTotalEnergy(parseFloat(energy.toFixed(1)));
          }

          // Draw Cannon base/nozzle
          ctx.save();
          ctx.translate(vars.x, vars.y);
          const angle = Math.atan2(vars.vy, vars.vx);
          ctx.rotate(angle);
          ctx.fillStyle = "#454C70";
          ctx.strokeStyle = "#ffc800";
          ctx.lineWidth = 2;
          ctx.fillRect(0, -10, 30, 20);
          ctx.strokeRect(0, -10, 30, 20);
          ctx.restore();

          // Cannon Base circle
          ctx.beginPath();
          ctx.arc(vars.x, vars.y, 14, 0, Math.PI * 2);
          ctx.fillStyle = "#23273D";
          ctx.fill();
          ctx.strokeStyle = "#ffc800";
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw Projectiles
          vars.projectiles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#ffc800";
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Trail
            ctx.beginPath();
            ctx.moveTo(p.x - (p.vx * 0.05), p.y - (p.vy * 0.05));
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = "rgba(255, 200, 0, 0.4)";
            ctx.lineWidth = 3;
            ctx.stroke();
          });

          // Draw ground Line
          ctx.beginPath();
          ctx.moveTo(0, h - 15);
          ctx.lineTo(w, h - 15);
          ctx.strokeStyle = "rgba(69, 76, 112, 0.4)";
          ctx.lineWidth = 4;
          ctx.stroke();

        } else if (activeScenario === "pendulum") {
          const vars = pendVariables.current;

          // Double pendulum dynamics equations (approximate numeric solver)
          if (isPlaying) {
            const gVal = gravity * 0.5; // scaled gravity
            const r1 = 80;
            const r2 = 70;
            const m1 = 10;
            const m2 = 10;

            const delta = vars.theta1 - vars.theta2;

            // Denominator
            const den1 = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * vars.theta1 - 2 * vars.theta2));
            const num1 = -gVal * (2 * m1 + m2) * Math.sin(vars.theta1) - m2 * gVal * Math.sin(vars.theta1 - 2 * vars.theta2) - 2 * Math.sin(delta) * m2 * (vars.omega2 * vars.omega2 * r2 + vars.omega1 * vars.omega1 * r1 * Math.cos(delta));
            const alpha1 = num1 / den1;

            const den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * vars.theta1 - 2 * vars.theta2));
            const num2 = 2 * Math.sin(delta) * (vars.omega1 * vars.omega1 * r1 * (m1 + m2) + gVal * (m1 + m2) * Math.cos(vars.theta1) + vars.omega2 * vars.omega2 * r2 * m2 * Math.cos(delta));
            const alpha2 = num2 / den2;

            vars.omega1 += alpha1 * dt * 50;
            vars.omega2 += alpha2 * dt * 50;
            vars.theta1 += vars.omega1 * dt * 5;
            vars.theta2 += vars.omega2 * dt * 5;

            // Damping slightly
            vars.omega1 *= 0.999;
            vars.omega2 *= 0.999;
          }

          // Pivot point
          const px = w / 2;
          const py = 100;
          const r1 = 80;
          const r2 = 70;

          // Coords
          const x1 = px + r1 * Math.sin(vars.theta1);
          const y1 = py + r1 * Math.cos(vars.theta1);

          const x2 = x1 + r2 * Math.sin(vars.theta2);
          const y2 = y1 + r2 * Math.cos(vars.theta2);

          // Add trail
          if (isPlaying) {
            vars.trail.push({ x: x2, y: y2 });
            if (vars.trail.length > 120) vars.trail.shift();
          }

          // Draw trail
          if (vars.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(vars.trail[0].x, vars.trail[0].y);
            for (let i = 1; i < vars.trail.length; i++) {
              ctx.lineTo(vars.trail[i].x, vars.trail[i].y);
            }
            ctx.strokeStyle = "rgba(255, 200, 0, 0.55)";
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }

          // Draw strings
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "#454C70";
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw pivot
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#23273D";
          ctx.fill();
          ctx.strokeStyle = "#ffc800";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Bob 1
          ctx.beginPath();
          ctx.arc(x1, y1, 14, 0, Math.PI * 2);
          ctx.fillStyle = "#6C8CFF";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw Bob 2
          ctx.beginPath();
          ctx.arc(x2, y2, 12, 0, Math.PI * 2);
          ctx.fillStyle = "#FF7A9E";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Compute Kinetic Energy (simulated)
          if (isPlaying) {
            const v1sq = (r1 * vars.omega1) * (r1 * vars.omega1);
            const v2sq = v1sq + (r2 * vars.omega2) * (r2 * vars.omega2) + 2 * (r1 * vars.omega1) * (r2 * vars.omega2) * Math.cos(vars.theta1 - vars.theta2);
            const ke = 0.5 * 10 * v1sq * 0.001 + 0.5 * 10 * v2sq * 0.001;
            setTotalEnergy(parseFloat((ke * 10).toFixed(1)));
          }

        } else if (activeScenario === "collisions") {
          const vars = collisionVariables.current;

          // Update physics
          if (isPlaying) {
            vars.balls.forEach((ball) => {
              ball.x += ball.vx * dt * 40;
              ball.y += ball.vy * dt * 40;

              // Wall bounce
              if (ball.x - ball.r < 0) {
                ball.x = ball.r;
                ball.vx = -ball.vx;
              } else if (ball.x + ball.r > w) {
                ball.x = w - ball.r;
                ball.vx = -ball.vx;
              }

              if (ball.y - ball.r < 0) {
                ball.y = ball.r;
                ball.vy = -ball.vy;
              } else if (ball.y + ball.r > h) {
                ball.y = h - ball.r;
                ball.vy = -ball.vy;
              }
            });

            // Ball collisions
            for (let i = 0; i < vars.balls.length; i++) {
              for (let j = i + 1; j < vars.balls.length; j++) {
                const b1 = vars.balls[i];
                const b2 = vars.balls[j];
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const dist = Math.hypot(dx, dy);

                if (dist < b1.r + b2.r) {
                  // Collision normal
                  const nx = dx / dist;
                  const ny = dy / dist;

                  // Relative velocity
                  const kx = b1.vx - b2.vx;
                  const ky = b1.vy - b2.vy;
                  const velAlongNormal = kx * nx + ky * ny;

                  if (velAlongNormal > 0) {
                    // Impulse scalar (elastic e=1)
                    const impulse = (2 * velAlongNormal) / (b1.mass + b2.mass);
                    
                    b1.vx -= impulse * b2.mass * nx;
                    b1.vy -= impulse * b2.mass * ny;
                    b2.vx += impulse * b1.mass * nx;
                    b2.vy += impulse * b1.mass * ny;
                  }

                  // Separate overlaps
                  const overlap = b1.r + b2.r - dist;
                  b1.x -= overlap * 0.5 * nx;
                  b1.y -= overlap * 0.5 * ny;
                  b2.x += overlap * 0.5 * nx;
                  b2.y += overlap * 0.5 * ny;
                }
              }
            }

            // Calculate total Energy
            let energy = 0;
            vars.balls.forEach((b) => {
              const speedSq = b.vx * b.vx + b.vy * b.vy;
              energy += 0.5 * b.mass * speedSq;
            });
            setTotalEnergy(parseFloat((energy * 4).toFixed(1)));
          }

          // Draw Balls
          vars.balls.forEach((b) => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Vector arrow
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x + b.vx * 3, b.y + b.vy * 3);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 2;
            ctx.stroke();
          });

        } else if (activeScenario === "orbit") {
          const vars = orbitVariables.current;

          if (isPlaying) {
            vars.anglePlanet += dt * 0.5 * (10 / gravity);
            vars.angleMoon += dt * 2.2;
          }

          const centerX = w / 2;
          const centerY = h / 2;
          const orbitR = 120;
          const moonOrbitR = 25;

          const planetX = centerX + orbitR * Math.cos(vars.anglePlanet);
          const planetY = centerY + orbitR * Math.sin(vars.anglePlanet);

          const moonX = planetX + moonOrbitR * Math.cos(vars.angleMoon);
          const moonY = planetY + moonOrbitR * Math.sin(vars.angleMoon);

          if (isPlaying) {
            vars.trail.push({ x: planetX, y: planetY });
            if (vars.trail.length > 180) vars.trail.shift();
          }

          // Draw planet orbit dashed line
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitR, 0, Math.PI * 2);
          ctx.setLineDash([5, 6]);
          ctx.strokeStyle = "rgba(69, 76, 112, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw planet trail
          if (vars.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(vars.trail[0].x, vars.trail[0].y);
            for (let i = 1; i < vars.trail.length; i++) {
              ctx.lineTo(vars.trail[i].x, vars.trail[i].y);
            }
            ctx.strokeStyle = "rgba(94, 234, 212, 0.45)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Draw Sun (glow)
          const sunGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 34);
          sunGlow.addColorStop(0, "#ffe580");
          sunGlow.addColorStop(0.3, "#ffc800");
          sunGlow.addColorStop(1, "rgba(255, 200, 0, 0)");
          ctx.beginPath();
          ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
          ctx.fillStyle = sunGlow;
          ctx.fill();

          // Sun Core
          ctx.beginPath();
          ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
          ctx.fillStyle = "#ffc800";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Planet
          ctx.beginPath();
          ctx.arc(planetX, planetY, 11, 0, Math.PI * 2);
          ctx.fillStyle = "#6C8CFF";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw moon orbit path
          ctx.beginPath();
          ctx.arc(planetX, planetY, moonOrbitR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw Moon
          ctx.beginPath();
          ctx.arc(moonX, moonY, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#b6bcda";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Mock energy based on orbital velocity
          if (isPlaying) {
            const orbitVel = 2 * Math.PI * orbitR * 0.5 * (10 / gravity);
            const ke = 0.5 * 6.5 * orbitVel * orbitVel * 0.005;
            setTotalEnergy(parseFloat((ke * 10).toFixed(1)));
          }
        }
      }

      if (isPlaying || activeScenario === "none") {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying || activeScenario === "none") {
      animationFrameRef.current = requestAnimationFrame(render);
    } else {
      // Draw static frame
      drawGrid(ctx, canvas.width, canvas.height);
      render();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, activeScenario, gravity]);

  // Handle Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvasContainerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = "rgba(69, 76, 112, 0.08)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  return (
    <section className="relative h-screen bg-indigo-50/40 dark:bg-slate-ink text-slate-deep dark:text-white transition-colors duration-500 overflow-hidden font-sans">
      {/* Background aurora gradients */}
      <div className="aurora-blob right-[-10%] top-[-5%] h-[300px] w-[300px] bg-gold/15 dark:bg-gold/8 pointer-events-none" />
      <div className="aurora-blob left-[-10%] bottom-[-5%] h-[300px] w-[300px] bg-indigo-500/10 dark:bg-indigo-500/8 pointer-events-none" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10 z-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Workspace Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 nav-glass py-2.5 h-16 flex items-center justify-between px-6 shadow-sm">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
          }}
          className="group flex items-center gap-1.5 z-10"
        >
          <div className="h-9 w-9 flex items-center justify-center -ml-1">
            <Player
              autoplay
              loop
              src="/assets/Mascot.json"
              style={{ height: "36px", width: "36px" }}
            />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-deep dark:text-white transition-colors">
            Morphysics
          </span>
        </a>

        {/* Center Icons Navigation Pill */}
        <nav className="relative h-11 flex items-center overflow-visible rounded-full border border-slate-deep/10 bg-white/50 shadow-sm dark:border-white/10 dark:bg-white/5 px-2.5 z-10">
          <ul className="flex items-center gap-2">
            {/* Tab: Interactive Lab */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setActiveTab("lab")}
                onMouseEnter={() => setHoveredTab("lab")}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-all duration-300",
                  activeTab === "lab"
                    ? "bg-gold text-slate-deep shadow-md font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                <Atom className="size-5" />
              </button>

              <AnimatePresence>
                {hoveredTab === "lab" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-slate-deep dark:bg-white text-white dark:text-slate-deep text-xs font-bold whitespace-nowrap shadow-md pointer-events-none"
                  >
                    Interactive Lab
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Tab: User Profile */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                onMouseEnter={() => setHoveredTab("user")}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-all duration-300",
                  activeTab === "user"
                    ? "bg-gold text-slate-deep shadow-md font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                <User className="size-5" />
              </button>

              <AnimatePresence>
                {hoveredTab === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-slate-deep dark:bg-white text-white dark:text-slate-deep text-xs font-bold whitespace-nowrap shadow-md pointer-events-none"
                  >
                    User Profile
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Tab: Policies */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setActiveTab("policy")}
                onMouseEnter={() => setHoveredTab("policy")}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-all duration-300",
                  activeTab === "policy"
                    ? "bg-gold text-slate-deep shadow-md font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                <Shield className="size-5" />
              </button>

              <AnimatePresence>
                {hoveredTab === "policy" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-slate-deep dark:bg-white text-white dark:text-slate-deep text-xs font-bold whitespace-nowrap shadow-md pointer-events-none"
                  >
                    Privacy Policy
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>

        {/* Right Side: Toggle + Logout */}
        <div className="flex items-center gap-3.5 z-10">
          <ThemeToggle className="size-9 p-1 shadow-sm" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = "";
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-deep/10 bg-white/40 dark:border-white/10 dark:bg-white/5 text-slate-gray dark:text-white/70 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transition-all duration-300 text-xs font-bold cursor-pointer"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container below navbar */}
      <div className="relative z-10 h-[calc(100vh-4rem)] mt-16 overflow-hidden">
        {activeTab === "lab" ? (
          // PAGE: INTERACTIVE LAB (Split view fitting screen height)
          <div className="h-full w-full flex flex-col lg:flex-row gap-5 p-5 xl:p-6 overflow-hidden max-w-7xl mx-auto">
            
            {/* Left Chatbot Column */}
            <div className="flex flex-col w-full lg:w-[420px] xl:w-[460px] h-[360px] lg:h-full bg-white dark:bg-[#1f2236]/90 border border-slate-deep/5 dark:border-white/5 shadow-md rounded-3xl overflow-hidden relative transition-colors duration-500">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-deep/5 dark:border-white/5 bg-white/50 dark:bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="size-9 flex items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 p-0.5 border border-gold/15">
                    <Player
                      autoplay
                      loop
                      src="/assets/Mascot.json"
                      style={{ height: "30px", width: "30px" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold text-slate-deep dark:text-white">
                      MorPhysics Bot
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-slate-gray/80 dark:text-white/55 font-semibold">
                        Online Physicist
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset chat button */}
                <button
                  type="button"
                  title="Clear chat history"
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg border border-slate-deep/5 bg-slate-soft/30 dark:border-white/5 dark:bg-white/5 text-slate-gray dark:text-white/60 hover:text-red-400 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 text-sm",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender === "bot" && (
                      <div className="size-7 rounded-full bg-gold/10 dark:bg-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold shrink-0 mt-0.5">
                        M
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-line leading-relaxed",
                        msg.sender === "user"
                          ? "bg-gold/15 dark:bg-gold/10 border border-gold/20 dark:border-gold/10 text-slate-deep dark:text-white font-medium rounded-tr-none"
                          : "bg-indigo-50/50 dark:bg-slate-ink/50 border border-slate-deep/5 dark:border-white/5 text-slate-deep dark:text-white/90 rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions pills */}
              <div className="px-4 py-2 border-t border-slate-deep/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-ink/30 overflow-x-auto flex items-center gap-2 scrollbar-none whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSelectScenario("projectile")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all shrink-0",
                    activeScenario === "projectile"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-slate-deep/5 dark:border-white/5 bg-white dark:bg-slate-ink/80 text-slate-gray dark:text-white/70 hover:border-gold/50 hover:text-gold"
                  )}
                >
                  <span className="text-[9px]">🔴</span> Projectile Launcher
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectScenario("pendulum")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all shrink-0",
                    activeScenario === "pendulum"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-slate-deep/5 dark:border-white/5 bg-white dark:bg-slate-ink/80 text-slate-gray dark:text-white/70 hover:border-gold/50 hover:text-gold"
                  )}
                >
                  <span className="text-[9px]">🔬</span> Double Pendulum
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectScenario("collisions")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all shrink-0",
                    activeScenario === "collisions"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-slate-deep/5 dark:border-white/5 bg-white dark:bg-slate-ink/80 text-slate-gray dark:text-white/70 hover:border-gold/50 hover:text-gold"
                  )}
                >
                  <span className="text-[9px]">💥</span> Elastic Collisions
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectScenario("orbit")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all shrink-0",
                    activeScenario === "orbit"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-slate-deep/5 dark:border-white/5 bg-white dark:bg-slate-ink/80 text-slate-gray dark:text-white/70 hover:border-gold/50 hover:text-gold"
                  )}
                >
                  <span className="text-[9px]">🪐</span> Planetary Orbit
                </button>
              </div>

              {/* Chat Input Field Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236] flex items-center gap-2.5"
              >
                <div className="flex items-center gap-1">
                  {/* Upload Image */}
                  <button
                    type="button"
                    title="Upload image analysis"
                    className="p-2 rounded-xl text-slate-gray/70 hover:text-gold dark:text-white/50 dark:hover:text-gold transition-colors"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                  {/* Attach files */}
                  <button
                    type="button"
                    title="Attach data file"
                    className="p-2 rounded-xl text-slate-gray/70 hover:text-gold dark:text-white/50 dark:hover:text-gold transition-colors"
                  >
                    <Paperclip className="size-5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask AI or type 'projectile motion'..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/40 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-sm transition-all"
                />

                {/* Send action */}
                <button
                  type="submit"
                  className="size-10 rounded-2xl bg-gold hover:bg-gold-hover text-slate-deep flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="size-4.5" />
                </button>
              </form>

            </div>

            {/* Right Simulation Column */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1f2236]/90 border border-slate-deep/5 dark:border-white/5 shadow-md rounded-3xl overflow-hidden transition-colors duration-500">
              
              {/* Simulation Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-deep/5 dark:border-white/5 bg-white/50 dark:bg-white/2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-gold fill-gold/20" />
                  <span className="font-sans text-sm font-extrabold text-slate-deep dark:text-white">
                    Simulation Canvas
                  </span>
                </div>

                {/* Scenario details or resets */}
                {activeScenario !== "none" && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all",
                        isPlaying
                          ? "border-amber-500 bg-amber-500/10 text-amber-500"
                          : "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      {isPlaying ? "Pause" : "Resume"}
                    </button>
                    <button
                      type="button"
                      title="Reset scenario"
                      onClick={() => {
                        // Triggers useEffect reset
                        const prev = activeScenario;
                        setActiveScenario("none");
                        setTimeout(() => setActiveScenario(prev), 20);
                      }}
                      className="p-1.5 rounded-xl border border-slate-deep/5 bg-slate-soft/30 dark:border-white/5 dark:bg-white/5 text-slate-gray dark:text-white/60 hover:text-gold dark:hover:text-gold transition-colors"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Canvas Physics Workspace */}
              <div
                ref={canvasContainerRef}
                className="flex-1 relative bg-slate-soft/[0.1] dark:bg-slate-ink/[0.3] overflow-hidden flex items-center justify-center"
              >
                {/* HTML5 Canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Idle overlay when no scenario is running */}
                {activeScenario === "none" && (
                  <div className="relative z-10 flex flex-col items-center max-w-sm text-center p-6 bg-white/30 dark:bg-[#1a1d2e]/30 backdrop-blur-[2px] rounded-3xl border border-slate-deep/5 dark:border-white/5 shadow-sm">
                    {/* Big squircle Play button */}
                    <button
                      type="button"
                      onClick={() => handleSelectScenario("projectile")}
                      className="size-16 rounded-[1.75rem] bg-gold/15 dark:bg-gold/10 border border-gold/30 hover:bg-gold hover:text-slate-deep text-gold flex items-center justify-center transition-all duration-350 hover:shadow-lg hover:shadow-gold/20 hover:scale-105 mb-4 group cursor-pointer"
                    >
                      <Play className="size-7 fill-current group-hover:scale-110 transition-transform" />
                    </button>
                    <h4 className="font-sans text-lg font-bold text-slate-deep dark:text-white mb-2">
                      Simulation is Idle
                    </h4>
                    <p className="text-xs text-slate-gray/80 dark:text-white/50 leading-relaxed font-sans px-4">
                      Enter a prompt or click one of the quick suggestions in the chat to generate and run a live physics simulation.
                    </p>
                  </div>
                )}
              </div>

              {/* Simulation Status Metrics Bar */}
              <div className="grid grid-cols-4 border-t border-slate-deep/5 dark:border-white/5 bg-white/50 dark:bg-white/2 select-none">
                {/* Gravity */}
                <div className="flex flex-col items-center justify-center py-3.5 border-r border-slate-deep/5 dark:border-white/5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40 mb-1">
                    Gravity
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-gold">
                    {gravity.toFixed(1)} m/s²
                  </span>
                  {activeScenario !== "none" && (
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={0.5}
                      value={gravity}
                      onChange={(e) => setGravity(parseFloat(e.target.value))}
                      className="w-16 sm:w-20 h-1 mt-1.5 accent-gold cursor-pointer"
                    />
                  )}
                </div>
                {/* Active Bodies */}
                <div className="flex flex-col items-center justify-center py-3.5 border-r border-slate-deep/5 dark:border-white/5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40 mb-1">
                    Active Bodies
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-sky-400">
                    {activeBodies}
                  </span>
                </div>
                {/* Total Energy */}
                <div className="flex flex-col items-center justify-center py-3.5 border-r border-slate-deep/5 dark:border-white/5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40 mb-1">
                    Total Energy
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                    {totalEnergy} J
                  </span>
                </div>
                {/* Engine FPS */}
                <div className="flex flex-col items-center justify-center py-3.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40 mb-1">
                    Engine FPS
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-purple-400">
                    {activeScenario !== "none" && isPlaying ? fps : 0}
                  </span>
                </div>
              </div>

            </div>

          </div>
        ) : activeTab === "user" ? (
          // PAGE: USER PROFILE SUBPAGE
          <div className="h-full w-full overflow-y-auto p-6 md:p-12 flex items-center justify-center">
            <Reveal>
              <div className="card-surface relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90 transition-all max-w-2xl w-full mx-auto">
                {/* Decorative glow lights inside card */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  {/* Leaf-shaped Avatar Frame with Gold Border */}
                  <div className="relative shrink-0 h-28 w-28">
                    <div className="h-full w-full rounded-full overflow-hidden bg-indigo-500/10 dark:bg-indigo-500/20 border-4 border-gold/40 shadow-lg flex items-center justify-center text-4xl text-gold font-bold">
                      JD
                    </div>
                  </div>

                  {/* Profile details */}
                  <div className="text-center sm:text-left">
                    <h3 className="font-sans text-2xl font-bold text-slate-deep dark:text-white mb-1.5">
                      Jane Doe
                    </h3>
                    <p className="text-sm text-gold font-bold mb-4 uppercase tracking-wider">
                      Physics Student
                    </p>
                    <div className="space-y-1.5 text-sm text-slate-gray dark:text-white/70 font-sans">
                      <div>
                        <span className="font-semibold text-slate-deep dark:text-white">Email:</span> jane.doe@morphysics.io
                      </div>
                      <div>
                        <span className="font-semibold text-slate-deep dark:text-white">Institution:</span> Ho Chi Minh City University of Technology (HCMUT)
                      </div>
                      <div>
                        <span className="font-semibold text-slate-deep dark:text-white">Major:</span> Computer Science & Artificial Intelligence
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-card Stats row */}
                <div className="mt-8 pt-6 border-t border-slate-deep/10 dark:border-white/10 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-slate-deep dark:text-white">14</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-gray/70 dark:text-white/40 uppercase mt-1">
                      Models Built
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-deep dark:text-white">3</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-gray/70 dark:text-white/40 uppercase mt-1">
                      Active Labs
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-deep dark:text-white">18.5h</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-gray/70 dark:text-white/40 uppercase mt-1">
                      Simulation Time
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
        ) : (
          // PAGE: POLICY SUBPAGE
          <div className="h-full w-full overflow-y-auto p-6 md:p-12 flex items-center justify-center">
            <Reveal>
              <div className="card-surface relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90 transition-all max-w-3xl w-full mx-auto">
                <h2 className="text-3xl font-extrabold tracking-tight mb-6">
                  <span className="font-sans text-slate-deep dark:text-white">Privacy & </span>
                  <span className="font-display italic font-semibold text-gold">Educational Policy.</span>
                </h2>

                <div className="space-y-6 text-sm sm:text-base text-slate-gray dark:text-white/70 leading-relaxed font-sans">
                  <div>
                    <h3 className="font-bold text-slate-deep dark:text-white text-base mb-1">
                      1. Educational Scope & Integrity
                    </h3>
                    <p className="text-sm">
                      MorPhysics is an interactive sandbox application designed to help secondary and high school students visualize abstract physics concepts. All simulation calculations are double-checked with High School physics textbooks in Vietnam and calibrated undercse advisor guidance (HCMUT).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-deep dark:text-white text-base mb-1">
                      2. Privacy & Data Protection
                    </h3>
                    <p className="text-sm">
                      We protect and value user privacy. Any uploaded logs, simulation parameters, and custom AI chat requests are compiled safely and local storage caches are only saved on-device. We do not transfer personal profiles to unauthorized third-party trackers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-deep dark:text-white text-base mb-1">
                      3. Fair Usage of Simulation Resources
                    </h3>
                    <p className="text-sm">
                      Free tier student accounts are granted full access to 2D Thermodynamics and Electromagnetism modules. To avoid performance degradation, complex physics loops are optimized client-side (leveraging canvas threads and CPU engines), keeping the system highly efficient.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-deep/10 dark:border-white/10 text-center text-xs text-slate-gray/60 dark:text-white/40">
                  Last updated: July 2026 • Version 1.0.0
                </div>

              </div>
            </Reveal>
          </div>
        )}
      </div>

    </section>
  );
}

export default Dashboard;
