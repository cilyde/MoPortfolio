import { useEffect, useRef } from "react";

const SHELLS = [
  { r: 0.42, h: 6.0, n: 14, core: true },
  { r: 0.92, h: 5.2, n: 22, core: false },
  { r: 1.42, h: 4.55, n: 30, core: false },
  { r: 1.92, h: 4.0, n: 38, core: false },
  { r: 2.42, h: 3.6, n: 46, core: false },
];

/** Canvas 2D rendition of the sculpture for devices without WebGL2. */
export function FallbackArt({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let t = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#070709";
      ctx.fillRect(0, 0, w, h);

      const portrait = w < h * 0.85;
      const cx = portrait ? w * 0.5 : w * 0.66;
      const cy = portrait ? h * 0.36 : h * 0.5;
      const scale = (portrait ? Math.min(w * 0.95, h * 0.62) : Math.min(w * 0.5, h * 0.95)) / 6.4;

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 4.5);
      glow.addColorStop(0, "rgba(180,255,57,0.18)");
      glow.addColorStop(0.5, "rgba(123,97,255,0.08)");
      glow.addColorStop(1, "rgba(7,7,9,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const tilt = 0.16;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const project = (x: number, y: number, z: number) => {
        const y2 = y * ct - z * st;
        const z2 = y * st + z * ct;
        const f = 9 / (9 + z2);
        return [cx + x * scale * f, cy - y2 * scale * f] as const;
      };

      SHELLS.forEach((s, si) => {
        const spin = t * (0.12 - si * 0.016);
        const twist = 1.35;
        ctx.strokeStyle = s.core ? "#ecece6" : "rgba(236,236,230,0.55)";
        ctx.lineWidth = s.core ? 1.4 : 0.8;

        for (let i = 0; i < s.n; i++) {
          const u = i / s.n;
          for (const fam of [1, -1]) {
            const th = u * Math.PI * 2 + spin;
            const a0 = th - (fam * twist) / 2;
            const a1 = th + (fam * twist) / 2;
            const hh = s.h * 0.5;
            const [x0, y0] = project(s.r * Math.cos(a0), -hh, s.r * Math.sin(a0));
            const [x1, y1] = project(s.r * Math.cos(a1), hh, s.r * Math.sin(a1));
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
        }
      });

      if (!reduced) {
        t += 0.01;
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return <canvas ref={ref} className="gl-canvas" aria-hidden="true" />;
}
