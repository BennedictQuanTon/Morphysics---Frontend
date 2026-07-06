export const partnerLogos = [
  { src: "/assets/unilogo-uts.png", alt: "UTS" },
  { src: "/assets/unilogo-hcmue.png", alt: "HCMUE" },
  { src: "/assets/unilogo-hcmus.png", alt: "HCMUS" },
  { src: "/assets/unilogo-hcmut.png", alt: "HCMUT" },
  { src: "/assets/unilogo-iuh.png", alt: "IUH" },
  { src: "/assets/unilogo-uit.png", alt: "UIT" },
];

export const featureCards = [
  {
    icon: "brain" as const,
    title: "AI Problem Extraction",
    body: "Type, photograph, or upload a physics problem. The AI identifies every variable — mass, angle, velocity, friction — without you lifting a pen.",
  },
  {
    icon: "canvas" as const,
    title: "Dynamic 2D Simulation",
    body: "No pre-built templates. Every environment is generated on-the-fly from your problem's unique parameters. Forces, motion, and energy behave exactly as they should.",
  },
  {
    icon: "sliders" as const,
    title: "Interactive Variable Control",
    body: "Tweak gravity, friction, mass, or initial velocity in real time with on-screen controls. See how changing one variable cascades through the entire system — instantly.",
  },
];

export const problems = [
  {
    title: "Formula Memorization",
    number: 11,
    suffix: "M+",
    accent: "from-red-500 to-orange-500",
    image: "/assets/pics-study-groups.jpeg",
  },
  {
    title: "Logistical Nightmare",
    number: 45,
    suffix: "Min",
    accent: "from-orange-500 to-amber-500",
    image: "/assets/pics-physics-class.jpg",
  },
  {
    title: "Resource Constraints",
    number: 666,
    suffix: "+",
    accent: "from-rose-500 to-red-600",
    image: "/assets/pics-physics-lab.jpg",
  },
];

export const solutions = [
  {
    tab: "Students",
    badge: "For Students · Age 12–18",
    headline: "Understand the Essence. Stop Memorizing.",
    solution: "Input your exact homework problem — and watch the scenario come alive. Interact with objects, modify forces, gravity, or friction in real time to see what actually happens.",
    cta: "Try for Free",
    image: "/assets/pics-study-groups.jpeg",
    imageAlt: "Students studying physics together in a group",
    stat: "Build deep visual intuition and improve academic outcomes.",
  },
  {
    tab: "Teachers",
    badge: "For Educators & Teachers",
    headline: "A Complete Lab, Ready in 5 Seconds.",
    solution: "Deploy customized visual simulations for your entire class instantly on any projector. No equipment, no setup, no teardown — just raw, high-impact instructional time.",
    cta: "Explore Teacher Plan",
    image: "/assets/pics-physics-class.jpg",
    imageAlt: "A physics classroom with interactive learning",
    stat: "Recover instructional hours lost to physical lab preparation.",
  },
  {
    tab: "Institutions",
    badge: "For Schools & Institutions",
    headline: "Scale Visual Labs with Zero Upkeep.",
    solution: "Bring an interactive virtual physics lab to every student in your school at 10,000–13,000 VND per year. Zero maintenance, infinite scale, and absolute safety.",
    cta: "Contact for Institutional License",
    image: "/assets/pics-physics-lab-2.jpeg",
    imageAlt: "School computer lab running virtual simulations",
    stat: "Save 90% of structural budget compared to physical labs.",
  },
];

export const stats = [
  { value: 72, suffix: "%", subtitle: "per year", label: "cost-efficiency" },
  { value: 120, suffix: "+", subtitle: "lab items", label: "for customization" },
  { customText: "Student", subtitle: "Experience Focus", label: "design" },
  { value: 99, suffix: "%", subtitle: "virtual lab", label: "safety" },
];

