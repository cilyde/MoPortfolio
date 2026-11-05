/**
 * Physically-motivated refraction maps for DOM liquid glass.
 *
 * The glass is modelled as a convex squircle bezel resting on the backdrop.
 * For each pixel we trace a single orthographic ray through the surface using
 * Snell's law and store the lateral displacement (R = x, G = y, 128 = neutral).
 * A second map stores a rim-light (specular) term with an internal reflection
 * on the opposite edge. Both are fed to an SVG filter used as backdrop-filter.
 */

export const SUPPORTS_SVG_BACKDROP = (() => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroidMobile = /Android.*Mobile/.test(ua);
  const isChromium = /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox|FxiOS/.test(ua);
  const hasFinePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? true;

  // Mobile / touch devices strictly use hardware-accelerated CSS backdrop-filter fallback for 120fps efficiency
  return isChromium && !isIOS && !isAndroidMobile && hasFinePointer;
})();

export type GlassMaps = { displacement: string; specular: string; scale: number };

const surface = (t: number) => Math.pow(1 - Math.pow(1 - t, 4), 0.25);
const cache = new Map<string, GlassMaps>();

export function createGlassMaps(opts: {
  width: number;
  height: number;
  radius: number;
  bezel: number;
  thickness: number;
  ior?: number;
  lightAngle?: number;
}): GlassMaps {
  const { ior = 1.5, lightAngle = -2.25 } = opts;
  const w = Math.max(2, Math.round(opts.width));
  const h = Math.max(2, Math.round(opts.height));
  const r = Math.max(0, Math.min(opts.radius, w / 2, h / 2));
  const bezel = Math.max(1, Math.min(opts.bezel, w / 2, h / 2));
  const thickness = opts.thickness;

  const key = [w, h, r, bezel, thickness, ior, lightAngle].map((v) => v.toFixed(2)).join("|");
  const hit = cache.get(key);
  if (hit) return hit;

  // 1 — refraction profile along one bezel slice
  const N = 128;
  const mags = new Float32Array(N + 1);
  let max = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const height = surface(t) * thickness;
    const t0 = Math.max(0, t - 1 / N);
    const t1 = Math.min(1, t + 1 / N);
    const slope = ((surface(t1) - surface(t0)) * thickness) / ((t1 - t0) * bezel);
    const thetaI = Math.atan(slope);
    const thetaT = Math.asin(Math.sin(thetaI) / ior);
    const d = height * Math.tan(thetaI - thetaT);
    mags[i] = d;
    if (d > max) max = d;
  }
  max = max || 1;

  // 2 — rasterise vector field + specular rim over the rounded rectangle
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { displacement: "", specular: "", scale: 0 };
  }
  const dImg = ctx.createImageData(w, h);
  const sImg = ctx.createImageData(w, h);
  const dd = dImg.data;
  const sd = sImg.data;
  const lx = Math.cos(lightAngle);
  const ly = Math.sin(lightAngle);
  const hw = w / 2;
  const hh = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const ax = Math.abs(px);
      const ay = Math.abs(py);
      const qx = ax - (hw - r);
      const qy = ay - (hh - r);
      let dist: number;
      let nx: number;
      let ny: number;
      if (qx > 0 && qy > 0) {
        const l = Math.hypot(qx, qy) || 1;
        dist = r - l;
        nx = qx / l;
        ny = qy / l;
      } else if (qx > qy) {
        dist = hw - ax;
        nx = 1;
        ny = 0;
      } else {
        dist = hh - ay;
        nx = 0;
        ny = 1;
      }
      if (px < 0) nx = -nx;
      if (py < 0) ny = -ny;

      dd[i + 2] = 128;
      dd[i + 3] = 255;
      if (dist <= 0 || dist >= bezel) {
        dd[i] = 128;
        dd[i + 1] = 128;
        continue;
      }
      const t = dist / bezel;
      const m = mags[Math.min(N, Math.round(t * N))] / max;
      // sample inward (convex glass pulls the backdrop toward the centre)
      dd[i] = Math.round(128 - nx * m * 127);
      dd[i + 1] = Math.round(128 - ny * m * 127);

      const facing = nx * lx + ny * ly;
      const rim = Math.pow(1 - t, 2.2);
      const s =
        (Math.pow(Math.max(0, facing), 2.5) * 1.0 + Math.pow(Math.max(0, -facing), 3) * 0.42) * rim +
        Math.pow(1 - t, 10) * 0.18;
      sd[i] = 255;
      sd[i + 1] = 255;
      sd[i + 2] = 255;
      sd[i + 3] = Math.round(Math.min(1, s) * 255);
    }
  }

  ctx.putImageData(dImg, 0, 0);
  const displacement = canvas.toDataURL("image/png");
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(sImg, 0, 0);
  const specular = canvas.toDataURL("image/png");

  const result = { displacement, specular, scale: max };
  cache.set(key, result);
  return result;
}
