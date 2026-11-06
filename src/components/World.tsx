import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import { runtime } from "../lib/runtime";
import { SplitChars } from "./Split";
import { setText, useLiveStats } from "./live";
import LiquidGlass from "./LiquidGlass";
import { PillarCaption } from "./PillarCaption";

const worldConfig = config.world;
const DISCIPLINES = worldConfig.disciplines;
const forces = worldConfig.forces;

/** Scroll stops (in vh from the top of the section) → scene keyframe + chapter. */
const STOPS = [
  { kf: "world-intro", at: 0, chapter: 0 },
  { kf: "structure", at: 90, chapter: 1 },
  { kf: "intelligence", at: 180, chapter: 2 },
  { kf: "pattern", at: 270, chapter: 3 },
  { kf: "pattern-sorted", at: 335, chapter: 3 },
  { kf: "behaviour", at: 415, chapter: 4 },
  { kf: "light", at: 505, chapter: 5 },
  { kf: "light-closed", at: 565, chapter: 5 },
  { kf: "synthesis", at: 655, chapter: 6 },
  { kf: "synthesis", at: 775, chapter: 6 },
];
const SPAN = 775;

const panelClass = (i: number, active: number) => (i === active ? "is-in" : i < active ? "is-out" : "");
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function World() {
  const ref = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const pos = self.progress * SPAN;
        let c = 0;
        for (const s of STOPS) if (pos + 36 >= s.at) c = s.chapter;
        setChapter(c);
      },
    });
    const vis = ScrollTrigger.create({
      trigger: el,
      start: "top 62%",
      end: "bottom 20%",
      onToggle: (self) => setInView(self.isActive),
    });
    return () => {
      st.kill();
      vis.kill();
    };
  }, []);

  const active = inView ? chapter : chapter >= 6 ? 6 : -1;
  const counter =
    chapter >= 1 && chapter <= 5
      ? `${String(chapter).padStart(2, "0")} / ${worldConfig.counterTotal}`
      : chapter === 6
      ? worldConfig.counterSynthesis
      : worldConfig.counterFallback;

  return (
    <section id="world" ref={ref} aria-labelledby="world-title" aria-label={worldConfig.ariaLabel} className="relative" style={{ height: `${SPAN + 100}vh` }}>
      {STOPS.map((s, idx) => (
        <div
          key={`${s.kf}-${idx}`}
          data-kf={s.kf}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${s.at}vh` }}
        />
      ))}

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Pillar Floating Caption Box */}
        <PillarCaption />

        {/* Sculpture interactive focus bounds */}
        <div aria-hidden="true" data-cursor="focus" className="absolute inset-y-[14%] right-0 hidden w-1/2 wide:block" />

        {/* Section label */}
        <div
          className={`rvl absolute left-[var(--gutter)] right-[var(--gutter)] top-[max(98px,calc(env(safe-area-inset-top)+78px))] sm:top-[max(104px,12svh)] flex items-center justify-between wide:top-[14svh] ${
            inView ? "is-in" : ""
          }`}
        >
          <p className="rv mono text-mist text-[10px] sm:text-[11px]">
            <span className="text-bone-2 mr-2">{worldConfig.sectionNumber}</span> {worldConfig.sectionTitle}
          </p>
          <p className="rv mono tabular-nums text-mist text-[10px] sm:text-[11px]">{counter}</p>
        </div>

        {/* 0 — Introduction */}
        <div className={`rvl rvl-hide absolute inset-0 ${panelClass(0, active)}`}>
          <div className="absolute bottom-[max(24px,env(safe-area-inset-bottom))] sm:bottom-10 left-[var(--gutter)] right-[var(--gutter)] wide:bottom-auto wide:right-auto wide:top-[38svh] wide:max-w-[min(48vw,800px)]">
            <h2 id="world-title" className="display text-[clamp(2.8rem,8vw,9.2rem)]">
              <SplitChars text={worldConfig.intro.headingLine1} className="block" />
              <span className="block text-bone/80 italic font-serif">
                <SplitChars text={worldConfig.intro.headingLine2} offset={9} />
              </span>
            </h2>
            <p className="rv mt-4 sm:mt-8 max-w-[31rem] text-[14px] sm:text-[15px] leading-[1.6] sm:leading-[1.65] text-mist wide:text-[17px]" style={d(120)}>
              {worldConfig.intro.description}
            </p>
          </div>
        </div>

        {/* 1–5 — The Forces */}
        {forces.map((f, i) => (
          <div key={f.id} className={`rvl rvl-hide absolute inset-0 ${panelClass(i + 1, active)}`}>
            <div className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] sm:bottom-8 left-[var(--gutter)] right-[var(--gutter)] wide:bottom-auto wide:right-auto wide:top-[38svh] wide:max-w-[min(44vw,700px)]">
              <p className="rv mono flex flex-wrap items-center gap-x-3 gap-y-1 text-mist text-[10.5px] sm:text-[11px]">
                <span className="text-bone-2">{f.index}</span>
                <span className="h-px w-6 bg-bone/25" aria-hidden="true" />
                <span className="text-bone">{f.discipline}</span>
                <span className="text-ash">— {f.role}</span>
              </p>
              <h3 className="display mt-2.5 sm:mt-4 text-[clamp(2.5rem,7.6vw,8.5rem)]">
                <SplitChars text={f.title} />
              </h3>
              <p className="rv mt-2 sm:mt-4 text-[15px] sm:text-[17px] font-semibold text-bone" style={d(60)}>
                {f.headline}
              </p>
              <p className="rv mt-2 sm:mt-3 max-w-[32rem] text-[13.5px] sm:text-[15px] leading-[1.55] sm:leading-[1.65] text-mist wide:text-[16px]" style={d(100)}>
                {f.text}
              </p>

              {f.id === "light" && <LiveAperture />}
            </div>
          </div>
        ))}

        {/* 6 — Synthesis */}
        <div className={`rvl rvl-hide absolute inset-0 ${panelClass(6, active)}`}>
          <div aria-hidden="true" className="scrim-radial absolute inset-0" />
          <div className="absolute inset-x-[var(--gutter)] top-1/2 -translate-y-1/2 text-center">
            <p className="rv mono text-mist">{worldConfig.synthesis.tag}</p>
            <h3 className="display mt-6 text-[clamp(2.8rem,7.8vw,8.5rem)]">
              <SplitChars text={worldConfig.synthesis.headingLine1} className="block" />
              <span className="block text-bone/80 italic font-serif">
                <SplitChars text={worldConfig.synthesis.headingLine2} offset={16} />
              </span>
            </h3>
            <p className="rv mx-auto mt-6 max-w-[35rem] text-[15px] leading-[1.65] text-mist wide:text-[17px]" style={d(220)}>
              {worldConfig.synthesis.description}
            </p>
          </div>
        </div>

        {/* Live HUD telemetry readouts */}
        <div
          className={`rvl pointer-events-none absolute inset-x-[var(--gutter)] bottom-[6svh] hidden items-end justify-between wide:flex transition-all duration-700 ${
            inView && chapter < 6
              ? "is-in opacity-100 translate-y-0"
              : "is-out opacity-0 pointer-events-none translate-y-4"
          }`}
        >
          <Disciplines chapter={chapter} />
          <Readouts chapter={chapter} />
        </div>
      </div>
    </section>
  );
}

function Disciplines({ chapter }: { chapter: number }) {
  return (
    <LiquidGlass
      tone="dark"
      radius={20}
      blur={0.4}
      contentClassName="px-4 py-3"
      className="rv pointer-events-auto"
      style={d(120)}
    >
      <ul className="space-y-[6px]" aria-label={worldConfig.disciplinesAriaLabel}>
        {DISCIPLINES.map((item) => {
          const on = chapter === item.chapter || (chapter === 0 && item.chapter === 1);
          const core = item.chapter === 1;
          return (
            <li
              key={item.name}
              onMouseEnter={() => {
                runtime.manualHoverPillar = item.chapter - 1;
              }}
              onMouseLeave={() => {
                runtime.manualHoverPillar = null;
              }}
              className={`mono flex items-center gap-3 transition-colors duration-500 cursor-pointer ${
                on ? "text-bone" : "text-ash hover:text-bone/85"
              }`}
            >
              <span
                aria-hidden="true"
                className={`block h-[5px] w-[5px] rounded-full transition-all duration-700 ${
                  on ? "scale-125 bg-bone shadow-[0_0_8px_rgba(236,236,230,0.6)]" : core ? "bg-bone/60" : "border border-current"
                }`}
              />
              <span className="w-[14rem] text-[11px]">{item.name}</span>
              <span className={`text-[9.5px] ${on ? "text-bone" : ""}`}>{item.tag}</span>
            </li>
          );
        })}
      </ul>
    </LiquidGlass>
  );
}

function Readouts({ chapter }: { chapter: number }) {
  const twist = useRef<HTMLSpanElement>(null);
  const members = useRef<HTMLSpanElement>(null);
  const flow = useRef<HTMLSpanElement>(null);
  const order = useRef<HTMLSpanElement>(null);
  const attention = useRef<HTMLSpanElement>(null);
  const aperture = useRef<HTMLSpanElement>(null);

  useLiveStats((s) => {
    if (!s) return;
    setText(twist.current, `${s.twistDeg.toFixed(1)}°`);
    setText(members.current, String(s.members));
    setText(flow.current, s.flow.toFixed(2));
    setText(order.current, `${Math.round(s.order * 100)}%`);
    setText(attention.current, s.attention.toFixed(2));
    setText(aperture.current, `ƒ/${s.fNumber.toFixed(1)}`);
  });

  const refMap: Record<string, React.RefObject<HTMLSpanElement | null>> = {
    "Twist φ": twist,
    Members: members,
    "Flow Field": flow,
    "Data Order": order,
    Attention: attention,
    Aperture: aperture,
  };

  const rows = worldConfig.telemetry.map((t) => ({
    ...t,
    ref: refMap[t.label],
  }));

  return (
    <dl className="rv w-[15rem] space-y-[6px]" style={d(160)} aria-label={worldConfig.telemetryAriaLabel}>
      {rows.map((r) => {
        const on = r.ch.includes(chapter);
        return (
          <div
            key={r.label}
            className={`mono flex items-center justify-between border-b pb-[5px] transition-colors duration-700 ${
              on ? "border-bone/40 text-bone" : "border-bone/10 text-ash"
            }`}
          >
            <dt>{r.label}</dt>
            <dd ref={r.ref} className="tabular-nums">
              {r.fallback}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function LiveAperture() {
  const ref = useRef<HTMLSpanElement>(null);
  useLiveStats((s) => setText(ref.current, s ? `ƒ/${s.fNumber.toFixed(1)}` : worldConfig.liveAperture.fallbackValue));
  return (
    <p className="rv mt-6 flex items-baseline gap-4" style={d(180)}>
      <span ref={ref} className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] italic leading-none tabular-nums text-bone">
        {worldConfig.liveAperture.initialDisplayValue}
      </span>
      <span className="mono text-mist">{worldConfig.liveAperture.cameraPerspective}</span>
    </p>
  );
}