export const pricingPlans = [
  {
    name: "Explorer",
    target: "Any student wanting to try before committing",
    price: "0 VND",
    period: "No credit card required",
    features: [
      "Access to Physics Playground (5 pre-built demo canvases)",
      "Text-to-simulation (3 inputs per day)",
      "Basic variable controls: gravity, friction, mass",
      "Standard 2D simulation rendering",
      "Community support via forum",
    ],
    cta: "Try for Free",
    popular: false,
  },
  {
    name: "Basic",
    target: "Individual students (self-study, homework help)",
    price: "70,000 VND",
    period: "per month",
    features: [
      "Everything in Explorer",
      "Text-to-simulation (unlimited daily inputs)",
      "Image-to-Simulation (photo upload of problem)",
      "Full variable control panel",
      "Save & revisit simulations (up to 20 saved scenes)",
      "Email support",
    ],
    cta: "Start Basic",
    popular: false,
  },
  {
    name: "Premium",
    target: "Serious students & individual educators",
    price: "150,000 VND",
    period: "per month",
    features: [
      "Everything in Basic",
      "Docs-to-Simulation (PDF / document upload)",
      "Unlimited saved simulation scenes",
      "Export simulation as animated GIF",
      "Advanced force & constraint tools (springs, joints, hinges)",
      "Priority email support",
      "Early access to new simulation types",
    ],
    cta: "Go Premium",
    popular: true,
  },
  {
    name: "School Package",
    target: "Schools, classes, educational institutions",
    price: "7,500,000 VND",
    period: "per semester",
    features: [
      "Everything in Premium",
      "Unlimited seats for all students in the school",
      "Teacher admin dashboard (assign simulations to classes)",
      "Class usage & engagement analytics",
      "Custom onboarding session & staff training",
      "Dedicated account manager",
      "SLA-backed technical support",
    ],
    cta: "Contact Us for School Access",
    popular: false,
  },
];

export const testimonials = [
  {
    quote:
      "I used to dread physics homework because I could never picture what the problem was describing. With Morphysics, I just type the question and watch it happen in real time. My exam score went from 6.5 to 9 in one semester.",
    name: "Nguyễn Minh Tú",
    role: "Grade 11 · THPT Nguyễn Thị Minh Khai, HCMC",
    avatar: "/assets/pics-study-groups.jpeg",
  },
  {
    quote:
      "The pendulum simulation blew my mind. I kept changing the string length and watching the period change — I finally understood WHY the formula works, not just how to plug numbers in. No textbook ever did that for me.",
    name: "Trần Quỳnh Anh",
    role: "Grade 10 · THPT Lê Hồng Phong, HCMC",
    avatar: "/assets/pics-girls-group.jpg",
  },
  {
    quote:
      "I demonstrated a projectile motion problem for my entire class in under 60 seconds. The students were completely glued to the screen. I haven't seen engagement like that in 8 years of teaching. I use it every week now.",
    name: "Thầy Phạm Hữu Hùng",
    role: "Physics Teacher · THCS Lê Quý Đôn, HCMC",
    avatar: "/assets/pics-physics-class.jpg",
  },
  {
    quote:
      "Before Morphysics, I had to spend 20 minutes setting up a demonstration that students would only half-understand anyway. Now I open a simulation, and they're asking me questions I've never been asked before. They actually want to stay after class.",
    name: "Cô Lê Thị Hương",
    role: "Physics & STEM Teacher · THPT Gia Định, HCMC",
    avatar: "/assets/pics-physics-class.jpg",
  },
  {
    quote:
      "Deploying Morphysics across our school was straightforward and fast. The admin dashboard gives me a clear view of which classes are using it actively and how student engagement is trending by week. It's the best EdTech investment we've made.",
    name: "Ms. Nguyễn Lan Anh",
    role: "Deputy Principal · THPT Trần Phú, HCMC",
    avatar: "/assets/pics-girls-group.jpg",
  },
  {
    quote:
      "My daughter was failing physics. I tried tutors, extra workbooks — nothing clicked. One week with Morphysics and she could finally explain force diagrams to me herself. Honestly the best 150,000đ I've ever spent.",
    name: "Chị Võ Thị Mai",
    role: "Parent of a Grade 10 student · Bình Dương",
    avatar: "/assets/pics-study-groups.jpeg",
  },
];

export const inquiryTypes = [
  "Student / Personal use",
  "Teacher / Educator plan",
  "School / Institutional licensing",
  "Press & Media",
  "Technical support",
  "Other",
];
