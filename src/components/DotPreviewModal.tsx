import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";
import type { Project } from "../content";
import { detectCapabilities } from "../lib/runtime";
import LiquidGlass from "./LiquidGlass";

interface DotPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

export function DotPreviewModal({ project, onClose }: DotPreviewModalProps) {
  const [renderedProject, setRenderedProject] = useState<Project | null>(project);

  const overlayRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);

  // Sync incoming project prop with internal renderedProject
  useEffect(() => {
    if (project) {
      isClosingRef.current = false;
      setRenderedProject(project);
    } else if (renderedProject && !isClosingRef.current) {
      handleClose();
    }
  }, [project]);

  // Clean exit transition
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const overlay = overlayRef.current;
    const card = cardRef.current;
    const aura = auraRef.current;
    const textCol = textColRef.current;
    const imageFrame = imageFrameRef.current;

    const finish = () => {
      setRenderedProject(null);
      isClosingRef.current = false;
      onClose();
    };

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const { reducedMotion } = detectCapabilities();

    if (reducedMotion || !overlay || !card) {
      if (overlay && card) {
        gsap.to([card, overlay], {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: finish,
        });
      } else {
        finish();
      }
      return;
    }

    const exitTl = gsap.timeline({ onComplete: finish });

    // 1. Content elements quickly dissolve
    if (textCol && imageFrame) {
      exitTl.to(
        [textCol, imageFrame],
        {
          opacity: 0,
          y: 8,
          duration: 0.2,
          ease: "power2.in",
        },
        0,
      );
    }

    // 2. Glass card recedes with 3D perspective and subtle blur
    exitTl.to(
      card,
      {
        opacity: 0,
        y: 28,
        scale: 0.93,
        rotationX: -4,
        filter: "blur(8px)",
        duration: 0.36,
        ease: "power3.in",
      },
      0.02,
    );

    // 3. Chromatic aura shrinks and fades
    if (aura) {
      exitTl.to(
        aura,
        {
          opacity: 0,
          scale: 0.7,
          duration: 0.32,
          ease: "power2.inOut",
        },
        0.04,
      );
    }

    // 4. Backdrop blur and dark overlay dissolve
    exitTl.to(
      overlay,
      {
        opacity: 0,
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
        duration: 0.36,
        ease: "power2.inOut",
      },
      0.04,
    );
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    if (!renderedProject) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [renderedProject, handleClose]);

  // Prevent background scroll events without modifying html/body overflow (which breaks sticky layout)
  useEffect(() => {
    if (!renderedProject) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const preventBackdropScroll = (e: WheelEvent | TouchEvent) => {
      // Allow scrolling inside the modal's scrollable content container
      const scrollable = cardRef.current?.querySelector(".overflow-y-auto");
      if (scrollable && scrollable.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    overlay.addEventListener("wheel", preventBackdropScroll, { passive: false });
    overlay.addEventListener("touchmove", preventBackdropScroll, { passive: false });
    return () => {
      overlay.removeEventListener("wheel", preventBackdropScroll);
      overlay.removeEventListener("touchmove", preventBackdropScroll);
    };
  }, [renderedProject]);

  // Entrance animation trigger
  useLayoutEffect(() => {
    if (!renderedProject) return;

    const overlay = overlayRef.current;
    const card = cardRef.current;
    const aura = auraRef.current;
    const topBar = topBarRef.current;
    const imageFrame = imageFrameRef.current;
    const textCol = textColRef.current;
    const closeBtn = closeBtnRef.current;

    if (!overlay || !card) return;

    const { reducedMotion } = detectCapabilities();

    if (reducedMotion) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }

    // Kill any running timeline
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tlRef.current = tl;

    // Initial setup for jaw-dropping entrance
    gsap.set(overlay, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
    });

    if (aura) {
      gsap.set(aura, {
        opacity: 0,
        scale: 0.45,
      });
    }

    gsap.set(card, {
      opacity: 0,
      y: 46,
      scale: 0.88,
      rotationX: 7,
      transformPerspective: 1200,
      transformOrigin: "50% 60%",
      filter: "blur(12px)",
    });

    if (topBar) {
      gsap.set(topBar, { opacity: 0, y: -14 });
    }

    if (imageFrame) {
      gsap.set(imageFrame, { opacity: 0, scale: 1.07 });
    }

    const textChildren = textCol ? Array.from(textCol.children) : [];
    if (textChildren.length) {
      gsap.set(textChildren, { opacity: 0, y: 16 });
    }

    if (closeBtn) {
      gsap.set(closeBtn, { opacity: 0, scale: 0.6, rotate: -45 });
    }

    // ── Choreographed Entrance ──

    // 1. Silky smooth backdrop fade & high-precision blur
    tl.to(
      overlay,
      {
        opacity: 1,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        duration: 0.65,
        ease: "power2.out",
      },
      0,
    );

    // 2. Chromatic radial aura bloom behind the glass
    if (aura) {
      tl.to(
        aura,
        {
          opacity: 0.45,
          scale: 1,
          duration: 0.85,
          ease: "expo.out",
        },
        0.05,
      );
    }

    // 3. 3D spatial glass card springs into crisp focus
    tl.to(
      card,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "expo.out",
      },
      0.05,
    );

    // 4. Dynamic specular light flare sweep across liquid glass rim
    tl.fromTo(
      card,
      { "--lg-angle": "120deg" } as gsap.TweenVars,
      { "--lg-angle": "240deg", duration: 0.95, ease: "power2.out" } as gsap.TweenVars,
      0.08,
    );

    // 5. Header bar glides into view
    if (topBar) {
      tl.to(
        topBar,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        0.16,
      );
    }

    // 6. Screenshot zooms gently into sharp presentation
    if (imageFrame) {
      tl.to(
        imageFrame,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "expo.out",
        },
        0.2,
      );
    }

    // 7. Typography, deliverables, and tags cascade with stagger
    if (textChildren.length) {
      tl.to(
        textChildren,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: "power3.out",
        },
        0.24,
      );
    }

    // 8. Close button springs into position
    if (closeBtn) {
      tl.to(
        closeBtn,
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.45,
          ease: "back.out(1.8)",
        },
        0.26,
      );
    }

    return () => {
      tl.kill();
    };
  }, [renderedProject]);

  if (!renderedProject || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      data-cursor="close"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-ink/75"
      onClick={handleClose}
    >
      {/* Dynamic ambient chromatic aura blooming behind the modal */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[540px] sm:w-[540px] rounded-full blur-[80px] sm:blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${renderedProject.accent} 0%, ${renderedProject.accent}66 45%, transparent 72%)`,
        }}
      />

      {/* 3D Glass aperture container */}
      <div
        ref={cardRef}
        className="relative max-w-4xl w-full max-h-[90svh] flex flex-col pointer-events-auto select-none sm:select-text"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <LiquidGlass
          tone="dark"
          radius={24}
          bezel={24}
          thickness={32}
          blur={0.5}
          className="w-full h-full flex flex-col overflow-hidden"
          contentClassName="p-5 sm:p-8 overflow-y-auto max-h-[90svh]"
          style={{
            boxShadow: `0 35px 90px -20px ${renderedProject.accent}3d, 0 0 0 1px ${renderedProject.accent}26`,
          }}
        >
          {/* Header bar */}
          <div
            ref={topBarRef}
            className="flex items-center justify-between border-b border-bone/10 pb-3 sm:pb-4 shrink-0"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: renderedProject.accent,
                  boxShadow: `0 0 12px ${renderedProject.accent}`,
                }}
              />
              <span className="mono text-xs text-mist">{renderedProject.kind}</span>
              <span className="text-ash">•</span>
              <span className="mono text-xs text-bone">{renderedProject.year}</span>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              data-cursor="link"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-bone/20 bg-bone/10 text-mist transition-all hover:bg-bone hover:text-ink hover:scale-105 active:scale-95"
              aria-label="Close visual preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content body */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12 items-center">
            {/* Screenshot presentation */}
            <div
              ref={imageFrameRef}
              className="lg:col-span-7 overflow-hidden rounded-xl border border-bone/15 bg-ink shadow-2xl"
            >
              <div className="relative group overflow-hidden">
                <img
                  src={renderedProject.image}
                  alt={`${renderedProject.title} interface preview`}
                  className="w-full h-auto object-cover max-h-[220px] sm:max-h-[360px] lg:max-h-[500px] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
            </div>

            {/* Details & outcomes */}
            <div ref={textColRef} className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div
                  className="mono text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: renderedProject.accent }}
                >
                  {renderedProject.metric.startsWith("★") ? renderedProject.metric : `★ ${renderedProject.metric}`}
                </div>
                <h3 id="preview-title" className="font-serif text-2xl sm:text-3xl font-normal mt-1 text-bone">
                  {renderedProject.title}
                </h3>
                <p className="font-serif italic text-base text-bone/80 mt-1">{renderedProject.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{renderedProject.summary}</p>
              </div>

              <div className="space-y-2 border-t border-bone/10 pt-4">
                <span className="mono text-[10px] text-ash uppercase tracking-wider">Key Highlights</span>
                <ul className="space-y-1.5 text-xs text-bone/90">
                  {renderedProject.contributions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full bg-bone-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mono text-[10px] text-mist flex flex-wrap gap-2 pt-2">
                <span className="text-ash">Stack:</span>
                <span className="text-bone">{renderedProject.stack}</span>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </div>,
    document.body,
  );
}
