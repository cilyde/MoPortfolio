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

export const site = {
  first: "Mohamed",
  middle: "Bruce",
  last: "Wayne",
  name: "Mohamed Bruce Wayne",
  shortName: "Mohamed Wayne",
  initials: "MW",
  role: "Flutter Developer & AI Engineer",
  tagline: "Fast, beautiful mobile apps with Flutter and applied AI.",
  city: "Dubai",
  country: "UAE",
  timezone: "Asia/Dubai",
  tzLabel: "GST",
  coords: "25.2048° N — 55.2708° E",
  email: "mohamed@brucewayne.dev",
  availability: "Available for new projects",
  since: 2019,
  caption: ["Every system begins", "with a single line."],
  intro:
    "I build fast, beautiful mobile apps with Flutter and useful AI integrations — clean code, smooth animations, and real business results.",
  socials: [
    { label: "GitHub", href: "https://github.com", handle: "@mohamedwayne" },
    { label: "LinkedIn", href: "https://linkedin.com", handle: "in/mohamedwayne" },
    { label: "X / Twitter", href: "https://x.com", handle: "@mohamedwayne" },
  ],
};

export const stats = [
  { value: "5+", label: "Years Shipping", detail: "Production code on iOS & Android" },
  { value: "40+", label: "Apps Launched", detail: "Shipped to App Store & Google Play" },
  { value: "12M+", label: "Daily Events", detail: "Analyzed with fast queries" },
  { value: "99.9%", label: "Crash-free Rate", detail: "Across 250k+ active users" },
];

export const forces: Force[] = [
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
];

export const projects: Project[] = [
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
];

export const stackCategories = [
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
];

export const experience = [
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
];
