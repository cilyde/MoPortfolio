import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";
import { createGlassMaps, SUPPORTS_SVG_BACKDROP } from "../lib/liquidGlass";

export type LiquidGlassProps<T extends ElementType = "div"> = {
  as?: T;
  tone?: "dark" | "light";
  /** Corner radius in px. Defaults to a pill (height / 2). */
  radius?: number;
  bezel?: number;
  thickness?: number;
  /** Whether to use physical SVG Snell displacement. Set true only on isolated elements. */
  refract?: boolean;
  /** Multiplier on the physical displacement when refract=true. */
  refraction?: number;
  /** Chromatic dispersion between R/G/B (0 – 0.25). */
  dispersion?: number;
  blur?: number;
  saturation?: number;
  specular?: number;
  interactiveRim?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "style">;

/**
 * Liquid glass surface.
 * Uses hardware-accelerated compositor backdrop blur with dynamic cursor-facing specular rims.
 * Can optionally enable physical SVG Snell displacement for isolated accent elements.
 */
export default function LiquidGlass<T extends ElementType = "div">({
  as,
  tone = "dark",
  radius,
  bezel,
  thickness,
  refract = false,
  refraction = 1,
  dispersion = 0.1,
  blur = 0.35,
  saturation = 1.5,
  specular = 0.8,
  interactiveRim = true,
  className = "",
  contentClassName = "",
  style,
  children,
  ...rest
}: LiquidGlassProps<T>) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const rawId = useId();
  const id = `lg-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Specular rim turns to face the pointer like a physical light source
  useEffect(() => {
    const el = ref.current;
    if (!el || !interactiveRim || typeof window === "undefined") return;
    if (!window.matchMedia?.("(pointer: fine)")?.matches) return;

    let raf = 0;
    let ex = 0;
    let ey = 0;
    const update = () => {
      raf = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ang = (Math.atan2(ey - (r.top + r.height / 2), ex - (r.left + r.width / 2)) * 180) / Math.PI + 90;
      el.style.setProperty("--lg-angle", `${ang.toFixed(1)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      ex = e.clientX;
      ey = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactiveRim]);

  const r = radius ?? (size.h > 0 ? size.h / 2 : 9999);
  const maps = useMemo(() => {
    if (!refract || !SUPPORTS_SVG_BACKDROP || size.w < 6 || size.h < 6) return null;
    const bz = bezel ?? Math.min(size.w, size.h) * 0.38;
    return createGlassMaps({
      width: size.w,
      height: size.h,
      radius: r,
      bezel: bz,
      thickness: thickness ?? bz * 1.45,
    });
  }, [refract, size.w, size.h, r, bezel, thickness]);

  const scale = maps ? maps.scale * 2 * refraction : 0;
  const glassStyle: CSSProperties = maps ? { backdropFilter: `url(#${id})` } : {};

  const isInline = as === "span" || as === "button" || as === "a";
  const ContentTag = (isInline ? "span" : "div") as ElementType;

  return (
    <Tag
      ref={ref}
      className={`lg ${maps ? "lg-svg" : "lg-fallback"} ${tone === "light" ? "lg-light" : "lg-dark"} ${className}`}
      style={{ borderRadius: r || 9999, ...glassStyle, ...style }}
      {...rest}
    >
      {maps && (
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
        >
          <defs>
            <filter id={id} colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="soft" />
              <feImage
                href={maps.displacement}
                x="0"
                y="0"
                width={size.w}
                height={size.h}
                preserveAspectRatio="none"
                result="field"
              />
              <feDisplacementMap in="soft" in2="field" scale={scale} xChannelSelector="R" yChannelSelector="G" result="dR" />
              <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR" />
              <feDisplacementMap
                in="soft"
                in2="field"
                scale={scale * (1 - dispersion)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dG"
              />
              <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cG" />
              <feDisplacementMap
                in="soft"
                in2="field"
                scale={scale * (1 - dispersion * 2)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dB"
              />
              <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cB" />
              <feBlend in="cR" in2="cG" mode="screen" result="cRG" />
              <feBlend in="cRG" in2="cB" mode="screen" result="refracted" />
              <feColorMatrix in="refracted" type="saturate" values={String(saturation)} result="vivid" />
              <feImage
                href={maps.specular}
                x="0"
                y="0"
                width={size.w}
                height={size.h}
                preserveAspectRatio="none"
                result="spec"
              />
              <feComponentTransfer in="spec" result="specSoft">
                <feFuncA type="linear" slope={specular} />
              </feComponentTransfer>
              <feBlend in="specSoft" in2="vivid" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}
      <span className="lg-tint" aria-hidden />
      <span className="lg-rim" aria-hidden />
      <ContentTag className={`lg-content ${contentClassName}`}>{children}</ContentTag>
    </Tag>
  );
}
