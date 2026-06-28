import { useState, useEffect } from "react";
import {
  Globe,
  Zap,
  Users,
  BookOpen,
  ArrowRight,
  Check,
  Star,
  X,
} from "lucide-react";
import Lottie from "lottie-react";
import mascotData from "../Images/demo.json";
import bkLogo from "../Images/bk.png";
import usLogo from "../Images/us.png";
import utsLogo from "../Images/UTS_Logo_Full.png";
import hcmueLogo from "../Images/hcmue.png";
import iuhLogo from "../Images/iuh.png";
import uitLogo from "../Images/uit.png";

export function LandingPage({
  onGetStarted,
  isLightTheme,
}: {
  onGetStarted: () => void;
  isLightTheme: boolean;
}) {
  const [showSecondSet, setShowSecondSet] = useState(false);
  const [isScaling, setIsScaling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsScaling(true);
      setTimeout(() => {
        setShowSecondSet((prev) => !prev);
        setTimeout(() => {
          setIsScaling(false);
        }, 600);
      }, 450);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const cardStyle = {
    perspective: "1000px",
  };

  const innerStyle = (flipped: boolean, scaling: boolean) => ({
    position: "relative" as const,
    width: "100%",
    height: "100%",
    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    transformStyle: "preserve-3d" as const,
    transform: `${flipped ? "rotateX(180deg)" : "rotateX(0deg)"} ${scaling ? "scale(1.15)" : "scale(1)"}`,
  });

  const faceStyle = (isBack = false) => ({
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    transform: isBack ? "rotateX(180deg)" : "rotateX(0deg)",
  });

  return (
    <div className="min-h-screen bg-[#23273d] text-white overflow-hidden">
      {/* Grid background pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255, 200, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 200, 0, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Ambient Thermal Heat Map Spots (Warm up/cool down, floating dynamically) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Top-Right warm golden thermal spot */}
        <div className="absolute top-[-20%] right-[-20%] w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[#ffc800]/25 to-[#ffc800]/5 blur-[180px] animate-heatmap-1" />

        {/* Bottom-Left cold-to-warm transitioning thermal spot */}
        <div className="absolute bottom-[-20%] left-[-20%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-[#598bff]/20 to-[#ffc800]/10 blur-[220px] animate-heatmap-2" />

        {/* Middle-Right auxiliary pulsing thermal spot */}
        <div
          className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-l from-[#ffc800]/15 to-transparent blur-[160px] animate-heatmap-1"
          style={{ animationDelay: "-5s" }}
        />

        {/* Top-Left small warm floating spot */}
        <div
          className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#ffc800]/15 to-transparent blur-[150px] animate-heatmap-2"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      {/* Animated Sine Wave */}
      <div className="fixed top-1/4 left-0 right-0 pointer-events-none opacity-40 z-0">
        <svg
          width="100%"
          height="400"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 Q150,-20 300,200 T600,200 T900,200 T1200,200"
            fill="none"
            stroke="#ffc800"
            strokeWidth="4"
            opacity="0.8"
          >
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="
                M0,200 Q150,-20 300,200 T600,200 T900,200 T1200,200;
                M0,200 Q150,420 300,200 T600,200 T900,200 T1200,200;
                M0,200 Q150,-20 300,200 T600,200 T900,200 T1200,200
              "
            />
          </path>
          <path
            d="M0,230 Q150,10 300,230 T600,230 T900,230 T1200,230"
            fill="none"
            stroke="#598bff"
            strokeWidth="3"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              dur="18s"
              repeatCount="indefinite"
              values="
                M0,230 Q150,10 300,230 T600,230 T900,230 T1200,230;
                M0,230 Q150,450 300,230 T600,230 T900,230 T1200,230;
                M0,230 Q150,10 300,230 T600,230 T900,230 T1200,230
              "
            />
          </path>
        </svg>
      </div>

      <div className="flex flex-col justify-between min-h-[calc(100vh-76px)]">
        {/* Hero Section */}
        <section className="relative flex-grow flex items-center py-6 md:py-8 lg:py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6 lg:space-y-8">
                <div className="flex items-center gap-3">
                  <div className="inline-block px-4 py-2 bg-[#ffc800]/10 border border-[#ffc800]/30 rounded-full">
                    <span className="text-sm text-[#ffc800] font-semibold">
                      BackKhoa Innovation 2026
                    </span>
                  </div>
                  {/* Small animated mascot */}
                  <div className="w-10 h-10 bg-white/5 rounded-full p-1 border border-white/10 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <Lottie
                      animationData={mascotData}
                      loop={true}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Make the static dynamic with{" "}
                  <span className="text-[#ffc800]">Virtual Lab AI</span>
                </h2>

                <p className="text-xl text-gray-300 leading-relaxed">
                  Transform textual descriptions into interactive, real-time AI
                  physics simulations for highly engaging learning and
                  reasoning.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={onGetStarted}
                    className="group px-8 py-4 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold transition-all duration-300 text-lg flex items-center gap-2 cursor-pointer border-0 hover:scale-105 hover:-translate-y-1 active:scale-95 hover:shadow-[0_0_25px_rgba(255,200,0,0.5)]"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="px-8 py-4 bg-[#1f2236] border-2 border-[#ffc800]/30 text-white rounded-lg font-semibold transition-all duration-300 text-lg cursor-pointer hover:scale-105 hover:-translate-y-1 active:scale-95 hover:border-[#ffc800] hover:bg-[#ffc800]/5"
                  >
                    Talk to Sales
                  </button>
                </div>
              </div>

              {/* Right Visual - Hidden on mobile to fit screen height */}
              <div className="relative hidden lg:block">
                <div className="w-full h-96 bg-gradient-to-br from-[#ffc800]/10 to-[#598bff]/10 rounded-2xl border border-[#ffc800]/25 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient from-[#ffc800]/5 to-transparent blur-2xl pointer-events-none" />

                  <div className="w-64 h-64 relative z-10 hover:scale-105 transition-transform duration-500 ease-out">
                    <Lottie
                      animationData={mascotData}
                      loop={true}
                      className="w-full h-full"
                    />
                  </div>

                  <p className="text-gray-300 font-semibold tracking-wide mt-4 relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ffc800] animate-pulse" />
                    Interactive Physics Sandbox
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* University Logos Section */}
        <section className="relative py-4 md:py-6 px-4 md:px-6 bg-white/[0.02] backdrop-blur-md border-t border-[#ffc800]/10 z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-400 text-xs md:text-sm uppercase tracking-widest mb-3 font-semibold">
              Trusted by Students and Educators from
            </p>
            <div className="grid grid-cols-3 gap-12 md:gap-24 items-center justify-items-center">
              {/* Card 1: UTS -> HCMUE */}
              <div
                style={cardStyle}
                className="w-full max-w-[220px] h-20 md:h-24"
              >
                <div style={innerStyle(showSecondSet, isScaling)}>
                  {/* Front: UTS */}
                  <div style={faceStyle(false)}>
                    <img
                      src={utsLogo}
                      alt="UTS Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-0 invert"
                      }`}
                    />
                  </div>
                  {/* Back: HCMUE */}
                  <div style={faceStyle(true)}>
                    <img
                      src={hcmueLogo}
                      alt="HCMUE Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-125"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Bách Khoa -> IUH */}
              <div
                style={cardStyle}
                className="w-full max-w-[220px] h-20 md:h-24"
              >
                <div style={innerStyle(showSecondSet, isScaling)}>
                  {/* Front: Bách Khoa */}
                  <div style={faceStyle(false)}>
                    <img
                      src={bkLogo}
                      alt="Bách Khoa Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-125"
                      }`}
                    />
                  </div>
                  {/* Back: IUH */}
                  <div style={faceStyle(true)}>
                    <img
                      src={iuhLogo}
                      alt="IUH Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-125"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: US -> UIT */}
              <div
                style={cardStyle}
                className="w-full max-w-[220px] h-20 md:h-24"
              >
                <div style={innerStyle(showSecondSet, isScaling)}>
                  {/* Front: US */}
                  <div style={faceStyle(false)}>
                    <img
                      src={usLogo}
                      alt="US Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-0 invert"
                      }`}
                    />
                  </div>
                  {/* Back: UIT */}
                  <div style={faceStyle(true)}>
                    <img
                      src={uitLogo}
                      alt="UIT Logo"
                      className={`max-h-12 md:max-h-16 max-w-[95%] object-contain opacity-75 hover:opacity-100 transition-opacity duration-300 ${
                        isLightTheme ? "" : "brightness-125"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <section className="relative pt-12 pb-16 px-6 border-y border-[#ffc800]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#ffc800] mb-2">
                99.8% Accuracy
              </div>
              <p className="text-gray-400">
                Computational mathematics resolved via advanced analytical
                solvers
              </p>
            </div>
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#ffc800] mb-2">
                &lt; 3 Seconds
              </div>
              <p className="text-gray-400">
                Average generation time from text prompts to runnable sandbox
                simulations
              </p>
            </div>
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#ffc800] mb-2">
                Multi-Physics Engine
              </div>
              <p className="text-gray-400">
                Seamless real-time modeling of kinematics, forces, and
                collisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold mb-4">
              Advanced Interactive{" "}
              <span className="text-[#ffc800]">Physics Sandbox Systems</span>
            </h3>
            <p className="text-xl text-gray-300">
              State-of-the-art AI technology coupled with world-class
              interactive visualizations designed for global educators and
              students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8 hover:border-[#ffc800] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-[#ffc800]" />
                </div>
                <h4 className="text-xl font-bold mb-4">
                  1. Product Features & Tech
                </h4>
                <p className="text-gray-300 text-sm mb-6">
                  Seamlessly recognizes and extracts complex mathematical and
                  physical formulas from textbook screenshots, documents, or
                  handwritten notes.
                </p>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    AI Multimodal Formula OCR
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Deep Parameter Fine-Tuning
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    High-Fidelity 2D Physics Engine
                  </span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8 hover:border-[#ffc800] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#ffc800]" />
                </div>
                <h4 className="text-xl font-bold mb-4">
                  2. User Experience - UX/UI
                </h4>
                <p className="text-gray-300 text-sm mb-6">
                  Instantly visualizes physical forces, acceleration vectors,
                  and motions in real-time with responsive animations.
                </p>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    No Coding Knowledge Required
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Drag-and-Drop Sandbox Canvas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Adaptive Web & Mobile Support
                  </span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8 hover:border-[#ffc800] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-[#ffc800]" />
                </div>
                <h4 className="text-xl font-bold mb-4">3. Business Model</h4>
                <p className="text-gray-300 text-sm mb-6">
                  Flexible Freemium model combined with an affordable
                  Pay-As-You-Go structure powered by instant credit top-ups.
                </p>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Pay-per-scan Credit Architecture
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Optimized OpenAI API Pipelines
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Viral Share-to-Earn Credit System
                  </span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-8 hover:border-[#ffc800] transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-[#ffc800]" />
                </div>
                <h4 className="text-xl font-bold mb-4">
                  4. Operations & Policy
                </h4>
                <p className="text-gray-300 text-sm mb-6">
                  Operating with maximum security, strict content moderation,
                  and absolute data compliance for classroom safety.
                </p>
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Auto-refund Rollback on Failures
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Real-time Safe Content Filters
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#ffc800] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">
                    Direct Slides & LMS Integrations
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold mb-4">
              Convenient &{" "}
              <span className="text-[#ffc800]">Flexible Pricing Models</span>
            </h3>
            <p className="text-xl text-gray-300">
              No locked-in monthly subscriptions. Buy flexible credits
              seamlessly starting as low as $0.50!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan (Cyan/Teal Theme) */}
            <div
              className={`group relative border rounded-xl p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between z-10 ${
                isLightTheme
                  ? "bg-white border-cyan-200 shadow-xl shadow-cyan-500/5 hover:border-cyan-500"
                  : "bg-gradient-to-b from-[#0f172a] to-[#090d16] border-cyan-500/20 hover:border-cyan-400"
              }`}
            >
              {/* Radial Glowing Back-Shadow (Triggered on hover) */}
              <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[60px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,transparent_70%)] pointer-events-none -z-10" />

              <div>
                <div className="mb-6">
                  <h4
                    className={`text-xl font-bold mb-2 ${isLightTheme ? "text-cyan-600" : "text-cyan-400"}`}
                  >
                    Free Trial
                  </h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className={`text-5xl font-bold ${isLightTheme ? "text-cyan-600" : "text-cyan-400"}`}
                    >
                      $0
                    </span>
                    <span
                      className={
                        isLightTheme ? "text-slate-500" : "text-gray-400"
                      }
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className={
                      isLightTheme
                        ? "text-slate-500 text-sm"
                        : "text-gray-400 text-sm"
                    }
                  >
                    Ideal for exploring the virtual lab
                  </p>
                </div>
                <div
                  className={`h-px my-6 ${isLightTheme ? "bg-slate-200" : "bg-white/10"}`}
                ></div>
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-cyan-600" : "text-cyan-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      5 free AI simulation scans
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-cyan-600" : "text-cyan-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Basic 2D physics models
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-cyan-600" : "text-cyan-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Community hub support
                    </span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className={`w-full px-6 py-3 rounded-lg font-semibold border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                  isLightTheme
                    ? "bg-cyan-600 text-white hover:bg-cyan-700 border-cyan-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    : "bg-cyan-500/10 text-cyan-400 border-cyan-400/30 hover:bg-cyan-500 hover:text-[#090d16] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                }`}
              >
                Start for Free
              </button>
            </div>

            {/* Student Pay-As-You-Go Plan (Royal Gold Theme) */}
            <div
              className={`group relative border-2 rounded-xl p-8 shadow-2xl flex flex-col justify-between transform lg:scale-105 hover:-translate-y-1 transition-all duration-300 z-20 ${
                isLightTheme
                  ? "bg-white border-[#ffc800] shadow-xl shadow-amber-500/5"
                  : "bg-gradient-to-b from-[#0f172a] to-[#090d16] border-[#ffc800]"
              }`}
            >
              {/* Radial Glowing Back-Shadow (Triggered on hover) */}
              <div className="absolute -inset-6 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[70px] bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.28)_0%,transparent_70%)] pointer-events-none -z-10" />

              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                    isLightTheme
                      ? "bg-[#ffc800] text-[#23273d]"
                      : "bg-[#ffc800] text-[#23273d]"
                  }`}
                >
                  RECOMMENDED FOR STUDENTS
                </span>
              </div>
              <div>
                <div className="mb-6 mt-2">
                  <h4 className="text-xl font-bold mb-2 text-[#ffc800]">
                    Student (Pay-As-You-Go)
                  </h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className={`text-4xl font-extrabold ${isLightTheme ? "text-slate-900" : "text-white"}`}
                    >
                      Micro-Credits
                    </span>
                  </div>
                  <p
                    className={
                      isLightTheme
                        ? "text-slate-500 text-sm"
                        : "text-gray-400 text-sm"
                    }
                  >
                    Pay only for what you scan, cancel anytime
                  </p>
                </div>
                <div
                  className={`h-px my-6 ${isLightTheme ? "bg-slate-200" : "bg-white/10"}`}
                ></div>
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#ffc800]" />
                    <span className="font-semibold text-[#ffc800]">
                      Solutions as low as ~$0.01 per scan
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#ffc800]" />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Instant Momo, ZaloPay, & Card top-ups
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#ffc800]" />
                    <span className="font-semibold text-[#ffc800]">
                      Automatic refund (rollback) on failure
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#ffc800]" />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Real-time force vector charts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#ffc800]" />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Earn credits by sharing virtual classrooms
                    </span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className={`w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95 border-0 ${
                  isLightTheme
                    ? "bg-[#ffc800] text-[#23273d] hover:bg-[#ffc800]/90 hover:shadow-[0_0_25px_rgba(255,200,0,0.5)]"
                    : "bg-[#ffc800] text-[#23273d] hover:bg-[#ffc800]/95 hover:shadow-[0_0_25px_rgba(255,200,0,0.5)]"
                }`}
              >
                Top Up Credits Now
              </button>
            </div>

            {/* School/Teacher Plan (Electric Violet Theme) */}
            <div
              className={`group relative border rounded-xl p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between z-10 ${
                isLightTheme
                  ? "bg-white border-violet-200 shadow-xl shadow-violet-500/5 hover:border-violet-500"
                  : "bg-gradient-to-b from-[#0f172a] to-[#090d16] border-violet-500/20 hover:border-violet-400"
              }`}
            >
              {/* Radial Glowing Back-Shadow (Triggered on hover) */}
              <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[60px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25)_0%,transparent_70%)] pointer-events-none -z-10" />

              <div>
                <div className="mb-6">
                  <h4
                    className={`text-xl font-bold mb-2 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                  >
                    School & Faculty
                  </h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className={`text-5xl font-bold ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    >
                      Custom
                    </span>
                  </div>
                  <p
                    className={
                      isLightTheme
                        ? "text-slate-500 text-sm"
                        : "text-gray-400 text-sm"
                    }
                  >
                    Tailored solutions for classrooms & institutions
                  </p>
                </div>
                <div
                  className={`h-px my-6 ${isLightTheme ? "bg-slate-200" : "bg-white/10"}`}
                ></div>
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    />
                    <span
                      className={`font-semibold ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    >
                      Unlimited AI simulation runs
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Directly embed in PowerPoint & LMS portals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    />
                    <span
                      className={`font-semibold ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    >
                      AI-Powered automated lesson planner tools
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      Classroom administration & student charts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLightTheme ? "text-violet-600" : "text-violet-400"}`}
                    />
                    <span
                      className={
                        isLightTheme ? "text-slate-700" : "text-gray-300"
                      }
                    >
                      24/7 priority dedicated technical support line
                    </span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className={`w-full px-6 py-3 rounded-lg font-semibold border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                  isLightTheme
                    ? "bg-violet-600 text-white hover:bg-violet-700 border-violet-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    : "bg-violet-500/10 text-violet-400 border-violet-400/30 hover:bg-violet-500 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                }`}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professor Feedback Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center">
            <h3 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by{" "}
              <span className="text-[#ffc800]">Professors Worldwide</span>
            </h3>
            <p className="text-xl text-gray-300">
              See what educators are saying about MorPhysics
            </p>
          </div>
        </div>

        {/* Horizontal Scrolling Feedback */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll">
            {/* Feedback Card 1 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "MorPhysics has completely transformed how I teach physics.
                Students are more engaged and understanding complex concepts
                better than ever before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Prof. Emily Rodriguez</p>
                  <p className="text-sm text-gray-400">
                    MIT Physics Department
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Card 2 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The AI-powered simulations are incredible. I can create custom
                physics problems in seconds and my students love the interactive
                visualizations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Dr. Michael Chen</p>
                  <p className="text-sm text-gray-400">Stanford University</p>
                </div>
              </div>
            </div>

            {/* Feedback Card 3 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "Finally, a platform that makes physics accessible and fun! My
                students' test scores have improved by 35% since we started
                using MorPhysics."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Prof. Sarah Williams</p>
                  <p className="text-sm text-gray-400">Oxford University</p>
                </div>
              </div>
            </div>

            {/* Feedback Card 4 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The collaborative features are amazing. Students can work
                together on projects and I can track their progress in
                real-time. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Dr. James Anderson</p>
                  <p className="text-sm text-gray-400">Cambridge University</p>
                </div>
              </div>
            </div>

            {/* Feedback Card 5 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "MorPhysics bridges the gap between theory and practice
                perfectly. My students can now see physics concepts come to life
                before their eyes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Prof. Lisa Thompson</p>
                  <p className="text-sm text-gray-400">Harvard University</p>
                </div>
              </div>
            </div>

            {/* Feedback Card 6 */}
            <div className="flex-shrink-0 w-96 bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffc800] text-[#ffc800]"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "As a physics lecturer for 20 years, this is the best teaching
                tool I've ever used. The AI assistance saves me hours of prep
                time every week."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffc800]/20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div>
                  <p className="font-semibold">Dr. Robert Kumar</p>
                  <p className="text-sm text-gray-400">Yale University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Section */}
      <section className="relative py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold mb-4">
              Competitor{" "}
              <span className="text-[#ffc800]">Comparison Matrix</span>
            </h3>
            <p className="text-xl text-gray-300">
              A detailed look at how MorPhysics outperforms traditional
              simulations and AI tools in active classrooms.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#ffc800]/20 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/10">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className="border-b border-[#ffc800]/20 bg-white/5">
                  <th className="p-4 md:p-5 font-semibold text-[#ffc800] text-sm md:text-base tracking-wider uppercase w-[40%]">
                    Evaluation Criteria
                  </th>
                  <th className="p-4 md:p-5 font-semibold text-white bg-[#ffc800]/10 border-x border-[#ffc800]/20 text-sm md:text-base tracking-wider uppercase text-center w-[30%]">
                    MorPhysics (Our Project)
                  </th>
                  <th className="p-4 md:p-5 font-semibold text-gray-400 text-sm md:text-base tracking-wider uppercase text-center w-[30%]">
                    Anonymous Solutions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm md:text-base">
                {/* Row 1 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    AI Multimodal Input (Text/Image)
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Instant Custom Auto-Generation
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Interactive Simulation Canvas
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Physics Sandbox Engine
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 5 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Real-time Vector Visualizations
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 6 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    No-Code Teacher/Student Friendly
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 7 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Curriculum Standards Alignment
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 8 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Cross-Platform Access (Web/Mobile)
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 9 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Lesson Portal & Sharing Control
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 10 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Telemetry Logs & Live Charts
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 11 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Offline Run Compatibility
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <span className="text-yellow-500 font-bold block text-center text-sm md:text-base">
                      ⚠️
                    </span>
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                </tr>
                {/* Row 12 */}
                <tr className="hover:bg-white/5 transition-all">
                  <td className="p-4 md:p-5 font-medium text-white">
                    Freemium & Flexible Micro-Payments
                  </td>
                  <td className="p-4 md:p-5 bg-[#ffc800]/5 border-x border-[#ffc800]/20 text-center">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 md:p-5 text-center">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl lg:text-5xl font-bold">
            Ready to transform your{" "}
            <span className="text-[#ffc800]">physics learning?</span>
          </h3>
          <p className="text-xl text-gray-300">
            Join thousands of students and educators using MorPhysics
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold hover:bg-[#ffc800]/90 transition-all text-xl inline-flex items-center gap-3 cursor-pointer border-0"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#ffc800]/20 bg-[#1f2236] py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 MorPhysics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
