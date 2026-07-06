# Morphysics — Make the Static Dynamic

**Morphysics** is a modern, interactive, and AI-inspired educational platform designed to transform abstract physics concepts from textbooks into real-time, customizable 2D simulations. It is built to support students, teachers, and educational institutions in Vietnam (specifically tailored to the high school physics curriculum) by replacing static diagrams with dynamic, interactive visual labs.

---



## 🛠 Tech Stack

| Layer | Choice | Description |
|---|---|---|
| **Framework** | **React 18** | Declarative UI structure with state management |
| **Language** | **TypeScript** | Strict typing for physics models and variables |
| **Build Tool** | **Vite 5** | High-performance developer server and builds |
| **Physics Engines** | **Matter.js** & Custom Canvas | 2D rigid-body dynamics and customized textbook equations |
| **Styling** | **Tailwind CSS 3** | Utility-first styling with dark/light themes |
| **Animations** | **Framer Motion** | Fluid page animations and scroll-based triggers |
| **Interactive Widgets** | **Swiper** & **NumberFlow** | Testimonial carousels and smooth count-up stat transitions |

---

## 📂 Project Structure

```text
Morphysics---Frontend/
├── frontend/
│   ├── public/
│   │   ├── assets/              # University logos, photos, Lottie mascot
│   │   └── favicon.svg          # App favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar (spotlight) and Footer components
│   │   │   ├── physics/         # HeroSandbox (Matter.js) & Physics3DModel (3D Spring-Mass)
│   │   │   ├── playground/      # 5 Grade 10 textbook demos & common helpers (shared.tsx)
│   │   │   └── ui/              # Reusable UI elements (buttons, ThemeToggle, Reveal hooks)
│   │   ├── sections/            # Hero, Partners, ProductOverview, Personas, Pricing, Testimonials, Contact
│   │   ├── hooks/               # useTheme (Circle-blur theme switcher via View Transitions)
│   │   ├── data/                # Landing page copywriting, pricing structures, and testimonials (content.ts)
│   │   ├── lib/                 # Utility helpers (cn class merge helper)
│   │   └── styles/              # Tailwind directives and custom animation styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md                    # Root project documentation (this file)
```

---

## 🚀 Getting Started

To run the Morphysics frontend application locally, make sure you have [Node.js](https://nodejs.org/) installed, and follow these steps:

1.  **Clone the repository** and navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

4.  **Build for production**:
    ```bash
    npm run build
    ```
    This generates a optimized static site inside the `dist/` directory.

5.  **Preview the build locally**:
    ```bash
    npm run preview
    ```

---

## 💡 Architectural Highlights

*   **Ref-Driven Physics loops**: To maintain high framerates on lower-spec student devices, all textbook simulation canvases run coordinate computations inside React `useRef` states. This prevents costly component re-renders on every animation frame.
*   **Circular Reveal View Transitions**: Leverages the browser's native `document.startViewTransition` API combined with CSS clip-paths to transition themes smoothly from the cursor pointer's exact coordinates.
*   **Spotlight Navigation**: Tracks the cursor position with vanilla CSS variables (`--spotlight-x`, `--ambience-x`) updated in React to direct radial gradients.
