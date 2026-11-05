import * as THREE from "three";
import { BACKDROP_FRAG, BACKDROP_VERT, DUST_FRAG, DUST_VERT } from "./shaders";
import { mulberry32 } from "./Sculpture";
import type { Params } from "./keyframes";

/** Full-screen studio backdrop with a soft background light behind the subject. */
export class Backdrop {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uBase: { value: new THREE.Color(0.0105, 0.0098, 0.0092) },
    uGlow: { value: new THREE.Color(0, 0, 0) },
    uGlowPos: { value: new THREE.Vector2(0.65, 0.53) },
    uGlowSize: { value: 0.36 },
    uAspect: { value: 1 },
    uHorizonColor: { value: new THREE.Color(1.0, 0.55, 0.24) },
    uHorizon: { value: 0 },
  };
  private material: THREE.ShaderMaterial;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: BACKDROP_VERT,
      fragmentShader: BACKDROP_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -10;
  }

  setAspect(aspect: number) {
    this.uniforms.uAspect.value = aspect;
  }

  update(p: Params, sx: number, sy: number) {
    const u = this.uniforms;
    u.uGlow.value.setRGB(p.glowR * p.glowIntensity, p.glowG * p.glowIntensity, p.glowB * p.glowIntensity);
    u.uGlowPos.value.set(0.5 + sx * 0.5, 0.5 + sy * 0.5 + 0.03);
    u.uGlowSize.value = p.glowSize;
    u.uHorizon.value = p.horizon;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/** Sparse motes drifting through the key light — atmosphere, not decoration. */
export class Dust {
  readonly points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uDust: { value: 0 },
  };

  constructor(count: number) {
    const rng = mulberry32(9);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + rng() * 6.2;
      const a = rng() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (rng() - 0.5) * 9;
      positions[i * 3 + 2] = Math.sin(a) * r - 1;
      seeds.set([rng(), rng(), rng(), rng()], i * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 6;
  }

  setPixelRatio(dpr: number) {
    this.uniforms.uPixelRatio.value = dpr;
  }

  update(time: number, amount: number) {
    this.uniforms.uTime.value = time;
    this.uniforms.uDust.value = amount;
    this.points.visible = amount > 0.005;
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
