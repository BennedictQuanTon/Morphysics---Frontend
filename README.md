# Morphysics — Make the Static Dynamic

**Morphysics** is a modern, interactive, and AI-inspired educational platform designed to transform abstract physics concepts from textbooks into real-time, customizable 2D simulations. It is built to support students, teachers, and educational institutions in Vietnam (specifically tailored to the high school physics curriculum) by replacing static diagrams with dynamic, interactive visual labs.

---

## 🚀 Key Product Features

### 1. Unified Landing & Marketing Page
* **Hero & Interactive Solenoid Coil:** High-fidelity simulation demonstrating electromagnetism principles directly in the hero zone.
* **Partners & Testimonials:** Integrated partner carousel and student review swiper powered by **Swiper.js**.
* **Problem & Solution Breakdowns:** Graphical showcases detailing current textbook challenges and the Morphysics interactive solver.
* **Pricing Plans:** Transparent tiered pricing model displaying details of Basic and Premium features.

### 2. Specialized Subpages
* **About Us (`#about`):** Shares the educational mission, teaching philosophies, and design system.
* **FAQ Page (`#faq`):** Detailed repository of common questions, usage policies, physics engine parameter guides, and troubleshooting tips.
* **Assets Store (`#assets`):** Catalog of downloadable textbook worksheets, ready-made simulation setups, and interactive physics formulas.
* **Authentication (`#login` / `#signup`):** Highly responsive, modern login and registration forms featuring validation feedback.

### 3. Interactive Lab Dashboard (`#dashboard`)
The dashboard is designed as a split-screen visual lab containing:
* **Dynamic Center Floating Navbar:**
  * Symmetrical Dynamic Capsule: Center-aligned floating pill layout containing the branding logo, navigation buttons, and theme toggler.
  * Hover Expansion: Buttons dynamically expand horizontally on hover (`Interactive Lab` expands left, `Settings` expands right) using spring physics (`stiffness: 380, damping: 30`) without layout snapping.
* **Left Panel: AI Physics Assistant:**
  * Intelligent Chatbot: Interactive conversation box with quick-suggestion triggers (e.g. "Simulate Gravity", "Explain Force").
  * File Attachment: Integrated PDF and document uploader to generate physics scenarios dynamically.
  * Embedded Asset and FAQ quick-access tabs inside the sidebar interface.
* **Right Panel: Matter.js Simulation Engine:**
  * Shape Spawner: Create circles, boxes, springs, rope constraints, and joint hinges.
  * Physics Inspector: Modify physics parameters (gravity vector, time steps) and select pre-built scenarios (Free fall, Pendulum, Newton's cradle, Inclined plane).
  * Real-Time Visualizer: Toggle vectors (force, velocity), bounding boxes, grid lines, and temperature sensors.

### 4. Advanced Settings Panel
* **Sidebar Profile:** Prominent gold-styled welcome banner (`Welcome, Long Quan`), avatar, and a subscription status badge displaying `Premium Plan`.
* **Account tab:** First and Last name inputs (defaulting to "Long Quan" and "Ton"), alongside a dedicated **Current Plan** box listing full benefits (Docs-to-Simulation, exports, constraints, support).
* **Appearance tab:** Enlarged, easy-to-click premium glass toggles for Light and Dark theme modes.
* **Interactive Configuration:** Fine-tune gravity settings, scenario presets, notification toggles, clear cache utilities, and view legal education policies.

---

## 🛠 Tech Stack

| Layer | Choice | Description |
|---|---|---|
| **Framework** | **React 18** | Declarative component UI structure and state management |
| **Language** | **TypeScript** | Strict typing for physics states and layout configurations |
| **Build Tool** | **Vite 5** | High-performance developer server and builds |
| **Physics Engine** | **Matter.js** & Canvas | 2D rigid-body dynamics engine and customized equation solvers |
| **Styling** | **Tailwind CSS 3** | Utility-first styling with custom dark/light theme variables |
| **Animations** | **Framer Motion** | Fluid layout transitions and scroll-based triggers |
| **Interactive Widgets** | **Swiper** & **NumberFlow** | Premium testimonial carousels and smooth count-up transitions |

---

## 📂 Project Structure

```text
Morphysics---Frontend/
├── frontend/
│   ├── public/
│   │   ├── assets/              # Logos, photos, and Lottie mascot files
│   │   └── favicon.svg          # App favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Spotlight navigation and footer components
│   │   │   ├── physics/         # Matter.js Canvas and 3D Spring-Mass renderer
│   │   │   ├── playground/      # Grade 10 textbook demos and physics helpers
│   │   │   └── ui/              # Buttons, ThemeToggle, and Reveal wrapper hooks
│   │   ├── sections/            # Hero, About, Assets, Dashboard, FAQ, Login, Signup, Pricing
│   │   ├── hooks/               # useTheme (Circle-reveal view transitions switcher)
│   │   ├── data/                # Landing page copy, plans data, and FAQ structures (content.ts)
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

1. **Clone the repository** and navigate into the `frontend` folder:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   This generates an optimized static bundle inside the `dist/` directory.

5. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

## 💡 Architectural Highlights

* **Ref-Driven Physics loops:** To maintain high framerates on lower-spec student devices, all textbook simulation canvases run coordinate computations inside React `useRef` states. This prevents costly component re-renders on every animation frame.
* **Circular Reveal View Transitions:** Leverages the browser's native `document.startViewTransition` API combined with CSS clip-paths to transition themes smoothly from the cursor pointer's exact coordinates.
* **Symmetrical Expanding Capsule Navigation:** Employs synchronized Framer Motion layouts that smoothly expand capsule widths on hover without causing layout jumps or snapping by maintaining a constant padding constraint.
* **Spotlight Navigation:** Tracks the cursor position with vanilla CSS variables (`--spotlight-x`, `--ambience-x`) updated in React to direct radial gradients.
