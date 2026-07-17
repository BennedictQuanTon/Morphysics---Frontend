import { useState, useEffect, useRef, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { apiService } from "../services/labApi";
import type { 
  Nullable, 
  PhysicsComponent, 
  PhysicsStateItem, 
  Phase1Response, 
  Phase2Response, 
  Snapshot, 
  StateBinding, 
  VisualElement, 
  SceneInstance, 
  ResolvedInstance 
} from '../services/schema';
import {
  Atom,
  Settings,
  Send,
  Image as ImageIcon,
  User
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

type LoadingMode = 'idle' | 'phase1' | 'phase2';

type VisualNode = Omit<VisualElement, 'type' | 'children'> & {
  type: string;
  width?: number;
  height?: number;
  opacity?: number;
  fontSize?: number;
  text?: string;
  children?: VisualNode[];
  offset?: string | number;
  color?: string;
  stopColor?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  fx?: string | number;
  fy?: string | number;
};

const INITIAL_CANVAS_SIZE = [1300, 1500] as [number, number];

// --- BỘ TÍNH TOÁN ĐỘNG LỰC HỌC VẬT LÝ HỆ THỐNG ---
function evaluatePhysicsEquations(equations: string[], currentState: Record<string, number>): Record<string, number> {
  const nextState = { ...currentState };
  for (let iter = 0; iter < 3; iter++) {
    equations.forEach((eq) => {
      const parts = eq.split('=');
      if (parts.length !== 2) return;
      
      const targetVar = parts[0].trim();
      let expression = parts[1].trim();
      
      const sortedKeys = Object.keys(nextState).sort((a, b) => b.length - a.length);
      sortedKeys.forEach((key) => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, String(nextState[key]));
      });
      
      try {
        const sanitized = expression.replace(/[^-+*/().\d\s]/g, '');
        const evaluated = Function(`"use strict"; return (${sanitized})`)();
        if (Number.isFinite(evaluated)) {
          nextState[targetVar] = evaluated;
        }
      } catch (err) {}
    });
  }
  return nextState;
}

function formatError(err: unknown): string {
  if (!err) return 'Lỗi không xác định';
  if (err instanceof Error) return err.message;
  return String(err);
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function toCssValue(value?: string) {
  if (!value) return undefined;
  return value;
}

function normalizeVisualUnits(node: VisualNode, width: number, height: number) {
  const scaleX = (v?: number) => safeNumber(v, 0) * width;
  const scaleY = (v?: number) => safeNumber(v, 0) * height;

  return {
    x: scaleX(node.x),
    y: scaleY(node.y),
    x1: scaleX(node.x1),
    y1: scaleY(node.y1),
    x2: scaleX(node.x2),
    y2: scaleY(node.y2),
    w: scaleX(node.w ?? node.width),
    h: scaleY(node.h ?? node.height),
    rx: scaleX(node.rx),
    ry: scaleY(node.ry),
    cx: scaleX(node.cx),
    cy: scaleY(node.cy),
    r: safeNumber(node.r, 0) * Math.min(width, height),
    strokeWidth: safeNumber(node.strokeWidth, 0) * Math.min(width, height),
    fontSize: safeNumber(node.fontSize, 0.1) * Math.min(width, height),
  };
}

function denormalizePath(path: string | undefined, width: number, height: number) {
  if (!path) return '';
  return path.replace(/-?\d*\.?\d+/g, (raw, offset, source) => {
    const previous = source.slice(Math.max(0, offset - 2), offset).trim();
    const number = Number(raw);
    if (!Number.isFinite(number)) return raw;
    const axis = previous.endsWith('L') || previous.endsWith('M') || previous.endsWith('Q') ? 'x' : 'unknown';
    if (axis === 'x') return String(number * width);
    return String(number <= 1 && number >= -1 ? number * height : number);
  });
}

function evaluateBindingTransform(expression: string, stateValues: Record<string, number>) {
  let result = expression;
  Object.entries(stateValues).forEach(([key, value]) => {
    result = result.split(`state.${key}`).join(String(value));
  });

  result = result.replace(/calc\(([^)]+)\)/g, (_, inner) => {
    const sanitized = inner.replace(/[^-+*/().\d\s]/g, '');
    try {
      const evaluated = Function(`"use strict"; return (${sanitized})`)();
      return Number.isFinite(evaluated) ? String(evaluated) : '0';
    } catch {
      return '0';
    }
  });

  const translateMatch = result.match(/translate\(([^,]+),\s*([^)]+)\)/);
  if (translateMatch) {
    return `translate(${parseFloat(translateMatch[1]) || 0} ${parseFloat(translateMatch[2]) || 0})`;
  }
  const rotateMatch = result.match(/rotate\(([^)]+)\)/);
  if (rotateMatch) {
    return `rotate(${parseFloat(rotateMatch[1]) || 0})`;
  }
  return undefined;
}

