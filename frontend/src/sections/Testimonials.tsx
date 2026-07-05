import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { testimonials } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Testimonials rendered inside the user's inverted-perspective coverflow
 * carousel (Swiper EffectCoverflow, adapted from Carousel_003).
 */
export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cloud dark:bg-slate-ink py-24 sm:py-28 transition-colors duration-500 text-slate-deep dark:text-white">
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
        <Reveal>
          <div className="text-left">
            <span className="text-gold text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight !leading-[1.2]">
              <span className="font-sans font-extrabold text-slate-deep dark:text-white">
                Loved in the{" "}
              </span>
              <span className="font-display italic font-semibold text-gold">
                Classroom.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Thin horizontal line separator */}
        <div className="border-t border-slate-deep/10 dark:border-white/10 mt-6 mb-14 w-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-5"
      >
        <Swiper
          spaceBetween={0}
          effect="coverflow"
          grabCursor
          slidesPerView="auto"
          centeredSlides
          loop
          autoplay={{ delay: 3200, disableOnInteraction: true }}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="testimonial-swiper"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="card-surface flex h-full min-h-[340px] flex-col rounded-3xl p-8 sm:p-10 shadow-lg">
                <div className="mb-4 flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-gold text-gold"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-muted flex-1 text-base sm:text-lg italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-4 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full border-2 border-gold object-cover"
                  />
                  <div>
                    <p className="text-base sm:text-lg font-bold">{t.name}</p>
                    <p className="text-muted text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}

export default Testimonials;
