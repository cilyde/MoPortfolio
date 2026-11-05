import { useEffect, useState } from "react";
import { useUI, type PillarHoverState } from "../lib/runtime";
import LiquidGlass from "./LiquidGlass";

/**
 * Small classy caption box positioned fixed in the top right.
 * Features a silky smooth fade-in and fade-out transition, preserving content during exit.
 */
export function PillarCaption() {
  const hovered = useUI("hoveredPillar");
  const [displayPillar, setDisplayPillar] = useState<PillarHoverState | null>(hovered);

  // Preserve the last hovered pillar during the fade-out transition
  useEffect(() => {
    if (hovered) {
      setDisplayPillar(hovered);
    }
  }, [hovered]);

  if (!displayPillar) return null;

  const isVisible = !!hovered;

  return (
    <div
      className={`pointer-events-none fixed top-20 sm:top-24 right-[var(--gutter)] z-40 w-[300px] sm:w-[380px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2.5 scale-[0.97]"
      }`}
      aria-live="polite"
    >
      <LiquidGlass
        tone="dark"
        radius={20}
        blur={0.5}
        contentClassName="p-4 sm:p-5"
        className="shadow-2xl border border-bone/20"
        style={{
          boxShadow: `0 24px 48px -12px rgba(0, 0, 0, 0.85), 0 0 28px -6px ${displayPillar.accent}40`,
        }}
      >
        {/* Header tag: Pillar index & status (No redundant chapter prefix) */}
        <div className="flex items-center justify-between pb-2.5 border-b border-bone/10">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{
                backgroundColor: displayPillar.accent,
                boxShadow: `0 0 10px ${displayPillar.accent}`,
              }}
              aria-hidden="true"
            />
            <span className="mono text-[10.5px] text-bone font-medium tracking-widest">
              PILLAR // {displayPillar.index}
            </span>
          </div>
          <span className="mono text-[8.5px] uppercase tracking-wider text-ash">
            Pillar Engraved
          </span>
        </div>

        {/* Pillar Trait Title & Subtitle */}
        <div className="mt-3">
          <h4 className="font-serif text-[18px] sm:text-[19px] font-normal tracking-wide text-bone">
            {displayPillar.trait}
          </h4>
          <p className="mono text-[11px] text-mist/95 mt-1.5 leading-relaxed">
            ({displayPillar.subtrait})
          </p>
        </div>

        {/* Subtle coordinate status footer */}
        <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-bone/10 text-[8.5px] mono text-ash">
          <span>SCULPTURE ROGUE // FLOAT</span>
          <span style={{ color: displayPillar.accent }} className="font-medium">
            ACTIVE CUE
          </span>
        </div>
      </LiquidGlass>
    </div>
  );
}
