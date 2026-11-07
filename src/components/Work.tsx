import { useState, useEffect, type CSSProperties } from "react";
import { Sparkles, Eye, ArrowUpRight } from "lucide-react";
import { config, type Project } from "../config";
import { useViewState, viewClass } from "../lib/runtime";
import { preloadAllImages, preloadImage } from "../lib/preloadImages";
import { SplitChars } from "./Split";
import { DotPreviewModal } from "./DotPreviewModal";
import { Magnetic } from "./Magnetic";
import LiquidGlass from "./LiquidGlass";

const workConfig = config.work;
const projects = workConfig.projects;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Work() {
  const [activePreview, setActivePreview] = useState<Project | null>(null);

  // Eagerly preload and decode preview images during idle time so opening is instantaneous
  useEffect(() => {
    preloadAllImages(projects.map((p) => p.image));
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      <WorkIntro />
      {projects.map((p, i) => (
        <ProjectBlock key={p.id} project={p} index={i} onOpenPreview={() => setActivePreview(p)} />
      ))}
      <DotPreviewModal project={activePreview} onClose={() => setActivePreview(null)} />
    </section>
  );
}

function WorkIntro() {
  const [ref, view] = useViewState<HTMLDivElement>("-30% 0px -30% 0px");
  return (
    <div ref={ref} className={`rvl relative flex min-h-[110svh] items-center px-[var(--gutter)] ${viewClass(view)}`}>
      <div data-kf="work-intro" aria-hidden="true" className="pointer-events-none absolute left-0 top-[10svh] h-px w-px" />
      <div className="w-full">
        <div className="rv mono flex items-center justify-between text-mist">
          <span>
            <span className="text-bone-2 mr-2">{workConfig.sectionNumber}</span> {workConfig.sectionTitle}
          </span>
          <span>{workConfig.period}</span>
        </div>
        <div className="rule mt-5 h-px w-full bg-bone/15" aria-hidden="true" />
        <h2 id="work-title" className="display mt-10 text-[clamp(4.2rem,16vw,17rem)] leading-[0.8] tracking-[-0.035em]">
          <SplitChars text={workConfig.headingLine1} className="block" />
          <span className="block pl-[0.8em]">
            <span className="text-bone/80 italic font-serif">
              <SplitChars text={workConfig.headingLine2} offset={8} />
            </span>
            <sup className="rv mono ml-4 align-top text-[12px] tracking-[0.14em] text-mist" style={d(300)}>
              {workConfig.countBadge}
            </sup>
          </span>
        </h2>
        <p
          className="rv mt-10 max-w-[32rem] text-[15px] leading-[1.65] text-mist wide:ml-auto wide:mr-[6vw] wide:text-[17px]"
          style={d(200)}
        >
          {workConfig.description}
        </p>
      </div>
    </div>
  );
}

function Meta({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="mono text-ash text-[10px]">{label}</dt>
      <dd className="mt-1 text-[13.5px] leading-[1.4] text-bone/90">{value}</dd>
    </div>
  );
}

function ProjectBlock({
  project: p,
  index,
  onOpenPreview,
}: {
  project: Project;
  index: number;
  onOpenPreview: () => void;
}) {
  const [ref, view] = useViewState<HTMLElement>("-45% 0px -45% 0px");
  const textLeft = index % 2 === 0;

  // Preload and decode project image as user approaches this project
  useEffect(() => {
    if (view !== "none") {
      preloadImage(p.image);
    }
  }, [view, p.image]);

  return (
    <article ref={ref} aria-labelledby={`${p.id}-title`} className="relative h-[155svh]">
      <div
        data-kf={p.id}
        data-kf-fallback={`work-${index + 1}`}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[25svh] h-px w-px"
      />
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Sculpture cursor focus trigger */}
        <div
          aria-hidden="true"
          data-cursor="focus"
          className={`absolute inset-y-[14%] hidden w-1/2 wide:block ${textLeft ? "right-0" : "left-0"}`}
        />

        <div className={`rvl absolute inset-0 ${viewClass(view)}`} style={{ "--accent": p.accent } as CSSProperties}>
          {/* Giant background index number */}
          <div
            aria-hidden="true"
            className={`absolute top-1/2 hidden -translate-y-1/2 wide:block ${textLeft ? "left-[-1.5vw]" : "right-[-1.5vw]"}`}
          >
            <span className="giant-num rv block" style={d(0)}>
              {p.index}
            </span>
          </div>

          {/* Project card content */}
          <div
            className={`absolute bottom-[4svh] sm:bottom-[6svh] left-[var(--gutter)] right-[var(--gutter)] wide:bottom-auto wide:top-1/2 wide:max-w-[min(46vw,720px)] wide:-translate-y-1/2 ${
              textLeft ? "wide:right-auto" : "wide:left-auto"
            }`}
          >
            <div className="rv mono flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-mist text-[10.5px] sm:text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
              <span style={{ color: "var(--accent)" }}>{p.index}</span>
              <span className="-ml-1 text-ash">/ {workConfig.totalCount}</span>
              <span className="h-px w-6 sm:w-8 bg-bone/20" aria-hidden="true" />
              <span className="text-bone">{p.kind}</span>
              <span>{p.year}</span>
            </div>

            <h3 id={`${p.id}-title`} className="display mt-2 sm:mt-5 text-[clamp(2.5rem,8.2vw,10.5rem)] leading-[0.88] sm:leading-[0.84] tracking-[-0.035em]">
              <SplitChars text={p.title} className={p.italic ? "italic text-bone-2" : ""} />
            </h3>

            <div className="rv mt-1.5 sm:mt-3 mono text-[11px] sm:text-xs" style={{ color: p.accent, ...d(60) }}>
              {p.metric.startsWith("★") ? p.metric : `★ ${p.metric}`}
            </div>

            <p className="rv mt-2.5 sm:mt-4 max-w-[34rem] text-[13.5px] sm:text-[15px] leading-[1.5] sm:leading-[1.6] text-bone/90 wide:text-[17px]" style={d(100)}>
              {p.summary}
            </p>

            {/* Hidden in dots: Interactive visual preview aperture in LiquidGlass */}
            <div className="rv mt-3.5 sm:mt-6 flex items-center gap-4" style={d(140)}>
              <Magnetic strength={0.3}>
                <LiquidGlass
                  as="button"
                  type="button"
                  onClick={onOpenPreview}
                  onMouseEnter={() => preloadImage(p.image)}
                  onTouchStart={() => preloadImage(p.image)}
                  onFocus={() => preloadImage(p.image)}
                  data-cursor="preview"
                  radius={24}
                  tone="dark"
                  blur={0.4}
                  className="group inline-flex transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  contentClassName="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-bone"
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: p.accent }} />
                  </span>
                  <span>{workConfig.previewButton}</span>
                  <Eye className="h-3.5 w-3.5 text-mist transition-transform group-hover:scale-110 group-hover:text-bone" />
                </LiquidGlass>
              </Magnetic>
              <span className="mono text-[10px] text-ash hidden sm:inline">{workConfig.previewPrompt}</span>
            </div>

            {/* Key Deliverables bullet list */}
            <ul className="rv mt-6 hidden space-y-2 sm:block" style={d(180)}>
              {p.contributions.map((c, k) => (
                <li key={k} className="flex items-baseline gap-3 text-[14px] text-mist">
                  <span className="mono text-[10px]" style={{ color: "var(--accent)" }}>
                    0{k + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            {/* Recruiter metadata grid */}
            <dl className="rv mt-3 sm:mt-6 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 border-t border-bone/10 pt-2.5 sm:pt-4 sm:grid-cols-3" style={d(240)}>
              <Meta label={workConfig.metaLabels.role} value={p.role} />
              <Meta label={workConfig.metaLabels.platform} value={p.platform} />
              <Meta label={workConfig.metaLabels.techStack} value={p.stack} className="col-span-2 sm:col-span-1" />
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
