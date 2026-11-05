import * as THREE from "three";
import { mulberry32, type Sculpture } from "./Sculpture";
import { SIGNALS_FRAG, SIGNALS_VERT } from "./shaders";

/** Luminous packets of information travelling along the structure's members. */
export class Signals {
  readonly mesh: THREE.Mesh;
  readonly uniforms: Record<string, THREE.IUniform>;
  private geometry: THREE.InstancedBufferGeometry;
  private material: THREE.ShaderMaterial;

  constructor(sculpture: Sculpture, tier: number) {
    const count = tier >= 2 ? 320 : 150;
    const rods = sculpture.rods;
    const rng = mulberry32(77);

    const shell = new Float32Array(count);
    const u = new Float32Array(count);
    const fam = new Float32Array(count);
    const rank = new Float32Array(count);
    const order = new Float32Array(count);
    const rand = new Float32Array(count * 4);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      let k = Math.floor(rng() * rods.count);
      if (rods.order[k] < 0) k = (k + 1) % rods.count; // never on the single line
      shell[i] = rods.shell[k];
      u[i] = rods.u[k];
      fam[i] = rods.fam[k];
      rank[i] = rods.rank[k];
      order[i] = rods.order[k];
      rand.set([rods.rand[k * 4], rods.rand[k * 4 + 1], rods.rand[k * 4 + 2], rng()], i * 4);
      phase[i] = rng();
      speed[i] = (0.07 + rng() * 0.14) * (rng() < 0.5 ? -1 : 1);
    }

    const plane = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = plane.index;
    geo.setAttribute("position", plane.getAttribute("position"));
    geo.setAttribute("uv", plane.getAttribute("uv"));
    geo.setAttribute("aShell", new THREE.InstancedBufferAttribute(shell, 1));
    geo.setAttribute("aU", new THREE.InstancedBufferAttribute(u, 1));
    geo.setAttribute("aFam", new THREE.InstancedBufferAttribute(fam, 1));
    geo.setAttribute("aRank", new THREE.InstancedBufferAttribute(rank, 1));
    geo.setAttribute("aOrder", new THREE.InstancedBufferAttribute(order, 1));
    geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rand, 4));
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
    geo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(speed, 1));
    geo.instanceCount = count;
    this.geometry = geo;

    this.uniforms = {
      ...sculpture.uniforms,
      uSignalTime: { value: 0 },
      uSignals: { value: 0 },
      uSignalColor: { value: new THREE.Vector3(1.0, 0.78, 0.52) },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: SIGNALS_VERT,
      fragmentShader: SIGNALS_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
