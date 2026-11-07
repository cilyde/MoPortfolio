import taza from "@/assets/work-taza.jpg";
import pos from "@/assets/work-pos.jpg";
import lumen from "@/assets/work-lumen.jpg";
import atlas from "@/assets/work-atlas.jpg";
import forge from "@/assets/work-forge.jpg";
import vitals from "@/assets/work-vitals.jpg";
import analytics from "@/assets/work-analytics.jpg";
import laundry from "@/assets/work-laundry.jpg";
import moonlit from "@/assets/work-moonlit.jpg";


export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  italic?: boolean;
  year: string;
  kind: string;
  subtitle: string;
  summary: string;
  role: string;
  platform: string;
  stack: string;
  metric: string;
  contributions: string[];
  links?: ProjectLink[];
  accent: string;
  image: string;
}

export interface Force {
  id: string;
  index: string;
  title: string;
  discipline: string;
  role: string;
  headline: string;
  text: string;
  hint?: string;
  hintTouch?: string;
}

export interface Stat {
  value: string;
  label: string;
  detail: string;
}

export interface StackCategory {
  category: string;
  badge: string;
  color: string;
  skills: string[];
}

export interface ExperienceItem {
  period: string;
  current: boolean;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
  externalIcon?: string;
}

export interface NavLink {
  label: string;
  target: string;
  href: string;
  index: string;
}

export interface NavSection {
  id: string;
  label: string;
}

export interface DisciplineItem {
  name: string;
  tag: string;
  chapter: number;
}

export interface RogueDef {
  id: string;
  index: string;
  chapter: string;
  shellIndex: number;
  trait: string;
  subtrait: string;
  spec: string;
  accent: [number, number, number]; // Linear RGB
  accentHex: string;
  angleOffset: number; // Base azimuthal position
  yOffset: number; // Vertical offset
}

export interface TelemetryReadout {
  label: string;
  fallback: string;
  ch: number[];
}