function getComponentSize(component: PhysicsComponent) {
  const base = component.base_size || [0, 0, 100, 100];
  return { width: safeNumber(base[2], 100), height: safeNumber(base[3], 100) };
}

function resolveAnchor(component: PhysicsComponent, anchorId?: Nullable<string>) {
  if (!anchorId) return { x: 0.5, y: 0.5 };
  return component.anchor_points?.find((anchor) => anchor.id === anchorId) || { x: 0.5, y: 0.5 };
}

function resolveInstances(instances: SceneInstance[], components: PhysicsComponent[]) {
  const byComponentId = new Map(components.map((component) => [component.id, component]));
  const resolved = new Map<string, ResolvedInstance>();
  const ordered = [...instances].sort((a, b) => safeNumber(a.z_index, 0) - safeNumber(b.z_index, 0));

  ordered.forEach((instance, index) => {
    const component = byComponentId.get(instance.component_id);
    if (!component) return;

    const { width, height } = getComponentSize(component);

    if (instance.placement.type === 'absolute') {
      resolved.set(instance.instance_id, {
        ...instance,
        x: safeNumber(instance.placement.point?.x, 160 + index * 24),
        y: safeNumber(instance.placement.point?.y, 120 + index * 24),
        width,
        height,
      });
      return;
    }

    const parent = instance.placement.attach_to ? resolved.get(instance.placement.attach_to) : undefined;
    const parentComponent = parent ? byComponentId.get(parent.component_id) : undefined;

    if (!parent || !parentComponent) {
      resolved.set(instance.instance_id, { ...instance, x: 160 + index * 32, y: 120 + index * 32, width, height });
      return;
    }

    const myAnchor = resolveAnchor(component, instance.placement.my_anchor);
    const targetAnchor = resolveAnchor(parentComponent, instance.placement.target_anchor);

    const targetX = parent.x + targetAnchor.x * parent.width;
    const targetY = parent.y + targetAnchor.y * parent.height;

    resolved.set(instance.instance_id, {
      ...instance,
      x: targetX - myAnchor.x * width,
      y: targetY - myAnchor.y * height,
      width,
      height,
    });
  });

  return Array.from(resolved.values());
}

