# Morphysics — Landing Page

> **Make the Static Dynamic.** AI-powered, interactive 2D physics simulations for students, teachers, and schools in Vietnam.

A fully responsive marketing landing page built with React + TypeScript + Vite, featuring a live Matter.js physics sandbox in the hero and five curriculum-aligned interactive physics demos.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (class-based dark mode) |
| Animation | Framer Motion, CSS View Transitions API |
| Physics | Matter.js (hero sandbox) + custom canvas integrators (playground demos) |
| Carousel | Swiper (coverflow effect) |
| Numbers | @number-flow/react |
| Mascot | @lottiefiles/react-lottie-player |
| Icons | lucide-react |

## Getting Started

```bash
# from the frontend/ directory
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Project Structure

```
frontend/
├── public/
│   ├── assets/              # logos, photos, Lottie mascot
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar (spotlight nav), Footer
│   │   ├── physics/         # HeroSandbox (full Matter.js sandbox)
│   │   ├── playground/      # 5 demo canvases + shared sim utilities
│   │   └── ui/              # AnimatedButton, RadialGlowButton, FlipText,
│   │                        #   ThemeToggle, Reveal / SectionHeading
│   ├── sections/            # Hero, Partners, ProductOverview, Personas,
│   │                        #   Playground, Stats, Pricing, Testimonials, Contact
│   ├── hooks/               # useTheme (View Transition circle-blur toggle)
│   ├── data/                # all landing page copy & content
│   ├── lib/                 # cn() class merge helper
│   └── styles/              # Tailwind + global effect styles
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## Highlights

- **Hero sandbox** — a full Matter.js environment: drag & throw bodies, spawn circles/boxes/triangles/static anchors, right-click-drag to apply impulses, pause / slow-motion, gravity presets (Moon / Earth / Jupiter), bounciness & air-drag sliders, live KE/velocity readouts, and velocity-vector overlays.
- **Physics Playground** — 5 tab-switched canvases aligned to the Lớp 10 curriculum: Projectile Motion, Inclined Plane, Simple Pendulum, Collision Lab, Free Fall & Air Resistance. Each with real equations of motion and live force-vector rendering.
- **Dark / light mode** — animated circle-blur reveal using the View Transitions API, persisted in localStorage.
- **Effects** — spotlight navbar lighting, coverflow testimonial carousel, count-up stats, 3D flip-in headline text, shine-sweep and radial-glow buttons, scroll-reveal sections, marquee partner ticker.
- Optimized first for a 14-inch MacBook viewport (~1512 × 982), responsive down to mobile.

## Notes

- The contact form is a **UI template only** — no backend is wired; submitting shows a static success state.
- Testimonial quotes are placeholders to be replaced with verified quotes before launch.
