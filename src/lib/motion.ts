import gsap from "gsap";
import type { Experience } from "../webgl/Experience";
import { BASE, type Params } from "../webgl/keyframes";

const all = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));

/** The opening frame: darkness, a single line, camera almost touching it. */
const INTRO_START: Partial<Params> = {
  emerge: -0.24,
  lineCenter: 1,
  lineGlow: 1,
  lineAngle: 0,
  lineLength: 1,
  camRadius: 4.6,
  camPolar: 90,
  camAzimuth: 0,
  fov: 26,
  shiftX: 0,
  shiftY: 0,
  mShiftY: 0,
  exposure: 0.75,
  glowIntensity: 0,
  signals: 0,
  flip: 0,
  attention: 0,
  spin: 0,
  dust: 0,
  flow: 0,
  breath: 0,
  bloom: 1.3,
};

export function prepareIntroScene(exp: Experience) {
  Object.assign(exp.director.current, BASE, INTRO_START);
  Object.assign(exp.intro, { t0: 0, t1: 0, t2: 0, t3: 0, t4: 0 });
  exp.director.introActive = true;
}

/** Hide interface elements before first paint; the intro reveals them. */
export function prepareUI() {
  const setIfExists = (sel: string, vars: gsap.TweenVars) => {
    const els = all(sel);
    if (els.length) gsap.set(els, vars);
  };
  setIfExists('[data-reveal="rule"]', { scaleX: 0, transformOrigin: "0% 50%" });
  setIfExists('[data-reveal="nav"]', { yPercent: -70, opacity: 0 });
  setIfExists('[data-reveal="eyebrow"]', { opacity: 0, y: 14 });
  setIfExists('[data-reveal="name"] .ch', { yPercent: 112, rotate: 4 });
  setIfExists('[data-reveal="intro"] .wd', { yPercent: 105, opacity: 0 });
  setIfExists('[data-reveal="cta"]', { opacity: 0, y: 16 });
  setIfExists('[data-reveal="badge"]', { opacity: 0, scale: 0.9 });
  setIfExists('[data-reveal="meta"]', { opacity: 0, y: 12 });
  setIfExists('[data-reveal="cue"]', { opacity: 0 });
}

