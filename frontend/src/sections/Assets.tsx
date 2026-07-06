import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

// Import all 18 interactive components
import {
  Cylinder,
  HydraulicPiston,
  PressureGauge,
  Thermometer,
  WeightMass,
  TempSensor,
  VacuumPump,
  ElectronicHeater,
  Condenser,
  GasValve,
  PressureChamber,
  CompassNeedle,
  PermanentMagnet,
  MaglevTrain,
  RectangularCoil,
  ParallelWires,
  ACGenerator,
  IdealTransformer,
} from "@/components/physics/items";

interface AssetCard {
  id: string;
  nameEn: string;
  nameVi: string;
  category: "thermo" | "electro";
  component: React.ComponentType;
  description: string;
}

const assetsData: AssetCard[] = [
  {
    id: "cylinder",
    nameEn: "Gas Cylinder",
    nameVi: "Xi lanh khí",
    category: "thermo",
    component: Cylinder,
    description: "Compresses gas to show the inverse relationship between volume and pressure under constant temperature.",
  },
  {
    id: "hydraulic-piston",
    nameEn: "Hydraulic Piston",
    nameVi: "Piston thủy lực",
    category: "thermo",
    component: HydraulicPiston,
    description: "Demonstrates Pascal's principle of force multiplication through connected fluid chambers.",
  },
  {
    id: "pressure-gauge",
    nameEn: "Pressure Gauge",
    nameVi: "Áp kế",
    category: "thermo",
    component: PressureGauge,
    description: "Measures fluid or gas pressure inside chambers, indicating safe limits and high-pressure zones.",
  },
  {
    id: "thermometer",
    nameEn: "Thermometer",
    nameVi: "Nhiệt kế",
    category: "thermo",
    component: Thermometer,
    description: "Visualizes liquid thermal expansion as temperature changes, showing room, hot, and cold states.",
  },
  {
    id: "weight-mass",
    nameEn: "Weight & Mass",
    nameVi: "Quả nặng",
    category: "thermo",
    component: WeightMass,
    description: "Models a spring-mass system to demonstrate gravity vectors, spring tension, and simple harmonic motion.",
  },
  {
    id: "temp-sensor",
    nameEn: "Temperature Sensor",
    nameVi: "Cảm biến nhiệt độ",
    category: "thermo",
    component: TempSensor,
    description: "Converts temperature readings into electronic signals with Celsius and Fahrenheit unit options.",
  },
  {
    id: "vacuum-pump",
    nameEn: "Vacuum Pump",
    nameVi: "Bơm hút khí chân không",
    category: "thermo",
    component: VacuumPump,
    description: "Extracts gas molecules from a bell jar to study behavior in a low-pressure vacuum environment.",
  },
  {
    id: "electronic-heater",
    nameEn: "Electronic Heater",
    nameVi: "Bộ gia nhiệt điện tử",
    category: "thermo",
    component: ElectronicHeater,
    description: "Uses electric current to heat experimental chambers, displaying live temperature rising.",
  },
  {
    id: "condenser",
    nameEn: "Condenser",
    nameVi: "Bộ ngưng tụ",
    category: "thermo",
    component: Condenser,
    description: "Cooling jacket spiral tube system demonstrating phase transitions from gas/vapor to liquid water.",
  },
  {
    id: "gas-valve",
    nameEn: "Gas Valve",
    nameVi: "Van khóa khí",
    category: "thermo",
    component: GasValve,
    description: "Regulates flow in pneumatic systems, demonstrating open vs. blocked gas flow dynamics.",
  },
  {
    id: "pressure-chamber",
    nameEn: "Pressure Chamber",
    nameVi: "Buồng kín áp suất",
    category: "thermo",
    component: PressureChamber,
    description: "Heavy-duty steel chamber visualizing high-density molecular kinetic speed and warnings.",
  },
  {
    id: "compass-needle",
    nameEn: "Compass Needle",
    nameVi: "Kim la bàn",
    category: "electro",
    component: CompassNeedle,
    description: "Pivoted magnetic needle that aligns with ambient magnetic fields, tracking your cursor in real-time.",
  },
  {
    id: "permanent-magnet",
    nameEn: "Permanent Magnet",
    nameVi: "Nam châm vĩnh cửu",
    category: "electro",
    component: PermanentMagnet,
    description: "Bar magnet displaying magnetic flux lines flowing from North to South with polarity reversing.",
  },
  {
    id: "maglev-train",
    nameEn: "Maglev Train Model",
    nameVi: "Mô hình tàu đệm từ",
    category: "electro",
    component: MaglevTrain,
    description: "Futuristic coach levitating over a track via electromagnetic suspension, sliding back and forth.",
  },
  {
    id: "rectangular-coil",
    nameEn: "Rectangular Coil",
    nameVi: "Khung dây chữ nhật",
    category: "electro",
    component: RectangularCoil,
    description: "A loop inside a magnetic field that experiences mechanical torque when electric current is applied.",
  },
  {
    id: "parallel-wires",
    nameEn: "Parallel Wires System",
    nameVi: "Hệ thống hai dây song song",
    category: "electro",
    component: ParallelWires,
    description: "Simulates Ampere's force law, demonstrating magnetic repulsion between opposite-current wires.",
  },
  {
    id: "ac-generator",
    nameEn: "Single-Phase AC Generator",
    nameVi: "Máy phát điện xoay chiều 1 pha",
    category: "electro",
    component: ACGenerator,
    description: "Generates alternating current via loop rotation in a magnetic field, showing live waves on a scope.",
  },
  {
    id: "ideal-transformer",
    nameEn: "Ideal Transformer",
    nameVi: "Máy biến áp lý tưởng",
    category: "electro",
    component: IdealTransformer,
    description: "Transfers energy between circuits via electromagnetic induction, stepping voltage up or down.",
  },
];

