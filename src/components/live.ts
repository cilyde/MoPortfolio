import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { runtime } from "../lib/runtime";
import type { SceneStats } from "../webgl/Experience";

/** Subscribe to the sculpture's live parameters every frame (zero React re-renders). */
export function useLiveStats(callback: (stats: SceneStats | null) => void) {
  const ref = useRef(callback);
  useLayoutEffect(() => {
    ref.current = callback;
  });
  useEffect(() => {
    const tick = () => ref.current(runtime.experience?.stats ?? null);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
}

/** Write text into a node only when it changed. */
export function setText(el: HTMLElement | null, value: string) {
  if (el && el.textContent !== value) el.textContent = value;
}
