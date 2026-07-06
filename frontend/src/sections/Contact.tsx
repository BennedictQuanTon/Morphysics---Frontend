import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { Clock, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { inquiryTypes } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-all placeholder:opacity-50 focus:border-gold focus:ring-2 focus:ring-gold/25";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiry: "",
    institution: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const invalid = (key: "name" | "email" | "inquiry" | "message") =>
    attempted && form[key].trim() === "";

  // UI-only template — no data is sent anywhere.
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
    cn(
      inputClass,
      bad
        ? "border-red-400 ring-2 ring-red-400/20"
        : "border-[color:var(--border)]",
    );
  return (
    <section id="contact" className="relative overflow-hidden bg-cloud dark:bg-slate-ink pt-10 pb-20 sm:pt-12 sm:pb-24 transition-colors duration-500 text-slate-deep dark:text-white">
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

      <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 relative z-10">
        {/* Left: info */}
        <Reveal>
          <div className="flex items-center justify-between gap-6 flex-wrap sm:flex-nowrap">
            <div className="flex-1">
              <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
                Get In Touch
              </span>
              <h2 className="text-4xl sm:text-5xl tracking-tight !leading-[1.2]">
                <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                  Let's Talk{" "}
                </span>
                <span className="font-display italic font-semibold text-gold">
                  Physics.
                </span>
              </h2>
            </div>
            <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0">
              <Player
                autoplay
                loop
                src="/assets/Mascot.json"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>

          {/* Thin horizontal line separator */}
          <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-8 w-full" />

          <p className="text-slate-gray dark:text-white/85 text-lg leading-relaxed font-sans mt-5 max-w-md">
            Have questions about a plan, want to schedule a demo for your
            school, or just curious? We're happy to hear from you.
          </p>

          <div className="mt-9 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-hover dark:text-gold">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-50">
                  Email
                </p>
                <a
                  href="mailto:hello@morphysics.io"
                  className="font-semibold hover:text-gold-hover dark:hover:text-gold"
                >
                  hello@morphysics.io
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-hover dark:text-gold">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-50">
                  Location
                </p>
                <p className="font-semibold">Ho Chi Minh City, Vietnam</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-hover dark:text-gold">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-50">
                  Response time
                </p>
                <p className="font-semibold">
                  We typically reply within 1 business day.
                </p>
              </div>
            </div>
          </div>


        </Reveal>

        {/* Right: form */}
        <Reveal delay={0.15}>
          <div className="card-surface relative overflow-hidden rounded-3xl p-8 shadow-lg">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 16,
                      delay: 0.1,
                    }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-gold" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold">
                    Message sent!
                  </h3>
                  <p className="text-muted max-w-xs text-sm">
                    ✅ We'll be in touch within 1 business day.
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
                    className="mt-2 text-sm font-bold text-gold-hover hover:underline dark:text-gold"
                  >
                    Send another message
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
                      onChange={(e) => set("name")(e.target.value)}
                      className={fieldStyle(invalid("name"))}
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                      className={fieldStyle(invalid("email"))}
                    />
                  </div>
                  <select
                    value={form.inquiry}
                    onChange={(e) => set("inquiry")(e.target.value)}
                    className={cn(
                      fieldStyle(invalid("inquiry")),
                      "appearance-none",
                      form.inquiry === "" && "opacity-60",
                    )}
                    style={{ backgroundColor: "var(--card)" }}
                  >
                    <option value="" disabled>
                      What are you reaching out about?
                    </option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="School or organization (if applicable)"
                    value={form.institution}
                    onChange={(e) => set("institution")(e.target.value)}
                    className={fieldStyle(false)}
                  />
                  <textarea
                    rows={4}
                    placeholder="Tell us what's on your mind..."
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className={cn(fieldStyle(invalid("message")), "resize-none")}
                  />
                  {attempted &&
                    (invalid("name") ||
                      invalid("email") ||
                      invalid("inquiry") ||
                      invalid("message")) && (
                      <p className="text-xs font-semibold text-red-400">
                        Please fill in the highlighted fields.
                      </p>
                    )}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 font-bold text-slate-deep shadow-lg shadow-gold/25 transition-colors hover:bg-gold-hover"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
