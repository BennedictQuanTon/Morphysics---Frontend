import { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Reveal } from "@/components/ui/Reveal";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export function Signup() {
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreePolicies, setAgreePolicies] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Signup submitted", { role, fullName, email, password, agreePolicies });
    // Connect to backend in future steps
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
              <h2 className="text-3xl xs:text-4xl sm:text-[2.75rem] md:text-5xl font-bold font-display italic text-gold tracking-tight whitespace-nowrap">
                Register your account
              </h2>
            </div>

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-deep/5 dark:bg-slate-ink/65 border border-slate-deep/5 dark:border-white/5 mb-8 relative">
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-gray/50 dark:text-white/30">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/50 focus:border-gold dark:focus:border-gold focus:outline-none transition-all duration-300 text-base placeholder:text-slate-gray/40 dark:placeholder:text-white/20 text-slate-deep dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2 block">
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
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2 block flex justify-between items-center">
                  <span>Password</span>
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
                <span className="text-[10px] text-slate-gray/70 dark:text-white/50 mt-1 block">
                  Must be at least 6 characters
                </span>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-gray dark:text-white/60 mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-gray/50 dark:text-white/30">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-deep/10 dark:border-white/10 bg-white/50 dark:bg-slate-ink/50 focus:border-gold dark:focus:border-gold focus:outline-none transition-all duration-300 text-base placeholder:text-slate-gray/40 dark:placeholder:text-white/20 text-slate-deep dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-gray/50 dark:text-white/30 hover:text-gold dark:hover:text-gold transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Policy Checkbox */}
              <div className="flex items-start gap-3 pt-2 select-none">
                <input
                  type="checkbox"
                  id="agree-policies"
                  checked={agreePolicies}
                  onChange={(e) => setAgreePolicies(e.target.checked)}
                  required
                  className="rounded border-slate-deep/20 dark:border-white/20 text-gold focus:ring-gold accent-gold h-5 w-5 mt-0.5 shrink-0"
                />
                <label htmlFor="agree-policies" className="text-sm text-slate-gray dark:text-white/70 leading-normal cursor-pointer">
                  I agree to the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-bold text-gold hover:text-gold-hover hover:underline transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="font-bold text-gold hover:text-gold-hover hover:underline transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => { window.location.hash = "#dashboard"; }}
                className="w-full py-4 rounded-xl border-2 border-gold hover:bg-gold hover:text-slate-deep text-gold font-bold transition-all duration-300 shadow-md hover:shadow-gold/20 active:scale-98 mt-3 flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-widest"
              >
                Create account
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-deep/10 dark:border-white/10 text-center text-sm sm:text-base text-slate-gray dark:text-white/60 font-medium">
              Already have an account?{" "}
              <a
                href="#login"
                className="font-bold text-gold hover:text-gold-hover hover:underline transition-colors ml-1"
              >
                Sign in
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

export default Signup;