export const config = {
  meta: {
    title: "Mohamed Ahamed — Flutter Developer · AI & Data Engineer",
    description:
      "Mohamed Shabeen Ahamed — Flutter Developer & AI/Data Engineer. High-impact mobile apps, applied AI models, and real-time data pipelines built for scale and aesthetic craft.",
    ogTitle: "Mohamed Shabeen Ahamed — Portfolio",
    ogDescription: "Every system begins with a single line. A portfolio by Mohamed Shabeen Ahamed — Flutter, AI & Data.",
  },

  personal: {
    first: "Mohamed",
    middle: "Shabeen",
    last: "Ahamed",
    name: "Mohamed Shabeen Ahamed",
    shortName: "",
    initials: "MSA",
    role: "",
    disciplinesBadge: "Apps · AI · Analytics",
    tagline: "Fast, beautiful mobile apps with Flutter and applied AI.",
    city: "Abu Dhabi",
    country: "UAE",
    timezone: "Asia/Dubai",
    tzLabel: "GST",
    coords: "25.2048° N — 55.2708° E",
    email: "mohamed.shabeen.ahamed@gmail.com",
    availability: "Available for new projects",
    since: 2019,
    caption: ["Every system begins", "with a single line."] as [string, string],
    intro:
      "I build for people, things they dont know they need yet.",
  },

  navigation: {
    skipLink: {
      text: "Skip to content",
      href: "#main",
    },
    brandAriaLabelSuffix: "return to top",
    primaryNavAriaLabel: "Primary",
    mobileMenu: {
      openLabel: "Open menu",
      closeLabel: "Close menu",
      openText: "Menu",
      closeText: "Close",
    },
    cta: {
      label: "Let's Talk",
      href: "#contact",
      target: "end",
    },
    links: [
      { label: "Personality", target: "#world", href: "#world", index: "01" },
      { label: "Selected Work", target: "#work", href: "#work", index: "02" },
      { label: "Impact & Stack", target: "#impact", href: "#impact", index: "03" },
      { label: "Contact", target: "end", href: "#contact", index: "04" },
    ] as NavLink[],
    sections: [
      { id: "#top", label: "Index" },
      { id: "#world", label: "Craft" },
      { id: "#work", label: "Work" },
      { id: "#impact", label: "Impact" },
      { id: "#contact", label: "Contact" },
    ] as NavSection[],
    hud: {
      separator: "/",
      percentSuffix: "%",
      initialPercent: "000",
    },
  },

  hero: {
    ariaLabel: "Introduction",
    eyebrowSeparator: "—",
    badge: {
      text: "Flutter • Applied AI • Data • Craft • ",
      ariaLabel: "Scroll to explore craft and projects",
      target: "#world",
    },
    ctas: {
      primary: {
        label: "Explore Personality",
        href: "#world",
      },
      secondary: {
        label: "Selected Work",
        href: "#work",
      },
    },
    scrollPrompt: "Keep scrolling to explore",
    scrollPromptMobile: "Keep scrolling to explore ↓",
    scrollTarget: "#world",
  },

  introOverlay: {
    skipText: "Skip intro →",
  },

  world: {
    ariaLabel: "Craft & Philosophy",
    sectionNumber: "(02)",
    sectionTitle: "Craft & Philosophy",
    counterFallback: "Five Forces",
    counterSynthesis: "Synthesis",
    counterTotal: "05",
    intro: {
      headingLine1: "One mind,",
      headingLine2: "five forces.",
      description: "Great mobile apps need clean code, useful AI, and thoughtful design. Nothing extra.",
    },
    disciplinesAriaLabel: "Disciplines",
    disciplines: [
      { name: "Software Development", tag: "01 Core", chapter: 1 },
      { name: "Advanced AI", tag: "02 Engine", chapter: 2 },
      { name: "Business Data Analytics", tag: "03 Signal", chapter: 3 },
      { name: "Psychology & Cognition", tag: "04 Touch", chapter: 4 },
      { name: "Photography & Optics", tag: "05 Craft", chapter: 5 },
    ] as DisciplineItem[],
    forces: [
      {
        id: "structure",
        index: "01",
        title: "Structure",
        discipline: "Software Development · Apps · Websites",
        role: "The Core",
        headline: "Rock-solid, fluid user experiences.",
        text: "Responsive systems that never crash and hold their shape under massive user load. Pure engineering discipline.",
        hint: "Rogue member 01 extends from the spine — laser-engraved with structural integrity.",
      },
      {
        id: "intelligence",
        index: "02",
        title: "Intelligence",
        discipline: "Advanced AI · Neural Models",
        role: "The Amplifier",
        headline: "Applied intelligence, not gimmicks.",
        text: "Context-aware agents, custom tuned AI models that run locally or frontier models that work seamlessly",
        hint: "Rogue member 02 unlocks from the inner lattice — laser-engraved with neural context.",
      },
      {
        id: "pattern",
        index: "03",
        title: "Pattern",
        discipline: "Business Data Analytics",
        role: "The Compass",
        headline: "Quantifiable numbers that prove ROI.",
        text: "Tracking real user data to turn guesswork into growth.",
        hint: "Rogue member 03 slides outward — laser-engraved with telemetry and conversion metrics.",
      },
      {
        id: "behaviour",
        index: "04",
        title: "Behaviour",
        discipline: "Psychology & Cognition",
        role: "The Human Lens",
        headline: "Designed for how humans think.",
        text: "Designing flows so intuitive that they guide users naturally, meeting needs they haven’t even noticed yet.",
        hint: "Rogue member 04 cantilevers forward — laser-engraved with behavioral flow.",
        hintTouch: "Touch the screen — rogue member 04 catches your light.",
      },
      {
        id: "light",
        index: "05",
        title: "Craft",
        discipline: "Photography & Visual Depth",
        role: "The Creative Eye",
        headline: "Details you feel through light and space.",
        text: "Using a photographer's eye for contrast and spacing to build interfaces that feel alive on screen.",
        hint: "Rogue member 05 peels from the outer veil — laser-engraved with aperture and composition.",
      },
    ] as Force[],
    synthesis: {
      tag: "(06) — Synthesis",
      headingLine1: "Not five titles.",
      headingLine2: "One unified craft.",
      description: "Solid code, useful AI, and clear numbers.",
    },
    liveAperture: {
      fallbackValue: "ƒ/2.8",
      initialDisplayValue: "ƒ/1.4",
      cameraPerspective: "",
    },
    telemetryAriaLabel: "Live sculpture state",
    telemetry: [
      { label: "Twist φ", fallback: "126.0°", ch: [1] },
      { label: "Members", fallback: "768", ch: [1] },
      { label: "Flow Field", fallback: "0.06", ch: [2] },
      { label: "Data Order", fallback: "0%", ch: [3] },
      { label: "Attention", fallback: "1.00", ch: [4] },
      { label: "Aperture", fallback: "ƒ/2.8", ch: [5] },
    ] as TelemetryReadout[],
  },

  work: {
    sectionNumber: "(03)",
    sectionTitle: "Selected Work",
    period: "2024 — 2026",
    headingLine1: "Selected",
    headingLine2: "work",
    countBadge: "(05)",
    totalCount: "05",
    description: "",
    previewButton: "Check out",
    previewPrompt: "Tap for more",
    metaLabels: {
      role: "Role",
      platform: "Platform",
      techStack: "Tech Stack",
    },
    projects: [
      {
        id: "taza",
        index: "01",
        title: "Taza",
        italic: false,
        year: "2025",
        kind: "FinTech · AI Mobile",
        subtitle: "AI-assisted Zakat & interest tracking",
        summary: "App helping People effortlessly track, calculate, and purify Zakat and interest.",
        role: "Solo Dev",
        platform: "iOS / Android",
        stack: "Flutter, Riverpod, ML, Firebase",
        metric: "Available on Play Store",
        contributions: [
          "Automatic prediction of interest gains and eligible Zakat assets",
          "Smooth offline-first financial dashboard built in Flutter",
        ],
        accent: "#E8A25F",
        image: taza,
      },
      {
        id: "neural-dine",
        index: "02",
        title: "NeuralDine",
        italic: false,
        year: "2026",
        kind: "Applied AI · Retail Tech",
        subtitle: "Fast Paced & AI Powered",
        summary: "Bulletproof POS built for peak rush hours. Combines smart AI order suggestions with an offline engine that never crashes even when the internet dies.\nTablets seamlessly works as part of an eco-system.",
        role: "Lead Developer",
        platform: "Windows / Tablet / Android",
        stack: "Flutter, On-Device AI, SQLite, Local Mesh",
        metric: "1M+ Sales recorded · 10x Faster Rush Checkouts",
        contributions: [
          "Built a local offline mesh so registers never drop an order when Wi-Fi dies",
          "Shipped AI smart-upsell suggestions that increased average table checks on the fly",
        ],
        accent: "#FF4500",
        image: pos,
      },
      {
        id: "cilyde-laundry-pos",
        index: "03",
        title: "Cilyde Laundry POS",
        italic: false,
        year: "2024",
        kind: "Retail Tech · Enterprise POS & Operations",
        subtitle: "A-Z offline-first laundry management & POS ecosystem",
        summary: "Streamlined end-to-end laundry operations into a high-reliability POS system. Built with offline-first local persistence, hardware thermal receipt printing, and automated inventory & ticket tracking designed for fast-paced frontline counters.",
        role: "Lead Mobile & Systems Engineer",
        platform: "Cross-Platform (Mobile / Desktop / Tablet)",
        stack: "Flutter, Dart, SQLite (sqflite), Provider, ESC/POS, Thermal Printing",
        metric: "100% Offline-First · Zero Transaction Loss",
        contributions: [
          "Architected an offline-first POS architecture with SQLite synchronization, guaranteeing instant order creation and zero downtime during network outages",
          "Engineered multi-channel hardware integrations for ESC/POS thermal printers, barcode scanners, and automated digital receipts",
        ],
        accent: "#0EA5E9",
        image: laundry,
      },
      {
        id: "restaurant-bi",
        index: "04",
        title: "Cilyde Pulse",
        italic: false,
        year: "2024",
        kind: "Business Intelligence Dashboard",
        subtitle: "In-browser AI analytics",
        summary: "Turn raw POS chaos into pure profit clarity. Runs a client-side Python engine directly inside the browser with one-click AI prompts to spot menu winners, server leaks, and rush-hour bottlenecks.",
        role: "Lead Fullstack & Data Engineer",
        platform: "Web / Desktop",
        stack: "JavaScript, Pyodide (Wasm), Python/Pandas, TailwindCSS",
        metric: "100% In-Browser · 0s Cloud Latency",
        contributions: [
          "Brought full Python & Pandas directly into the browser via WebAssembly to analyze thousands of checks with zero server costs",
          "Engineered one-click AI intelligence exports that instantly summarize table turnover leaks, server rankings, and menu margins",
        ],
        accent: "#6366F1",
        image: analytics,
      },

      {
        id: "moonlit",
        index: "05",
        title: "Moonlit",
        italic: false,
        year: "2024",
        kind: "Bespoke Immersive Invitation",
        subtitle: "Interactive invitation unboxing experience",
        summary: "An ultra-refined digital wedding invitation featuring realistic interactive wax seal opening physics, dynamic countdowns, rich typography, and seamless audio accompaniment.",
        role: "UI/UX & Creative Frontend Engineer",
        platform: "Web / Mobile Optimized",
        stack: "Vanilla JavaScript (ES6+), Modern CSS3, HTML5 Canvas, Web Audio API",
        metric: "Instant Initial Load · Zero Framework Overhead",
        contributions: [
          "Developed tactile interactive envelope-unsealing animations with responsive physics, sound effects, and smooth particle reveals",
          "Engineered zero-dependency configuration architecture allowing rapid instant-rebranding across names, itineraries, and map locations",
        ],
        links: [
          { label: "One", url: "https://cilyde-wedding-one.vercel.app/" },
          { label: "Two", url: "https://cilyde-wedding-two.vercel.app/" },
        ],
        accent: "#FFB347",
        image: moonlit,
      },
    ] as Project[],
  },

  modal: {
    closeAriaLabel: "Close visual preview",
    highlightsTitle: "Key Highlights",
    stackLabel: "Stack:",
    previewAltSuffix: "interface preview",
    separator: "•",
  },

  impact: {
    sectionNumber: "(04)",
    sectionTitle: "Track Record & Business Impact",
    headingLine1: "Proven",
    headingLine2: "Numbers",
    description: "Measurable engineering results shipped to real users.",
    stats: [
      { value: "3+", label: "Years Shipping", detail: "Production code on Desktop, iOS & Android" },
      { value: "9M+", label: "Daily Events", detail: "Analyzed with fast queries" },
      { value: "99.9%", label: "Crash-free Rate", detail: "Across multiple clients" },
    ] as Stat[],
  },

  stack: {
    sectionNumber: "(05)",
    sectionTitle: "Technology Arsenal",
    headingLine1: "Core",
    headingLine2: "Skills",
    headingSuffix: "& Tools",
    description: "Battle-tested production toolsets.",
    categories: [
      {
        category: "Mobile & Systems",
        badge: "Core",
        color: "#E8A25F",
        skills: [
          "Flutter",
          "Dart",
          "Riverpod",
          "Provider",
          "SQLite",
          "ESC/POS",
          "Local Mesh & LAN Sync",
          "Offline-First Engine",
          "Cross-Platform Desktop & Mobile",
          "MVVM/MVC",
          "React Native",
          "Swift",
          "Kotlin",
          "C++"
        ],
      },
      {
        category: "Artificial Intelligence & ML",
        badge: "Applied",
        color: "#7B61FF",
        skills: [
          "On-Device AI",
          "Machine Learning",
          "LLM Integration",
          "Prompt Engineering",
          "Predictive AI Models",
          "Smart Upsell AI",
          "Model Training", "Tuning",
          "RAG",
          "Reinforcement Learning",
        ],
      },
      {
        category: "Web & Data Engineering",
        badge: "Scale",
        color: "#5EEAD4",
        skills: [
          "Python",
          "Pandas, Numpy",
          "WebAssembly (Pyodide)",
          "Firebase",
          "JavaScript (ES6+)",
          "HTML5 Canvas",
          "Web Audio API",
          "TailwindCSS",
          "CSS3 Animations",
          "REST APIs",
          "GraphQL",
          "SQL",
          "BigQuery",
          "PostgreSQL",
        ],
      },
    ] as StackCategory[],
  },

  experience: {
    sectionNumber: "(06)",
    sectionTitle: "Career Path",
    headingLine1: "Work",
    headingLine2: "History",
    description: "Leadership, architectures shipped.",
    currentBadge: "Current",
    impactTitle: "Key Impact",
    separator: "•",
    history: [
      {
        period: "2025 — Present",
        current: true,
        role: "Lead Software Engineer",
        company: "Phoenix Hypermarket & Chain",
        location: "Abu Dhabi",
        description: "Leading product development for multiple business with integrated generative AI.",
        achievements: [
          "Recorded 9M+ in retail sales with zero transaction loss during peak rush hours",
          "Shipped resilient offline-first systems across store counters, tablets, and mobile",
          "Automated daily operations and inventory tracking with smart on-device intelligence"
        ],
      },
      {
        period: "2024 — 2025",
        current: false,
        role: "Freelance Developer",
        location: "London / Remote",
        description: "Shipped and maintaned apps with flutter for clients",
        achievements: [
          "Shipped 3 apps to the Google Play from scratch",
          "Maintained fluid, stutter-free animations across all phones",
        ],
      },
      {
        period: "2022 — 2023",
        current: false,
        role: "Flutter Developer",
        company: "Mentorow",
        location: "Kochi, India",
        description: "Developed and launched commercial Flutter apps for clients.",
        achievements: [
          "Developed with team for clients",
          "Cut app bug volume by 45% through cleaner reactive architecture",
        ],
      },
    ] as ExperienceItem[],
  },

  closing: {
    stage1: {
      sectionNumber: "(07)",
      sectionTitle: "Full Circle",
      line1: "Every system begins",
      line2: "with a single line.",
    },
    stage2: {
      sectionNumber: "(07)",
      sectionTitle: "Direct Contact",
      headingLine1: "Let's build",
      headingLine2: "the next one.",
    },
    copyAddress: {
      defaultLabel: "Copy address",
      copiedLabel: "Copied ✓",
    },
    socials: [
      { label: "GitHub", href: "https://github.com", handle: "@mohamedwayne", externalIcon: "↗" },
      { label: "LinkedIn", href: "https://linkedin.com", handle: "in/mohamedwayne", externalIcon: "↗" },
      { label: "X / Twitter", href: "https://x.com", handle: "@mohamedwayne", externalIcon: "↗" },
    ] as SocialLink[],
    footer: {
      copyrightSuffix: "All rights reserved.",
      craftedWith: "Designed & engineered with code, light & spatial depth",
      backToTop: "Back to the first line ↑",
    },
  },

  rogueElements: {
    systemHeaderPrefix: "SYS.ROGUE // SHELL_0",
    systemHeaderTrait: " // TRAIT_",
    badgePrefix: "TRAIT: ",
    items: [
      {
        id: "dev-core",
        index: "01",
        chapter: "01 Structure",
        shellIndex: 0,
        trait: "DEV AT THE CORE",
        subtrait: "Developer, Quick Study, Adaptable",
        spec: "CLEAN REACTIVE ARCH · 120 FPS · CRASH-FREE",
        accent: [1.0, 0.72, 0.42], // Warm Amber
        accentHex: "#E8A25F",
        angleOffset: 0.25,
        yOffset: 0.15,
      },
      {
        id: "advanced-ai",
        index: "02",
        chapter: "02 Intelligence",
        shellIndex: 1,
        trait: "ADVANCED AI",
        subtrait: "Msc CS with Applied Machine Learning",
        spec: "LLM ORCHESTRATION · ON-DEVICE · HIGH LEVERAGE",
        accent: [0.55, 0.42, 1.0], // Royal Violet
        accentHex: "#7B61FF",
        angleOffset: 1.5,
        yOffset: -0.12,
      },
      {
        id: "business-data",
        index: "03",
        chapter: "03 Pattern",
        shellIndex: 2,
        trait: "BUSINESS DATA ANALYTICS",
        subtrait: "Big Data Analytics, expert in creating business dashboards from scratch",
        spec: "12M EVENTS/DAY · COHORT RETENTION · ROI CERTAINTY",
        accent: [0.37, 0.92, 0.83], // Teal Cyan
        accentHex: "#5EEAD4",
        angleOffset: 2.75,
        yOffset: 0.28,
      },
      {
        id: "psychology",
        index: "04",
        chapter: "04 Behaviour",
        shellIndex: 3,
        trait: "PSYCHOLOGY & COGNITION",
        subtrait: "Analyzes user behaviour and we know what people need before they know they need it yet",
        spec: "COGNITIVE FLOW · USER EMPATHY · ZERO FRICTION",
        accent: [1.0, 0.48, 0.35], // Coral Synapse
        accentHex: "#FF7A59",
        angleOffset: 4.0,
        yOffset: -0.22,
      },
      {
        id: "photography",
        index: "05",
        chapter: "05 Craft",
        shellIndex: 4,
        trait: "PHOTOGRAPHY & OPTICS",
        subtrait: "what can i say, I love photography and yeah, this aint AI generated!",
        spec: "APERTURE ƒ/1.4 · FOCAL DEPTH · HARMONY & POLISH",
        accent: [1.0, 0.82, 0.5], // Gold Light
        accentHex: "#FFD080",
        angleOffset: 5.25,
        yOffset: 0.08,
      },
    ] as RogueDef[],
  },
};

// Convenience direct exports
export const site = {
  ...config.personal,
  socials: config.closing.socials,
};
export const forces = config.world.forces;
export const projects = config.work.projects;
export const stats = config.impact.stats;
export const stackCategories = config.stack.categories;
export const experience = config.experience.history;
export const ROGUE_DEFS = config.rogueElements.items;

export default config;
