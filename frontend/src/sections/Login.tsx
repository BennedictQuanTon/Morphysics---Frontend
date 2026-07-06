import { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Reveal } from "@/components/ui/Reveal";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted", { role, email, password, rememberMe });
    // In the future this will connect with the backend
    window.location.hash = "#dashboard";
  };

  return (
    <section className="relative h-screen flex flex-col md:flex-row bg-indigo-50/40 dark:bg-slate-ink overflow-hidden text-slate-deep dark:text-white font-sans transition-colors duration-500">
      {/* Aurora background blobs */}
      <div className="aurora-blob right-[-10%] top-[-5%] h-[300px] w-[300px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[-10%] bottom-[-5%] h-[300px] w-[300px] bg-indigo-500/10 dark:bg-indigo-500/8" />

      {/* Dotted texture background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Absolute top header bar */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-start px-6 py-4 md:px-12 w-full gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
          }}
          className="group flex items-center gap-2"
        >
          <div className="h-9 w-9 flex items-center justify-center -ml-2">
            <Player
              autoplay
              loop
              src="/assets/Mascot.json"
              style={{ height: "36px", width: "36px" }}
            />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-deep dark:text-white transition-colors duration-300">
            Morphysics
          </span>
        </a>
        <ThemeToggle className="size-9 p-1 shadow-sm" />
      </header>

      {/* Left Column - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20 pt-40 pb-12 h-screen overflow-y-auto relative z-10">
        <Reveal className="w-full max-w-md">
          <div className="relative w-full">
            <div className="text-center mb-10">
              <h2 className="text-5xl sm:text-6xl font-bold font-display italic text-gold tracking-tight">
                Welcome back
              </h2>
            </div>

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-deep/5 dark:bg-slate-ink/65 border border-slate-deep/5 dark:border-white/5 mb-10 relative">
              <button
                type="button"
                onClick={() => setRole("student")}
                className="relative z-10 py-3.5 text-base font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center"
              >
                {role === "student" && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-gold rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className={role === "student" ? "text-slate-deep relative z-20" : "text-slate-gray dark:text-white/50 relative z-20 hover:text-slate-deep dark:hover:text-white"}>
                  Student
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("lecturer")}
                className="relative z-10 py-3.5 text-base font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center"
              >
                {role === "lecturer" && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-gold rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className={role === "lecturer" ? "text-slate-deep relative z-20" : "text-slate-gray dark:text-white/50 relative z-20 hover:text-slate-deep dark:hover:text-white"}>
                  Lecturer
                </span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2.5 block">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-gray/50 dark:text-white/30">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/50 focus:border-gold dark:focus:border-gold focus:outline-none transition-all duration-300 text-base placeholder:text-slate-gray/40 dark:placeholder:text-white/20 text-slate-deep dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2.5 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-gray/50 dark:text-white/30">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/50 focus:border-gold dark:focus:border-gold focus:outline-none transition-all duration-300 text-base placeholder:text-slate-gray/40 dark:placeholder:text-white/20 text-slate-deep dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-gray/50 dark:text-white/30 hover:text-gold dark:hover:text-gold transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Extra options */}
              <div className="flex items-center justify-between text-sm sm:text-base font-semibold select-none pt-1">
                <label className="flex items-center gap-3 cursor-pointer text-slate-gray dark:text-white/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-deep/20 dark:border-white/20 text-gold focus:ring-gold accent-gold h-5 w-5"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gold-hover dark:text-gold hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => { window.location.hash = "#dashboard"; }}
                className="w-full py-4 rounded-xl border-2 border-gold hover:bg-gold hover:text-slate-deep text-gold font-bold transition-all duration-300 shadow-md hover:shadow-gold/20 active:scale-98 mt-2 flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-widest"
              >
                Sign in
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-deep/10 dark:border-white/10 text-center text-sm sm:text-base text-slate-gray dark:text-white/60 font-medium">
              Don't have an account?{" "}
              <a
                href="#signup"
                className="font-bold text-gold hover:text-gold-hover hover:underline transition-colors ml-1"
              >
                Sign up for free
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right Column - Graphic/Showcase */}
      <div className="hidden md:flex md:w-1/2 h-screen p-6 lg:p-8 items-center justify-center relative">
        <Reveal delay={0.2} className="relative w-full h-[calc(100vh-3rem)] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-deep/5 dark:border-white/5 bg-slate-deep/5 dark:bg-white/5 flex items-center justify-center">
          <img
            src="/assets/auth_page_side_showcase.png"
            alt="Morphysics App Showcase"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Decorative Overlay Gradient to integrate with page */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/10 via-transparent to-transparent dark:from-slate-ink/10 pointer-events-none" />
        </Reveal>
      </div>
    </section>
  );
}

export default Login;
