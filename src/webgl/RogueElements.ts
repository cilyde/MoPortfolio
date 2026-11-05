import * as THREE from "three";
import type { Params } from "./keyframes";
import type { ShellDef } from "./Sculpture";

export interface RogueDef {
  id: string;
  index: string;
  shellIndex: number;
  trait: string;
  subtrait: string;
  spec: string;
  accent: [number, number, number]; // Linear RGB
  angleOffset: number; // Base azimuthal position
  yOffset: number; // Vertical offset
}

export const ROGUE_DEFS: RogueDef[] = [
  {
    id: "dev-core",
    index: "01",
    shellIndex: 0,
    trait: "01 // DEV AT THE CORE",
    subtrait: "FLUTTER ARCHITECTURE · SYSTEM INTEGRITY",
    spec: "CLEAN REACTIVE ARCH · 120 FPS · CRASH-FREE",
    accent: [1.0, 0.72, 0.42], // Warm Amber
    angleOffset: 0.25,
    yOffset: 0.15,
  },
  {
    id: "advanced-ai",
    index: "02",
    shellIndex: 1,
    trait: "02 // ADVANCED AI",
    subtrait: "NEURAL AGENTS · REASONING PIPELINES",
    spec: "LLM ORCHESTRATION · ON-DEVICE · HIGH LEVERAGE",
    accent: [0.55, 0.42, 1.0], // Royal Violet
    angleOffset: 1.5,
    yOffset: -0.12,
  },
  {
    id: "business-data",
    index: "03",
    shellIndex: 2,
    trait: "03 // BUSINESS DATA ANALYTICS",
    subtrait: "TELEMETRY · USER PATTERNS & ROI",
    spec: "12M EVENTS/DAY · COHORT RETENTION · ROI CERTAINTY",
    accent: [0.37, 0.92, 0.83], // Teal Cyan
    angleOffset: 2.75,
    yOffset: 0.28,
  },
  {
    id: "psychology",
    index: "04",
    shellIndex: 3,
    trait: "04 // PSYCHOLOGY & COGNITION",
    subtrait: "BEHAVIORAL ERGONOMICS · MENTAL MODELS",
    spec: "COGNITIVE FLOW · USER EMPATHY · ZERO FRICTION",
    accent: [1.0, 0.48, 0.35], // Coral Synapse
    angleOffset: 4.0,
    yOffset: -0.22,
  },
  {
    id: "photography",
    index: "05",
    shellIndex: 4,
    trait: "05 // PHOTOGRAPHY & OPTICS",
    subtrait: "LIGHT, COMPOSITION & VISUAL DEPTH",
    spec: "APERTURE ƒ/1.4 · FOCAL DEPTH · HARMONY & POLISH",
    accent: [1.0, 0.82, 0.5], // Gold Light
    angleOffset: 5.25,
    yOffset: 0.08,
  },
];

/**
 * Creates high-DPI vertical textures (512x2048) for laser-etched engraving on brushed metallic blades.
 * Generates:
 *  1. Albedo map: brushed dark titanium with laser-etched type and vernier calipers running lengthwise.
 *  2. Bump map: recessed micro-indentations for real physical shadows under scene lights.
 *  3. Emissive map: subtle luminescence catching the light when active.
 */
