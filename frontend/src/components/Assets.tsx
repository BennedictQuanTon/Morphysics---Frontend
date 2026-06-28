import { useState } from "react";
import { Search, Box } from "lucide-react";

export function Assets() {
  const [activeTab, setActiveTab] = useState<"experiments" | "components">(
    "experiments",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const experiments = [
    {
      title: "Projectile Motion",
      category: "Kinematics",
      description:
        "Simulate objects launched at various angles and velocities. Explore trajectory, range, and maximum height.",
      icon: "🚀",
      difficulty: "Beginner",
      parameters: ["Initial Velocity", "Launch Angle", "Gravity"],
    },
    {
      title: "Simple Pendulum",
      category: "Oscillations",
      description:
        "Study periodic motion with adjustable length and amplitude. Observe period, frequency, and energy transfer.",
      icon: "⚖️",
      difficulty: "Beginner",
      parameters: ["Length", "Amplitude", "Gravity"],
    },
    {
      title: "Spring-Mass System",
      category: "Oscillations",
      description:
        "Investigate Hooke's law and simple harmonic motion with spring constants and masses.",
      icon: "🔷",
      difficulty: "Intermediate",
      parameters: ["Spring Constant", "Mass", "Damping"],
    },
    {
      title: "Elastic Collision",
      category: "Dynamics",
      description:
        "Explore conservation of momentum and kinetic energy in 1D and 2D collisions.",
      icon: "💥",
      difficulty: "Intermediate",
      parameters: ["Mass 1", "Mass 2", "Velocity 1", "Velocity 2"],
    },
    {
      title: "Inelastic Collision",
      category: "Dynamics",
      description:
        "Study collisions where objects stick together. Analyze momentum conservation and energy loss.",
      icon: "🔴",
      difficulty: "Intermediate",
      parameters: ["Mass 1", "Mass 2", "Velocity", "Coefficient"],
    },
    {
      title: "Free Fall Motion",
      category: "Kinematics",
      description:
        "Observe objects falling under gravity. Measure acceleration, velocity, and displacement.",
      icon: "⬇️",
      difficulty: "Beginner",
      parameters: ["Initial Height", "Initial Velocity", "Gravity"],
    },
    {
      title: "Inclined Plane",
      category: "Dynamics",
      description:
        "Analyze forces on objects on slopes. Include friction and normal force calculations.",
      icon: "📐",
      difficulty: "Intermediate",
      parameters: ["Angle", "Mass", "Friction Coefficient"],
    },
    {
      title: "Circular Motion",
      category: "Kinematics",
      description:
        "Study uniform and non-uniform circular motion. Explore centripetal force and acceleration.",
      icon: "⭕",
      difficulty: "Intermediate",
      parameters: ["Radius", "Angular Velocity", "Mass"],
    },
    {
      title: "Wave Motion",
      category: "Waves",
      description:
        "Visualize transverse and longitudinal waves. Adjust frequency, amplitude, and wavelength.",
      icon: "🌊",
      difficulty: "Intermediate",
      parameters: ["Frequency", "Amplitude", "Wavelength"],
    },
    {
      title: "Standing Waves",
      category: "Waves",
      description:
        "Create interference patterns and resonance. Explore nodes and antinodes.",
      icon: "〰️",
      difficulty: "Advanced",
      parameters: ["Length", "Frequency", "Wave Speed"],
    },
    {
      title: "Doppler Effect",
      category: "Waves",
      description:
        "Simulate frequency shifts due to relative motion. Applications in sound and light.",
      icon: "📻",
      difficulty: "Advanced",
      parameters: ["Source Velocity", "Observer Velocity", "Frequency"],
    },
    {
      title: "Pulley System",
      category: "Dynamics",
      description:
        "Analyze mechanical advantage in single and compound pulley systems.",
      icon: "🔺",
      difficulty: "Intermediate",
      parameters: ["Number of Pulleys", "Mass", "Force"],
    },
    {
      title: "Atwood Machine",
      category: "Dynamics",
      description:
        "Study two masses connected over a pulley. Calculate tension and acceleration.",
      icon: "⚖️",
      difficulty: "Intermediate",
      parameters: ["Mass 1", "Mass 2", "Pulley Radius"],
    },
    {
      title: "Rotational Motion",
      category: "Rotation",
      description:
        "Explore angular velocity, acceleration, and torque. Include moment of inertia.",
      icon: "🔄",
      difficulty: "Advanced",
      parameters: ["Radius", "Torque", "Moment of Inertia"],
    },
    {
      title: "Energy Conservation",
      category: "Energy",
      description:
        "Visualize conversion between kinetic and potential energy in various systems.",
      icon: "⚡",
      difficulty: "Intermediate",
      parameters: ["Initial Height", "Mass", "Spring Constant"],
    },
    {
      title: "Friction Forces",
      category: "Dynamics",
      description:
        "Investigate static and kinetic friction on horizontal and inclined surfaces.",
      icon: "🛑",
      difficulty: "Beginner",
      parameters: ["Mass", "Surface Type", "Applied Force"],
    },
    {
      title: "Electric Field",
      category: "Electromagnetism",
      description:
        "Visualize electric field lines around point charges and charge distributions.",
      icon: "⚡",
      difficulty: "Advanced",
      parameters: ["Charge 1", "Charge 2", "Distance"],
    },
    {
      title: "Magnetic Field",
      category: "Electromagnetism",
      description:
        "Display magnetic field patterns around currents and magnets.",
      icon: "🧲",
      difficulty: "Advanced",
      parameters: ["Current", "Wire Length", "Distance"],
    },
    {
      title: "Photoelectric Effect",
      category: "Quantum",
      description:
        "Demonstrate particle nature of light. Vary frequency and intensity.",
      icon: "💡",
      difficulty: "Advanced",
      parameters: ["Frequency", "Intensity", "Work Function"],
    },
    {
      title: "Simple Harmonic Motion",
      category: "Oscillations",
      description:
        "General SHM simulator with position, velocity, and acceleration graphs.",
      icon: "📊",
      difficulty: "Intermediate",
      parameters: ["Amplitude", "Frequency", "Phase"],
    },
  ];

  const components = [
    {
      name: "Input Field",
      category: "Form Controls",
      description:
        "Customizable text input with validation and styling options",
      preview: "input",
    },
    {
      name: "Button",
      category: "Interactive",
      description: "Primary, secondary, and outlined button variants",
      preview: "button",
    },
    {
      name: "Slider",
      category: "Form Controls",
      description: "Range slider for numeric input with min/max values",
      preview: "slider",
    },
    {
      name: "Card",
      category: "Layout",
      description: "Container component with border and shadow effects",
      preview: "card",
    },
    {
      name: "Toggle Switch",
      category: "Form Controls",
      description: "On/off switch for boolean states",
      preview: "toggle",
    },
    {
      name: "Dropdown",
      category: "Form Controls",
      description: "Select dropdown with search and multi-select options",
      preview: "dropdown",
    },
    {
      name: "Modal",
      category: "Overlay",
      description: "Dialog overlay for focused interactions",
      preview: "modal",
    },
    {
      name: "Tooltip",
      category: "Overlay",
      description: "Contextual information on hover",
      preview: "tooltip",
    },
    {
      name: "Progress Bar",
      category: "Feedback",
      description: "Visual indicator for task completion",
      preview: "progress",
    },
    {
      name: "Chart",
      category: "Data Visualization",
      description: "Line, bar, and scatter plot components",
      preview: "chart",
    },
  ];

  const filteredExperiments = experiments.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredComponents = components.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Explore Our <span className="text-[#ffc800]">Physics Library</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready-to-use experiments and components to accelerate your physics
            learning journey
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("experiments")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer border ${
              activeTab === "experiments"
                ? "bg-[#ffc800] text-[#23273d] border-[#ffc800]"
                : "bg-[#1f2236] border-[#ffc800]/30 text-white hover:border-[#ffc800]"
            }`}
          >
            Physics Experiments ({experiments.length})
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer border ${
              activeTab === "components"
                ? "bg-[#ffc800] text-[#23273d] border-[#ffc800]"
                : "bg-[#1f2236] border-[#ffc800]/30 text-white hover:border-[#ffc800]"
            }`}
          >
            UI Components ({components.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1f2236] border border-[#ffc800]/30 rounded-lg text-white placeholder-gray-400 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Experiments Grid */}
        {activeTab === "experiments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp, index) => (
              <div
                key={index}
                className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 hover:border-[#ffc800] transition-all group cursor-pointer"
              >
                {/* Icon & Category */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{exp.icon}</div>
                  <span className="px-3 py-1 bg-[#ffc800]/10 border border-[#ffc800]/30 rounded-full text-xs text-[#ffc800] font-semibold">
                    {exp.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ffc800] transition-colors">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Difficulty */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">Difficulty:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      exp.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-400"
                        : exp.difficulty === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {exp.difficulty}
                  </span>
                </div>

                {/* Parameters */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold">
                    Adjustable Parameters:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.parameters.map((param, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#23273d] border border-[#ffc800]/20 rounded text-xs text-gray-300"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Try Button */}
                <button className="w-full mt-6 px-4 py-2 bg-[#ffc800]/10 border border-[#ffc800] text-[#ffc800] rounded-lg font-semibold hover:bg-[#ffc800] hover:text-[#23273d] transition-all cursor-pointer">
                  Try Experiment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Components Grid */}
        {activeTab === "components" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((comp, index) => (
              <div
                key={index}
                className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 hover:border-[#ffc800] transition-all group cursor-pointer"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#ffc800]/20 rounded-lg flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-[#ffc800]" />
                </div>

                {/* Name & Category */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ffc800] transition-colors">
                  {comp.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-[#ffc800]/10 border border-[#ffc800]/30 rounded-full text-xs text-[#ffc800] font-semibold mb-4">
                  {comp.category}
                </span>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {comp.description}
                </p>

                {/* Preview */}
                <div className="bg-[#23273d] border border-[#ffc800]/20 rounded-lg p-4 mb-4">
                  {comp.preview === "input" && (
                    <input
                      type="text"
                      placeholder="Example input"
                      className="w-full px-3 py-2 bg-[#1f2236] border border-[#ffc800]/50 rounded text-white text-sm"
                      readOnly
                    />
                  )}
                  {comp.preview === "button" && (
                    <button className="px-4 py-2 bg-[#ffc800] text-[#23273d] rounded font-semibold text-sm cursor-pointer border-0">
                      Example Button
                    </button>
                  )}
                  {comp.preview === "slider" && (
                    <input type="range" className="w-full" readOnly />
                  )}
                  {comp.preview === "card" && (
                    <div className="border border-[#ffc800]/30 rounded p-3">
                      <p className="text-xs text-gray-400">Card Content</p>
                    </div>
                  )}
                  {comp.preview === "toggle" && (
                    <div className="w-12 h-6 bg-[#ffc800] rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-[#23273d] rounded-full"></div>
                    </div>
                  )}
                  {!["input", "button", "slider", "card", "toggle"].includes(
                    comp.preview,
                  ) && (
                    <p className="text-xs text-gray-400 text-center">
                      Preview Available
                    </p>
                  )}
                </div>

                {/* Use Button */}
                <button className="w-full px-4 py-2 bg-[#ffc800]/10 border border-[#ffc800] text-[#ffc800] rounded-lg font-semibold hover:bg-[#ffc800] hover:text-[#23273d] transition-all cursor-pointer">
                  Use Component
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {((activeTab === "experiments" && filteredExperiments.length === 0) ||
          (activeTab === "components" && filteredComponents.length === 0)) && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">
              No results found for "{searchQuery}"
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
