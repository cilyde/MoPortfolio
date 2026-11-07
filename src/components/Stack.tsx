import type { CSSProperties } from "react";
import { config } from "../config";
import { useViewState, viewClass } from "../lib/runtime";
import LiquidGlass from "./LiquidGlass";

const stackConfig = config.stack;
const stackCategories = stackConfig.categories;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Stack() {
  const [ref, view] = useViewState<HTMLElement>("-35% 0px -35% 0px");

  return (
    <section ref={ref} aria-labelledby="stack-title" className="relative py-16 sm:py-20 px-[var(--gutter)] border-t border-bone/10">
      <div data-kf="stack" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-px w-px" />
      <div className={`rvl w-full max-w-6xl mx-auto ${viewClass(view)}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-8">
          <div>
            <p className="rv mono text-mist text-[10.5px] sm:text-xs">
              <span className="text-bone-2 mr-2">{stackConfig.sectionNumber}</span> {stackConfig.sectionTitle}
            </p>
            <h2 id="stack-title" className="display mt-2.5 sm:mt-3 text-[clamp(2.2rem,6vw,5.5rem)]">
              {stackConfig.headingLine1} <span className="text-bone/80 italic font-serif">{stackConfig.headingLine2}</span> {stackConfig.headingSuffix}
            </h2>
          </div>
          <p className="rv mt-2.5 sm:mt-0 max-w-sm text-xs mono text-mist" style={d(80)}>
            {stackConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {stackCategories.map((cat, idx) => (
            <LiquidGlass
              key={cat.category}
              tone="dark"
              radius={20}
              bezel={18}
              thickness={22}
              blur={0.4}
              className="rv flex flex-col h-full"
              contentClassName="p-5 sm:p-6 flex flex-col h-full"
              style={d(idx * 100 + 100)}
            >
              <div className="flex items-center justify-between border-b border-bone/10 pb-4">
                <h3 className="font-sans font-bold text-base text-bone">{cat.category}</h3>
                <span className="mono text-[9px] px-2.5 py-0.5 rounded-full border border-bone/20 text-bone-2 bg-bone/5">
                  {cat.badge}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="mono text-[11px] rounded-lg border border-bone/15 bg-bone/5 px-3 py-1.5 text-bone/90 transition-all hover:bg-bone/15 hover:text-bone"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </section>
  );
}
