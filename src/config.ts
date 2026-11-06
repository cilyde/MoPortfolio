import pulse from "@/assets/work-pulse.jpg";
import lumen from "@/assets/work-lumen.jpg";
import atlas from "@/assets/work-atlas.jpg";
import forge from "@/assets/work-forge.jpg";
import vitals from "@/assets/work-vitals.jpg";

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
    title: "Mohamed Bruce Wayne — Flutter Developer · AI & Data Engineer",
    description:
      "Mohamed Bruce Wayne — Flutter Developer & AI/Data Engineer. High-impact mobile apps, applied AI models, and real-time data pipelines built for scale and aesthetic craft.",
    ogTitle: "Mohamed Bruce Wayne — Portfolio",
    ogDescription: "Every system begins with a single line. A portfolio by Mohamed Bruce Wayne — Flutter, AI & Data.",
  },

  personal: {
    first: "Mohamed",
    middle: "Bruce",
    last: "Wayne",
    name: "Mohamed Bruce Wayne",
    shortName: "Mohamed Wayne",
    initials: "MW",
    role: "Flutter Developer & AI Engineer",
    disciplinesBadge: "Flutter · AI · Data",
    tagline: "Fast, beautiful mobile apps with Flutter and applied AI.",
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    tzLabel: "GST",
    coords: "25.2048° N — 55.2708° E",
    email: "mohamed@brucewayne.dev",
    availability: "Available for new projects",
    since: 2019,
    caption: ["Every system begins", "with a single line."] as [string, string],
    intro:
      "I build fast, beautiful mobile apps with Flutter and useful AI integrations — clean code, smooth animations, and real business results.",
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
      { label: "Craft & Forces", target: "#world", href: "#world", index: "01" },
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
        label: "Explore Craft & Forces",
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
      { name: "Dev at the Core", tag: "01 Bedrock", chapter: 1 },
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
        discipline: "Dev at the Core · Flutter",
        role: "The Bedrock",
        headline: "Rock-solid, fluid mobile architectures.",
        text: "Clean reactive systems that never crash and hold their shape under massive user load. Pure engineering discipline.",
        hint: "Rogue member 01 extends from the spine — laser-engraved with structural integrity.",
      },
      {
        id: "intelligence",
        index: "02",
        title: "Intelligence",
        discipline: "Advanced AI · Neural Models",
        role: "The Amplifier",
        headline: "Applied intelligence, not gimmicks.",
        text: "Context-aware agents and private on-device models that solve real problems with zero latency and high leverage.",
        hint: "Rogue member 02 unlocks from the inner lattice — laser-engraved with neural context.",
      },
      {
        id: "pattern",
        index: "03",
        title: "Pattern",
        discipline: "Business Data Analytics",
        role: "The Compass",
        headline: "Quantifiable numbers that prove ROI.",
        text: "Real-time event pipelines, cohort retention, and conversion funnels turning intuition into decisive business velocity.",
        hint: "Rogue member 03 slides outward — laser-engraved with telemetry and conversion metrics.",
      },
      {
        id: "behaviour",
        index: "04",
        title: "Behaviour",
        discipline: "Psychology & Cognition",
        role: "The Human Lens",
        headline: "Designed for how humans think.",
        text: "Intuitive flows rooted in cognitive ergonomics, emotional safety, and effortless interaction. Eliminates friction before code is written.",
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
        text: "Composition, negative space, focal depth, and tactile spring physics that give digital systems an authentic aesthetic soul.",
        hint: "Rogue member 05 peels from the outer veil — laser-engraved with aperture and composition.",
      },
    ] as Force[],
    synthesis: {
      tag: "(06) — Synthesis",
      headingLine1: "Not five silos.",
      headingLine2: "One unified craft.",
      description: "Solid code, useful AI, and clear numbers.",
    },
    liveAperture: {
      fallbackValue: "ƒ/2.8",
      initialDisplayValue: "ƒ/1.4",
      cameraPerspective: "Camera perspective: overhead orbital plane",
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
    sectionTitle: "Selected Work & Case Studies",
    period: "2023 — 2025",
    headingLine1: "Selected",
    headingLine2: "work",
    countBadge: "(05)",
    totalCount: "05",
    description: "Selected mobile apps and production systems.",
    previewButton: "Preview Interface",
    previewPrompt: "Tap to preview UI",
    metaLabels: {
      role: "Role",
      platform: "Platform",
      techStack: "Tech Stack",
    },
    projects: [
      {
        id: "pulse",
        index: "01",
        title: "Pulse",
        italic: false,
        year: "2025",
        kind: "FinTech · AI Mobile",
        subtitle: "AI-native personal finance",
        summary: "Smart finance app turning bank feeds into automated spending insights and savings coaching.",
        role: "Lead Mobile Architect",
        platform: "iOS / Android",
        stack: "Flutter, Riverpod, GPT-4o, Firebase",
        metric: "★ 4.9 · 120k+ Downloads",
        contributions: [
          "Fluid transaction timeline handling 50k+ records",
          "Instant AI receipt parsing cut logging from 4 min to 15 sec",
        ],
        accent: "#E8A25F",
        image: pulse,
      },
      {
        id: "lumen",
        index: "02",
        title: "Lumen",
        italic: true,
        year: "2024",
        kind: "Applied AI · Voice",
        subtitle: "Voice-first journaling",
        summary: "Private voice journal with on-device speech transcription and smart memory search.",
        role: "Lead Mobile Developer",
        platform: "iOS / Android",
        stack: "Flutter, Whisper AI, Supabase",
        metric: "★ 4.8 · 85% Retention",
        contributions: [
          "Featured by Apple in New Apps We Love",
          "Works 100% offline with fast local search",
        ],
        accent: "#7B61FF",
        image: lumen,
      },
      {
        id: "atlas",
        index: "03",
        title: "Atlas",
        italic: false,
        year: "2024",
        kind: "Data Platform",
        subtitle: "Real-time analytics engine",
        summary: "Real-time telemetry engine connecting mobile apps to live executive dashboards.",
        role: "Lead Data Engineer",
        platform: "Cloud Dashboard & SDK",
        stack: "Python, BigQuery, dbt, ClickHouse, Flutter",
        metric: "★ 12M Events/Day · <300ms Queries",
        contributions: [
          "Lightweight mobile SDK with offline batching",
          "Real-time early-warning alerts for user drop-off",
        ],
        accent: "#5EEAD4",
        image: atlas,
      },
      {
        id: "forge",
        index: "04",
        title: "PromptForge",
        italic: false,
        year: "2025",
        kind: "AI Developer Tooling",
        subtitle: "Enterprise prompt workbench",
        summary: "Developer tool to test, compare, and version AI prompts before shipping to production.",
        role: "Full-Stack AI Developer",
        platform: "Web & Desktop",
        stack: "TypeScript, Claude, OpenAI, Postgres, Docker",
        metric: "★ 3 Teams · 99.4% Reliability",
        contributions: [
          "Regression tests preventing prompt bugs across releases",
          "Cut monthly AI compute costs by 32%",
        ],
        accent: "#FFB347",
        image: forge,
      },
      {
        id: "vitals",
        index: "05",
        title: "Vitals",
        italic: false,
        year: "2023",
        kind: "HealthTech · Edge AI",
        subtitle: "On-device health tracking",
        summary: "Private wearable health app predicting recovery and sleep with on-device AI.",
        role: "Mobile Lead",
        platform: "iOS & Android",
        stack: "Flutter, TensorFlow Lite, HealthKit",
        metric: "★ 100% On-Device · <2% Battery",
        contributions: [
          "Zero data leaves the device for clinical-grade privacy",
          "Seamless Apple HealthKit and Health Connect sync",
        ],
        accent: "#FF7A59",
        image: vitals,
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
      { value: "5+", label: "Years Shipping", detail: "Production code on iOS & Android" },
      { value: "40+", label: "Apps Launched", detail: "Shipped to App Store & Google Play" },
      { value: "12M+", label: "Daily Events", detail: "Analyzed with fast queries" },
      { value: "99.9%", label: "Crash-free Rate", detail: "Across 250k+ active users" },
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
        category: "Mobile",
        badge: "Core",
        color: "#E8A25F",
        skills: ["Flutter", "Dart", "Clean Architecture", "Riverpod", "Bloc", "CI/CD", "Offline-First", "App Store Launches"],
      },
      {
        category: "Artificial Intelligence",
        badge: "Applied",
        color: "#7B61FF",
        skills: ["LLM Integration", "On-Device Models", "OpenAI & Claude APIs", "Prompt Engineering", "Vector Search", "Evals"],
      },
      {
        category: "Data & Cloud",
        badge: "Scale",
        color: "#5EEAD4",
        skills: ["Python", "SQL", "BigQuery", "Firebase", "Supabase", "PostgreSQL", "dbt", "REST APIs"],
      },
    ] as StackCategory[],
  },

  experience: {
    sectionNumber: "(06)",
    sectionTitle: "Career Path",
    headingLine1: "Work",
    headingLine2: "History",
    description: "Leadership, architectures shipped, teams elevated.",
    currentBadge: "Current",
    impactTitle: "Key Impact",
    separator: "•",
    history: [
      {
        period: "2023 — Present",
        current: true,
        role: "Lead Mobile & AI Engineer",
        company: "Nimbus Systems",
        location: "Dubai / Remote",
        description: "Leading mobile product development for flagship Flutter apps with integrated generative AI.",
        achievements: [
          "Scaled Flutter apps to 250k+ active users at 99.9% crash-free rate",
          "Built on-device voice search and transcription",
          "Led and mentored a team of 6 engineers",
        ],
      },
      {
        period: "2021 — 2023",
        current: false,
        role: "Senior Flutter Developer",
        company: "Apex Digital Health",
        location: "London / Remote",
        description: "Built privacy-first health apps connected to wearable biometric sensors.",
        achievements: [
          "Shipped 3 apps to the App Store and Google Play from scratch",
          "Maintained fluid, stutter-free animations across all phones",
          "Built real-time sensor pipelines aggregating 8M+ weekly events",
        ],
      },
      {
        period: "2019 — 2021",
        current: false,
        role: "Mobile Engineer",
        company: "Veloce Technologies",
        location: "London, UK",
        description: "Developed and launched commercial Flutter apps for international clients.",
        achievements: [
          "Delivered 12+ client projects on schedule",
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
      craftedWith: "Engineered with Flutter, AI & WebGL craft",
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
