import * as THREE from "three";
import { SCULPTURE_NORMAL, SCULPTURE_VERTEX_PARS } from "./shaders";

export interface ShellDef {
  radius: number;
  height: number;
  count: number;
  width: number;
  dir: 1 | -1;
  speed: number;
  color: [number, number, number];
}

/** Five nested hyperboloid shells. Shell 0 — the tall brass spine — is the core. */
export const SHELLS: ShellDef[] = [
  { radius: 0.42, height: 6.0, count: 26, width: 0.032, dir: 1, speed: 0.11, color: [1.0, 0.8, 0.56] },
  { radius: 0.92, height: 5.2, count: 50, width: 0.04, dir: -1, speed: 0.07, color: [0.92, 0.92, 0.93] },
  { radius: 1.42, height: 4.55, count: 74, width: 0.046, dir: 1, speed: 0.05, color: [0.95, 0.95, 0.96] },
  { radius: 1.92, height: 4.0, count: 96, width: 0.052, dir: -1, speed: 0.038, color: [0.98, 0.98, 0.99] },
  { radius: 2.42, height: 3.6, count: 120, width: 0.058, dir: 1, speed: 0.03, color: [1.0, 1.0, 1.0] },
];

/** Twist (radians) at twist = 1. Waist radius = R·cos(twist/2). */
export const TWIST_MAX = 2.2;

export function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RodData {
  count: number;
  shell: Float32Array;
  u: Float32Array;
  fam: Float32Array;
  rank: Float32Array;
  order: Float32Array;
  rand: Float32Array;
}

function buildRods(density: number): RodData {
  const rng = mulberry32(20250611);
  const counts = SHELLS.map((s) => Math.max(10, Math.round(s.count * density)));
  const total = counts.reduce((a, n) => a + n * 2, 0);
  const data: RodData = {
    count: total,
    shell: new Float32Array(total),
    u: new Float32Array(total),
    fam: new Float32Array(total),
    rank: new Float32Array(total),
    order: new Float32Array(total),
    rand: new Float32Array(total * 4),
  };

  let idx = 0;
  SHELLS.forEach((_, si) => {
    const n = counts[si];
    for (const fam of [1, -1]) {
      const start = idx;
      const values: number[] = [];
      const offset = fam < 0 ? 0.5 / n : 0;
      for (let i = 0; i < n; i++) {
        const u = i / n + offset;
        const r0 = rng();
        const r1 = rng();
        const r2 = rng();
        const r3 = rng();
        data.shell[idx] = si;
        data.u[idx] = u;
        data.fam[idx] = fam;
        data.rand.set([r0, r1, r2, r3], idx * 4);
        values.push(r0);

        // choreography: the outer shell is drawn first, sweeping out from the front,
        // then the inner shells assemble towards the core
        const d = Math.min(u, 1 - u) * 2;
        let order: number;
        if (si === 4) order = 0.02 + d * 0.36 + (fam < 0 ? 0.035 : 0) + r1 * 0.02;
        else order = 0.44 + (3 - si) * 0.115 + d * 0.09 + r1 * 0.015;
        if (si === 4 && fam === 1 && i === 0) order = -0.25; // the first line
        data.order[idx] = order;
        idx++;
      }
      values
        .map((v, k) => [v, k] as const)
        .sort((a, b) => a[0] - b[0])
        .forEach(([, k], rank) => {
          data.rank[start + k] = rank / n + offset;
        });
    }
  });
  return data;
}

export class Sculpture {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.MeshStandardMaterial;
  readonly rods: RodData;
  readonly spin = [0, 0, 0, 0, 0];
  readonly twist = [0, 0, 0, 0, 0];
  readonly len = [1, 1, 1, 1, 1];
  readonly uniforms: Record<string, THREE.IUniform>;
  private geometry: THREE.InstancedBufferGeometry;

  constructor(tier: number, envMap: THREE.Texture) {
    this.rods = buildRods(tier >= 2 ? 1 : 0.6);
    const segments = tier >= 2 ? 18 : 12;

    const box = new THREE.BoxGeometry(1, 1, 1, 1, segments, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.setAttribute("position", box.getAttribute("position"));
    geo.setAttribute("normal", box.getAttribute("normal"));
    geo.setAttribute("uv", box.getAttribute("uv"));
    const r = this.rods;
    geo.setAttribute("aShell", new THREE.InstancedBufferAttribute(r.shell, 1));
    geo.setAttribute("aU", new THREE.InstancedBufferAttribute(r.u, 1));
    geo.setAttribute("aFam", new THREE.InstancedBufferAttribute(r.fam, 1));
    geo.setAttribute("aRank", new THREE.InstancedBufferAttribute(r.rank, 1));
    geo.setAttribute("aOrder", new THREE.InstancedBufferAttribute(r.order, 1));
    geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(r.rand, 4));
    geo.instanceCount = r.count;
    this.geometry = geo;

    this.uniforms = {
      uTime: { value: 0 },
      uRadius: { value: SHELLS.map((s) => s.radius) },
      uHeight: { value: SHELLS.map((s) => s.height) },
      uWidth: { value: SHELLS.map((s) => s.width) },
      uSpin: { value: this.spin },
      uTwist: { value: this.twist },
      uLen: { value: this.len },
      uEmerge: { value: 1 },
      uFlow: { value: 0 },
      uData: { value: 0 },
      uSort: { value: 0 },
      uBreath: { value: 0 },
      uAttention: { value: 0 },
      uAttnRadius: { value: 1.3 },
      uFlip: { value: 0 },
      uHeightMul: { value: 1 },
      uMouse: { value: new THREE.Vector3(0, 0, 2) },
      uLineCenter: { value: 0 },
      uLineAngle: { value: 0 },
      uLineLength: { value: 1 },
      uKick: { value: 0 },
      uTint: { value: new THREE.Color(1, 1, 1) },
      uShellColor: { value: SHELLS.map((s) => new THREE.Vector3(s.color[0], s.color[1], s.color[2])) },
      uGlowColor: { value: new THREE.Vector3(1.0, 0.84, 0.64) },
      uGrowGlow: { value: 1 },
      uLineGlow: { value: 0 },
    };

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.28,
      envMap,
      envMapIntensity: 1,
    });
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${SCULPTURE_VERTEX_PARS}`)
        .replace("#include <beginnormal_vertex>", SCULPTURE_NORMAL)
        .replace("#include <begin_vertex>", "vec3 transformed = rodPos;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vTint;\nvarying vec3 vGlow;")
        .replace("#include <color_fragment>", "#include <color_fragment>\n  diffuseColor.rgb *= vTint;")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  totalEmissiveRadiance += vGlow;");
    };
    material.customProgramCacheKey = () => "ruled-surface-rods-v1";
    this.material = material;

    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
