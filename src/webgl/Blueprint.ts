import * as THREE from "three";
import type { ShellDef } from "./Sculpture";

/**
 * Construction drawing overlay for the "Structure" chapter: generating circles of
 * every shell, the axis with ticks, the core's height dimension and its waist.
 */
export class Blueprint {
  readonly group = new THREE.Group();
  private material: THREE.LineBasicMaterial;
  private waist: THREE.LineLoop;
  private geometries: THREE.BufferGeometry[] = [];
  private coreRadius: number;

  constructor(shells: ShellDef[]) {
    this.coreRadius = shells[0].radius;
    this.material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0.95, 0.88, 0.78),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    const pts: number[] = [];
    const circle = (r: number, y: number, seg = 128) => {
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        pts.push(r * Math.cos(a0), y, r * Math.sin(a0), r * Math.cos(a1), y, r * Math.sin(a1));
      }
    };
    shells.forEach((s) => {
      circle(s.radius, s.height / 2);
      circle(s.radius, -s.height / 2);
    });

    // axis + ticks
    pts.push(0, -4.4, 0, 0, 4.4, 0);
    for (let k = -8; k <= 8; k++) {
      const y = k * 0.5;
      const w = k % 2 === 0 ? 0.12 : 0.06;
      pts.push(-w, y, 0, w, y, 0);
    }

    // core height dimension
    const R0 = shells[0].radius;
    const H0 = shells[0].height;
    const x = R0 + 0.6;
    pts.push(x, -H0 / 2, 0, x, H0 / 2, 0);
    pts.push(x - 0.09, -H0 / 2, 0, x + 0.09, -H0 / 2, 0);
    pts.push(x - 0.09, H0 / 2, 0, x + 0.09, H0 / 2, 0);
    pts.push(R0, H0 / 2, 0, x + 0.09, H0 / 2, 0);
    pts.push(R0, -H0 / 2, 0, x + 0.09, -H0 / 2, 0);
    // radius at the top
    pts.push(0, H0 / 2, 0, R0, H0 / 2, 0);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    this.geometries.push(geo);
    this.group.add(new THREE.LineSegments(geo, this.material));

    const wp: number[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      wp.push(Math.cos(a), 0, Math.sin(a));
    }
    const wg = new THREE.BufferGeometry();
    wg.setAttribute("position", new THREE.Float32BufferAttribute(wp, 3));
    this.geometries.push(wg);
    this.waist = new THREE.LineLoop(wg, this.material);
    this.group.add(this.waist);

    this.group.visible = false;
    this.group.renderOrder = 4;
  }

  update(amount: number, coreTwist: number, heightMul: number) {
    this.material.opacity = amount * 0.42;
    this.group.visible = amount > 0.005;
    this.group.scale.set(1, heightMul, 1);
    const wr = Math.max(0.001, this.coreRadius * Math.cos(Math.min(coreTwist, Math.PI) / 2));
    this.waist.scale.set(wr, 1, wr);
  }

  dispose() {
    this.geometries.forEach((g) => g.dispose());
    this.material.dispose();
  }
}
