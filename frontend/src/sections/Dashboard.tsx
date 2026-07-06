import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import {
  Atom,
  Settings,
  Trash2,
  Send,
  Image as ImageIcon,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Bell,
  Lock,
  Info,
  Check,
  Sparkles,
  User,
  Sun,
  Moon,
  Camera
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

export function Dashboard({ currentHash }: { currentHash: string }) {
  const { theme, toggleTheme } = useTheme();

  // Determine active tab from routing hash
  const activeTab = currentHash === "#dashboard-settings"
    ? "settings"
    : "lab";

  const setActiveTab = (tab: "lab" | "settings") => {
    if (tab === "lab") window.location.hash = "#dashboard";
    else if (tab === "settings") window.location.hash = "#dashboard-settings";
  };

  // Tooltip hover states
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hey there! 👋 I'm MorPhysics, your personal physics lab assistant.\n\nJust send me a request and I'll build an interactive experiment for you — whether it's projectile motion, a double pendulum, elastic collisions, or planetary orbits. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load Sim Preferences helper
  const getSimPrefs = () => {
    const saved = localStorage.getItem("morphysics_sim_prefs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      defaultGravity: 9.8,
      autoPlay: true,
      showFPS: true,
      showGrid: true,
      defaultScenario: "none"
    };
  };

  // Simulation Canvas State
  const [simPrefs, setSimPrefs] = useState(getSimPrefs);
  const [isPlaying, setIsPlaying] = useState(() => {
    const prefs = getSimPrefs();
    return prefs.defaultScenario !== "none" ? prefs.autoPlay : false;
  });
  const [activeScenario, setActiveScenario] = useState<
    "none" | "projectile" | "pendulum" | "collisions" | "orbit"
  >(() => {
    return getSimPrefs().defaultScenario as any;
  });
  const [gravity, setGravity] = useState(() => {
    return getSimPrefs().defaultGravity;
  });
  const [activeBodies, setActiveBodies] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0.0);
  const [fps, setFps] = useState(60);

  // User Profile States
  const [firstName, setFirstName] = useState(() => localStorage.getItem("morphysics_first_name") || "Long Quan");
  const [lastName, setLastName] = useState(() => localStorage.getItem("morphysics_last_name") || "Ton");
  const profileName = `${lastName} ${firstName}`.trim();
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem("morphysics_profile_email") || "quan.ton@morphysics.io");

  // Notifications Settings
  const [notifTips, setNotifTips] = useState(() => localStorage.getItem("morphysics_notif_tips") !== "false");
  const [notifHints, setNotifHints] = useState(() => localStorage.getItem("morphysics_notif_hints") !== "false");
  const [notifAutoSave, setNotifAutoSave] = useState(() => localStorage.getItem("morphysics_notif_autosave") === "true");

  // Confirm states for privacy cards
  const [confirmClearChat, setConfirmClearChat] = useState(false);
  const [confirmResetPrefs, setConfirmResetPrefs] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Show policy state inside Settings page
  const [showPolicy, setShowPolicy] = useState(false);

  // Settings sub-tab state
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState<
    "account" | "appearance" | "simulation" | "notifications" | "privacy" | "about"
  >("account");

  useEffect(() => {
    if (activeTab === "settings") {
      setActiveSettingsSubTab("account");
    }
  }, [activeTab]);

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

  // Scroll to bottom of chat — skip on initial welcome message to preserve top padding
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle Scenario trigger
  const handleSelectScenario = (scenario: "projectile" | "pendulum" | "collisions" | "orbit") => {
    setActiveScenario(scenario);
    setIsPlaying(simPrefs.autoPlay);

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
        text: "Hey there! 👋 I'm MorPhysics, your personal physics lab assistant.\n\nJust send me a request and I'll build an interactive experiment for you — whether it's projectile motion, a double pendulum, elastic collisions, or planetary orbits. What would you like to explore?",
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

      if (simPrefs.showFPS && activeScenario !== "none") {
        ctx.save();
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = theme === "dark" ? "rgba(255, 200, 0, 0.85)" : "rgba(206, 169, 69, 0.85)";
        ctx.fillText(`FPS: ${fps}`, w - 55, 20);
        ctx.restore();
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
  }, [isPlaying, activeScenario, gravity, simPrefs.showFPS, simPrefs.showGrid, theme]);

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
    if (!simPrefs.showGrid) return;
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
    <section className="relative h-screen bg-cloud dark:bg-slate-ink text-slate-deep dark:text-white transition-colors duration-500 overflow-hidden font-sans">
      {/* Background aurora gradients — Hero-style multi-blob */}
      <div className="aurora-blob left-[-12%] top-[-15%] h-[500px] w-[500px] bg-gold/20 dark:bg-gold/10 pointer-events-none" />
      <div className="aurora-blob bottom-[-15%] right-[-8%] h-[560px] w-[560px] bg-indigo-500/25 dark:bg-indigo-500/18 pointer-events-none" />
      <div className="aurora-blob right-[-8%] top-[-5%] h-[420px] w-[420px] bg-gold/15 dark:bg-gold/8 pointer-events-none" />
      <div className="aurora-blob left-[30%] top-[30%] h-[360px] w-[360px] bg-indigo-400/12 dark:bg-indigo-500/10 pointer-events-none" />
      <div className="aurora-blob left-[33%] top-[50%] h-[280px] w-[280px] bg-rose-400/6 dark:bg-rose-400/10 pointer-events-none" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-15 z-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Workspace Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 nav-glass py-2.5 h-16 flex items-center justify-center px-6 shadow-sm">
        {/* Center Floating Capsule / Dynamic Island */}
        <nav className="relative h-12 flex items-center overflow-visible rounded-full border border-slate-deep/10 bg-white/50 shadow-sm dark:border-white/10 dark:bg-white/5 px-2.5 z-10 gap-2">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "";
            }}
            className="group flex items-center gap-1.5 pl-3.5 pr-2.5 py-1 text-slate-deep dark:text-white transition-colors cursor-pointer select-none"
          >
            <div className="h-6 w-6 flex items-center justify-center">
              <Player
                autoplay
                loop
                src="/assets/Mascot.json"
                style={{ height: "24px", width: "24px" }}
              />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">
              Morphysics
            </span>
          </a>

          {/* Separator */}
          <div className="h-5 w-[1px] bg-slate-deep/10 dark:bg-white/10" />

          {/* Navigation Tabs */}
          <ul className="flex items-center gap-1.5">
            {/* Tab: Interactive Lab */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setActiveTab("lab")}
                onMouseEnter={() => setHoveredTab("lab")}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
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

            {/* Tab: Settings */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                onMouseEnter={() => setHoveredTab("settings")}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
                  activeTab === "settings"
                    ? "bg-gold text-slate-deep shadow-md font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                <Settings className="size-5" />
              </button>

              <AnimatePresence>
                {hoveredTab === "settings" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-slate-deep dark:bg-white text-white dark:text-slate-deep text-xs font-bold whitespace-nowrap shadow-md pointer-events-none"
                  >
                    Settings
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Separator */}
          <div className="h-5 w-[1px] bg-slate-deep/10 dark:bg-white/10" />

          {/* Right Side ThemeToggle */}
          <div className="pr-1.5 flex items-center justify-center">
            <ThemeToggle className="size-8 p-1 hover:bg-slate-deep/5 dark:hover:bg-white/5 rounded-full shadow-none border-none bg-transparent cursor-pointer" />
          </div>
        </nav>
      </header>

      {/* Main Container below navbar — sits below the fixed 64px header */}
      <div className="absolute inset-0 top-16 z-10 overflow-hidden">
        {activeTab === "lab" ? (
          // PAGE: INTERACTIVE LAB (Split view fitting screen height)
          <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Chatbot Column */}
            <div className="flex flex-col w-full lg:w-[400px] xl:w-[440px] shrink-0 h-[50vh] lg:h-full bg-white dark:bg-[#1a1d2e] border-r border-slate-deep/10 dark:border-white/10 overflow-hidden relative transition-colors duration-500">
              
              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 text-base font-sans",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender === "bot" && (
                      <div className="size-8 flex items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 p-0.5 border border-gold/15 shrink-0 mt-0.5">
                        <Player
                          autoplay
                          loop
                          src="/assets/Mascot.json"
                          style={{ height: "24px", width: "24px" }}
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-line leading-relaxed text-base font-sans",
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

              {/* Chat Input Field Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1a1d2e] flex items-center gap-2.5"
              >
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reset chat button */}
                  <button
                    type="button"
                    title="Clear chat history"
                    onClick={handleClearChat}
                    className="p-2 rounded-xl text-slate-gray/70 hover:text-red-400 dark:text-white/50 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="size-5" />
                  </button>

                  {/* Upload Image */}
                  <button
                    type="button"
                    title="Upload image analysis"
                    className="p-2 rounded-xl text-slate-gray/70 hover:text-gold dark:text-white/50 dark:hover:text-gold transition-colors"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask AI or type 'projectile motion'..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/40 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-base transition-all font-sans"
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
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
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
                    <p className="text-sm text-slate-gray/80 dark:text-white/50 leading-relaxed font-sans px-4">
                      Enter a prompt or click the play button above to start a live physics simulation.
                    </p>
                  </div>
                )}
              </div>

              {/* Simulation Controls Bar — only shown when a scenario is active */}
              {activeScenario !== "none" && (
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 border-t border-slate-deep/5 dark:border-white/5 bg-white/50 dark:bg-white/2 select-none">
                  {/* Play/Pause & Reset */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all shadow-sm",
                        isPlaying
                          ? "border-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                          : "border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      )}
                      title={isPlaying ? "Pause simulation" : "Resume simulation"}
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </button>

                    <button
                      type="button"
                      title="Reset simulation"
                      onClick={() => {
                        const prev = activeScenario;
                        setActiveScenario("none");
                        setTimeout(() => setActiveScenario(prev), 20);
                      }}
                      className="p-2 rounded-xl border border-slate-deep/5 bg-slate-soft/30 dark:border-white/5 dark:bg-white/5 text-slate-gray dark:text-white/60 hover:text-gold dark:hover:text-gold transition-colors"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                  </div>

                  {/* Engine Stats */}
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40">
                        Bodies
                      </span>
                      <span className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400">
                        {activeBodies}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40">
                        Energy
                      </span>
                      <span className="text-xs font-extrabold text-emerald-500 dark:text-emerald-400">
                        {totalEnergy.toFixed(1)} J
                      </span>
                    </div>
                  </div>

                  {/* Gravity Slider */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-gray/70 dark:text-white/40">
                        Gravity
                      </span>
                      <span className="text-xs font-extrabold text-gold">
                        {gravity.toFixed(1)} m/s²
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={0.5}
                      value={gravity}
                      onChange={(e) => setGravity(parseFloat(e.target.value))}
                      className="w-20 sm:w-24 h-1 accent-gold cursor-pointer"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          // PAGE: SETTINGS SUBPAGE
          // PAGE: SETTINGS SUBPAGE
          <div className="h-full w-full flex flex-col md:flex-row relative overflow-hidden">
            
            {/* Left Column: Sidebar Navigation (Directly integrated into full frame) */}
            <div className="w-full md:w-[290px] shrink-0 bg-slate-soft/30 dark:bg-[#171a2e]/45 backdrop-blur-md p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-deep/10 dark:border-white/10 relative z-10">
              <div className="space-y-8">
                 {/* Avatar Profile Section */}
                 <div className="flex flex-col items-center text-center">
                   {/* Welcome message on top */}
                   <span className="font-display italic font-extrabold text-2xl text-gold mb-4">
                     Welcome, {firstName}
                   </span>
                   {/* Avatar circle */}
                   <div className="relative h-24 w-24 mb-4 group">
                     <div className="h-full w-full rounded-full overflow-hidden bg-slate-deep/5 dark:bg-white/10 border-2 border-gold/50 flex items-center justify-center text-3xl text-gold font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
                       {profileName ? (profileName === "Ton Long Quan" ? "TLQ" : profileName.split(" ").map(n => n[0]).join("").slice(0, 3).toUpperCase()) : "TLQ"}
                     </div>
                     <button
                       type="button"
                       className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-slate-deep shadow-md border-2 border-cloud dark:border-[#171a2e] transition-transform active:scale-90 cursor-pointer"
                       onClick={() => alert("Photo upload coming soon with backend integration!")}
                       title="Change Photo"
                     >
                       <Camera className="size-4" />
                     </button>
                   </div>
                   {/* Full Name */}
                   <h4 className="font-sans text-base font-semibold text-slate-gray/80 dark:text-white/60 mt-1 truncate max-w-full px-2">
                     {profileName}
                   </h4>
                   {/* Plan Box */}
                   <div className="mt-3 px-5 py-2 rounded-xl bg-gold/15 dark:bg-gold/10 border border-gold/30 text-gold font-sans font-bold text-sm tracking-wide uppercase select-none">
                     Premium Plan
                   </div>
                 </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-slate-deep/10 dark:bg-white/10" />

                {/* Navigation Sidebar Tabs */}
                <nav className="space-y-2">
                  {[
                    { id: "account", label: "Account Profile", icon: User },
                    { id: "appearance", label: "Appearance", icon: Sparkles },
                    { id: "simulation", label: "Simulation Prefs", icon: Sliders },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "privacy", label: "Privacy & Data", icon: Lock },
                    { id: "about", label: "About Morphysics", icon: Info }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSettingsSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSettingsSubTab(tab.id as any)}
                        className={cn(
                          "w-full flex items-center gap-4 px-6 py-3 rounded-2xl text-sm font-bold text-left transition-all duration-200 cursor-pointer select-none",
                          isActive
                            ? "bg-gold text-slate-deep shadow-md scale-[1.02]"
                            : "text-slate-deep/70 dark:text-white/70 hover:text-slate-deep dark:hover:text-white hover:bg-slate-deep/5 dark:hover:bg-white/5"
                        )}
                      >
                        <Icon className="size-5 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Empty footer area replacing version info */}
              <div className="mt-8 pt-4 text-center font-sans">
              </div>
            </div>

            {/* RIGHT COLUMN: Settings Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-14 lg:p-16 relative z-10 flex flex-col justify-between">
              
              {/* Page Content switches */}
              <div className="flex-1 max-w-4xl">
                <AnimatePresence mode="wait">
                  {activeSettingsSubTab === "account" && (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">Account </span>
                          <span className="font-display italic font-semibold text-gold">Profile.</span>
                        </h3>
                      </div>

                      <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block mb-2 font-sans">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full px-5 py-3.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/60 dark:bg-slate-soft/10 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-base font-medium transition-all shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block mb-2 font-sans">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full px-5 py-3.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/60 dark:bg-slate-soft/10 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-base font-medium transition-all shadow-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block mb-2 font-sans">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/60 dark:bg-slate-soft/10 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-base font-medium transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Current Plan Block */}
                      <div className="max-w-2xl pt-6 border-t border-slate-deep/10 dark:border-white/10">
                        <div className="p-6 rounded-2xl border border-gold/30 bg-gold/5 dark:bg-gold/5 space-y-4">
                          <label className="text-xl sm:text-2xl font-black uppercase tracking-wider text-gold block font-sans">
                            Current Plan
                          </label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                            {/* Block 1: Plan Name */}
                            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-soft/5 border border-slate-deep/5 dark:border-white/5">
                              <span className="text-sm text-slate-gray/70 dark:text-white/55 uppercase font-extrabold tracking-wider block mb-1.5">Plan Package</span>
                              <div className="text-xl sm:text-2xl font-black text-slate-deep dark:text-white">Premium Plan</div>
                            </div>
                            
                            {/* Block 2: Price */}
                            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-soft/5 border border-slate-deep/5 dark:border-white/5">
                              <span className="text-sm text-slate-gray/70 dark:text-white/55 uppercase font-extrabold tracking-wider block mb-1.5">Pricing</span>
                              <div className="text-xl sm:text-2xl font-black text-slate-deep dark:text-white">150,000đ <span className="text-sm font-bold text-slate-gray/60 dark:text-white/40">/ mo</span></div>
                            </div>
                            
                            {/* Block 3: Renewal */}
                            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-soft/5 border border-slate-deep/5 dark:border-white/5">
                              <span className="text-sm text-slate-gray/70 dark:text-white/55 uppercase font-extrabold tracking-wider block mb-1.5">Renewal Date</span>
                              <div className="text-xl sm:text-2xl font-black text-slate-deep dark:text-white">Aug 6, 2026</div>
                            </div>
                          </div>

                          {/* Benefits / Features */}
                          <div className="p-5 rounded-xl bg-white/40 dark:bg-slate-soft/5 border border-slate-deep/5 dark:border-white/5 space-y-3">
                            <span className="text-sm sm:text-base text-slate-gray/70 dark:text-white/55 uppercase font-black tracking-wider block">Access Features</span>
                            <ul className="grid grid-cols-1 gap-2 text-base sm:text-lg text-slate-deep/90 dark:text-white/80 font-sans leading-relaxed">
                              {[
                                "Everything in Basic Plan",
                                "Docs-to-Simulation (PDF / document upload)",
                                "Unlimited saved simulation scenes",
                                "Export simulation as animated GIF",
                                "Advanced force & constraint tools (springs, joints, hinges)",
                                "Priority email support",
                                "Early access to new simulation types"
                              ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-gold font-black mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-8 pt-6 border-t border-slate-deep/10 dark:border-white/10 flex justify-end items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to sign out?")) {
                              alert("Signing out...");
                              window.location.hash = "";
                              window.location.reload();
                            }
                          }}
                          className="px-6 py-3 rounded-2xl border border-red-500/20 hover:border-red-500/40 text-red-500 hover:bg-red-500/5 text-base font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          Sign Out
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.setItem("morphysics_first_name", firstName);
                            localStorage.setItem("morphysics_last_name", lastName);
                            localStorage.setItem("morphysics_profile_email", profileEmail);
                            alert("Profile saved successfully!");
                          }}
                          className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-hover text-slate-deep font-extrabold text-base transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Check className="size-5" /> Save Profile
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsSubTab === "appearance" && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">Appearance & </span>
                          <span className="font-display italic font-semibold text-gold">Theme.</span>
                        </h3>
                      </div>

                      <div className="space-y-8 max-w-2xl">
                        <div>
                          <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block mb-4 font-sans">
                            Color Theme
                          </label>
                          <div className="grid grid-cols-2 gap-5 max-w-2xl">
                            <button
                              type="button"
                              onClick={(e) => {
                                if (theme !== "light") toggleTheme(e);
                              }}
                              className={cn(
                                "flex items-center justify-center gap-3 px-8 py-6 rounded-3xl border text-xl font-extrabold transition-all cursor-pointer shadow-md",
                                theme === "light"
                                  ? "border-gold bg-gold/15 text-gold"
                                  : "border-slate-deep/10 dark:border-white/10 hover:border-gold/50"
                              )}
                            >
                              <Sun className="size-6" /> Light Mode
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                if (theme !== "dark") toggleTheme(e);
                              }}
                              className={cn(
                                "flex items-center justify-center gap-3 px-8 py-6 rounded-3xl border text-xl font-extrabold transition-all cursor-pointer shadow-md",
                                theme === "dark"
                                  ? "border-gold bg-gold/15 text-gold"
                                  : "border-slate-deep/10 dark:border-white/10 hover:border-gold/50"
                              )}
                            >
                              <Moon className="size-6" /> Dark Mode
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Show Physics Grid
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Display background coordinate helper lines on active canvas.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !simPrefs.showGrid;
                              const newPrefs = { ...simPrefs, showGrid: updated };
                              setSimPrefs(newPrefs);
                              localStorage.setItem("morphysics_sim_prefs", JSON.stringify(newPrefs));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              simPrefs.showGrid ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                simPrefs.showGrid ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsSubTab === "simulation" && (
                    <motion.div
                      key="simulation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">Simulation </span>
                          <span className="font-display italic font-semibold text-gold">Prefs.</span>
                        </h3>
                      </div>

                      <div className="space-y-6 max-w-2xl">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block font-sans">
                              Default Gravity Value
                            </label>
                            <span className="text-base font-extrabold text-gold">
                              {simPrefs.defaultGravity.toFixed(1)} m/s²
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={20}
                            step={0.5}
                            value={simPrefs.defaultGravity}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const newPrefs = { ...simPrefs, defaultGravity: val };
                              setSimPrefs(newPrefs);
                              localStorage.setItem("morphysics_sim_prefs", JSON.stringify(newPrefs));
                              setGravity(val);
                            }}
                            className="control-slider"
                            style={{ "--progress": `${(simPrefs.defaultGravity / 20) * 100}%` } as React.CSSProperties}
                          />
                        </div>

                        <div>
                          <label className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-deep/80 dark:text-white/60 block mb-2 font-sans">
                            Default Starting Lab
                          </label>
                          <select
                            value={simPrefs.defaultScenario}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newPrefs = { ...simPrefs, defaultScenario: val };
                              setSimPrefs(newPrefs);
                              localStorage.setItem("morphysics_sim_prefs", JSON.stringify(newPrefs));
                            }}
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/60 dark:bg-slate-soft/10 text-slate-deep dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold text-base font-medium transition-all shadow-sm"
                          >
                            <option value="none">None (Idle Welcome State)</option>
                            <option value="projectile">Projectile Launcher</option>
                            <option value="pendulum">Double Pendulum</option>
                            <option value="collisions">Elastic Collisions</option>
                            <option value="orbit">Planetary Orbit</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between gap-6 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Auto-play Scenarios
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Instantly start simulator ticks when switching scenarios.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !simPrefs.autoPlay;
                              const newPrefs = { ...simPrefs, autoPlay: updated };
                              setSimPrefs(newPrefs);
                              localStorage.setItem("morphysics_sim_prefs", JSON.stringify(newPrefs));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              simPrefs.autoPlay ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                simPrefs.autoPlay ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-6 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Show FPS Counter
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Display dynamic rendering frames per second in the simulator header.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !simPrefs.showFPS;
                              const newPrefs = { ...simPrefs, showFPS: updated };
                              setSimPrefs(newPrefs);
                              localStorage.setItem("morphysics_sim_prefs", JSON.stringify(newPrefs));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              simPrefs.showFPS ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                simPrefs.showFPS ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsSubTab === "notifications" && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">Tips & </span>
                          <span className="font-display italic font-semibold text-gold">Notifications.</span>
                        </h3>
                      </div>

                      <div className="space-y-6 max-w-2xl">
                        <div className="flex items-center justify-between gap-6 py-3">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Simulation Tips & Suggestions
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Receive interactive comments and tips from Morphysics mascot.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !notifTips;
                              setNotifTips(updated);
                              localStorage.setItem("morphysics_notif_tips", String(updated));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              notifTips ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                notifTips ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-6 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Keyboard Shortcut Hints
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Display helper tips for controls on active playground overlays.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !notifHints;
                              setNotifHints(updated);
                              localStorage.setItem("morphysics_notif_hints", String(updated));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              notifHints ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                notifHints ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-6 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Auto-save Canvas Snapshots
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Export a snapshot image automatically when the simulation resets.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = !notifAutoSave;
                              setNotifAutoSave(updated);
                              localStorage.setItem("morphysics_notif_autosave", String(updated));
                            }}
                            className={cn(
                              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                              notifAutoSave ? "bg-gold" : "bg-slate-deep/20 dark:bg-white/20"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                notifAutoSave ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsSubTab === "privacy" && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">Privacy & </span>
                          <span className="font-display italic font-semibold text-gold">Local Data.</span>
                        </h3>
                      </div>

                      <div className="space-y-6 max-w-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Clear Chat Logs
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Remove all messaging logs and reset AI state back to defaults.
                            </p>
                          </div>
                          {!confirmClearChat ? (
                            <button
                              type="button"
                              onClick={() => setConfirmClearChat(true)}
                              className="px-5 py-2.5 rounded-xl border border-slate-deep/15 dark:border-white/15 hover:border-red-400 hover:text-red-400 text-slate-deep dark:text-white text-sm font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              Clear Chat
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleClearChat();
                                  setConfirmClearChat(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold active:scale-95 cursor-pointer shadow-sm"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmClearChat(false)}
                                className="px-4 py-2 rounded-xl bg-slate-soft dark:bg-white/10 text-slate-deep dark:text-white text-sm font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Reset Simulator Prefs
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Restore all defaults for gravity values, timers, and grids.
                            </p>
                          </div>
                          {!confirmResetPrefs ? (
                            <button
                              type="button"
                              onClick={() => setConfirmResetPrefs(true)}
                              className="px-5 py-2.5 rounded-xl border border-slate-deep/15 dark:border-white/15 hover:border-red-400 hover:text-red-400 text-slate-deep dark:text-white text-sm font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              Reset
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const defaults = {
                                    defaultGravity: 9.8,
                                    autoPlay: true,
                                    showFPS: true,
                                    showGrid: true,
                                    defaultScenario: "none"
                                  };
                                  setSimPrefs(defaults);
                                  setGravity(9.8);
                                  localStorage.setItem("morphysics_sim_prefs", JSON.stringify(defaults));
                                  setConfirmResetPrefs(false);
                                  alert("Simulator preferences reset!");
                                }}
                                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold active:scale-95 cursor-pointer shadow-sm"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmResetPrefs(false)}
                                className="px-4 py-2 rounded-xl bg-slate-soft dark:bg-white/10 text-slate-deep dark:text-white text-sm font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-t border-slate-deep/10 dark:border-white/10">
                          <div>
                            <p className="font-sans text-xl font-extrabold text-slate-deep dark:text-white">
                              Clear All Storage
                            </p>
                            <p className="text-base text-slate-gray dark:text-white/70 font-sans mt-1 leading-relaxed">
                              Wipe all user parameters, cached profiles, and settings.
                            </p>
                          </div>
                          {!confirmClearAll ? (
                            <button
                              type="button"
                              onClick={() => setConfirmClearAll(true)}
                              className="px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-500 text-sm font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              Wipe Storage
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.clear();
                                  setConfirmClearAll(false);
                                  window.location.reload();
                                }}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold active:scale-95 cursor-pointer shadow-sm"
                              >
                                Wipe
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmClearAll(false)}
                                className="px-4 py-2 rounded-xl bg-slate-soft dark:bg-white/10 text-slate-deep dark:text-white text-sm font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSettingsSubTab === "about" && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="pb-3 border-b border-slate-deep/10 dark:border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          <span className="font-sans text-slate-deep dark:text-white">About </span>
                          <span className="font-display italic font-semibold text-gold">Morphysics.</span>
                        </h3>
                      </div>

                      <div className="space-y-6 max-w-2xl">
                        <div className="flex items-center gap-5">
                          <div className="size-16 flex items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 p-1 border border-gold/25 shrink-0 shadow-sm">
                            <Player
                              autoplay
                              loop
                              src="/assets/Mascot.json"
                              style={{ height: "48px", width: "48px" }}
                            />
                          </div>
                          <div>
                            <p className="font-display italic font-bold text-2xl text-gold leading-none">
                              Morphysics Lab
                            </p>
                            <p className="text-base text-slate-gray/70 dark:text-white/40 mt-1.5 font-sans font-medium">
                              Version 1.0.0 (Local Sandbox Build)
                            </p>
                          </div>
                        </div>

                        <p className="text-lg text-slate-gray dark:text-white/70 leading-relaxed font-sans pt-2">
                          Morphysics transforms abstract physics problems into real-time, interactive 2D simulations instantly using advanced mathematical solvers and custom canvas renders.
                        </p>

                        <div className="flex items-center justify-center gap-3 my-6">
                          <div className="h-[1px] w-16 bg-slate-deep/15 dark:bg-white/10" />
                          <div className="h-2 w-2 rounded-full bg-gold" />
                          <div className="h-[1px] w-16 bg-slate-deep/15 dark:bg-white/10" />
                        </div>

                        <div className="flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={() => setShowPolicy(true)}
                            className="w-full py-3 rounded-2xl border border-slate-deep/10 dark:border-white/10 hover:border-gold hover:text-gold text-slate-deep dark:text-white text-sm font-bold transition-all active:scale-98 cursor-pointer bg-white/40 dark:bg-white/5 hover:bg-white/60"
                          >
                            Read Educational & Privacy Policy
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Policy Overlay Modal (reused styling from original policy page, but compact & inside Settings) */}
            <AnimatePresence>
              {showPolicy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="card-surface relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-2xl border border-gold/20 dark:border-gold/10 bg-white dark:bg-[#1f2236] max-w-2xl w-full"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gold/10 dark:bg-gold/5 pointer-events-none" />
                    <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                    <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

                    <h2 className="text-3xl font-extrabold tracking-tight mb-6">
                      <span className="font-sans text-slate-deep dark:text-white">Privacy & </span>
                      <span className="font-display italic font-semibold text-gold">Educational Policy.</span>
                    </h2>

                    <div className="space-y-5 text-base text-slate-gray dark:text-white/70 leading-relaxed font-sans max-h-[50vh] overflow-y-auto pr-2">
                      <div>
                        <h3 className="font-bold text-slate-deep dark:text-white text-lg mb-1">
                          1. Educational Scope & Integrity
                        </h3>
                        <p className="text-base">
                          MorPhysics is an interactive sandbox application designed to help secondary and high school students visualize abstract physics concepts. All simulation calculations are double-checked with High School physics textbooks in Vietnam and calibrated under advisor guidance (HCMUT).
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-deep dark:text-white text-lg mb-1">
                          2. Privacy & Data Protection
                        </h3>
                        <p className="text-base">
                          We protect and value user privacy. Any uploaded logs, simulation parameters, and custom AI chat requests are compiled safely and local storage caches are only saved on-device. We do not transfer personal profiles to unauthorized third-party trackers.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-deep dark:text-white text-lg mb-1">
                          3. Fair Usage of Simulation Resources
                        </h3>
                        <p className="text-base">
                          Free tier student accounts are granted full access to 2D Thermodynamics and Electromagnetism modules. To avoid performance degradation, complex physics loops are optimized client-side (leveraging canvas threads and CPU engines), keeping the system highly efficient.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-deep/10 dark:border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-slate-gray/50 dark:text-white/40">
                        Last updated: July 2026 • Version 1.0.0
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPolicy(false)}
                        className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-hover text-slate-deep font-bold text-xs transition-all active:scale-95"
                      >
                        Close Policy
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

    </section>
  );
}

export default Dashboard;
