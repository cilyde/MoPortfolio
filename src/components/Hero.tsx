import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import { site } from "../content";
import { scrollToTarget } from "../lib/runtime";
import { SplitChars, SplitWords } from "./Split";
import { Magnetic } from "./Magnetic";
import LiquidGlass from "./LiquidGlass";
import { GlassButton } from "./GlassButton";

function RotatingBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const isSm = size === "sm";
  const btnSize = isSm ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24 wide:h-28 wide:w-28";
  const glassSize = isSm ? "h-9 w-9" : "h-10 w-10 sm:h-12 sm:w-12";
  const innerSize = isSm ? "h-7 w-7" : "h-8 w-8 sm:h-10 sm:w-10";
  const iconSize = isSm ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4";

  return (
    <div data-reveal="badge" className="flex items-center -ml-1 sm:-ml-2.5">
      <Magnetic strength={0.2}>
        <button
          type="button"
          onClick={() => scrollToTarget("#world", 2.2)}
          data-cursor="link"
          className={`group relative grid ${btnSize} place-items-center`}
          aria-label="Scroll to explore craft and projects"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
            <defs>
              <path id="badgeCircle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-mist font-mono text-[7.2px] uppercase tracking-[0.22em]">
              <textPath href="#badgeCircle" startOffset="0">
                Flutter • Applied AI • Data • Craft •&#160;
              </textPath>
            </text>
          </svg>
          <LiquidGlass
            as="span"
            radius={24}
            tone="dark"
            blur={0.4}
            className={`grid ${glassSize} place-items-center transition-transform duration-500 group-hover:scale-110 shadow-lg`}
          >
            <span className={`grid ${innerSize} place-items-center rounded-full bg-bone text-ink`}>
              <ArrowDown className={`${iconSize} transition-transform duration-500 group-hover:translate-y-0.5`} />
            </span>
          </LiquidGlass>
        </button>
      </Magnetic>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-fade]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "75% top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      data-kf="hero"
      aria-label="Introduction"
      className="relative h-[100svh] min-h-[580px] overflow-hidden"
    >
      {/* 3D Sculpture cursor focus trap */}
      <div aria-hidden="true" data-cursor="focus" className="absolute inset-y-[10%] right-0 hidden w-[48%] wide:block" />

      {/* Hero content cluster: Grounded in lower portion on mobile, absolute left on desktop */}
      <div className="absolute inset-x-[var(--gutter)] bottom-5 z-10 wide:bottom-[max(180px,22svh)] wide:left-[var(--gutter)] wide:right-auto wide:max-w-[min(54vw,880px)]">
        <div data-hero-fade className="relative">
          {/* Silky soft atmospheric contrast vignette behind mobile text — fades out cleanly on scroll! */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 rounded-3xl bg-radial-[ellipse_120%_90%_at_50%_90%] from-[#070709]/92 via-[#070709]/65 to-transparent wide:hidden"
          />

          {/* Eyebrow in delicate LiquidGlass capsule */}
          <div data-reveal="eyebrow" className="mb-3 sm:mb-4 inline-block wide:mb-7">
            <LiquidGlass
              tone="dark"
              radius={24}
              blur={0.4}
              contentClassName="px-3 sm:px-4 py-1 flex items-center gap-x-2.5 text-xs"
            >
              <span className="pulse-dot" aria-hidden="true" />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-bone">{site.role}</span>
              <span className="text-ash" aria-hidden="true">—</span>
              <span className="font-mono text-[11px] sm:text-xs text-mist">
                {site.city}, {site.country}
              </span>
            </LiquidGlass>
          </div>

          {/* Main Title: Refined Serif with elegant italic surname */}
          <h1
            data-reveal="name"
            className="display text-[clamp(2.8rem,11.5vw,4.8rem)] leading-[0.92] tracking-[-0.025em] wide:text-[clamp(5.5rem,10.5vw,12.5rem)] wide:leading-[0.88] text-bone"
            style={{
              textShadow: "0 2px 24px rgba(7, 7, 9, 0.95), 0 0 45px rgba(7, 7, 9, 0.8)",
            }}
          >
            <SplitChars text={site.first} className="block" />
            <span className="block pl-[0.35em] sm:pl-[0.55em] italic text-bone/90 font-serif">
              <SplitChars text={site.last} offset={7} />
            </span>
          </h1>

          {/* Subtitle / Intro */}
          <p
            data-reveal="intro"
            className="mt-3 max-w-[32rem] text-[13.5px] sm:text-[15px] leading-[1.55] sm:leading-[1.65] text-mist/95 wide:mt-8 wide:text-[17px]"
            style={{
              textShadow: "0 1px 16px rgba(7, 7, 9, 0.95)",
            }}
          >
            <SplitWords text={site.intro} />
          </p>

          {/* Hero CTAs */}
          <div data-reveal="cta" className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-4 wide:mt-8">
            <GlassButton href="#world" size="md">
              Explore Craft & Forces
            </GlassButton>
            <GlassButton href="#work" size="md" tone="dark">
              Selected Work
            </GlassButton>
          </div>

          {/* Mobile-only status & cue row seamlessly integrated with the hero cluster */}
          <div className="mt-4 flex items-center justify-between pt-1 wide:hidden">
            <div className="flex items-center gap-2.5">
              <RotatingBadge size="sm" />
              <button
                type="button"
                onClick={() => scrollToTarget("#world", 2.2)}
                className="mono text-[9.5px] text-mist/90 transition-colors hover:text-bone"
              >
                Keep scrolling to explore ↓
              </button>
            </div>

            <div className="mono text-right text-mist text-[9px]">
              <span className="block text-bone">{site.availability}</span>
              <span className="block text-ash">{site.coords}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only bottom status bar & Rotating badge */}
      <div
        data-hero-fade
        className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-6 hidden items-end justify-between wide:flex"
      >
        <div className="pointer-events-auto flex items-center gap-6">
          <RotatingBadge />
          <Magnetic strength={0.3}>
            <button
              type="button"
              data-reveal="cue"
              data-cursor="link"
              onClick={() => scrollToTarget("#world", 2.2)}
              className="mono flex items-center gap-3 text-mist transition-colors hover:text-bone"
            >
              <span className="h-px w-6 bg-bone/40 -translate-y-px" aria-hidden="true" />
              Keep scrolling to explore
            </button>
          </Magnetic>
        </div>

        <div data-reveal="meta" className="mono text-right text-mist">
          <span className="block text-bone">{site.availability}</span>
          <span className="block text-ash">{site.coords}</span>
        </div>
      </div>
    </section>
  );
}
