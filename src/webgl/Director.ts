import { BASE, PARAM_KEYS, resolveKeyframe, type ParamKey, type Params } from "./keyframes";

const CAMERA_KEYS = new Set<ParamKey>(["camRadius", "camPolar", "camAzimuth", "camTargetY", "fov", "shiftX", "shiftY", "mShiftY"]);

interface Anchor {
  y: number;
  params: Params;
}

/**
 * Maps scroll position → scene parameters.
 * Anchors come from DOM markers ([data-kf]); between two anchors the state eases
 * with a hold plateau, then everything is critically damped so motion has weight.
 */
export class Director {
  current: Params = { ...BASE };
  readonly target: Params = { ...BASE };
  introActive = true;
  private anchors: Anchor[] = [];

  measure() {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-kf]"));
    const sy = window.scrollY;
    this.anchors = els
      .map((el) => ({ y: el.getBoundingClientRect().top + sy, params: resolveKeyframe(el.dataset.kf ?? "hero") }))
      .sort((a, b) => a.y - b.y);
  }

  private computeTarget(scrollY: number) {
    const a = this.anchors;
    if (!a.length) return;
    let from = a[0];
    let to = a[0];
    let t = 0;
    if (scrollY <= a[0].y) {
      from = to = a[0];
    } else if (scrollY >= a[a.length - 1].y) {
      from = to = a[a.length - 1];
    } else {
      let i = 0;
      while (i < a.length - 2 && scrollY >= a[i + 1].y) i++;
      from = a[i];
      to = a[i + 1];
      t = (scrollY - from.y) / Math.max(1, to.y - from.y);
      const hold = 0.16;
      t = Math.min(1, Math.max(0, (t - hold) / (1 - 2 * hold)));
      t = t * t * (3 - 2 * t);
    }
    for (const k of PARAM_KEYS) {
      this.target[k] = from.params[k] + (to.params[k] - from.params[k]) * t;
    }
  }

  update(scrollY: number, dt: number): Params {
    this.computeTarget(scrollY);
    if (this.introActive) return this.current;
    const kc = 1 - Math.exp(-dt * 2.4);
    const ks = 1 - Math.exp(-dt * 3.0);
    for (const k of PARAM_KEYS) {
      const f = CAMERA_KEYS.has(k) ? kc : ks;
      this.current[k] += (this.target[k] - this.current[k]) * f;
    }
    return this.current;
  }
}
