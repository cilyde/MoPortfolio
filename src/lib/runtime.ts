import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type Lenis from "lenis";
import type { Experience } from "../webgl/Experience";

export interface Capabilities {
  webgl: boolean;
  /** 0 = no WebGL (2D fallback), 1 = constrained (mobile / low power), 2 = full */
  tier: 0 | 1 | 2;
  touch: boolean;
  reducedMotion: boolean;
}

export function detectCapabilities(): Capabilities {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) as WebGL2RenderingContext | null;
    webgl = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl = false;
  }
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  if (params?.get("gl") === "0") webgl = false;

  const cores = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4;
  const memory = typeof navigator !== "undefined" ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) : 8;
  const small = typeof window !== "undefined" && Math.min(window.innerWidth, window.innerHeight) < 720;
  let tier: 0 | 1 | 2 = 0;
  if (webgl) tier = touch || small || cores <= 4 || memory <= 4 ? 1 : 2;
  if (params?.get("quality") === "low" && webgl) tier = 1;

  return { webgl, tier, touch, reducedMotion };
}

interface Runtime {
  lenis: Lenis | null;
  experience: Experience | null;
  caps: Capabilities | null;
  manualHoverPillar: number | null;
}

export const runtime: Runtime = { lenis: null, experience: null, caps: null, manualHoverPillar: null };

export interface PillarHoverState {
  index: number;
  chapter: string;
  trait: string;
  subtrait: string;
  accent: string;
  screenX: number;
  screenY: number;
}

/* ── Global UI state store ─────────────────────────────────────────── */
interface UIState {
  introDone: boolean;
  section: number;
  hoveredPillar: PillarHoverState | null;
}
const state: UIState = { introDone: false, section: 0, hoveredPillar: null };
const listeners = new Set<() => void>();

export function setUI(patch: Partial<UIState>) {
  let changed = false;
  (Object.keys(patch) as (keyof UIState)[]).forEach((key) => {
    if (patch[key] !== undefined && state[key] !== patch[key]) {
      Object.assign(state, { [key]: patch[key] });
      changed = true;
    }
  });
  if (changed) listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useUI<K extends keyof UIState>(key: K): UIState[K] {
  return useSyncExternalStore(
    subscribe,
    () => state[key],
    () => state[key],
  );
}

/* ── Smooth Navigation helpers ─────────────────────────────────────── */
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

export function scrollToTarget(target: string | number, duration = 2.0, onComplete?: () => void) {
  const lenis = runtime.lenis;
  if (lenis) {
    if (lenis.isStopped) {
      lenis.start();
    }
    document.documentElement.classList.remove("lenis-stopped", "is-locked");
    lenis.scrollTo(target, { duration, easing: easeInOutQuart, onComplete });
    return;
  }
  let top = 0;
  if (typeof target === "number") top = target;
  else {
    const el = document.querySelector(target);
    top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }
  window.scrollTo({ top, behavior: runtime.caps?.reducedMotion ? "auto" : "smooth" });
  if (onComplete) {
    setTimeout(onComplete, (duration || 1) * 1000);
  }
}

/**
 * Jump smoothly to any specific chapter within the World / Personality section.
 */
export function scrollToChapter(chapter: number, duration?: number) {
  const worldEl = document.getElementById("world");
  if (!worldEl) return;

  const currentScroll = runtime.lenis ? runtime.lenis.scroll : window.scrollY;
  const worldTop = worldEl.getBoundingClientRect().top + currentScroll;

  // Chapter stop percentages (in vh from top of #world) matching STOPS in World.tsx
  const stops: Record<number, number> = {
    0: 0,   // Intro
    1: 90,  // Structure
    2: 180, // Intelligence
    3: 270, // Pattern
    4: 415, // Behaviour
    5: 505, // Craft / Light
    6: 655, // Synthesis
  };

  const vh = window.innerHeight;
  const at = stops[chapter] ?? 0;
  // Offset slightly into the chapter zone to reliably trigger ScrollTrigger keyframe
  const targetY = Math.round(worldTop + (at * vh) / 100 + 10);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const dur = duration ?? (isMobile ? 1.4 : 2.0);

  scrollToTarget(targetY, dur);
}

/* ── Viewport observation hooks ───────────────────────────────────── */
export type ViewState = "below" | "in" | "out";

/** Directional in-view state: below (not reached), in, out (scrolled past). */
export function useViewState<T extends Element>(rootMargin = "-40% 0px -40% 0px") {
  const ref = useRef<T>(null);
  const [view, setView] = useState<ViewState>("below");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setView("in");
        else setView(entry.boundingClientRect.top < 0 ? "out" : "below");
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, view] as const;
}

export function viewClass(view: ViewState) {
  return view === "in" ? "is-in" : view === "out" ? "is-out" : "";
}

export function useClock(timeZone: string) {
  const format = () => {
    try {
      return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(new Date());
    } catch {
      return "--:--";
    }
  };
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}
