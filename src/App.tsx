import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { detectCapabilities, runtime, setUI } from "./lib/runtime";
import { createSmoothScroll } from "./lib/lenis";
import { prepareIntroScene, prepareUI, runIntro } from "./lib/motion";
import { Experience } from "./webgl/Experience";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { World } from "./components/World";
import { Work } from "./components/Work";
import { Impact } from "./components/Impact";
import { Stack } from "./components/Stack";
import { Experience as ExperienceSection } from "./components/Experience";
import { Closing } from "./components/Closing";
import { Cursor } from "./components/Cursor";
import { IntroOverlay } from "./components/IntroOverlay";
import { FallbackArt } from "./components/FallbackArt";

gsap.registerPlugin(ScrollTrigger);

const VISITED_KEY = "mo:visited";
const readVisited = () => {
  try {
    return sessionStorage.getItem(VISITED_KEY) === "1";
  } catch {
    return false;
  }
};
const writeVisited = () => {
  try {
    sessionStorage.setItem(VISITED_KEY, "1");
  } catch {
    /* private mode fallback */
  }
};

function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (locked) runtime.lenis?.stop();
  else runtime.lenis?.start();
}

export default function App() {
  const caps = useMemo(() => detectCapabilities(), []);
  runtime.caps = caps;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glOk, setGlOk] = useState(caps.webgl);
  const introState = useRef<"idle" | "running" | "done">("idle");
  const killIntro = useRef<(() => void) | null>(null);

  // Hide the interface before first paint; the opening sequence reveals it
  useLayoutEffect(() => {
    if (!caps.reducedMotion) prepareUI();
  }, [caps]);

  // Smooth Lenis scrolling
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const smooth = createSmoothScroll(caps.reducedMotion);
    runtime.lenis = smooth.lenis;
    return () => {
      smooth.dispose();
      runtime.lenis = null;
    };
  }, [caps]);

  // Three.js WebGL kinetic sculpture + opening intro sequence
  useEffect(() => {
    let exp: Experience | null = null;
    if (glOk && canvasRef.current) {
      try {
        exp = new Experience(canvasRef.current, caps, () => setGlOk(false));
        runtime.experience = exp;
        if (introState.current === "done") {
          exp.director.introActive = false;
          exp.startMonitoring();
        } else if (!caps.reducedMotion) {
          prepareIntroScene(exp);
        }
      } catch (err) {
        console.warn("[experience] WebGL unavailable, using fallback", err);
        exp = null;
        runtime.experience = null;
        queueMicrotask(() => setGlOk(false));
      }
    }

    const offLenis = runtime.lenis?.on("scroll", (l) => {
      if (exp) {
        exp.scrollY = l.scroll;
        exp.scrollVel = l.velocity;
      }
    });
    let lastY = window.scrollY;
    const onNativeScroll = () => {
      if (!exp || runtime.lenis) return;
      const y = window.scrollY;
      exp.scrollVel = (y - lastY) * 0.5;
      exp.scrollY = y;
      lastY = y;
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    const tick = (_time: number, deltaMs: number) => exp?.update(deltaMs / 1000);
    gsap.ticker.add(tick);

    const refresh = () => {
      ScrollTrigger.refresh();
      exp?.director.measure();
    };
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(refresh);
    });
    ro.observe(document.body);
    const onResize = () => exp?.resize();
    window.addEventListener("resize", onResize);
    exp?.director.measure();

    let cancelled = false;
    if (introState.current === "idle") {
      introState.current = "running";
      lockScroll(true);
      const fonts = Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((r) => setTimeout(r, 2200)),
      ]);
      const compiled = exp ? exp.warmup() : Promise.resolve();
      Promise.all([fonts, compiled]).then(() => {
        if (cancelled) return;
        refresh();
        killIntro.current = runIntro(exp, {
          quick: readVisited(),
          reduced: caps.reducedMotion,
          onComplete: () => {
            introState.current = "done";
            lockScroll(false);
            setUI({ introDone: true });
            writeVisited();
            refresh();
          },
        });
      });
    }

    return () => {
      cancelled = true;
      if (introState.current === "running") {
        killIntro.current?.();
        killIntro.current = null;
        introState.current = "idle";
      }
      offLenis?.();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      cancelAnimationFrame(raf);
      ro.disconnect();
      exp?.dispose();
      if (runtime.experience === exp) runtime.experience = null;
    };
  }, [glOk, caps]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {glOk ? <canvas ref={canvasRef} className="gl-canvas" aria-hidden="true" /> : <FallbackArt reduced={caps.reducedMotion} />}
      <div className="grain" aria-hidden="true" />

      <IntroOverlay />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <World />
        <Work />
        <Impact />
        <Stack />
        <ExperienceSection />
        <Closing />
      </main>
      {!caps.touch && !caps.reducedMotion && <Cursor />}
    </>
  );
}
