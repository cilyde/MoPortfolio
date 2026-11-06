import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import { scrollToTarget, useClock } from "../lib/runtime";
import { SplitChars } from "./Split";
import { Magnetic } from "./Magnetic";
import LiquidGlass from "./LiquidGlass";

const { personal: site, closing: closingConfig } = config;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Full circle: the kinetic sculpture collapses back into its first line, which
 * lies down 90° into a warm glowing horizon line — and the conversation begins.
 */
export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [copied, setCopied] = useState(false);
  const time = useClock(site.timezone);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const pos = self.progress * 160;
        setStage(pos < 14 ? 0 : pos < 98 ? 1 : 2);
      },
      onLeaveBack: () => setStage(0),
    });
    return () => st.kill();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const copyLabel = copied ? closingConfig.copyAddress.copiedLabel : closingConfig.copyAddress.defaultLabel;

  return (
    <section id="contact" ref={ref} aria-labelledby="contact-title" className="relative h-[260svh]">
      {/* 3D Sculpture Keyframe Markers */}
      <div data-kf="closing-line" aria-hidden="true" className="pointer-events-none absolute left-0 top-[55svh] h-px w-px" />
      <div data-kf="closing-horizon" aria-hidden="true" className="pointer-events-none absolute left-0 top-[160svh] h-px w-px" />

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Stage 1 — Full circle: The single line */}
        <div className={`rvl rvl-hide absolute inset-0 ${stage === 1 ? "is-in" : stage > 1 ? "is-out" : ""}`}>
          <div className="absolute bottom-[13svh] left-[var(--gutter)] right-[var(--gutter)] text-center wide:bottom-auto wide:left-[calc(50%+36px)] wide:right-auto wide:top-1/2 wide:-translate-y-1/2 wide:text-left">
            <p className="rv mono text-mist">
              <span className="text-bone-2 mr-2">{closingConfig.stage1.sectionNumber}</span> {closingConfig.stage1.sectionTitle}
            </p>
            <p className="mt-4 font-serif text-[clamp(1.8rem,3.2vw,3rem)] italic leading-[1.14] text-bone">
              <SplitChars text={closingConfig.stage1.line1} className="block" />
              <span className="text-bone/80">
                <SplitChars text={closingConfig.stage1.line2} className="block" offset={19} />
              </span>
            </p>
          </div>
        </div>

        {/* Stage 2 — The glowing horizon & Contact */}
        <div className={`rvl rvl-hide absolute inset-0 ${stage === 2 ? "is-in" : ""}`}>
          <div className="absolute inset-x-[var(--gutter)] bottom-[calc(50%+4svh)] text-center">
            <p className="rv mono text-mist">
              <span className="text-bone-2 mr-2">{closingConfig.stage2.sectionNumber}</span> {closingConfig.stage2.sectionTitle}
            </p>
            <h2 id="contact-title" className="display mt-3 sm:mt-5 text-[clamp(2.7rem,9vw,10.5rem)]">
              <SplitChars text={closingConfig.stage2.headingLine1} className="block" />
              <span className="block text-bone/80 italic font-serif">
                <SplitChars text={closingConfig.stage2.headingLine2} offset={11} />
              </span>
            </h2>
          </div>

          <div className="absolute inset-x-[var(--gutter)] top-[calc(50%+3svh)] sm:top-[calc(50%+4.5svh)] flex flex-col items-center text-center">
            {/* Liquid Glass Email & Copy Capsule */}
            <div className="rv" style={d(120)}>
              <LiquidGlass
                tone="dark"
                radius={36}
                blur={0.5}
                contentClassName="px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
              >
                <Magnetic strength={0.2}>
                  <a
                    href={`mailto:${site.email}`}
                    data-cursor="link"
                    className="font-serif text-[clamp(1.15rem,4.5vw,2.8rem)] leading-none text-bone hover:text-bone-2 transition-colors break-all sm:break-normal text-center"
                  >
                    {site.email}
                  </a>
                </Magnetic>

                <div className="h-6 w-px bg-bone/20 hidden sm:block" />

                <button
                  type="button"
                  onClick={copy}
                  data-cursor="link"
                  className="rounded-full border border-bone/20 bg-bone/10 px-4 py-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-bone transition-all hover:bg-bone hover:text-ink w-full sm:w-auto text-center"
                >
                  {copyLabel}
                </button>
              </LiquidGlass>
            </div>

            <div className="rv mono mt-4 sm:mt-5 flex items-center justify-center gap-2 text-mist text-xs" style={d(200)}>
              <span className="pulse-dot" aria-hidden="true" />
              <span>{site.availability}</span>
            </div>

            {/* Social pills */}
            <ul className="rv mono mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3" style={d(280)}>
              {closingConfig.socials.map((s) => (
                <li key={s.label}>
                  <Magnetic strength={0.25}>
                    <LiquidGlass
                      as="a"
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="link"
                      radius={20}
                      tone="dark"
                      blur={0.4}
                      className="group inline-flex transition-transform duration-300 hover:scale-105"
                      contentClassName="px-3.5 sm:px-4 py-1.5 flex items-center gap-1.5 text-xs text-mist transition-colors group-hover:text-bone"
                    >
                      <span>{s.label}</span>
                      <span aria-hidden="true">{s.externalIcon ?? "↗"}</span>
                    </LiquidGlass>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer bar */}
          <footer
            className="rv mono absolute inset-x-[var(--gutter)] bottom-[max(16px,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 text-ash text-[10.5px] wide:flex-row wide:justify-between"
            style={d(360)}
          >
            <span>
              © {new Date().getFullYear()} {site.name}. {closingConfig.footer.copyrightSuffix}
            </span>
            <span className="hidden wide:inline">{closingConfig.footer.craftedWith}</span>
            <span>
              {site.city} <span className="tabular-nums text-mist">{time}</span> {site.tzLabel}
            </span>
            <button
              type="button"
              data-cursor="link"
              onClick={() => scrollToTarget(0, 3)}
              className="text-mist transition-colors hover:text-bone"
            >
              <span className="roll">
                <span>{closingConfig.footer.backToTop}</span>
                <span aria-hidden="true">{closingConfig.footer.backToTop}</span>
              </span>
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