function createEngravingTextures(def: RogueDef) {
  const w = 512;
  const h = 2048;

  // 1. Albedo Canvas
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  // Dark brushed metal background
  const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
  bgGrad.addColorStop(0, "#0a0b0d");
  bgGrad.addColorStop(0.35, "#15161c");
  bgGrad.addColorStop(0.65, "#181920");
  bgGrad.addColorStop(1, "#0a0b0d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Micro vertical brush texture
  ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * w;
    const len = 120 + Math.random() * 500;
    const y = Math.random() * (h - len);
    ctx.fillRect(x, y, 1, len);
  }

  // Outer precision technical frame
  ctx.strokeStyle = "rgba(236, 236, 230, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  // Inner margin dotted guide
  ctx.setLineDash([8, 12]);
  ctx.strokeStyle = "rgba(236, 236, 230, 0.1)";
  ctx.strokeRect(40, 40, w - 80, h - 80);
  ctx.setLineDash([]);

  // Vernier measurement tick marks along both long edges
  ctx.fillStyle = "rgba(236, 236, 230, 0.32)";
  for (let y = 60; y <= h - 60; y += 20) {
    const isMajor = (y - 60) % 80 === 0;
    const tickW = isMajor ? 14 : 7;
    ctx.fillRect(30, y, tickW, 1.5);
    ctx.fillRect(w - 30 - tickW, y, tickW, 1.5);
  }

  // Corner precision crosses
  const drawCross = (cx: number, cy: number) => {
    ctx.strokeStyle = "rgba(236, 236, 230, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 8);
    ctx.stroke();
  };
  drawCross(34, 34);
  drawCross(w - 34, 34);
  drawCross(34, h - 34);
  drawCross(w - 34, h - 34);

  // Now draw all engraving typography lengthwise along the blade axis
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 2); // Rotate 90deg counter-clockwise so text runs upwards along the blade
  // Coordinate space in this rotated context:
  // X ranges from -h/2 (-1024) to +h/2 (+1024) [lengthwise]
  // Y ranges from -w/2 (-256) to +w/2 (+256)   [crosswise]

  // Top header metadata
  ctx.font = "600 22px 'Geist Mono', 'SF Mono', Menlo, monospace";
  ctx.fillStyle = "rgba(236, 236, 230, 0.48)";
  ctx.fillText(`SYS.ROGUE // SHELL_0${def.shellIndex + 1} // TRAIT_${def.index}`, -860, -48);
  ctx.textAlign = "right";
  ctx.fillText("25.2048° N — 55.2708° E", 860, -48);
  ctx.textAlign = "left";

  // Center primary laser-etched trait title
  ctx.font = "800 58px 'Syne', 'Manrope', 'SF Pro Display', sans-serif";
  ctx.fillStyle = "rgba(244, 244, 240, 0.92)";
  ctx.shadowColor = `rgba(${Math.round(def.accent[0] * 255)}, ${Math.round(def.accent[1] * 255)}, ${Math.round(
    def.accent[2] * 255,
  )}, 0.45)`;
  ctx.shadowBlur = 10;
  ctx.fillText(def.trait, -860, 22);
  ctx.shadowBlur = 0;

  // Subtitle trait description
  ctx.font = "600 27px 'Geist Mono', 'SF Mono', Menlo, monospace";
  ctx.fillStyle = "rgba(225, 225, 220, 0.78)";
  ctx.fillText(def.subtrait, -860, 68);

  // Technical specs
  ctx.font = "500 20px 'Geist Mono', 'SF Mono', Menlo, monospace";
  ctx.fillStyle = "rgba(236, 236, 230, 0.42)";
  ctx.fillText(def.spec, -860, 108);

  // Accent pill badge on the right
  const badgeText = `TRAIT: ${def.index}`;
  ctx.font = "700 18px 'Geist Mono', monospace";
  const badgeWidth = ctx.measureText(badgeText).width + 30;
  ctx.fillStyle = `rgba(${Math.round(def.accent[0] * 255)}, ${Math.round(def.accent[1] * 255)}, ${Math.round(
    def.accent[2] * 255,
  )}, 0.18)`;
  ctx.strokeStyle = `rgba(${Math.round(def.accent[0] * 255)}, ${Math.round(def.accent[1] * 255)}, ${Math.round(
    def.accent[2] * 255,
  )}, 0.7)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(860 - badgeWidth, 88, badgeWidth, 28, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `rgba(${Math.round(def.accent[0] * 255)}, ${Math.round(def.accent[1] * 255)}, ${Math.round(
    def.accent[2] * 255,
  )}, 0.98)`;
  ctx.textAlign = "center";
  ctx.fillText(badgeText, 860 - badgeWidth / 2, 108);
  ctx.textAlign = "left";

  ctx.restore();

  // 2. Bump / Normal indentation canvas (matching dimensions)
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bctx = bumpCanvas.getContext("2d")!;
  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, w, h);

  bctx.save();
  bctx.translate(w / 2, h / 2);
  bctx.rotate(-Math.PI / 2);

  bctx.fillStyle = "#454545"; // Recessed floor
  bctx.font = "800 58px 'Syne', 'Manrope', 'SF Pro Display', sans-serif";
  bctx.fillText(def.trait, -860, 22);

  bctx.font = "600 27px 'Geist Mono', 'SF Mono', Menlo, monospace";
  bctx.fillText(def.subtrait, -860, 68);

  // Subtle specular highlight on the edge of the etch
  bctx.fillStyle = "#b5b5b5";
  bctx.fillText(def.trait, -860, 23.5);

  bctx.restore();

  // 3. Emissive glow canvas
  const emissiveCanvas = document.createElement("canvas");
  emissiveCanvas.width = w;
  emissiveCanvas.height = h;
  const ectx = emissiveCanvas.getContext("2d")!;
  ectx.fillStyle = "#000000";
  ectx.fillRect(0, 0, w, h);

  ectx.save();
  ectx.translate(w / 2, h / 2);
  ectx.rotate(-Math.PI / 2);

  ectx.font = "800 58px 'Syne', 'Manrope', 'SF Pro Display', sans-serif";
  ectx.fillStyle = `rgb(${Math.round(def.accent[0] * 255)}, ${Math.round(def.accent[1] * 255)}, ${Math.round(
    def.accent[2] * 255,
  )})`;
  ectx.fillText(def.trait, -860, 22);

  ectx.restore();

  const albedoTex = new THREE.CanvasTexture(canvas);
  albedoTex.colorSpace = THREE.SRGBColorSpace;
  albedoTex.minFilter = THREE.LinearMipmapLinearFilter;
  albedoTex.magFilter = THREE.LinearFilter;
  albedoTex.generateMipmaps = true;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.minFilter = THREE.LinearMipmapLinearFilter;
  bumpTex.magFilter = THREE.LinearFilter;
  bumpTex.generateMipmaps = true;

  const emissiveTex = new THREE.CanvasTexture(emissiveCanvas);
  emissiveTex.minFilter = THREE.LinearMipmapLinearFilter;
  emissiveTex.magFilter = THREE.LinearFilter;
  emissiveTex.generateMipmaps = true;

  return { albedoTex, bumpTex, emissiveTex };
}

interface RogueBlade {
  def: RogueDef;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  textures: { albedoTex: THREE.CanvasTexture; bumpTex: THREE.CanvasTexture; emissiveTex: THREE.CanvasTexture };
  baseRadius: number;
  shellRadius: number;
  shellHeight: number;
  currentGrowth: number;
}

/**
 * 3D Rogue Elements Subsystem.
 * Sprouts precision-etched structural blades that kinematically extend from the kinetic sculpture.
 */
export class RogueElements {
  readonly group = new THREE.Group();
  private blades: RogueBlade[] = [];
  private v1 = new THREE.Vector3();

  constructor(shells: ShellDef[], envMap: THREE.Texture) {
    this.group.name = "RogueElements";
    this.group.renderOrder = 3;

    ROGUE_DEFS.forEach((def) => {
      const sh = shells[def.shellIndex];
      const textures = createEngravingTextures(def);

      // Precision mechanical blade geometry: width 0.28, length 2.4, thickness 0.016
      const bladeGeo = new THREE.BoxGeometry(0.28, 2.4, 0.016, 2, 16, 2);

      const mat = new THREE.MeshStandardMaterial({
        color: 0xf0f0eb,
        metalness: 0.94,
        roughness: 0.22,
        map: textures.albedoTex,
        bumpMap: textures.bumpTex,
        bumpScale: 0.02,
        emissive: new THREE.Color(def.accent[0], def.accent[1], def.accent[2]),
        emissiveMap: textures.emissiveTex,
        emissiveIntensity: 0.08,
        envMap,
        envMapIntensity: 1.3,
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(bladeGeo, mat);
      mesh.frustumCulled = false;
      this.group.add(mesh);

      this.blades.push({
        def,
        mesh,
        material: mat,
        textures,
        baseRadius: sh.radius,
        shellRadius: sh.radius,
        shellHeight: sh.height,
        currentGrowth: 0,
      });
    });
  }

  update(
    dt: number,
    params: Params,
    time: number,
    mouseWorld: THREE.Vector3,
    shellSpins: number[],
    shellTwists: number[],
  ) {
    const growths = [
      params.rogue1 ?? 0,
      params.rogue2 ?? 0,
      params.rogue3 ?? 0,
      params.rogue4 ?? 0,
      params.rogue5 ?? 0,
    ];
    const engraveIntensity = params.rogueEngrave ?? 1;

    let anyVisible = false;

    this.blades.forEach((b, i) => {
      const targetGrowth = growths[i];
      // Critically damped kinematic growth
      b.currentGrowth += (targetGrowth - b.currentGrowth) * (1 - Math.exp(-dt * 3.6));
      const g = b.currentGrowth;

      if (g < 0.005) {
        b.mesh.visible = false;
        b.material.opacity = 0;
        return;
      }

      anyVisible = true;
      b.mesh.visible = true;

      // Opacity fades in cleanly with initial growth
      b.material.opacity = Math.min(1, g * 1.8);

      // Shell kinematics
      const spin = shellSpins[b.def.shellIndex] ?? 0;
      const twist = shellTwists[b.def.shellIndex] ?? 0;

      // Base angle follows shell rotation plus distinct architectural angle
      const theta = spin + b.def.angleOffset;

      // The rogue element peels radially outwards from its shell
      // Docked inside shell when g=0, cantilevers outward into camera space when g=1
      const extendR = b.shellRadius + g * 1.25 + Math.sin(time * 0.8 + i) * 0.03;
      const extendY = b.def.yOffset * (b.shellHeight * 0.35) + Math.cos(time * 0.6 + i) * 0.04;

      const px = extendR * Math.cos(theta);
      const pz = extendR * Math.sin(theta);
      const py = extendY;

      b.mesh.position.set(px, py, pz);

      // Rotation: The blade tilts so the engraved face directly addresses the viewer's camera plane
      const faceAngle = Math.atan2(px, pz);
      const tiltZ = Math.sin(theta + twist * 0.5) * 0.16 * (1 - g * 0.6);
      const tiltX = (g - 0.5) * 0.12;

      b.mesh.rotation.set(tiltX, faceAngle + Math.PI * 0.5, tiltZ);

      // Scale: Sleek mechanical extension along its spine
      const lenScale = 0.35 + 0.65 * g;
      b.mesh.scale.set(1, lenScale, 1);

      // Light interaction: When mouse cursor point light is near this blade, specular & emissive glint rises
      b.mesh.getWorldPosition(this.v1);
      const distToMouse = this.v1.distanceTo(mouseWorld);
      const mouseProximity = Math.max(0, 1 - distToMouse / 2.2);

      // Subtle, high-craft emissive glow: barely there normally (0.05), catching light on hover (0.35)
      const baseEmissive = 0.04 + g * 0.08 * engraveIntensity;
      b.material.emissiveIntensity = baseEmissive + mouseProximity * 0.28;
    });

    this.group.visible = anyVisible;
  }

  dispose() {
    this.blades.forEach((b) => {
      b.mesh.geometry.dispose();
      b.material.dispose();
      b.textures.albedoTex.dispose();
      b.textures.bumpTex.dispose();
      b.textures.emissiveTex.dispose();
    });
    this.blades = [];
  }
}
