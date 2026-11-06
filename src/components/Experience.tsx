import type { CSSProperties } from "react";
import { config } from "../config";
import { useViewState, viewClass } from "../lib/runtime";
import LiquidGlass from "./LiquidGlass";

const expConfig = config.experience;
const experience = expConfig.history;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Experience() {
  const [ref, view] = useViewState<HTMLElement>("-35% 0px -35% 0px");

  return (
    <section ref={ref} aria-labelledby="experience-title" className="relative py-16 sm:py-24 px-[var(--gutter)] border-t border-bone/10">
      <div className={`rvl w-full max-w-6xl mx-auto ${viewClass(view)}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-10">
          <div>
            <p className="rv mono text-mist text-[10.5px] sm:text-xs">
              <span className="text-bone-2 mr-2">{expConfig.sectionNumber}</span> {expConfig.sectionTitle}
            </p>
            <h2 id="experience-title" className="display mt-2.5 sm:mt-3 text-[clamp(2.2rem,6vw,5.5rem)]">
              {expConfig.headingLine1} <span className="text-bone/80 italic font-serif">{expConfig.headingLine2}</span>
            </h2>
          </div>
          <p className="rv mt-2.5 sm:mt-0 max-w-sm text-xs mono text-mist" style={d(80)}>
            {expConfig.description}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 mt-6">
          {experience.map((exp, idx) => (
            <LiquidGlass
              key={exp.company}
              tone="dark"
              radius={24}
              bezel={22}
              thickness={28}
              blur={0.4}
              className="rv transition-all duration-300 hover:-translate-y-1 flex flex-col"
              contentClassName="p-5 sm:p-9 flex flex-col"
              style={d(idx * 120 + 100)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bone/10 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg sm:text-2xl font-normal text-bone">
                      {exp.role}
                    </h3>
                    {exp.current && (
                      <span className="mono text-[9px] rounded-full bg-bone/10 border border-bone/30 text-bone px-2.5 py-0.5">
                        {expConfig.currentBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-bone-2 mt-1">
                    {exp.company} <span className="text-ash font-normal">{expConfig.separator} {exp.location}</span>
                  </p>
                </div>
                <div className="mono text-xs text-mist">{exp.period}</div>
              </div>

              <p className="text-sm leading-relaxed text-bone/80 mt-4 max-w-3xl">{exp.description}</p>

              <div className="mt-5 space-y-2 border-t border-bone/10 pt-4">
                <span className="mono text-[10px] text-ash uppercase tracking-wider">{expConfig.impactTitle}</span>
                <ul className="space-y-1.5 text-xs text-mist">
                  {exp.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1 w-1 rounded-full bg-bone-2 shrink-0" />
                      <span className="text-bone/90">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </section>
  );
}