// --- VISUAL RENDER COMPONENT (ĐÃ SỬA ĐỔI TOÀN DIỆN THẺ SVG & ĐỆ QUY) ---
function VisualRenderer({
  visuals = [],
  width,
  height,
  bindings = [],
  instanceId,
  componentId,
  stateValues,
}: {
  visuals?: VisualNode[];
  width: number;
  height: number;
  bindings?: StateBinding[];
  instanceId?: string;
  componentId?: string;
  stateValues: Record<string, number>;
}) {
  const defs = visuals.filter((item) => item.type === 'defs');
  const drawable = visuals.filter((item) => item.type !== 'defs');

  const renderNode = (node: VisualNode, index: number): React.ReactNode => {
    const binding = bindings.find(
      (item) => item.target_instance === instanceId && item.visual_id && item.visual_id === node.id,
    );
    const transform = binding ? evaluateBindingTransform(binding.css_attribute, stateValues) : undefined;
    const unit = normalizeVisualUnits(node, width, height);
    const key = `${node.id || node.type}-${index}`;

    // Hỗ trợ cả tag g lẫn group mang tính đệ quy (recursive) sâu
    if (node.type === 'g' || node.type === 'group') {
      return (
        <g key={key} id={node.id} transform={transform}>
          {node.children?.map(renderNode)}
        </g>
      );
    }
    if (node.type === 'rect') {
      return (
        <rect
          key={key}
          id={node.id}
          x={unit.x}
          y={unit.y}
          width={unit.w}
          height={unit.h}
          rx={unit.rx}
          ry={unit.ry || unit.rx}
          fill={toCssValue(node.fill)}
          stroke={toCssValue(node.stroke)}
          strokeWidth={unit.strokeWidth || undefined}
          opacity={node.opacity}
          transform={transform}
        />
      );
    }
    if (node.type === 'circle') {
      return (
        <circle
          key={key}
          id={node.id}
          cx={unit.cx}
          cy={unit.cy}
          r={unit.r}
          fill={toCssValue(node.fill)}
          stroke={toCssValue(node.stroke)}
          strokeWidth={unit.strokeWidth || undefined}
          opacity={node.opacity}
          transform={transform}
        />
      );
    }
    if (node.type === 'ellipse') {
      return (
        <ellipse
          key={key}
          id={node.id}
          cx={unit.cx}
          cy={unit.cy}
          rx={unit.rx}
          ry={unit.ry}
          fill={toCssValue(node.fill)}
          stroke={toCssValue(node.stroke)}
          strokeWidth={unit.strokeWidth || undefined}
          opacity={node.opacity}
          transform={transform}
        />
      );
    }
    if (node.type === 'line') {
      return (
        <line
          key={key}
          id={node.id}
          x1={unit.x1}
          y1={unit.y1}
          x2={unit.x2}
          y2={unit.y2}
          stroke={toCssValue(node.stroke)}
          strokeWidth={unit.strokeWidth || undefined}
          opacity={node.opacity}
          transform={transform}
        />
      );
    }
    if (node.type === 'path') {
      return (
        <path
          key={key}
          id={node.id}
          d={denormalizePath(node.d, width, height)}
          fill={node.fill === 'none' ? 'none' : toCssValue(node.fill)}
          stroke={toCssValue(node.stroke)}
          strokeWidth={unit.strokeWidth || undefined}
          opacity={node.opacity}
          transform={transform}
        />
      );
    }
    
    if (node.type === 'text') {
      let displayString = node.text || '';
      const compIdLower = componentId?.toLowerCase() || '';
      const nodeIdLower = node.id?.toLowerCase() || '';

      if (compIdLower.includes('ap_suat') || nodeIdLower.includes('readout') || nodeIdLower.includes('sensor')) {
        const pVal = stateValues['p'] ?? stateValues['pressure'] ?? stateValues['ap_suat'];
        if (pVal !== undefined) displayString = `${pVal.toFixed(2)} atm`;
      } else if (compIdLower.includes('chia_do') || nodeIdLower.includes('volume') || nodeIdLower.includes('level')) {
        const vVal = stateValues['V'] ?? stateValues['volume'] ?? stateValues['the_tich'];
        if (vVal !== undefined) displayString = `${vVal.toFixed(2)} L`;
      } else if (compIdLower.includes('can_dien_tu') || nodeIdLower.includes('display_value')) {
        const mVal = stateValues['m'] ?? stateValues['mass'] ?? stateValues['weight'];
        if (mVal !== undefined) displayString = `${mVal.toFixed(2)} g`;
      } else {
        Object.entries(stateValues).forEach(([sKey, sVal]) => {
          if (displayString.includes(sKey) || nodeIdLower.includes(sKey.toLowerCase())) {
            displayString = `${sVal.toFixed(2)}`;
          }
        });
      }

      return (
        <text
          key={key}
          id={node.id}
          x={unit.x || unit.cx || width * safeNumber(node.x, 0.5)}
          y={unit.y || unit.cy || height * safeNumber(node.y, 0.5)}
          fill={toCssValue(node.fill) || '#4ade80'}
          fontSize={unit.fontSize || 14}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={transform}
          style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          {displayString}
        </text>
      );
    }
    return null;
  };

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        {defs.flatMap((defNode) =>
          defNode.children?.map((child, index) => {
            const stops = child.children?.map((stop, sIdx) => (
              <stop 
                key={`${child.id}-stop-${sIdx}`} 
                offset={stop.offset} 
                stopColor={stop.color || stop.stopColor} 
              />
            ));

            if (child.type === 'linearGradient') {
              return (
                <linearGradient 
                  key={`${child.id}-${index}`} 
                  id={child.id} 
                  x1={child.x1 ?? "0%"} 
                  y1={child.y1 ?? "0%"} 
                  x2={child.x2 ?? "100%"} 
                  y2={child.y2 ?? "0%"}
                >
                  {stops}
                </linearGradient>
              );
            }
            if (child.type === 'radialGradient') {
              return (
                <radialGradient 
                  key={`${child.id}-${index}`} 
                  id={child.id} 
                  cx={child.cx ?? "50%"} 
                  cy={child.cy ?? "50%"} 
                  r={child.r ?? "50%"}
                  fx={child.fx}
                  fy={child.fy}
                >
                  {stops}
                </radialGradient>
              );
            }
            return null;
          }),
        )}
      </defs>
      {drawable.map(renderNode)}
    </svg>
  );
}

