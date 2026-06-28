import { useState } from "react";
import {
  Globe,
  Check,
  Beaker,
  User,
  FileText,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { InteractiveLab } from "./components/InteractiveLab";
import { UserProfile } from "./components/UserProfile";
import { Policy } from "./components/Policy";
import { LandingPage } from "./components/LandingPage";
import { FAQ } from "./components/FAQ";
import { AboutUs } from "./components/AboutUs";
import { Assets } from "./components/Assets";

type Page =
  | "landing"
  | "login"
  | "lab"
  | "profile"
  | "policy"
  | "faq"
  | "about"
  | "assets";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const [loginType, setLoginType] = useState<"student" | "lecturer">("student");
  const [registerType, setRegisterType] = useState<"student" | "lecturer">(
    "student",
  );
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const handleLogin = () => {
    setCurrentPage("lab");
  };

  const handleLogout = () => {
    setCurrentPage("landing");
    setActiveForm("login");
  };

  const handleGetStarted = () => {
    setCurrentPage("login");
  };

  const handleBackToLanding = () => {
    setCurrentPage("landing");
  };

  // Login/Register Page (Fullscreen render)
  if (currentPage === "login") {
    return (
      <div
        className={`h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden relative ${isLightTheme ? "light" : ""}`}
      >
        {/* Left Panel - Forms Side */}
        <div
          className={`flex-1 relative h-full overflow-hidden flex flex-col justify-center ${isLightTheme ? "bg-[#f1f5f9] text-slate-800" : "bg-[#23273d] text-white"}`}
        >
          {/* Sleek Circular Back Button */}
          <button
            onClick={handleBackToLanding}
            className={`absolute top-6 left-6 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer z-30 ${
              isLightTheme
                ? "bg-white border-slate-300 text-slate-700 hover:text-[#ffc800] hover:border-[#ffc800] hover:shadow-md"
                : "bg-[#1f2236] border-[#ffc800]/30 hover:border-[#ffc800] text-[#ffc800] hover:text-white hover:shadow-[0_0_15px_rgba(255,200,0,0.4)]"
            }`}
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Grid background pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255, 200, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 200, 0, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "30px 30px",
            }}
          />

          {/* Inner Centered Container */}
          <div className="relative w-full h-full flex flex-col justify-center p-6 lg:p-8 max-w-xl mx-auto overflow-y-auto lg:overflow-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {/* Header */}
            <div className="mb-4 space-y-2 pt-6 lg:pt-0">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-[#ffc800]" strokeWidth={2} />
                <h1 className="text-2xl font-bold">
                  <span className="text-[#ffc800]">Mor</span>
                  <span
                    className={isLightTheme ? "text-slate-800" : "text-white"}
                  >
                    Physics
                  </span>
                </h1>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#ffc800] leading-tight">
                  Make the static dynamic
                </h2>
                <p className="text-sm text-gray-400">
                  A dynamic collaborative workspace
                </p>
              </div>
            </div>

            {/* Forms */}
            <div className="space-y-4">
              {/* Login Form */}
              {activeForm === "login" && (
                <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-5 lg:p-6 space-y-4 shadow-2xl shadow-[#ffc800]/5">
                  <h3 className="text-xl font-semibold text-white">
                    Welcome back
                  </h3>

                  {/* User Type Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLoginType("student")}
                      className={`flex-1 px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                        loginType === "student"
                          ? "bg-[#ffc800] text-[#23273d] font-semibold border-0"
                          : isLightTheme
                            ? "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900"
                            : "border border-white/20 text-white bg-transparent hover:border-white/40"
                      }`}
                    >
                      Student
                    </button>
                    <button
                      onClick={() => setLoginType("lecturer")}
                      className={`flex-1 px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                        loginType === "lecturer"
                          ? "bg-[#ffc800] text-[#23273d] font-semibold border-0"
                          : isLightTheme
                            ? "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900"
                            : "border border-white/20 text-white bg-transparent hover:border-white/40"
                      }`}
                    >
                      Lecturer
                    </button>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 border-2 rounded transition-all ${
                            rememberMe
                              ? "bg-[#ffc800] border-[#ffc800]"
                              : "border-[#ffc800] bg-transparent"
                          }`}
                        >
                          {rememberMe && (
                            <Check
                              className="w-4 h-4 text-[#23273d]"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-300">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#ffc800] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Sign In Button */}
                  <button
                    onClick={handleLogin}
                    className={`w-full px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      isLightTheme
                        ? "bg-[#ffc800] text-[#23273d] hover:bg-[#ffc800]/90 hover:shadow-md border-0"
                        : "bg-[#23273d] border-2 border-[#ffc800] text-[#ffc800] hover:bg-[#ffc800] hover:text-[#23273d]"
                    }`}
                  >
                    Sign in
                  </button>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveForm("register")}
                      className="text-[#ffc800] hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      Sign up for free
                    </button>
                  </p>
                </div>
              )}

              {/* Register Form */}
              {activeForm === "register" && (
                <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-5 lg:p-6 space-y-3 shadow-2xl shadow-[#ffc800]/5 max-h-[52vh] overflow-y-auto scrollbar-thin">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Register your account
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Join the platform and start collaborating
                    </p>
                  </div>

                  {/* User Type Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRegisterType("student")}
                      className={`flex-1 px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                        registerType === "student"
                          ? "bg-[#ffc800] text-[#23273d] font-semibold border-0"
                          : isLightTheme
                            ? "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900"
                            : "border border-white/20 text-white bg-transparent hover:border-white/40"
                      }`}
                    >
                      Student
                    </button>
                    <button
                      onClick={() => setRegisterType("lecturer")}
                      className={`flex-1 px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                        registerType === "lecturer"
                          ? "bg-[#ffc800] text-[#23273d] font-semibold border-0"
                          : isLightTheme
                            ? "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900"
                            : "border border-white/20 text-white bg-transparent hover:border-white/40"
                      }`}
                    >
                      Lecturer
                    </button>
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 focus:shadow-[0_0_15px_rgba(255,200,0,0.3)] outline-none transition-all"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded transition-all ${
                          agreeTerms
                            ? "bg-[#ffc800] border-[#ffc800]"
                            : "border-[#ffc800] bg-transparent"
                        }`}
                      >
                        {agreeTerms && (
                          <Check
                            className="w-4 h-4 text-[#23273d]"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300">
                      I agree to the{" "}
                      <a href="#" className="text-[#ffc800] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#ffc800] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {/* Create Account Button */}
                  <button
                    onClick={handleLogin}
                    className={`w-full px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      isLightTheme
                        ? "bg-[#ffc800] text-[#23273d] hover:bg-[#ffc800]/90 hover:shadow-md border-0"
                        : "bg-[#23273d] border-2 border-[#ffc800] text-[#ffc800] hover:bg-[#ffc800] hover:text-[#23273d]"
                    }`}
                  >
                    Create account
                  </button>

                  {/* Sign In Link */}
                  <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveForm("login")}
                      className="text-[#ffc800] hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continuous Vertical Wavy Separator (Absolute sibling positioned exactly at the split boundary) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 hidden lg:block overflow-hidden pointer-events-none z-20 select-none">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            {/* Path 1: Left side fill (Dark Slate #23273d or Light #f1f5f9) */}
            <path
              fill={isLightTheme ? "#f1f5f9" : "#23273d"}
              d="M 0 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 0 1000 Z"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M 0 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 0 1000 Z;
                  M 0 0 L 50 0 C 65 170, 70 330, 48 500 C 20 670, 65 830, 50 1000 L 0 1000 Z;
                  M 0 0 L 50 0 C 85 130, 90 370, 40 500 C 5 630, 85 870, 50 1000 L 0 1000 Z;
                  M 0 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 0 1000 Z
                "
              />
            </path>

            {/* Path 2: Right side fill (White #ffffff) */}
            <path
              fill="#ffffff"
              d="M 100 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 100 1000 Z"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M 100 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 100 1000 Z;
                  M 100 0 L 50 0 C 65 170, 70 330, 48 500 C 20 670, 65 830, 50 1000 L 100 1000 Z;
                  M 100 0 L 50 0 C 85 130, 90 370, 40 500 C 5 630, 85 870, 50 1000 L 100 1000 Z;
                  M 100 0 L 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000 L 100 1000 Z
                "
              />
            </path>

            {/* Path 3: The Boundary Stroke Line */}
            <path
              fill="none"
              stroke="#ffc800"
              strokeWidth="2.5"
              d="M 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000;
                  M 50 0 C 65 170, 70 330, 48 500 C 20 670, 65 830, 50 1000;
                  M 50 0 C 85 130, 90 370, 40 500 C 5 630, 85 870, 50 1000;
                  M 50 0 C 75 150, 80 350, 45 500 C 10 650, 75 850, 50 1000
                "
              />
            </path>
          </svg>
        </div>

        {/* Right Panel - Info Side (Hidden on mobile for scroll-free experience) */}
        <div className="flex-1 bg-white relative h-full overflow-hidden hidden lg:flex flex-col justify-center">
          <div className="relative h-full flex flex-col justify-center items-center text-center p-8 lg:p-12">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-block px-4 py-2 bg-[#ffc800]/20 border border-[#ffc800] rounded-full">
                <span className="text-xs text-[#23273d] uppercase tracking-wider font-semibold">
                  AI-Powered Learning
                </span>
              </div>

              <h3 className="text-4xl lg:text-5xl font-bold text-[#23273d] leading-tight">
                AI Virtual Lab
              </h3>

              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#ffc800] to-transparent mx-auto"></div>

              <p className="text-xl text-[#23273d] leading-relaxed">
                Helps students visualize how physics works in real-time
              </p>

              <div className="space-y-4 pt-4">
                <p className="text-gray-600 leading-relaxed">
                  Simply input your prompts, upload pictures, or provide
                  documentation, and our AI will recreate the physics problem
                  into an interactive 2D virtual laboratory.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  Explore, experiment, and interact with physics concepts like
                  never before.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <div className="px-6 py-3 bg-[#ffc800] border-2 border-[#ffc800] rounded-lg shadow-md shadow-[#ffc800]/10">
                  <p className="text-sm text-[#23273d] font-semibold">
                    Text Prompts
                  </p>
                </div>
                <div className="px-6 py-3 bg-[#ffc800] border-2 border-[#ffc800] rounded-lg shadow-md shadow-[#ffc800]/10">
                  <p className="text-sm text-[#23273d] font-semibold">
                    Image Upload
                  </p>
                </div>
                <div className="px-6 py-3 bg-[#ffc800] border-2 border-[#ffc800] rounded-lg shadow-md shadow-[#ffc800]/10">
                  <p className="text-sm text-[#23273d] font-semibold">
                    Document Analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showLoggedInNav = ["lab", "policy", "profile"].includes(currentPage);

  return (
    <div
      className={`min-h-screen ${isLightTheme ? "light" : ""} bg-[#23273d] text-white relative`}
    >
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

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl shadow-md transition-all duration-300 ${
          isLightTheme
            ? "bg-white/70 border-slate-200/80 shadow-slate-100/50"
            : "bg-white/5 border-white/10 shadow-black/10"
        }`}
      >
        <div className="px-6 py-4 flex items-center justify-between w-full">
          {/* Logo & Theme Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentPage(showLoggedInNav ? "lab" : "landing")
              }
              className="group flex items-center gap-3 bg-transparent border-0 cursor-pointer text-left p-0"
            >
              <Globe
                className="w-7 h-7 group-hover:rotate-[360deg] transition-transform duration-[1200ms] ease-out text-[#ffc800]"
                strokeWidth={2}
              />
              <h1 className="text-2xl font-bold transition-all duration-300 group-hover:tracking-wider">
                <span className="text-[#ffc800]">Mor</span>
                <span
                  className={isLightTheme ? "text-slate-800" : "text-white"}
                >
                  Physics
                </span>
              </h1>
            </button>

            {/* Light/Dark Toggle Icon */}
            <button
              onClick={() => setIsLightTheme(!isLightTheme)}
              className={`p-2 rounded-lg bg-transparent border-0 cursor-pointer transition-transform duration-500 hover:rotate-[360deg] hover:scale-110 active:scale-95 ${
                isLightTheme
                  ? "hover:bg-black/5 text-[#ffc800]"
                  : "hover:bg-white/10 text-[#ffc800]"
              }`}
              title="Toggle Light/Dark Mode"
            >
              {isLightTheme ? (
                <svg
                  className="w-5 h-5 fill-[#ffc800] stroke-none"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 fill-[#ffc800] stroke-none"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!showLoggedInNav ? (
              <>
                <button
                  onClick={() => setCurrentPage("assets")}
                  className={`group relative transition-all font-semibold bg-transparent border-0 cursor-pointer px-4 py-2 rounded-full overflow-hidden ${
                    isLightTheme
                      ? currentPage === "assets"
                        ? "text-[#ffc800]"
                        : "text-slate-700 hover:text-[#ffc800]"
                      : currentPage === "assets"
                        ? "text-[#ffc800]"
                        : "text-white/90 hover:text-[#ffc800]"
                  }`}
                >
                  <span className="relative z-10">Assets</span>
                  <span
                    className={`absolute inset-0 border rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 -z-10 ${
                      isLightTheme
                        ? "bg-gradient-to-b from-black/5 to-black/[0.02] border-black/10 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.05)]"
                        : "bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.2)]"
                    }`}
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center bg-[#ffc800]" />
                </button>
                <button
                  onClick={() => setCurrentPage("faq")}
                  className={`group relative transition-all font-semibold bg-transparent border-0 cursor-pointer px-4 py-2 rounded-full overflow-hidden ${
                    isLightTheme
                      ? currentPage === "faq"
                        ? "text-[#ffc800]"
                        : "text-slate-700 hover:text-[#ffc800]"
                      : currentPage === "faq"
                        ? "text-[#ffc800]"
                        : "text-white/90 hover:text-[#ffc800]"
                  }`}
                >
                  <span className="relative z-10">FAQ</span>
                  <span
                    className={`absolute inset-0 border rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 -z-10 ${
                      isLightTheme
                        ? "bg-gradient-to-b from-black/5 to-black/[0.02] border-black/10 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.05)]"
                        : "bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.2)]"
                    }`}
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center bg-[#ffc800]" />
                </button>
                <button
                  onClick={() => setCurrentPage("about")}
                  className={`group relative transition-all font-semibold bg-transparent border-0 cursor-pointer px-4 py-2 rounded-full overflow-hidden ${
                    isLightTheme
                      ? currentPage === "about"
                        ? "text-[#ffc800]"
                        : "text-slate-700 hover:text-[#ffc800]"
                      : currentPage === "about"
                        ? "text-[#ffc800]"
                        : "text-white/90 hover:text-[#ffc800]"
                  }`}
                >
                  <span className="relative z-10">About Us</span>
                  <span
                    className={`absolute inset-0 border rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 -z-10 ${
                      isLightTheme
                        ? "bg-gradient-to-b from-black/5 to-black/[0.02] border-black/10 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.05)]"
                        : "bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.2)]"
                    }`}
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center bg-[#ffc800]" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage("lab")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer border-0 hover:scale-105 active:scale-95 hover:shadow-md ${
                    isLightTheme
                      ? currentPage === "lab"
                        ? "bg-[#ffc800] text-[#23273d] font-semibold"
                        : "text-slate-700 hover:text-[#ffc800] bg-transparent hover:bg-black/5"
                      : currentPage === "lab"
                        ? "bg-[#ffc800] text-[#23273d] font-semibold hover:shadow-[#ffc800]/10"
                        : "text-white/90 hover:text-[#ffc800] bg-transparent hover:bg-white/5"
                  }`}
                >
                  <Beaker className="w-4 h-4" />
                  Lab
                </button>
                <button
                  onClick={() => setCurrentPage("policy")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer border-0 hover:scale-105 active:scale-95 hover:shadow-md ${
                    isLightTheme
                      ? currentPage === "policy"
                        ? "bg-[#ffc800] text-[#23273d] font-semibold"
                        : "text-slate-700 hover:text-[#ffc800] bg-transparent hover:bg-black/5"
                      : currentPage === "policy"
                        ? "bg-[#ffc800] text-[#23273d] font-semibold hover:shadow-[#ffc800]/10"
                        : "text-white/90 hover:text-[#ffc800] bg-transparent hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Policy
                </button>
              </>
            )}

            {/* Right side CTA or Avatar */}
            {!showLoggedInNav ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setActiveForm("login");
                    setCurrentPage("login");
                  }}
                  className={`group relative font-semibold transition-all bg-transparent border-0 cursor-pointer px-4 py-2 rounded-full overflow-hidden ${
                    isLightTheme
                      ? "text-slate-700 hover:text-[#ffc800]"
                      : "text-white/90 hover:text-[#ffc800]"
                  }`}
                >
                  <span className="relative z-10">Login</span>
                  <span
                    className={`absolute inset-0 border rounded-full opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 -z-10 ${
                      isLightTheme
                        ? "bg-gradient-to-b from-black/5 to-black/[0.02] border-black/10 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.05)]"
                        : "bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.2)]"
                    }`}
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center bg-[#ffc800]" />
                </button>
                <button
                  onClick={() => {
                    setActiveForm("register");
                    setCurrentPage("login");
                  }}
                  className="px-5 py-2 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95 border-0 hover:bg-[#ffc800]/90 hover:shadow-[0_0_20px_rgba(255,200,0,0.4)]"
                >
                  Sign-up
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage("profile")}
                className={`ml-2 transition-all duration-300 cursor-pointer bg-transparent border-0 p-0 hover:scale-110 active:scale-95 ${
                  currentPage === "profile"
                    ? "ring-2 ring-[#ffc800]"
                    : "hover:ring-2 hover:ring-[#ffc800]/50"
                } rounded-full`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    isLightTheme
                      ? "bg-[#ffc800]/10 border-[#ffc800]"
                      : "bg-[#ffc800]/20 border-[#ffc800]"
                  }`}
                >
                  <User className="w-5 h-5 text-[#ffc800]" />
                </div>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`bg-transparent border-0 cursor-pointer ${isLightTheme ? "text-slate-800" : "text-white"}`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className={`md:hidden border-t border-[#ffc800]/30 px-6 py-4 space-y-2 shadow-lg shadow-black/10 ${
              isLightTheme ? "bg-slate-50" : "bg-[#1f2236]"
            }`}
          >
            {!showLoggedInNav ? (
              <>
                <button
                  onClick={() => {
                    setCurrentPage("assets");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg bg-transparent border-0 cursor-pointer block font-semibold ${
                    isLightTheme
                      ? "text-slate-800 hover:bg-slate-200/50"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  Assets
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("faq");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg bg-transparent border-0 cursor-pointer block font-semibold ${
                    isLightTheme
                      ? "text-slate-800 hover:bg-slate-200/50"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("about");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg bg-transparent border-0 cursor-pointer block font-semibold ${
                    isLightTheme
                      ? "text-slate-800 hover:bg-slate-200/50"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  About Us
                </button>
                <div
                  className={`h-px my-3 ${isLightTheme ? "bg-slate-200" : "bg-white/10"}`}
                ></div>
                <button
                  onClick={() => {
                    setActiveForm("login");
                    setCurrentPage("login");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-center px-4 py-3 rounded-lg bg-transparent cursor-pointer block font-semibold border ${
                    isLightTheme
                      ? "text-slate-800 border-slate-300 hover:bg-slate-200/50"
                      : "text-white border-white/20 hover:bg-white/5"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setActiveForm("register");
                    setCurrentPage("login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 rounded-lg bg-[#ffc800] text-[#23273d] cursor-pointer block font-semibold border-0 hover:bg-[#ffc800]/90"
                >
                  Sign-up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentPage("lab");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all cursor-pointer border-0 ${
                    currentPage === "lab"
                      ? "bg-[#ffc800] text-[#23273d] font-semibold"
                      : isLightTheme
                        ? "text-slate-800 hover:bg-slate-200/50 bg-transparent"
                        : "text-white hover:bg-white/5 bg-transparent"
                  }`}
                >
                  <Beaker className="w-4 h-4" />
                  Lab
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("policy");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all cursor-pointer border-0 ${
                    currentPage === "policy"
                      ? "bg-[#ffc800] text-[#23273d] font-semibold"
                      : isLightTheme
                        ? "text-slate-800 hover:bg-slate-200/50 bg-transparent"
                        : "text-white hover:bg-white/5 bg-transparent"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Policy
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all cursor-pointer border-0 ${
                    currentPage === "profile"
                      ? "bg-[#ffc800] text-[#23273d] font-semibold"
                      : isLightTheme
                        ? "text-slate-800 hover:bg-slate-200/50 bg-transparent"
                        : "text-white hover:bg-white/5 bg-transparent"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="relative">
        {currentPage === "landing" && (
          <LandingPage
            onGetStarted={handleGetStarted}
            isLightTheme={isLightTheme}
          />
        )}
        {currentPage === "assets" && <Assets />}
        {currentPage === "faq" && <FAQ />}
        {currentPage === "about" && <AboutUs />}
        {currentPage === "lab" && (
          <InteractiveLab isLightTheme={isLightTheme} />
        )}
        {currentPage === "profile" && <UserProfile onLogout={handleLogout} />}
        {currentPage === "policy" && <Policy />}
      </main>
    </div>
  );
}