function revealUI(tl: gsap.core.Timeline, at: number) {
  const add = (sel: string, vars: gsap.TweenVars, pos: number) => {
    const els = all(sel);
    if (els.length) tl.to(els, vars, pos);
  };
  add('[data-reveal="rule"]', { scaleX: 1, duration: 1.7, ease: "expo.inOut", stagger: 0.1 }, at);
  add('[data-reveal="eyebrow"]', { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, at + 0.05);
  add('[data-reveal="name"] .ch', { yPercent: 0, rotate: 0, duration: 1.6, ease: "expo.out", stagger: 0.04 }, at + 0.12);
  add('[data-reveal="nav"]', { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.07 }, at + 0.3);
  add('[data-reveal="intro"] .wd', { yPercent: 0, opacity: 1, duration: 1.3, ease: "expo.out", stagger: 0.014 }, at + 0.62);
  add('[data-reveal="cta"]', { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, at + 0.85);
  add('[data-reveal="badge"]', { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }, at + 0.95);
  add('[data-reveal="meta"]', { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }, at + 1.05);
  add('[data-reveal="cue"]', { opacity: 1, duration: 1.2, ease: "power2.out" }, at + 1.25);
}

export interface IntroOptions {
  quick: boolean;
  reduced: boolean;
  onComplete: () => void;
}

/**
 * The Hook Choreography (seconds):
 * 0.15  A single line of light is drawn through darkness
 * 0.50  "Every system begins with a single line."
 * 1.55  It multiplies — the outer ring sweeps into existence as camera pulls away
 * 2.42  Lights on: ring twists into ruled hyperboloid surface with mechanical overshoot
 * 2.62  Inner shells assemble and synchronise towards the core
 * 3.35  Camera settles into hero composition, signals flow through the rods
 * 3.95  Typography & Interface reveal
 */
export function runIntro(exp: Experience | null, opts: IntroOptions): () => void {
  const boot = document.getElementById("boot");
  const caption = all('[data-intro="caption"]');
  const skip = all('[data-intro="skip"]');
  const removeBoot = () => boot?.remove();

  let finished = false;
  const listeners: [string, EventListener][] = [];
  const cleanup = () => listeners.forEach(([ev, fn]) => window.removeEventListener(ev, fn));

  const finish = () => {
    if (finished) return;
    finished = true;
    cleanup();
    if (exp) {
      exp.director.introActive = false;
      exp.startMonitoring();
    }
    if (skip.length) gsap.set(skip, { autoAlpha: 0 });
    removeBoot();
    opts.onComplete();
  };

  if (opts.reduced) {
    if (exp) {
      Object.assign(exp.director.current, BASE);
      Object.assign(exp.intro, { t0: 1, t1: 1, t2: 1, t3: 1, t4: 1 });
    }
    const tl = gsap.timeline({ onComplete: finish });
    if (boot) tl.to(boot, { opacity: 0, duration: 0.5, ease: "none" });
    else tl.set({}, {}, 0.01);
    return () => {
      tl.kill();
      cleanup();
    };
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
  const c = exp?.director.current;

  if (exp && c) {
    prepareIntroScene(exp);
    // 1. The single line
    tl.to(c, { emerge: -0.09, duration: 1.2, ease: "expo.inOut" }, 0.15);
    // 2. Multiplies — the ring sweeps out while camera pulls back
    tl.to(c, { camRadius: 12.5, camPolar: 97, camAzimuth: -24, fov: 30, duration: 2.0 }, 1.45);
    tl.to(c, { emerge: 0.5, duration: 1.05, ease: "power2.inOut" }, 1.55);
    tl.to(c, { lineCenter: 0, duration: 1.0 }, 1.6);
    tl.to(c, { lineGlow: 0, duration: 1.3, ease: "power2.out" }, 1.95);
    // 3. Lights on + the twist
    tl.to(c, { glowIntensity: BASE.glowIntensity, duration: 1.5, ease: "power2.out" }, 2.4);
    tl.to(c, { exposure: 1.14, duration: 0.55, ease: "power2.out" }, 2.42);
    tl.to(c, { exposure: BASE.exposure, duration: 1.4, ease: "power2.inOut" }, 2.97);
    tl.to(exp.intro, { t4: 1, duration: 1.35, ease: "back.out(1.5)" }, 2.42);
    // 4. Inner shells assemble and synchronise towards core
    tl.to(c, { emerge: 1, duration: 1.35, ease: "power2.inOut" }, 2.62);
    tl.to(exp.intro, { t3: 1, duration: 1.2, ease: "back.out(1.6)" }, 2.95);
    tl.to(exp.intro, { t2: 1, duration: 1.2, ease: "back.out(1.6)" }, 3.12);
    tl.to(exp.intro, { t1: 1, duration: 1.2, ease: "back.out(1.6)" }, 3.29);
    tl.to(exp.intro, { t0: 1, duration: 1.2, ease: "back.out(1.7)" }, 3.46);
    // 5. System comes alive
    tl.to(c, { spin: BASE.spin, flip: BASE.flip, dust: BASE.dust, flow: BASE.flow, breath: BASE.breath, duration: 1.8, ease: "power2.inOut" }, 3.0);
    tl.to(c, { signals: BASE.signals, duration: 1.5, ease: "power2.out" }, 3.55);
    tl.to(c, { attention: BASE.attention, bloom: BASE.bloom, duration: 1.4, ease: "power2.inOut" }, 3.9);
    // 6. Settle into hero composition
    tl.to(
      c,
      {
        camRadius: BASE.camRadius,
        camPolar: BASE.camPolar,
        camAzimuth: BASE.camAzimuth,
        fov: BASE.fov,
        shiftX: BASE.shiftX,
        shiftY: BASE.shiftY,
        mShiftY: BASE.mShiftY,
        duration: 2.1,
        ease: "power3.inOut",
      },
      3.35,
    );
  }

  if (boot) tl.to(boot, { opacity: 0, duration: 0.7, ease: "power2.out", onComplete: removeBoot }, 0.05);
  if (caption.length) {
    tl.fromTo(
      caption,
      { opacity: 0, y: 10, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" },
      0.5,
    );
    tl.to(caption, { opacity: 0, y: -8, filter: "blur(6px)", duration: 0.65, ease: "power2.in" }, exp ? 1.8 : 1.6);
  }
  if (skip.length) {
    tl.fromTo(skip, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.6);
    tl.to(skip, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, exp ? 4.6 : 2.2);
  }
  revealUI(tl, exp ? 3.95 : 1.9);

  if (opts.quick) tl.timeScale(1.7);

  const speedUp = () => {
    if (finished) return;
    tl.timeScale(5);
    if (skip.length) gsap.to(skip, { autoAlpha: 0, duration: 0.25, overwrite: true });
  };
  (["pointerdown", "keydown", "wheel", "touchstart"] as const).forEach((ev) => {
    const fn: EventListener = () => speedUp();
    window.addEventListener(ev, fn, { passive: true });
    listeners.push([ev, fn]);
  });

  return () => {
    tl.kill();
    cleanup();
  };
}