// Single stat item component with NumberFlow count-up
function StatColumn({
  value,
  suffix = "+",
  title,
  desc,
}: {
  value: number;
  suffix?: string;
  title: string;
  desc: string;
}) {
  const [currentVal, setCurrentVal] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  return (
    <motion.div
      onViewportEnter={() => {
        isIntersectingRef.current = true;
        if (fontsReady) {
          setCurrentVal(value);
        }
      }}
      onViewportLeave={() => {
        isIntersectingRef.current = false;
        setCurrentVal(0);
      }}
      viewport={{ margin: "-40px" }}
      className="flex flex-col items-center text-center px-6 py-8 md:py-6 flex-1 border-r border-slate-deep/10 dark:border-white/10 last:border-r-0"
    >
      <div className="font-sans text-6xl md:text-7xl font-black tracking-tight text-slate-deep dark:text-white flex items-center justify-center">
        <span className="inline-block tracking-normal flex-shrink-0" style={{ letterSpacing: "normal" }}>
          <NumberFlow
            key={fontsReady ? "ready" : "loading"}
            value={currentVal}
            suffix={suffix}
            transformTiming={{ duration: 1500, easing: "ease-out" }}
          />
        </span>
      </div>
      <h4 className="mt-4 font-display italic font-semibold text-gold text-2xl">
        {title}
      </h4>
      <p className="mt-3 text-base sm:text-lg text-slate-gray dark:text-white/70 leading-relaxed max-w-[280px]">
        {desc}
      </p>
    </motion.div>
  );
}

