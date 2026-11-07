import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { config } from "../config";
import { runtime, scrollToTarget, setUI, useClock, useUI } from "../lib/runtime";
import { Mark } from "./Mark";
import { Magnetic } from "./Magnetic";
import LiquidGlass from "./LiquidGlass";

const { personal: site, navigation: navConfig } = config;
const LINKS = navConfig.links;
const SECTIONS = navConfig.sections;

function go(target: string) {
  if (target === "end") scrollToTarget(document.documentElement.scrollHeight, 2.8);
  else scrollToTarget(target, 2.4);
}

export function Nav() {
  const time = useClock(site.timezone);
  const section = useUI("section");
  const introDone = useUI("introDone");
  const [open, setOpen] = useState(false);
  const [markHover, setMarkHover] = useState(false);
  const [hudOn, setHudOn] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLElement | null)[]>([]);
  const beadRef = useRef<HTMLSpanElement>(null);

  // Track scroll progress and active section in real-time
  useEffect(() => {
    let lastPct = -1;
    let lastOn = false;
    let lastSection = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = runtime.lenis ? runtime.lenis.scroll : window.scrollY;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      const pct = Math.round(p * 100);

      if (pct !== lastPct) {
        lastPct = pct;
        if (pctRef.current) pctRef.current.textContent = String(pct).padStart(3, "0");
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      const on = y > window.innerHeight * 0.75;
      if (on !== lastOn) {
        lastOn = on;
        setHudOn(on);
      }

      // Compute active section based on viewport intersection
      const mid = window.innerHeight * 0.45;
      let activeSec = 0;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.querySelector(SECTIONS[i].id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= mid) {
            activeSec = i;
            break;
          }
        }
      }
      if (activeSec !== lastSection) {
        lastSection = activeSec;
        setUI({ section: activeSec });
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  // Update sliding liquid bead position behind active or hovered link
  const activeLinkIdx =
    hoveredIdx !== null
      ? hoveredIdx
      : section > 0 && section <= LINKS.length
      ? section - 1
      : null;

  useEffect(() => {
    const updateBead = () => {
      const bead = beadRef.current;
      const nav = navRef.current;
      if (!bead || !nav) return;

      if (activeLinkIdx === null) {
        bead.style.opacity = "0";
        return;
      }

      const targetEl = linkRefs.current[activeLinkIdx];
      if (!targetEl) {
        bead.style.opacity = "0";
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const left = targetRect.left - navRect.left;
      const width = targetRect.width;

      bead.style.opacity = "1";
      bead.style.transform = `translate3d(${Math.round(left)}px, 0, 0)`;
      bead.style.width = `${Math.round(width)}px`;
    };

    updateBead();
    window.addEventListener("resize", updateBead);
    return () => window.removeEventListener("resize", updateBead);
  }, [activeLinkIdx]);

  useEffect(() => {
    if (!open) return;
    runtime.lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      runtime.lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4 pt-[max(12px,env(safe-area-inset-top))] sm:pt-6 transition-opacity duration-700 ${
          introDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <LiquidGlass
          tone="dark"
          radius={32}
          blur={0.5}
          className="pointer-events-auto max-w-[1400px] w-full"
          contentClassName="flex h-[60px] sm:h-[64px] items-center justify-between px-4 sm:px-6"
        >
          {/* Brand & Monogram */}
          <a
            href={SECTIONS[0]?.id ?? "#top"}
            data-reveal="nav"
            data-cursor="link"
            aria-label={`${site.name} — ${navConfig.brandAriaLabelSuffix}`}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              scrollToTarget(0, 2.4);
            }}
            onMouseEnter={() => setMarkHover(true)}
            onMouseLeave={() => setMarkHover(false)}
            className="group flex items-center gap-3 text-bone transition-opacity hover:opacity-90 pr-3"
          >
            <Mark active={markHover} size={26} className="text-bone transition-transform group-hover:scale-110" />
            <div className="leading-tight">
              <span className="font-serif block text-[15px] font-normal tracking-wide text-bone">
                {site.first} <span className="italic text-bone/80">{site.last}</span>
              </span>
              <span className="mono block text-[9px] text-mist tracking-wider uppercase">{site.disciplinesBadge}</span>
            </div>
          </a>

          {/* Center: Desktop Navigation with Liquid Bead */}
          <nav
            ref={navRef}
            aria-label={navConfig.primaryNavAriaLabel}
            className="relative hidden items-center rounded-full px-1.5 py-1 wide:flex"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Sliding Liquid Bead Indicator */}
            <span
              ref={beadRef}
              aria-hidden="true"
              className="nav-bead-dark pointer-events-none absolute inset-y-[2px] left-0 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: 0 }}
            />

            {LINKS.map((item, i) => {
              const isCurrent = section === i + 1;
              return (
                <div
                  key={item.label}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  className="inline-block"
                >
                  <Magnetic strength={0.2}>
                    <a
                      href={item.href}
                      data-reveal="nav"
                      data-cursor="link"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.target);
                      }}
                      className={`relative z-10 block rounded-full px-4 py-2 text-[12.5px] font-mono tracking-wider transition-colors duration-300 ${
                        isCurrent ? "text-bone" : "text-mist hover:text-bone"
                      }`}
                    >
                      <span className="text-ash mr-1.5 text-[10px]">{item.index}</span>
                      {item.label}
                    </a>
                  </Magnetic>
                </div>
              );
            })}
          </nav>

          {/* Right Status Capsule & Action */}
          <div data-reveal="nav" className="flex items-center gap-3">
            <div className="mono hidden items-center gap-2 rounded-full border border-bone/15 bg-ink/50 px-3.5 py-1.5 text-[10.5px] text-mist sm:flex">
              <span className="pulse-dot" aria-hidden="true" />
              <span>
                {site.city} <span className="tabular-nums text-bone">{time}</span> {site.tzLabel}
              </span>
            </div>

            <Magnetic strength={0.25}>
              <a
                href={navConfig.cta.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(navConfig.cta.target);
                }}
                className="hidden sm:inline-flex items-center rounded-full bg-bone px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink transition-all duration-300 hover:scale-105 hover:bg-bone-2"
              >
                {navConfig.cta.label}
              </a>
            </Magnetic>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? navConfig.mobileMenu.closeLabel : navConfig.mobileMenu.openLabel}
              aria-expanded={open}
              data-cursor="link"
              className="mono text-bone wide:hidden inline-flex items-center justify-center w-[72px] py-1.5 rounded-full border border-bone/20 bg-ink/60 text-xs tracking-wider shrink-0 text-center select-none"
            >
              {open ? navConfig.mobileMenu.closeText : navConfig.mobileMenu.openText}
            </button>
          </div>
        </LiquidGlass>
      </header>

      {/* Floating HUD progress bar at viewport bottom */}
      <div
        className={`pointer-events-none fixed bottom-6 left-[var(--gutter)] right-[var(--gutter)] z-30 hidden items-center justify-between transition-opacity duration-700 wide:flex ${
          hudOn ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="mono text-[10px] text-mist">
          <span className="text-bone">{site.shortName}</span> {navConfig.hud.separator} {site.role}
        </span>
        <div className="flex items-center gap-3">
          <div className="h-px w-24 bg-bone/15 overflow-hidden">
            <span ref={barRef} className="block h-full w-full origin-left bg-bone transition-transform" />
          </div>
          <span className="mono text-[10px] tabular-nums text-mist">
            <span ref={pctRef}>{navConfig.hud.initialPercent}</span>{navConfig.hud.percentSuffix}
          </span>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(92px,calc(env(safe-area-inset-top)+76px))] backdrop-blur-2xl transition-all duration-500 wide:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-6">
          {LINKS.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                go(item.target);
              }}
              className="font-serif text-4xl italic tracking-tight text-bone hover:text-bone-2"
            >
              <span className="mono mr-3 text-xs text-mist not-italic">{item.index}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-bone/15 pt-6 flex flex-col gap-2">
          <span className="mono text-xs text-mist">{site.availability}</span>
          <span className="mono text-xs text-bone">{site.email}</span>
        </div>
      </div>
    </>
  );
}
