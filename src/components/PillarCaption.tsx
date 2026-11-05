import { useEffect, useState } from "react";
import { useUI, type PillarHoverState } from "../lib/runtime";

/**
 * Clean, understated caption box in the top right.
 * Stripped of all jargon — contains strictly the title and description requested.
 * Uses a smooth, flicker-free opacity fade with zero blur snapping.
 */
export function PillarCaption() {
  const hovered = useUI("hoveredPillar");
  const [displayPillar, setDisplayPillar] = useState<PillarHoverState | null>(hovered);

  // Preserve the pillar content during fade-out
  useEffect(() => {
    if (hovered) {
      setDisplayPillar(hovered);
    }
  }, [hovered]);

  if (!displayPillar) return null;

  const isVisible = !!hovered;

  return (
    <div
      className={`pointer-events-none fixed top-20 sm:top-24 right-[var(--gutter)] z-40 w-[280px] sm:w-[350px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-[0.98]"
      }`}
      style={{ willChange: "opacity, transform" }}
      aria-live="polite"
    >
      <div
        className="rounded-2xl border border-bone/15 bg-[#0b0c10]/94 p-4 sm:p-5 shadow-2xl"
        style={{
          boxShadow: `0 24px 48px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        }}
      >
        <h4 className="font-serif text-[18px] sm:text-[19px] font-normal tracking-wide text-bone">
          {displayPillar.trait}
        </h4>
        <p className="mono text-[11px] text-mist mt-1.5 leading-relaxed">
          {displayPillar.subtrait}
        </p>
      </div>
    </div>
  );
}
