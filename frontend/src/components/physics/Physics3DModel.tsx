import React, { useRef, useEffect } from "react";

interface Physics3DModelProps {
  isLightTheme: boolean;
  showControls?: boolean;
}

/**
 * Interactive 3D Spring-Mass Oscillation System rendered on Canvas.
 * Supports dragging the mass to oscillate, and dragging the background to rotate in 3D.
 */
export const Physics3DModel = ({
  isLightTheme,
}: Physics3DModelProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPlaying = true;

  // 3D rotation angles (Yaw & Pitch)
  const thetaRef = useRef<number>(-0.4); // Yaw
  const phiRef = useRef<number>(0.2);    // Pitch

  // Drag interaction states
  const isDraggingCameraRef = useRef<boolean>(false);
  const isDraggingMassRef = useRef<boolean>(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Physics oscillator state
  const stateRef = useRef({
    y: 15,          // Position from equilibrium (0)
    vy: 0,           // Velocity
    k: 0.08,         // Spring constant
    mass: 1.0,       // Mass of block
    damping: 0.015,  // Damping coefficient
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
      }
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // 3D Perspective Projection
    const project = (x: number, y: number, z: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 10;
      const scaleVal = Math.min(w, h) * 0.007;

      // Rotate around Y-axis (Yaw)
      const x1 = x * Math.cos(thetaRef.current) - z * Math.sin(thetaRef.current);
      const z1 = x * Math.sin(thetaRef.current) + z * Math.cos(thetaRef.current);

      // Rotate around X-axis (Pitch)
      const y2 = y * Math.cos(phiRef.current) - z1 * Math.sin(phiRef.current);
      const z2 = y * Math.sin(phiRef.current) + z1 * Math.cos(phiRef.current);

      const dist = 350;
      const depthScale = dist / (dist + z2);

      return {
        x: cx + x1 * scaleVal * depthScale,
        y: cy + y2 * scaleVal * depthScale,
        z: z2,
        scale: scaleVal * depthScale,
      };
    };

    // Helper to draw a shaded 3D cylinder
    const drawCylinder = (
      xCenter: number,
      zCenter: number,
      radius: number,
      yMin: number,
      yMax: number,
      color1: string,
      color2: string
    ) => {
      const segments = 16;
      const topPts = [];
      const botPts = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const px = xCenter + radius * Math.cos(angle);
        const pz = zCenter + radius * Math.sin(angle);
        topPts.push(project(px, yMin, pz));
        botPts.push(project(px, yMax, pz));
      }

      // Draw and fill bottom base ellipse
      ctx.beginPath();
      ctx.moveTo(botPts[0].x, botPts[0].y);
      for (let i = 1; i < segments; i++) {
        ctx.lineTo(botPts[i].x, botPts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = color2;
      ctx.fill();

      // Find screen bounds
      let minIdx = 0;
      let maxIdx = 0;
      for (let i = 1; i < segments; i++) {
        if (botPts[i].x < botPts[minIdx].x) minIdx = i;
        if (botPts[i].x > botPts[maxIdx].x) maxIdx = i;
      }

      // Draw cylinder body
      ctx.beginPath();
      ctx.moveTo(botPts[minIdx].x, botPts[minIdx].y);
      let idx = minIdx;
      while (idx !== maxIdx) {
        idx = (idx + 1) % segments;
        ctx.lineTo(botPts[idx].x, botPts[idx].y);
      }
      ctx.lineTo(topPts[maxIdx].x, topPts[maxIdx].y);
      while (idx !== minIdx) {
        idx = (idx + 1) % segments;
        ctx.lineTo(topPts[idx].x, topPts[idx].y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(botPts[minIdx].x, 0, botPts[maxIdx].x, 0);
      grad.addColorStop(0, color2);
      grad.addColorStop(0.3, color1);
      grad.addColorStop(0.7, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw top ellipse
      ctx.beginPath();
      ctx.moveTo(topPts[0].x, topPts[0].y);
      for (let i = 1; i < segments; i++) {
        ctx.lineTo(topPts[i].x, topPts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = color1;
      ctx.fill();
      ctx.strokeStyle = isLightTheme ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)";
      ctx.stroke();
    };

    const draw = () => {
      // Safety check for Safari flex container late rendering
      if (canvas.width === 0 || canvas.height === 0) {
        resizeCanvas();
      }

      const w = canvas.width;
      const h = canvas.height;

      // Physics integration step
      const state = stateRef.current;
      if (isPlaying && !isDraggingMassRef.current) {
        const dt = 0.45;
        const ay = (-state.k * state.y - state.damping * state.vy) / state.mass;
        state.vy += ay * dt;
        state.y += state.vy * dt;
      }

      ctx.clearRect(0, 0, w, h);

      // Draw 3D Base Plates (Steel/Iron blocks) at the feet of the pillars
      drawCylinder(-45, 0, 6, 52, 55, "#475569", "#1e293b");
      drawCylinder(45, 0, 6, 52, 55, "#475569", "#1e293b");

      // Draw 3D Vertical Pillars (Stainless steel)
      drawCylinder(-45, 0, 2.5, -55, 52, "#94a3b8", "#475569");
      drawCylinder(45, 0, 2.5, -55, 52, "#94a3b8", "#475569");

      // Draw Top Horizontal Bar (Stainless steel cylinder)
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath();
      const pStartBar = project(-45, -55, 0);
      const pEndBar = project(45, -55, 0);
      ctx.moveTo(pStartBar.x, pStartBar.y);
      ctx.lineTo(pEndBar.x, pEndBar.y);
      ctx.stroke();

      // Draw top connector loop/hook
      const pHookTop = project(0, -55, 0);
      const pHookBot = project(0, -42, 0);
      ctx.strokeStyle = "#d97706"; // Brass hook color
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pHookTop.x, pHookTop.y);
      ctx.lineTo(pHookBot.x, pHookBot.y);
      ctx.stroke();

      // Draw Spring (3D helical spiral path)
      const springStartY = -42;
      const springEndY = state.y - 12;
      const turns = 18;
      const coilRadius = 4.5;
      const springSegments = 160;

      ctx.beginPath();
      const pStartSpring = project(0, springStartY, 0);
      ctx.moveTo(pStartSpring.x, pStartSpring.y);

      for (let i = 0; i <= springSegments; i++) {
        const t = i / springSegments;
        const curY = springStartY + t * (springEndY - springStartY);
        const angle = t * turns * 2 * Math.PI;
        const curX = coilRadius * Math.cos(angle);
        const curZ = coilRadius * Math.sin(angle);

        const pSpringPt = project(curX, curY, curZ);
        ctx.lineTo(pSpringPt.x, pSpringPt.y);
      }

      ctx.strokeStyle = isLightTheme ? "#475569" : "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Cylinder hook on the mass
      const pMassHookTop = project(0, state.y - 12, 0);
      const pMassHookBot = project(0, state.y - 6, 0);
      ctx.strokeStyle = "#d97706";
      ctx.beginPath();
      ctx.moveTo(pMassHookTop.x, pMassHookTop.y);
      ctx.lineTo(pMassHookBot.x, pMassHookBot.y);
      ctx.stroke();

      // Draw 3D Blue Cylindrical Mass
      drawCylinder(0, 0, 9, state.y - 6, state.y + 12, "#3b82f6", "#1e40af");

      if (isPlaying || isDraggingMassRef.current) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isPlaying, isLightTheme]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Project current mass center to check distance
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 10;
    const scaleVal = Math.min(canvas.width, canvas.height) * 0.007;

    // Yaw/Pitch rotation transform of mass center
    const x1 = 0;
    const y2 = stateRef.current.y * Math.cos(phiRef.current);
    const z2 = stateRef.current.y * Math.sin(phiRef.current);

    const dist = 350;
    const depthScale = dist / (dist + z2);
    const projMassX = cx + x1 * scaleVal * depthScale;
    const projMassY = cy + y2 * scaleVal * depthScale;

    // Calculate distance to mass cylinder
    const distToMass = Math.hypot(clickX - projMassX, clickY - projMassY);

    if (distToMass < 35) {
      // User clicked on the blue mass -> start pulling/dragging spring
      isDraggingMassRef.current = true;
    } else {
      // User clicked outside -> rotate viewport camera
      isDraggingCameraRef.current = true;
    }

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    if (isDraggingMassRef.current) {
      // Pull mass up or down
      const scaleVal = Math.min(canvas.width, canvas.height) * 0.007;
      const verticalMovement = dy / (scaleVal * 1.2);
      stateRef.current.y = Math.max(-50, Math.min(50, stateRef.current.y + verticalMovement));
      stateRef.current.vy = 0; // reset velocity
    } else if (isDraggingCameraRef.current) {
      // Rotate camera viewport
      thetaRef.current += dx * 0.015;
      phiRef.current = Math.max(-0.4, Math.min(0.6, phiRef.current + dy * 0.015));
    }

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDraggingCameraRef.current = false;
    isDraggingMassRef.current = false;
  };

  return (
    <div className="absolute inset-0 w-full h-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
      <div className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="absolute inset-0 w-full h-full bg-transparent cursor-grab active:cursor-grabbing block"
        />
      </div>
    </div>
  );
};

export default Physics3DModel;
