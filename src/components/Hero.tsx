import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import { site } from "../content";
import { scrollToTarget } from "../lib/runtime";
import { SplitChars, SplitWords } from "./Split";
import { Magnetic } from "./Magnetic";
import LiquidGlass from "./LiquidGlass";
import { GlassButton } from "./GlassButton";

function RotatingBadge() {
  return (
    <div data-reveal="badge" className="flex items-center -ml-2.5 sm:-ml-3.5">
      <Magnetic strength={0.2}>
        <button
          type="button"
          onClick={() => scrollToTarget("#world", 2.2)}
          data-cursor="link"
          className="group relative grid h-24 w-24 place-items-center sm:h-28 sm:w-28"
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
            className="grid h-12 w-12 place-items-center transition-transform duration-500 group-hover:scale-110 shadow-lg"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink">
              <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
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
    <section id="top" ref={ref} data-kf="hero" aria-label="Introduction" className="relative h-[100svh] min-h-[580px]">
      {/* 3D Sculpture cursor focus trap */}
      <div aria-hidden="true" data-cursor="focus" className="absolute inset-y-[10%] right-0 hidden w-[48%] wide:block" />
      <div aria-hidden="true" className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[64%] wide:hidden" />

      {/* Hero content */}
      <div className="absolute bottom-[max(160px,20svh)] left-[var(--gutter)] right-[var(--gutter)] wide:bottom-[max(180px,22svh)] wide:right-auto wide:max-w-[min(54vw,880px)]">
        <div data-hero-fade>
          {/* Eyebrow in delicate LiquidGlass capsule */}
          <div data-reveal="eyebrow" className="mb-5 inline-block wide:mb-7">
            <LiquidGlass
              tone="dark"
              radius={24}
              blur={0.4}
              contentClassName="px-4 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              <span className="pulse-dot" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-bone">{site.role}</span>
              <span className="text-ash" aria-hidden="true">—</span>
              <span className="font-mono text-xs text-mist">
                {site.city}, {site.country}
              </span>
            </LiquidGlass>
          </div>

          {/* Main Title: Refined Serif with elegant italic surname */}
          <h1
            data-reveal="name"
            className="display text-[clamp(4.2rem,16vw,7.5rem)] leading-[0.88] tracking-[-0.025em] wide:text-[clamp(5.5rem,10.5vw,12.5rem)] text-bone"
          >
            <SplitChars text={site.first} className="block" />
            <span className="block pl-[0.55em] italic text-bone/90 font-serif">
              <SplitChars text={site.last} offset={7} />
            </span>
          </h1>

          {/* Subtitle / Intro */}
          <p data-reveal="intro" className="mt-6 max-w-[32rem] text-[15px] leading-[1.65] text-mist wide:mt-8 wide:text-[17px]">
            <SplitWords text={site.intro} />
          </p>

          {/* Hero CTAs */}
          <div data-reveal="cta" className="mt-8 flex flex-wrap items-center gap-4">
            <GlassButton href="#world" size="md">
              Explore Craft & Forces
            </GlassButton>
            <GlassButton href="#work" size="md" tone="dark">
              Selected Work
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Hero bottom status bar & Rotating badge */}
      <div data-hero-fade className="absolute inset-x-[var(--gutter)] bottom-6 flex items-end justify-between">
        <div className="flex items-center gap-6">
          <RotatingBadge />
          <Magnetic strength={0.3}>
            <button
              type="button"
              data-reveal="cue"
              data-cursor="link"
              onClick={() => scrollToTarget("#world", 2.2)}
              className="mono hidden sm:flex items-center gap-3 text-mist transition-colors hover:text-bone"
            >
              <span className="h-px w-6 bg-bone/40 -translate-y-px" aria-hidden="true" />
              Keep scrolling to explore
            </button>
          </Magnetic>
        </div>

        <div data-reveal="meta" className="mono text-right text-mist hidden sm:block">
          <span className="block text-bone">{site.availability}</span>
          <span className="block text-ash">{site.coords}</span>
        </div>
      </div>
    </section>
  );
}
