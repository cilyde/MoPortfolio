import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createSmoothScroll(reduced: boolean): { lenis: Lenis | null; dispose: () => void } {
  if (reduced) return { lenis: null, dispose: () => {} };

  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.35,
    smoothWheel: true,
  });
  const off = lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    dispose: () => {
      off();
      gsap.ticker.remove(raf);
      lenis.destroy();
    },
  };
}
