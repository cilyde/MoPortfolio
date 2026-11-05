import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Dot + trailing ring. Over links the ring opens; over preview dots it highlights violet;
 * over the sculpture it becomes autofocus brackets.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let state = "";
    let visible = false;

    const setState = (s: string) => {
      if (s === state) return;
      state = s;
      root.current?.setAttribute("data-state", s);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        root.current?.classList.remove("is-hidden");
      }
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target && typeof target.closest === "function" ? target.closest("[data-cursor], a, button") : null;
      setState(el ? (el.getAttribute("data-cursor") ?? "link") : "");
    };
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        visible = false;
        root.current?.classList.add("is-hidden");
      }
    };
    const down = () => root.current?.classList.add("is-down");
    const up = () => root.current?.classList.remove("is-down");
    const tick = () => {
      rx += (x - rx) * 0.17;
      ry += (y - ry) * 0.17;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("mouseout", out);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    gsap.ticker.add(tick);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={root} className="cursor is-hidden" aria-hidden="true">
      <div ref={dot} className="cursor-dot">
        <i />
      </div>
      <div ref={ring} className="cursor-ring">
        <i />
        <b>
          <span />
          <span />
          <span />
          <span />
        </b>
      </div>
    </div>
  );
}
