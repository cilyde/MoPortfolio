import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * The identity mark: a miniature ruled surface — straight lines forming a curve.
 * Twists tighter when its parent is hovered.
 */
export function Mark({ size = 26, active = false, className }: { size?: number; active?: boolean; className?: string }) {
  const [twist, setTwist] = useState(1.25);
  const state = useRef({ v: 1.25 });

  useEffect(() => {
    const tween = gsap.to(state.current, {
      v: active ? 2.65 : 1.25,
      duration: 1.3,
      ease: active ? "expo.out" : "elastic.out(1, 0.55)",
      onUpdate: () => setTwist(state.current.v),
    });
    return () => {
      tween.kill();
    };
  }, [active]);

  const lines = [];
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    for (const f of [1, -1]) {
      const a0 = a - (f * twist) / 2;
      const a1 = a + (f * twist) / 2;
      const x0 = 16 + Math.cos(a0) * 10;
      const y0 = 27 + Math.sin(a0) * 2.6;
      const x1 = 16 + Math.cos(a1) * 10;
      const y1 = 5 + Math.sin(a1) * 2.6;
      const depth = (Math.sin(a0) + Math.sin(a1)) / 2;
      lines.push(
        <line key={`${i}${f}`} x1={x0} y1={y0} x2={x1} y2={y1} strokeOpacity={0.28 + 0.72 * (depth * 0.5 + 0.5)} />,
      );
    }
  }

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={0.85}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <ellipse cx={16} cy={5} rx={10} ry={2.6} strokeOpacity={0.4} />
      <ellipse cx={16} cy={27} rx={10} ry={2.6} strokeOpacity={0.4} />
      {lines}
    </svg>
  );
}
