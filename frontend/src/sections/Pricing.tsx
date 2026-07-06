import { motion } from "framer-motion";
import {
  Wand2,
  Monitor,
  Users,
  Sparkles,
  Image as ImageIcon,
  SlidersHorizontal,
  Save,
  Mail,
  Download,
  Hammer,
  Clock,
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Check,
  Crown
} from "lucide-react";
import { pricingPlans } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

function getFeatureIcon(feature: string) {
  const text = feature.toLowerCase();
  if (text.includes("playground") || text.includes("everything")) return Sparkles;
  if (text.includes("text-to-simulation") || text.includes("docs-to-simulation")) return Wand2;
  if (text.includes("image-to-simulation")) return ImageIcon;
  if (text.includes("control panel") || text.includes("controls")) return SlidersHorizontal;
  if (text.includes("rendering") || text.includes("simulation scenes")) return Monitor;
  if (text.includes("support")) return Mail;
  if (text.includes("save")) return Save;
  if (text.includes("export")) return Download;
  if (text.includes("force") || text.includes("constraint")) return Hammer;
  if (text.includes("early access")) return Clock;
  if (text.includes("seats") || text.includes("class")) return Users;
  if (text.includes("dashboard")) return LayoutDashboard;
  if (text.includes("analytics") || text.includes("usage")) return BarChart3;
  if (text.includes("onboarding") || text.includes("training")) return GraduationCap;
  if (text.includes("manager")) return UserCheck;
  if (text.includes("sla-backed")) return ShieldCheck;
  return Check;
}

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-cloud dark:bg-slate-ink pt-10 pb-10 sm:pt-12 sm:pb-12 transition-colors duration-500 text-slate-deep dark:text-white">
      {/* Aurora background */}
      <div className="aurora-blob right-[-10%] top-[-5%] h-[400px] w-[400px] bg-gold/15 dark:bg-gold/8" />
      <div className="aurora-blob left-[-10%] bottom-[-5%] h-[400px] w-[400px] bg-indigo-500/10 dark:bg-indigo-500/8" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--dot-color, rgba(35,39,61,0.08)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <Reveal>
          <div className="text-left">
            <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
              Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                A Plan for Every{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Learner.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan, i) => {
            return (
              <Reveal key={plan.name} delay={i * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={cn(
                    "group relative flex h-full flex-col justify-start rounded-[2.5rem] p-8 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 border pb-28",
                    plan.popular
                      ? "border-2 border-gold bg-slate-deep text-white shadow-2xl shadow-gold/20 xl:scale-[1.04]"
                      : "card-surface border-slate-deep/5 dark:border-white/5"
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-4 py-1.5 text-xs font-black uppercase tracking-wider text-slate-deep shadow-lg z-30">
                      <Crown className="h-3.5 w-3.5" /> Most Popular
                    </span>
                  )}

                  {/* Plan Name */}
                  <h3 className={cn(
                    "font-display text-2xl font-bold leading-tight",
                    plan.popular ? "text-white" : "text-slate-deep dark:text-white"
                  )}>
                    {plan.name}
                  </h3>
                  
                  {/* Price & Period (Price on one line, Period below it to prevent crop) */}
                  <div className="mt-4 mb-8">
                    <div className={cn(
                      "font-sans text-3xl font-black tracking-tight whitespace-nowrap",
                      plan.popular ? "text-gold" : "text-slate-deep dark:text-white"
                    )}>
                      {plan.price}
                    </div>
                    <div className={cn(
                      "text-xs sm:text-sm font-bold mt-1 block",
                      plan.popular ? "text-white/60" : "text-slate-gray/70 dark:text-white/50"
                    )}>
                      {plan.period}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="flex flex-col gap-4 mt-2">
                    {plan.features.map((feature) => {
                      const Icon = getFeatureIcon(feature);
                      return (
                        <li key={feature} className="flex items-start gap-3">
                          <Icon
                            className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                            strokeWidth={2}
                          />
                          <span className={cn(
                            "text-sm sm:text-base font-medium leading-relaxed",
                            plan.popular ? "text-white/80" : "text-slate-gray dark:text-white/80"
                          )}>
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Hover Popup Button (No background dim/blur) */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-20">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      className={cn(
                        "w-full py-4 px-6 rounded-2xl text-base font-black transition-all shadow-xl",
                        plan.popular
                          ? "bg-gold text-slate-deep hover:bg-gold-hover"
                          : "bg-slate-ink dark:bg-white text-white dark:text-slate-ink hover:bg-slate-ink/90 dark:hover:bg-white/90"
                      )}
                    >
                      {plan.cta}
                    </motion.button>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Pricing;
