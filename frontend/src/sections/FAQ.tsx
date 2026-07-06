import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Cpu,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { inquiryTypes } from "@/data/content";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
  category: "product" | "pricing" | "tech";
}

const faqData: FaqItem[] = [
  {
    category: "product",
    question: "What is Morphysics?",
    answer:
      "Morphysics is an AI-powered interactive web application designed to bridge the gap between abstract physics theories and hands-on experimentation. It automatically translates textbook physics problems (typed text, documents, or photos) into real-time, customizable 2D simulations.",
  },
  {
    category: "product",
    question: "How does the Text-to-Simulation feature work?",
    answer:
      "Our core AI parser identifies physical variables (such as mass, angles, initial velocity, friction coefficients, and gravity) from user text inputs. It then dynamically generates a custom physics-based simulation canvas on the fly, saving users from having to draw or build the setup by hand.",
  },
  {
    category: "product",
    question: "What physical variables can I customize in the simulation?",
    answer:
      "Once your simulation is generated, you can adjust parameters like mass, gravity, friction coefficients, spring constants, initial velocity, and angles in real-time. This interactive sandbox allows students to learn through trial and error without physical safety risks.",
  },
  {
    category: "pricing",
    question: "What pricing plans are available for Morphysics?",
    answer:
      "We offer multiple tiers tailored to different needs:\n• Explorer: Free access with 3 inputs/day and 5 pre-built demo canvases.\n• Basic: 70,000 VND/month for unlimited inputs and photo uploads.\n• Premium: 150,000 VND/month with document uploads, GIF export, and advanced mechanical constraint tools (springs, joints, hinges).\n• School Package: 7,500,000 VND/semester for unlimited student seats and teacher dashboards.",
  },
  {
    category: "pricing",
    question: "How much does institutional licensing cost for schools?",
    answer:
      "Our standard B2B institutional license is 20,000,000 VND/year, which reduces the cost per student to only 10,000 - 13,000 VND annually. For early school onboardings, we offer a special Proof-of-Concept rate of 7,500,000 VND for the first year.",
  },
  {
    category: "pricing",
    question: "Is Morphysics suitable for large high school classrooms?",
    answer:
      "Absolutely. It is designed to run directly in the browser with zero installation or setup, fitting perfectly within standard 45-minute lesson blocks. Teachers can deploy custom visual simulations instantly for classes of 40 to 50 students, saving time lost to physical lab setup.",
  },
  {
    category: "tech",
    question: "Which physics topics are currently supported?",
    answer:
      "The current engine is optimized for high school physics topics in accordance with the new curriculum standards (GDPT 2018), including mechanics (projectile motion, collisions, Newton's laws), electromagnetism (solenoids, circuits), and wave motion (pendulums).",
  },
  {
    category: "tech",
    question: "What is the product roadmap for Morphysics?",
    answer:
      "In our next phases (Product Upgrade), we are refining Image-to-Simulation and Docs-to-Simulation pipelines, incorporating advanced LLMs to improve physics reasoning, and adding support for exporting simulation canvases directly to animated GIFs.",
  },
  {
    category: "tech",
    question: "How does virtual simulation compare to traditional physical labs?",
    answer:
      "While physical labs are financially and logistically costly to maintain, Morphysics provides a zero-setup, zero-upkeep digital sandbox. It eliminates the fear of damaging expensive equipment or facing safety hazards, granting every student an autonomous space to experiment freely.",
  },
];

const categories = [
  {
    id: "product" as const,
    title: "Product & Physics",
    icon: Sparkles,
    desc: "Learn about the core simulator, interactive variable controls, and supported physics phenomena.",
  },
  {
    id: "pricing" as const,
    title: "Licensing & Pricing",
    icon: CreditCard,
    desc: "Find details on individual monthly plans, B2B school licensing, and budget procurement.",
  },
  {
    id: "tech" as const,
    title: "Roadmap & Tech Stack",
    icon: Cpu,
    desc: "Explore our AI reasoning layer, upcoming GIF exports, and Image-to-Simulation features.",
  },
];

