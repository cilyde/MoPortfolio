import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forces } from "../content";
import { runtime } from "../lib/runtime";
import { SplitChars } from "./Split";
import { setText, useLiveStats } from "./live";
import LiquidGlass from "./LiquidGlass";

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
];
const SPAN = 655;

const DISCIPLINES = [
  { name: "Dev at the Core", tag: "01 Bedrock", chapter: 1 },
  { name: "Advanced AI", tag: "02 Engine", chapter: 2 },
  { name: "Business Data Analytics", tag: "03 Signal", chapter: 3 },
  { name: "Psychology & Cognition", tag: "04 Touch", chapter: 4 },
  { name: "Photography & Optics", tag: "05 Craft", chapter: 5 },
];

const panelClass = (i: number, active: number) => (i === active ? "is-in" : i < active ? "is-out" : "");
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function World() {
  const ref = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [inView, setInView] = useState(false);
  const touch = runtime.caps?.touch ?? false;

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
      end: "bottom 38%",
      onToggle: (self) => setInView(self.isActive),
    });
    return () => {
      st.kill();
      vis.kill();
    };
  }, []);

  const active = inView ? chapter : chapter >= 6 ? 7 : -1;
  const counter =
    chapter >= 1 && chapter <= 5 ? `${String(chapter).padStart(2, "0")} / 05` : chapter === 6 ? "Synthesis" : "Five Forces";

  return (
    <section id="world" ref={ref} aria-labelledby="world-title" className="relative" style={{ height: `${SPAN + 100}vh` }}>
      {STOPS.map((s) => (
        <div
          key={s.kf}
          data-kf={s.kf}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${s.at}vh` }}
        />
      ))}

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Sculpture interactive focus bounds */}
        <div aria-hidden="true" data-cursor="focus" className="absolute inset-y-[14%] right-0 hidden w-1/2 wide:block" />
        <div aria-hidden="true" className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[64%] wide:hidden" />

        {/* Section label */}
        <div
          className={`rvl absolute left-[var(--gutter)] right-[var(--gutter)] top-[12svh] flex items-center justify-between wide:top-[14svh] ${
            inView ? "is-in" : ""
          }`}
        >
          <p className="rv mono text-mist">
            <span className="text-bone-2 mr-2">(02)</span> Craft & Engineering Philosophy
          </p>
          <p className="rv mono tabular-nums text-mist">{counter}</p>
        </div>

        {/* 0 — Introduction */}
        <div className={`rvl rvl-hide absolute inset-0 ${panelClass(0, active)}`}>
          <div className="absolute bottom-[13svh] left-[var(--gutter)] right-[var(--gutter)] wide:bottom-auto wide:right-auto wide:top-[28svh] wide:max-w-[min(48vw,800px)]">
            <h2 id="world-title" className="display text-[clamp(3.2rem,8.2vw,9.2rem)]">
              <SplitChars text="One mind," className="block" />
              <span className="block text-bone/80 italic font-serif">
                <SplitChars text="five forces." offset={9} />
              </span>
            </h2>
            <p className="rv mt-8 max-w-[31rem] text-[15px] leading-[1.65] text-mist wide:text-[17px]" style={d(120)}>
              Great mobile apps need clean code, useful AI, and thoughtful design. Nothing extra.
            </p>
          </div>
        </div>

        {/* 1–5 — The Forces */}
        {forces.map((f, i) => (
          <div key={f.id} className={`rvl rvl-hide absolute inset-0 ${panelClass(i + 1, active)}`}>
            <div className="absolute bottom-[10svh] left-[var(--gutter)] right-[var(--gutter)] wide:bottom-auto wide:right-auto wide:top-[24svh] wide:max-w-[min(44vw,700px)]">
              <p className="rv mono flex flex-wrap items-center gap-x-3 gap-y-1 text-mist">
                <span className="text-bone-2">{f.index}</span>
                <span className="h-px w-6 bg-bone/25" aria-hidden="true" />
                <span className="text-bone">{f.discipline}</span>
                <span className="text-ash">— {f.role}</span>
              </p>
              <h3 className="display mt-4 text-[clamp(3.2rem,8.5vw,8.5rem)]">
                <SplitChars text={f.title} />
              </h3>
              <p className="rv mt-4 text-[17px] font-semibold text-bone" style={d(60)}>
                {f.headline}
              </p>
              <p className="rv mt-3 max-w-[32rem] text-[15px] leading-[1.65] text-mist wide:text-[16px]" style={d(100)}>
                {f.text}
              </p>

              {f.id === "light" ? (
                <LiveAperture />
              ) : f.hint ? (
                <p className="rv mono mt-5 flex items-center gap-3 text-bone/80 text-[10px]" style={d(180)}>
                  <span className="h-px w-6 bg-lime" aria-hidden="true" />
                  {touch && f.hintTouch ? f.hintTouch : f.hint}
                </p>
              ) : null}
            </div>
          </div>
        ))}

        {/* 6 — Synthesis */}
        <div className={`rvl rvl-hide absolute inset-0 ${panelClass(6, active)}`}>
          <div aria-hidden="true" className="scrim-radial absolute inset-0" />
          <div className="absolute inset-x-[var(--gutter)] top-1/2 -translate-y-1/2 text-center">
            <p className="rv mono text-mist">(06) — Synthesis</p>
            <h3 className="display mt-6 text-[clamp(2.8rem,7.8vw,8.5rem)]">
              <SplitChars text="Not five silos." className="block" />
              <span className="block text-bone/80 italic font-serif">
                <SplitChars text="One unified craft." offset={16} />
              </span>
            </h3>
            <p className="rv mx-auto mt-6 max-w-[35rem] text-[15px] leading-[1.65] text-mist wide:text-[17px]" style={d(220)}>
              Solid code, useful AI, and clear numbers.
            </p>
          </div>
        </div>

        {/* Live HUD telemetry readouts */}
        <div
          className={`rvl pointer-events-none absolute inset-x-[var(--gutter)] bottom-[6svh] hidden items-end justify-between wide:flex ${
            inView && chapter < 6 ? "is-in" : inView ? "is-out" : ""
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
      className="pointer-events-auto"
    >
      <ul className="space-y-[6px]" aria-label="Disciplines">
        {DISCIPLINES.map((item) => {
          const on = chapter === item.chapter || (chapter === 0 && item.chapter === 1);
          const core = item.chapter === 1;
          return (
            <li
              key={item.name}
              className={`mono flex items-center gap-3 transition-colors duration-700 ${on ? "text-bone" : "text-ash"}`}
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

  const rows = [
    { label: "Twist φ", ref: twist, ch: [1], fallback: "126.0°" },
    { label: "Members", ref: members, ch: [1], fallback: "768" },
    { label: "Flow Field", ref: flow, ch: [2], fallback: "0.06" },
    { label: "Data Order", ref: order, ch: [3], fallback: "0%" },
    { label: "Attention", ref: attention, ch: [4], fallback: "1.00" },
    { label: "Aperture", ref: aperture, ch: [5], fallback: "ƒ/2.8" },
  ];

  return (
    <dl className="rv w-[15rem] space-y-[6px]" style={d(160)} aria-label="Live sculpture state">
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
  useLiveStats((s) => setText(ref.current, s ? `ƒ/${s.fNumber.toFixed(1)}` : "ƒ/2.8"));
  return (
    <p className="rv mt-6 flex items-baseline gap-4" style={d(180)}>
      <span ref={ref} className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] italic leading-none tabular-nums text-bone">
        ƒ/1.4
      </span>
      <span className="mono text-mist">Camera perspective: overhead orbital plane</span>
    </p>
  );
}