export function Assets() {
  const [filter, setFilter] = useState<"all" | "thermo" | "electro">("all");

  const filteredAssets =
    filter === "all" ? assetsData : assetsData.filter((a) => a.category === filter);

  return (
    <section className="relative overflow-hidden bg-indigo-50/40 dark:bg-slate-ink pt-28 pb-24 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob right-[-10%] top-[-5%] h-[400px] w-[400px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[-10%] bottom-[-5%] h-[400px] w-[400px] bg-indigo-500/10 dark:bg-indigo-500/8" />

      {/* Dotted texture background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight !leading-[1.2] mb-4">
              <span className="block font-sans text-slate-deep dark:text-white">
                Explore Our
              </span>
              <span className="block font-display italic font-semibold text-gold mt-2">
                Simulation Assets.
              </span>
            </h2>
            <p className="text-slate-gray dark:text-white/70 text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Interactive, high-fidelity 2D UI components designed to help students visualize abstract physical concepts through direct experimentation.
            </p>
          </Reveal>
        </div>

        {/* Stats card (Horizontal layout divided by vertical lines) */}
        <div className="max-w-4xl mx-auto mb-16">
          <Reveal delay={0.1}>
            <div className="card-surface relative overflow-hidden rounded-[2rem] p-6 md:p-8 shadow-lg border border-slate-deep/5 dark:border-white/5 bg-white/70 dark:bg-[#1f2236]/80 backdrop-blur-md transition-all duration-300">
              {/* Radial gradient glow accents inside card */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="flex flex-col md:flex-row justify-between items-stretch">
                <StatColumn
                  value={120}
                  suffix="+"
                  title="Coded Elements"
                  desc="From valves, cylinders, to indicators, we cover the essentials."
                />
                <StatColumn
                  value={70}
                  suffix="+"
                  title="Thermodynamics"
                  desc="Components designed for heat, gases, pressure, and fluids."
                />
                <StatColumn
                  value={50}
                  suffix="+"
                  title="Electromagnetism"
                  desc="Assets representing electromagnetic fields, current wires, and induction."
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          <Reveal delay={0.15}>
            <div className="inline-flex rounded-full border border-slate-deep/10 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-200",
                  filter === "all"
                    ? "bg-gold text-slate-deep font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                All Components
              </button>
              <button
                type="button"
                onClick={() => setFilter("thermo")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-200",
                  filter === "thermo"
                    ? "bg-gold text-slate-deep font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                Thermodynamics
              </button>
              <button
                type="button"
                onClick={() => setFilter("electro")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-200",
                  filter === "electro"
                    ? "bg-gold text-slate-deep font-bold"
                    : "text-slate-gray hover:text-slate-deep dark:text-white/60 dark:hover:text-white"
                )}
              >
                Electromagnetism
              </button>
            </div>
          </Reveal>
        </div>

        {/* Components Exhibition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredAssets.map((asset, idx) => {
            const Comp = asset.component;
            return (
              <Reveal key={asset.id} delay={idx * 0.03} className="h-full">
                <div className="card-surface group relative overflow-hidden rounded-3xl p-6 shadow-md border border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col justify-between">
                  {/* Decorative wavy top-right corner background shape */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gold/10 dark:bg-gold/5 pointer-events-none transition-all duration-350 group-hover:bg-gold/15" />

                  {/* Component interactive box frame */}
                  <div className="w-full h-56 rounded-2xl border border-slate-deep/5 dark:border-white/5 bg-slate-deep/[0.01] dark:bg-white/[0.01] overflow-hidden mb-6 flex items-center justify-center p-2 relative shadow-inner group-hover:bg-slate-deep/[0.02] dark:group-hover:bg-white/[0.02] transition-colors">
                    <Comp />
                  </div>

                  {/* Divider Line with Dot */}
                  <div className="flex items-center justify-center gap-3 my-4">
                    <div className="h-[1px] w-12 bg-slate-deep/10 dark:bg-white/10" />
                    <div className="h-2 w-2 rounded-full bg-gold" />
                    <div className="h-[1px] w-12 bg-slate-deep/10 dark:bg-white/10" />
                  </div>

                  {/* Details */}
                  <div className="mt-2 text-center">
                    <h3 className="font-sans text-2xl font-bold text-slate-deep dark:text-white">
                      {asset.nameEn}
                    </h3>
                    <h4 className="font-display italic text-base text-gold mt-1.5 font-semibold uppercase tracking-wider">
                      {asset.nameVi}
                    </h4>
                    <p className="text-base text-slate-gray dark:text-white/70 leading-relaxed font-sans mt-3 px-2">
                      {asset.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Assets;