const inputClass =
  "w-full rounded-xl border bg-white/5 backdrop-blur-sm border-white/20 px-4 py-3.5 text-base text-white outline-none transition-all placeholder:text-white/50 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:bg-white/10";

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<"product" | "pricing" | "tech" | "all">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Form states
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiry: "",
    institution: "",
    message: "",
  });

  const setField = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isInvalid = (key: "name" | "email" | "inquiry" | "message") =>
    attempted && form[key].trim() === "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (
      form.name.trim() &&
      form.email.trim() &&
      form.inquiry &&
      form.message.trim()
    ) {
      setSubmitted(true);
    }
  };

  const fieldStyle = (bad: boolean) =>
    cn(inputClass, bad && "border-red-400 ring-2 ring-red-400/20");

  const filteredFaqs =
    activeCategory === "all"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="relative overflow-hidden bg-indigo-50/40 dark:bg-slate-ink pt-28 pb-24 transition-colors duration-500 text-slate-deep dark:text-white">
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight !leading-[1.2] mb-4">
              <span className="font-sans text-slate-deep dark:text-white">
                Frequently Asked{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Questions.
              </span>
            </h2>
            <p className="text-slate-gray dark:text-white/70 text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Find answers to common questions about our Text-to-Simulation platform, physics engine, licensing, and roadmap.
            </p>
          </Reveal>
        </div>

        {/* Categories (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <Reveal key={cat.id} delay={0.05} className="h-full">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(isSelected ? "all" : cat.id);
                    setExpandedIndex(null);
                  }}
                  className={cn(
                    "card-surface group relative overflow-hidden rounded-3xl p-8 shadow-md border text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col justify-between w-full",
                    isSelected
                      ? "border-gold/60 bg-gold/5 dark:bg-gold/5"
                      : "border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90"
                  )}
                >
                  <div>
                    {/* Wavy background shape */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gold/10 dark:bg-gold/5 pointer-events-none transition-all duration-350 group-hover:bg-gold/15" />

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/15 text-gold-hover dark:text-gold mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="font-sans text-2xl font-bold text-slate-deep dark:text-white mb-3">
                      {cat.title}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-gray dark:text-white/70 leading-relaxed font-sans">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-sm font-bold uppercase tracking-wider text-gold-hover dark:text-gold">
                    {isSelected ? "Showing this category" : "Filter questions"}
                    <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto mb-28">
          <Reveal>
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="card-surface rounded-2xl overflow-hidden border border-slate-deep/5 dark:border-white/5 bg-white dark:bg-[#1f2236]/90 shadow-sm transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-slate-deep/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="font-sans text-lg sm:text-xl font-bold text-slate-deep dark:text-white leading-snug">
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-deep/5 dark:bg-white/5 text-slate-gray dark:text-white/60 transition-all duration-300",
                          isOpen && "bg-gold/15 text-gold-hover dark:text-gold rotate-180"
                        )}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-4 border-t border-slate-deep/5 dark:border-white/5 text-slate-gray dark:text-white/70 font-sans text-base sm:text-lg !leading-8 whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 text-slate-gray dark:text-white/50">
                  No questions found for this filter. Click a card above to reset.
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Bottom Banner Section (How can we help / stay in the know with Group background) */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-slate-deep/10 dark:border-white/10 min-h-[500px] flex items-center bg-[#151724]">
            {/* Background Image with dimming and blur filters */}
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.25] blur-[1px] pointer-events-none"
              style={{
                backgroundImage: "url('/assets/Group.jpg')",
              }}
            />

            {/* Custom transition gradient overlay (gold/yellow transition into deep slate) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/35 via-[#151724]/85 to-[#151724]/98 z-0 pointer-events-none" />

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 sm:p-12 lg:p-16 items-center text-white">
              {/* Left Column: Info */}
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight !leading-[1.2] font-sans">
                  Still have <span className="font-display italic font-semibold text-gold dark:text-gold">Questions?</span>
                </h2>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed font-sans max-w-md">
                  Can't find the answers you're looking for? Reach out directly to our team! We will read your message and reply via email within 1 business day.
                </p>

                <div className="border-t border-white/20 my-6 w-full" />

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50">Email</p>
                      <a href="mailto:hello@morphysics.io" className="text-sm sm:text-base font-semibold hover:text-gold transition-colors">
                        hello@morphysics.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50">Location</p>
                      <p className="text-sm sm:text-base font-semibold">Ho Chi Minh City, Vietnam</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50">Response Time</p>
                      <p className="text-sm sm:text-base font-semibold">Typically within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form Box */}
              <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex min-h-[350px] flex-col items-center justify-center gap-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 16,
                        }}
                      >
                        <CheckCircle2 className="h-16 w-16 text-gold" />
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Question Sent!
                      </h3>
                      <p className="text-white/80 max-w-xs text-sm">
                        Thank you for reaching out. We will get back to you within 1 business day.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setAttempted(false);
                          setForm({
                            name: "",
                            email: "",
                            inquiry: "",
                            institution: "",
                            message: "",
                          });
                        }}
                        className="mt-2 text-sm font-bold text-gold hover:underline"
                      >
                        Send another question
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                      noValidate
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setField("name")(e.target.value)}
                          className={fieldStyle(isInvalid("name"))}
                        />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => setField("email")(e.target.value)}
                          className={fieldStyle(isInvalid("email"))}
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={form.inquiry}
                          onChange={(e) => setField("inquiry")(e.target.value)}
                          className={cn(
                            fieldStyle(isInvalid("inquiry")),
                            "appearance-none pr-10 text-white cursor-pointer"
                          )}
                          style={{
                            backgroundColor: "rgba(35, 39, 61, 0.4)",
                            colorScheme: "dark",
                          }}
                        >
                          <option value="" disabled className="bg-slate-deep text-white">
                            What are you reaching out about?
                          </option>
                          {inquiryTypes.map((t) => (
                            <option key={t} value={t} className="bg-slate-deep text-white">
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="School / Organization (optional)"
                        value={form.institution}
                        onChange={(e) => setField("institution")(e.target.value)}
                        className={fieldStyle(false)}
                      />
                      <textarea
                        rows={4}
                        placeholder="Type your question here..."
                        value={form.message}
                        onChange={(e) => setField("message")(e.target.value)}
                        className={cn(fieldStyle(isInvalid("message")), "resize-none")}
                      />
                      {attempted &&
                        (isInvalid("name") ||
                          isInvalid("email") ||
                          isInvalid("inquiry") ||
                          isInvalid("message")) && (
                          <p className="text-xs font-semibold text-red-300">
                            Please fill in the highlighted fields.
                          </p>
                        )}
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-base font-bold text-slate-deep shadow-lg shadow-gold/25 transition-all hover:bg-gold-hover"
                      >
                        <Send className="h-4 w-4" />
                        Send Question
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FAQ;
