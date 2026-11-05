import type { CSSProperties } from "react";
import { stats } from "../content";
import { useViewState, viewClass } from "../lib/runtime";
import LiquidGlass from "./LiquidGlass";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Impact() {
  const [ref, view] = useViewState<HTMLElement>("-35% 0px -35% 0px");

  return (
    <section id="impact" ref={ref} aria-labelledby="impact-title" className="relative min-h-[90svh] flex items-center py-16 sm:py-24 px-[var(--gutter)]">
      <div data-kf="impact" aria-hidden="true" className="pointer-events-none absolute left-0 top-1/4 h-px w-px" />

      <div className={`rvl w-full max-w-6xl mx-auto ${viewClass(view)}`}>
        {/* Section title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-bone/15 pb-5 sm:pb-6">
          <div>
            <p className="rv mono text-mist text-[10.5px] sm:text-xs">
              <span className="text-bone-2 mr-2">(04)</span> Track Record & Business Impact
            </p>
            <h2 id="impact-title" className="display mt-3 sm:mt-4 text-[clamp(2.4rem,7vw,6.5rem)]">
              Proven <span className="text-bone/80 italic font-serif">Numbers</span>
            </h2>
          </div>
          <p className="rv mt-3 sm:mt-0 max-w-md text-xs sm:text-sm text-mist leading-relaxed" style={d(100)}>
            Measurable engineering results shipped to real users.
          </p>
        </div>

        {/* Stats grid in Liquid Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {stats.map((s, i) => (
            <LiquidGlass
              key={s.label}
              tone="dark"
              radius={20}
              bezel={18}
              thickness={22}
              blur={0.4}
              className="rv h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
              contentClassName="p-5 sm:p-7 flex flex-col justify-between h-full"
              style={d(i * 90 + 120)}
            >
              <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-bone tracking-tight">
                {s.value}
              </div>
              <div>
                <h3 className="font-sans font-bold text-base sm:text-lg text-bone mt-2.5 sm:mt-3">{s.label}</h3>
                <p className="text-xs text-mist mt-1 leading-relaxed">{s.detail}</p>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </section>
  );
}