// --- MAIN DASHBOARD FRAMEWORK ---
export function Dashboard({ currentHash }: { currentHash: string }) {
  const activeTab = currentHash === "#dashboard-settings" ? "settings" : "lab";
  const setActiveTab = (tab: "lab" | "settings") => {
    if (tab === "lab") window.location.hash = "#dashboard";
    else if (tab === "settings") window.location.hash = "#dashboard-settings";
  };

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [filePayload, setFilePayload] = useState<Nullable<string>>(null);
  const [phase1Data, setPhase1Data] = useState<Nullable<Phase1Response>>(null);
  const [phase2Data, setPhase2Data] = useState<Nullable<Phase2Response>>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [stateValues, setStateValues] = useState<Record<string, number>>({});
  const [loadingMode, setLoadingMode] = useState<LoadingMode>('idle');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const [canvasMetrics, setCanvasMetrics] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  const selectedComponents = useMemo(() => {
    const components = phase1Data?.mapped_components || [];
    return components.filter((component) => selectedIds.has(component.id));
  }, [phase1Data, selectedIds]);

  const sliderStates = useMemo(() => {
    return phase1Data?.plan?.state?.filter((item) => Array.isArray(item.range)) || [];
  }, [phase1Data]);

  const resolvedInstances = useMemo(() => {
    if (!phase2Data?.instances) return [];
    return resolveInstances(phase2Data.instances, selectedComponents);
  }, [phase2Data, selectedComponents]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! 👋 Tôi là MorPhysics, trợ lý phòng thí nghiệm vật lý ảo của bạn.\n\nHãy nhập yêu cầu hoặc đề bài toán vật lý, tôi sẽ tự động thiết kế, lắp ráp và thiết lập mô hình mô phỏng tương tác thời gian thực cho bạn!",
      timestamp: new Date(),
    },
  ]);

  // FIX 1: Tối ưu hóa cơ chế tự động cuộn chống lệch khung UI
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const calculateMetrics = () => {
      if (!canvasContainerRef.current) return;
      const containerW = canvasContainerRef.current.clientWidth;
      const containerH = canvasContainerRef.current.clientHeight;
      
      if (resolvedInstances && resolvedInstances.length > 0) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        resolvedInstances.forEach((instance) => {
          const x1 = instance.x;
          const x2 = instance.x + instance.width;
          const y1 = instance.y;
          const y2 = instance.y + instance.height;
          
          if (x1 < minX) minX = x1;
          if (x2 > maxX) maxX = x2;
          if (y1 < minY) minY = y1;
          if (y2 > maxY) maxY = y2;
        });
        
        const actualW = maxX - minX;
        const actualH = maxY - minY;
        
        const padding = 60;
        const scaleX = (containerW - padding * 2) / (actualW || 1);
        const scaleY = (containerH - padding * 2) / (actualH || 1);
        
        const scale = Math.min(scaleX, scaleY, 3.5);
        
        const bbCenterX = (minX + maxX) / 2;
        const bbCenterY = (minY + maxY) / 2;
        const offsetX = containerW / 2 - scale * bbCenterX;
        const offsetY = containerH / 2 - scale * bbCenterY;
        
        setCanvasMetrics({ scale, offsetX, offsetY });
      } else {
        const virtualW = INITIAL_CANVAS_SIZE[0];
        const virtualH = INITIAL_CANVAS_SIZE[1];
        const scaleX = containerW / virtualW;
        const scaleY = containerH / virtualH;
        const scale = Math.min(scaleX, scaleY) * 0.95;
        const offsetX = (containerW - virtualW * scale) / 2;
        const offsetY = (containerH - virtualH * scale) / 2;
        setCanvasMetrics({ scale, offsetX, offsetY });
      }
    };

    calculateMetrics();
    window.addEventListener("resize", calculateMetrics);
    return () => window.removeEventListener("resize", calculateMetrics);
  }, [resolvedInstances]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loadingMode !== 'idle') return;

    const userText = inputText.trim();
    setInputText("");
    setError('');
    setPhase1Data(null);
    setPhase2Data(null);
    setSelectedIds(new Set());
    setStateValues({});
    setLoadingMode('phase1');

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: userText, timestamp: new Date() }
    ]);

    try {
      const response = await apiService.runPhase1(userText, filePayload);
      setPhase1Data(response);
      setSelectedIds(new Set(response.mapped_components?.map((item) => item.id) || []));

      const initialState: Record<string, number> = {};
      response.plan?.state?.forEach((item) => {
        initialState[item.key] = item.initial;
      });
      
      const solvedState = evaluatePhysicsEquations(response.plan.equations || [], initialState);
      setStateValues(solvedState);

      setMessages((prev) => [
        ...prev,
        { 
          id: `bot-${Date.now()}`, 
          sender: "bot", 
          text: `🎯 **Phân tích hiện tượng:** ${response.plan.summary}\n\nĐã lập sơ đồ cấu phần linh kiện. Bạn có thể xem trước hình khối trực quan và loại bỏ thiết bị không cần thiết ở bảng phía dưới trước khi dựng không gian Lab.`, 
          timestamp: new Date() 
        }
      ]);
    } catch (err) {
      const errMsg = formatError(err);
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: "bot", text: `❌ Đã xảy ra lỗi hệ thống: ${errMsg}`, timestamp: new Date() }
      ]);
    } finally {
      setLoadingMode('idle');
    }
  };

  const handleConfirmComponents = async () => {
    if (!phase1Data || selectedComponents.length === 0 || loadingMode !== 'idle') return;

    setError('');
    setLoadingMode('phase2');

    try {
      const mappedComponentsForPhase2 = selectedComponents.map((component) => ({
        id: component.id,
        base_size: component.base_size,
        visuals: component.visuals as unknown as Record<string, string | number>[],
        anchor_points: component.anchor_points.map((anchor) => anchor.id),
        regions: component.regions as unknown as Record<string, string | number>[],
      }));

      const response = await apiService.runPhase2(
        INITIAL_CANVAS_SIZE,
        {
          summary: phase1Data.plan.summary,
          state: (phase1Data.plan.state || []) as PhysicsStateItem[],
          equations: (phase1Data.plan.equations || []) as string[],
        },
        mappedComponentsForPhase2,
        filePayload,
      );

      setPhase2Data(response);

      setMessages((prev) => {
        const cleanedHistory = prev.map((msg) => {
          if (msg.sender === "bot" && msg.text.includes("Đã lập sơ đồ cấu phần linh kiện")) {
            return {
              ...msg,
              text: msg.text.split("\n\nĐã lập sơ đồ cấu phần linh kiện")[0],
            };
          }
          return msg;
        });

        return [
          ...cleanedHistory,
          { 
            id: `bot-${Date.now()}`, 
            sender: "bot", 
            text: "⚙️ Phòng thí nghiệm ảo đã được thiết lập thành công! Hãy kéo các thanh trượt điều khiển để theo dõi các thông số cập nhật tương tác.", 
            timestamp: new Date() 
          }
        ];
      });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoadingMode('idle');
    }
  };

  const handleSliderChange = (key: string, val: number) => {
    if (!phase1Data) return;
    const nextRawState = { ...stateValues, [key]: val };
    const nextSolvedState = evaluatePhysicsEquations(phase1Data.plan.equations || [], nextRawState);
    setStateValues(nextSolvedState);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFilePayload(String(reader.result));
    reader.readAsDataURL(file);
  };

  const applySnapshot = (snapshot: Snapshot) => {
    setStateValues((prev) => {
      const next = { ...prev };
      snapshot.values.forEach((item) => {
        if (typeof item.values === 'number') next[item.key] = item.values;
      });
      return phase1Data ? evaluatePhysicsEquations(phase1Data.plan.equations || [], next) : next;
    });
  };

  const [firstName, setFirstName] = useState(() => localStorage.getItem("morphysics_first_name") || "Long Quan");
  const [lastName, setLastName] = useState(() => localStorage.getItem("morphysics_last_name") || "Ton");
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem("morphysics_profile_email") || "quan.ton@morphysics.io");

  return (
    <section className="h-screen w-screen flex flex-col bg-cloud dark:bg-slate-ink text-slate-deep dark:text-white transition-colors duration-500 overflow-hidden font-sans relative pt-20">
      <div className="aurora-blob left-[-12%] top-[-15%] h-[500px] w-[500px] bg-gold/20 dark:bg-gold/10 pointer-events-none absolute" />
      <div className="aurora-blob bottom-[-15%] right-[-8%] h-[560px] w-[560px] bg-indigo-500/25 dark:bg-indigo-500/18 pointer-events-none absolute" />

      <header className="h-20 fixed top-0 left-0 right-0 nav-glass flex items-center justify-center px-6 shadow-sm border-b border-slate-deep/5 dark:border-white/5 z-50">
        <nav className="h-14 flex items-center rounded-full border border-slate-deep/10 bg-white/50 shadow-sm dark:border-white/10 dark:bg-white/5 px-3 gap-2.5">
          <a href="#" onClick={(e) => { e.preventDefault(); setPhase1Data(null); setPhase2Data(null); }} className="group flex items-center gap-2 pl-4 pr-3 py-1.5 cursor-pointer select-none">
            <span className="font-display text-base font-bold tracking-tight">MorPhysics</span>
          </a>
          <div className="h-7 w-[1px] bg-slate-deep/10 dark:bg-white/10" />
          <ul className="flex items-center gap-2">
            <li>
              <button type="button" onClick={() => setActiveTab("lab")} onMouseEnter={() => setHoveredTab("lab")} onMouseLeave={() => setHoveredTab(null)} className={cn("relative flex h-11 min-w-[44px] items-center justify-center rounded-full cursor-pointer px-3", activeTab === "lab" ? "bg-gold text-slate-deep shadow-md font-bold" : "text-slate-gray dark:text-white/60 hover:bg-white/10")}>
                <div className="flex items-center gap-2">
                  <AnimatePresence initial={false}>
                    {hoveredTab === "lab" && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-black uppercase tracking-wide pl-1">Phòng Lab</motion.span>}
                  </AnimatePresence>
                  <Atom className="size-5.5" />
                </div>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab("settings")} onMouseEnter={() => setHoveredTab("settings")} onMouseLeave={() => setHoveredTab(null)} className={cn("relative flex h-11 min-w-[44px] items-center justify-center rounded-full cursor-pointer px-3", activeTab === "settings" ? "bg-gold text-slate-deep shadow-md font-bold" : "text-slate-gray dark:text-white/60 hover:bg-white/10")}>
                <div className="flex items-center gap-2">
                  <Settings className="size-5.5" />
                  <AnimatePresence initial={false}>
                    {hoveredTab === "settings" && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-black uppercase tracking-wide pr-1">Cấu Hình</motion.span>}
                  </AnimatePresence>
                </div>
              </button>
            </li>
          </ul>
          <div className="h-7 w-[1px] bg-slate-deep/10 dark:bg-white/10" />
          <div className="pr-2 flex items-center justify-center">
            <ThemeToggle className="size-11 rounded-full shadow-none" />
          </div>
        </nav>
      </header>

      <div className="flex-1 min-h-0 relative z-10 overflow-hidden">
        {activeTab === "lab" ? (
          <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
            {/* FIX CONTAINER CHAT: Gán ref vào div này để tự cuộn khu trú */}
            <div className="flex flex-col w-full lg:w-[420px] xl:w-[460px] shrink-0 h-[45vh] lg:h-full bg-white dark:bg-[#1a1d2e] border-r border-slate-deep/10 dark:border-white/10 overflow-hidden relative transition-colors duration-500">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3 text-base font-sans", msg.sender === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("rounded-2xl px-4 py-3 max-w-[85%] whitespace-pre-line leading-relaxed text-sm", msg.sender === "user" ? "bg-gold/20 text-slate-deep dark:text-white border border-gold/30 rounded-tr-none" : "bg-indigo-50/50 dark:bg-slate-ink/50 border border-slate-deep/5 dark:border-white/5 rounded-tl-none")}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {phase1Data && !phase2Data && loadingMode === 'idle' && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs uppercase tracking-wider text-slate-400">Linh kiện trong mô hình</span>
                      <small className="text-xs font-bold text-gold">{selectedComponents.length} đã kích hoạt</small>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                      {phase1Data.mapped_components.map((component) => {
                        const isSelected = selectedIds.has(component.id);
                        const size = getComponentSize(component);
                        return (
                          <div 
                            key={component.id} 
                            onClick={() => {
                              const next = new Set(selectedIds);
                              if (next.has(component.id)) next.delete(component.id);
                              else next.add(component.id);
                              setSelectedIds(next);
                            }} 
                            className={cn(
                              "group flex flex-col p-2 rounded-xl border bg-white dark:bg-slate-800/80 cursor-pointer transition-all hover:scale-[1.02]", 
                              isSelected ? "border-gold ring-1 ring-gold/30 shadow-md" : "border-slate-100 dark:border-slate-700/60 opacity-60"
                            )}
                          >
                            <div className="w-full h-24 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-1 mb-2">
                              <VisualRenderer
                                visuals={component.visuals as unknown as VisualNode[]}
                                width={size.width}
                                height={size.height}
                                componentId={component.id}
                                stateValues={stateValues}
                              />
                            </div>
                            <p className="text-[11px] font-bold text-center line-clamp-1 text-slate-700 dark:text-slate-200">
                              {component.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" onClick={handleConfirmComponents} className="w-full py-3 rounded-xl bg-gold text-slate-deep text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95">
                      🚀 Khởi dựng mô hình phòng Lab
                    </button>
                  </div>
                )}

                {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">{error}</div>}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1a1d2e] flex flex-col gap-3">
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className={cn("p-2 rounded-xl text-slate-gray/70 transition-colors", filePayload ? "text-emerald-500 bg-emerald-500/10" : "hover:text-gold")}>
                    <ImageIcon className="size-5" />
                  </button>
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={loadingMode === 'phase1' ? "Đang phân tích..." : "Nhập bài toán hoặc hiện tượng vật lý..."} className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/40 text-sm focus:outline-none focus:border-gold transition-all" />
                  <button type="submit" disabled={loadingMode !== 'idle'} className="size-10 rounded-2xl bg-gold text-slate-deep flex items-center justify-center shrink-0 transition-all active:scale-95">
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <div ref={canvasContainerRef} className="flex-1 relative bg-slate-soft/[0.1] dark:bg-slate-ink/[0.3] overflow-hidden">
                
                {!phase2Data && loadingMode === 'idle' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="size-16 rounded-[1.75rem] bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 animate-pulse">
                      <Atom className="size-7" />
                    </div>
                    <h4 className="text-md font-bold mb-1">Hệ thống sẵn sàng</h4>
                    <p className="text-xs text-slate-gray/80 dark:text-white/50 max-w-xs">
                      Hãy nhập câu hỏi lý thuyết hoặc bài tập tính toán ở khung bên để bắt đầu mô phỏng trực quan.
                    </p>
                  </div>
                )}

                {loadingMode !== 'idle' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-ink/20 backdrop-blur-sm z-30 space-y-3">
                    <div className="size-12 rounded-full border-4 border-gold border-t-transparent animate-spin" />
                    <span className="text-xs font-semibold text-gold tracking-wide">
                      {loadingMode === 'phase1' ? 'AI đang phân tích hiện tượng...' : 'Đang xử lý kết nối cấu trúc liên kết hình học...'}
                    </span>
                  </div>
                )}

                {phase2Data && loadingMode === 'idle' && (
                  <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                    {resolvedInstances.map((instance) => {
                      const component = selectedComponents.find((item) => item.id === instance.component_id);
                      if (!component) return null;

                      const leftPos = canvasMetrics.offsetX + instance.x * canvasMetrics.scale;
                      const topPos = canvasMetrics.offsetY + instance.y * canvasMetrics.scale;
                      const finalW = instance.width * canvasMetrics.scale;
                      const finalH = instance.height * canvasMetrics.scale;

                      return (
                        <div
                          key={instance.instance_id}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${leftPos}px`,
                            top: `${topPos}px`,
                            width: `${finalW}px`,
                            height: `${finalH}px`,
                            zIndex: instance.z_index || 1,
                          }}
                        >
                          <VisualRenderer
                            visuals={component.visuals as unknown as VisualNode[]}
                            width={instance.width}
                            height={instance.height}
                            instanceId={instance.instance_id}
                            componentId={component.id}
                            bindings={phase2Data.state_bindings || []}
                            stateValues={stateValues}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {phase2Data && loadingMode === 'idle' && (
                <div className="px-6 py-5 border-t border-slate-deep/5 dark:border-white/5 bg-white/95 dark:bg-[#161929] shrink-0 space-y-4 relative z-20">
                  {sliderStates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sliderStates.map((item) => (
                        <div key={item.key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.label || item.key}</span>
                            <span className="text-xs font-black text-gold">
                              {stateValues[item.key] !== undefined ? stateValues[item.key].toFixed(2) : item.initial} {item.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={item.range?.[0]}
                            max={item.range?.[1]}
                            step="0.01"
                            value={stateValues[item.key] ?? item.initial}
                            onChange={(e) => handleSliderChange(item.key, Number(e.target.value))}
                            className="w-full h-1 accent-gold cursor-pointer bg-slate-200 dark:bg-slate-700 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {!!phase1Data?.plan?.snapshots?.length && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trạng thái mẫu:</span>
                      <div className="flex gap-2 overflow-x-auto">
                        {phase1Data.plan.snapshots.map((snapshot) => (
                          <button key={snapshot.label} type="button" onClick={() => applySnapshot(snapshot)} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-all whitespace-nowrap">
                            {snapshot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col md:flex-row overflow-hidden relative">
            <div className="w-full md:w-[290px] shrink-0 bg-slate-soft/30 dark:bg-[#171a2e]/45 backdrop-blur-md p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-deep/10 dark:border-white/10 relative z-10">
              <div className="space-y-8">
                 <div className="flex flex-col items-center text-center">
                   <div className="relative h-24 w-24 mb-4">
                     <div className="h-full w-full rounded-full bg-slate-deep/5 dark:bg-white/10 border-2 border-gold/50 flex items-center justify-center text-3xl text-gold font-bold shadow-lg">
                       TLQ
                     </div>
                   </div>
                   <h4 className="text-base font-semibold text-slate-gray/80 dark:text-white/60 mt-1 truncate max-w-full px-2">{lastName} {firstName}</h4>
                 </div>
                <div className="h-[1px] w-full bg-slate-deep/10 dark:bg-white/10" />
                <nav className="space-y-2">
                  <button type="button" className="w-full flex items-center gap-4 px-6 py-3 rounded-2xl text-sm font-bold text-left bg-gold text-slate-deep shadow-md">
                    <User className="size-5 shrink-0" />
                    <span>Hồ Sơ Cá Nhân</span>
                  </button>
                </nav>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Cài đặt tài khoản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Tên</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Họ</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Địa chỉ Email</label>
                  <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm" />
                </div>
                <button type="button" onClick={() => alert("Đã lưu!")} className="px-4 py-2 bg-gold text-slate-deep rounded-xl font-bold text-sm">Cập nhật</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}