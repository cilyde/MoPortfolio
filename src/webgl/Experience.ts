import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { runtime, type Capabilities } from "../lib/runtime";
import { Director } from "./Director";
import { createStudioEnvironment } from "./environment";
import { Sculpture, SHELLS, TWIST_MAX } from "./Sculpture";
import { Signals } from "./Signals";
import { Backdrop, Dust } from "./Atmosphere";
import { Blueprint } from "./Blueprint";
import { RogueElements } from "./RogueElements";
import { FINAL_SHADER } from "./shaders";

const DEG = Math.PI / 180;
const clamp = THREE.MathUtils.clamp;
const smooth01 = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

export interface SceneStats {
  twistDeg: number;
  fNumber: number;
  members: number;
  flow: number;
  order: number;
  attention: number;
}

export class Experience {
  readonly director = new Director();
  readonly stats: SceneStats;
  /** Per-shell intro twist multipliers, animated by the opening sequence. */
  readonly intro = { t0: 1, t1: 1, t2: 1, t3: 1, t4: 1 };
  scrollY = 0;
  scrollVel = 0;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 140);
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private finalPass: ShaderPass;
  private sculpture: Sculpture;
  private signals: Signals;
  private backdrop: Backdrop;
  private dust: Dust;
  private blueprint: Blueprint;
  private rogueElements: RogueElements;
  private envMap: THREE.Texture;
  private cursorLight: THREE.PointLight;
  private caps: Capabilities;
  private canvas: HTMLCanvasElement;
  private onLost: () => void;

  private width = 0;
  private height = 0;
  private aspect = 1;
  private dpr = 1;
  private elapsed = 0;
  private spins = [0.0, 0.0, 0.0, 0.0, 0.0];
  private signalClock = 0;
  private kick = 0;
  private pointer = new THREE.Vector2(0, 0);
  private pointerActive = 0;
  private lastPointer = -100;
  private parallax = new THREE.Vector2();
  private mouseWorld = new THREE.Vector3();
  private mouseSmooth = new THREE.Vector3(0, 0, 2);
  private raycaster = new THREE.Raycaster();
  private plane = new THREE.Plane();
  private v1 = new THREE.Vector3();
  private v2 = new THREE.Vector3();
  private ndc = new THREE.Vector2();
  private perfTime = 0;
  private perfFrames = 0;
  private monitoring = false;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, caps: Capabilities, onLost: () => void) {
    this.canvas = canvas;
    this.caps = caps;
    this.onLost = onLost;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x060606, 1);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.dpr = Math.min(window.devicePixelRatio || 1, caps.tier >= 2 ? 1.75 : 1.5);
    this.renderer.setPixelRatio(this.dpr);

    this.scene.fog = new THREE.FogExp2(0x070707, 0.028);

    this.envMap = createStudioEnvironment(this.renderer);
    this.sculpture = new Sculpture(caps.tier, this.envMap);
    this.signals = new Signals(this.sculpture, caps.tier);
    this.backdrop = new Backdrop();
    this.dust = new Dust(caps.tier >= 2 ? 240 : 120);
    this.blueprint = new Blueprint(SHELLS);
    this.rogueElements = new RogueElements(SHELLS, this.envMap);
    this.scene.add(
      this.backdrop.mesh,
      this.sculpture.mesh,
      this.signals.mesh,
      this.dust.points,
      this.blueprint.group,
      this.rogueElements.group,
    );

    const key = new THREE.DirectionalLight(0xffd9b0, 1.6);
    key.position.set(-4, 6, 5);
    const rim = new THREE.DirectionalLight(0x9db8ff, 2.2);
    rim.position.set(4, 2, -6);
    this.cursorLight = new THREE.PointLight(0xffc28a, 0, 7, 2);
    this.scene.add(key, rim, this.cursorLight);

    this.stats = { twistDeg: 0, fNumber: 1.4, members: this.sculpture.rods.count, flow: 0, order: 0, attention: 0 };

    // HDR + MSAA render target so thin members stay crisp and glints can bloom.
    // On mobile / touch devices (tier < 2 or touch), multisampled float buffers are not
    // supported by WebGL2 (iOS Safari / WebKit throws FRAMEBUFFER_INCOMPLETE_MULTISAMPLE),
    // so MSAA is safely restricted to desktop tier 2.
    const ext = this.renderer.extensions;
    const hdr = ext.has("EXT_color_buffer_float") || ext.has("EXT_color_buffer_half_float");
    const samples = caps.tier >= 2 && !caps.touch ? 4 : 0;
    const rt = new THREE.WebGLRenderTarget(2, 2, {
      type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType,
      samples,
      depthBuffer: true,
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.62, 0.92);
    this.composer.addPass(this.bloom);
    this.finalPass = new ShaderPass(FINAL_SHADER);
    this.finalPass.uniforms.uResolution.value = new THREE.Vector2(1, 1);
    this.composer.addPass(this.finalPass);

    this.resize();

    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("touchstart", this.onTouch, { passive: true });
    window.addEventListener("touchmove", this.onTouch, { passive: true });
    canvas.addEventListener("webglcontextlost", this.onContextLost, false);
  }

  /* ── input ─────────────────────────────────────────────────────── */
  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    this.setPointer(e.clientX, e.clientY);
  };

  private onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) this.setPointer(t.clientX, t.clientY);
  };

  private setPointer(x: number, y: number) {
    if (!this.width || !this.height) return;
    this.pointer.set((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1);
    this.lastPointer = this.elapsed;
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.onLost();
  };

  /* ── lifecycle ─────────────────────────────────────────────────── */
  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    // cap the total pixel budget so 4K/5K displays stay smooth (MSAA + HDR buffers are heavy)
    const maxPixels = this.caps.tier >= 2 ? 4.2e6 : 2.4e6;
    const dpr = Math.max(0.75, Math.min(this.dpr, Math.sqrt(maxPixels / Math.max(1, w * h))));
    if (w === this.width && h === this.height && Math.abs(this.renderer.getPixelRatio() - dpr) < 1e-3) return;
    this.width = w;
    this.height = h;
    this.aspect = w / h;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    (this.finalPass.uniforms.uResolution.value as THREE.Vector2).set(w * dpr, h * dpr);
    this.backdrop.setAspect(this.aspect);
    this.dust.setPixelRatio(dpr);
  }

  async warmup() {
    try {
      this.update(1 / 60, true);
      await Promise.race([
        this.renderer.compileAsync(this.scene, this.camera),
        new Promise((r) => setTimeout(r, 600)),
      ]);
    } catch {
      /* compile on first render instead */
    }
  }

  startMonitoring() {
    this.monitoring = true;
    this.perfTime = 0;
    this.perfFrames = 0;
  }

  /* ── frame ─────────────────────────────────────────────────────── */
  update(dtRaw: number, skipRender = false) {
    if (this.disposed) return;
    const dt = Math.min(Math.max(dtRaw, 0), 1 / 15);
    const motion = this.caps.reducedMotion ? 0.35 : 1;
    this.elapsed += dt * motion;
    const t = this.elapsed;

    this.scrollVel *= Math.exp(-dt * 5);
    const p = this.director.update(this.scrollY, dt);

    // attention — follow the visitor, or wander gently when idle
    const isActive = t - this.lastPointer < 2.8 ? 1 : 0;
    this.pointerActive += (isActive - this.pointerActive) * (1 - Math.exp(-dt * 2.5));

    // camera — spherical rig + lens shift (keeps verticals parallel, like a tilt-shift lens)
    const portrait = this.aspect < 0.85;
    const narrow = !portrait && this.aspect < 1.3;
    const radiusMul = portrait ? clamp(0.8 / this.aspect, 1, 1.9) : narrow ? 1.12 : 1;
    const par = this.caps.touch || this.caps.reducedMotion ? 0 : 1;
    const pf = 1 - Math.exp(-dt * 2.2);
    this.parallax.x += (this.pointer.x * par - this.parallax.x) * pf;
    this.parallax.y += (this.pointer.y * par - this.parallax.y) * pf;
    const az = (p.camAzimuth + this.parallax.x * 3.5) * DEG;
    const pol = clamp(p.camPolar + this.parallax.y * 2.2, 1.5, 178) * DEG;
    const r = p.camRadius * radiusMul;
    const ty = p.camTargetY;
    this.camera.position.set(r * Math.sin(pol) * Math.sin(az), ty + r * Math.cos(pol), r * Math.sin(pol) * Math.cos(az));
    this.v1.set(0, ty, 0);
    this.camera.lookAt(this.v1);
    this.camera.fov = p.fov;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    const sx = portrait ? 0 : p.shiftX * (narrow ? 0.55 : 1);
    const sy = portrait ? p.mShiftY : p.shiftY;
    const pe = this.camera.projectionMatrix.elements;
    pe[8] = -sx;
    pe[9] = -sy;
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.camera.updateMatrixWorld();

    // attention point on a plane just in front of the sculpture
    const autoX = sx + Math.cos(t * 0.29) * 0.22;
    const autoY = sy + Math.sin(t * 0.21) * 0.32;
    this.ndc.set(
      THREE.MathUtils.lerp(autoX, this.pointer.x, this.pointerActive),
      THREE.MathUtils.lerp(autoY, this.pointer.y, this.pointerActive),
    );
    this.camera.getWorldDirection(this.v2);
    this.v1.set(0, ty, 0).addScaledVector(this.v2, -1.9);
    this.plane.setFromNormalAndCoplanarPoint(this.v2, this.v1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    if (this.raycaster.ray.intersectPlane(this.plane, this.mouseWorld)) {
      this.mouseSmooth.lerp(this.mouseWorld, 1 - Math.exp(-dt * 4.5));
    }

    // momentum from scrolling
    const kickTarget = clamp(this.scrollVel / 45, -1.2, 1.2);
    this.kick += (kickTarget - this.kick) * (1 - Math.exp(-dt * 3));
    const spinBoost = 1 + Math.abs(this.kick) * 2.5;

    const s = this.sculpture;
    const introT = [this.intro.t0, this.intro.t1, this.intro.t2, this.intro.t3, this.intro.t4];
    for (let i = 0; i < 5; i++) {
      const sh = SHELLS[i];
      this.spins[i] += dt * motion * sh.speed * sh.dir * p.spin * spinBoost;
      s.spin[i] = this.spins[i];
      const breathTw = 1 + p.breath * 0.07 * Math.sin(t * 1.0472 + i * 0.6);
      s.twist[i] = p.twist * TWIST_MAX * introT[i] * breathTw;
      s.len[i] = i === 0 ? 1 : smooth01((p.outer - (i - 1) * 0.1875) / 0.25);
    }
    this.signalClock += dt * motion * p.signalSpeed * (1 + Math.abs(this.kick) * 1.5);

    const u = s.uniforms;
    u.uTime.value = t;
    u.uEmerge.value = p.emerge;
    u.uFlow.value = p.flow;
    u.uData.value = p.data;
    u.uSort.value = p.sort;
    u.uBreath.value = p.breath;
    u.uAttention.value = p.attention;
    u.uAttnRadius.value = p.attnRadius;
    u.uFlip.value = p.flip;
    u.uHeightMul.value = p.heightMul;
    (u.uMouse.value as THREE.Vector3).copy(this.mouseSmooth);
    u.uLineCenter.value = p.lineCenter;
    u.uLineAngle.value = p.lineAngle * DEG;
    u.uLineLength.value = p.lineLength;
    u.uKick.value = this.kick * 0.6;
    (u.uTint.value as THREE.Color).setRGB(p.tintR, p.tintG, p.tintB);
    u.uGrowGlow.value = p.growGlow;
    u.uLineGlow.value = p.lineGlow;
    s.material.roughness = p.roughness;
    s.material.envMapIntensity = p.env;

    this.signals.uniforms.uSignalTime.value = this.signalClock;
    this.signals.uniforms.uSignals.value = p.signals;

    // the visitor's "light" floats just in front of the surface (never inside it — no blow-outs)
    this.cursorLight.position.copy(this.mouseSmooth).addScaledVector(this.v2, -1.4);
    this.cursorLight.intensity = 8 * p.attention * (0.3 + 0.7 * this.pointerActive);

    this.backdrop.update(p, sx, sy);
    this.dust.update(t, p.dust);
    this.blueprint.update(p.blueprint, s.twist[0], p.heightMul);
    this.rogueElements.update(dt, p, t, this.mouseSmooth, this.camera.position, this.spins, s.twist);
    this.rogueElements.checkHover(this.raycaster, this.camera, this.width, this.height, runtime.manualHoverPillar);

    const fu = this.finalPass.uniforms;
    fu.uTime.value = t;
    fu.uExposure.value = p.exposure;
    fu.uCA.value = 0.01 + Math.abs(this.kick) * 0.012;
    this.bloom.strength = 0.6 * p.bloom;

    // live readouts for the interface
    const outerTwist = s.twist[4];
    this.stats.twistDeg = outerTwist / DEG;
    const ratio = Math.cos(Math.min(outerTwist, Math.PI * 0.999) / 2);
    this.stats.fNumber = clamp(1.4 / Math.max(ratio, 0.0636), 1.4, 22);
    this.stats.flow = p.flow;
    this.stats.order = p.sort * p.data;
    this.stats.attention = p.attention * (0.3 + 0.7 * this.pointerActive);

    if (skipRender) return;
    this.composer.render(dt);
    this.monitor(dt);
  }

  private monitor(dt: number) {
    if (!this.monitoring) return;
    this.perfTime += dt;
    this.perfFrames++;
    if (this.perfTime < 2) return;
    const avg = this.perfTime / this.perfFrames;
    if (avg > 1 / 45) {
      const effective = this.renderer.getPixelRatio();
      if (effective > 1.01) {
        this.dpr = Math.max(1, effective - 0.25);
        this.resize();
      } else if (this.bloom.enabled) {
        this.bloom.enabled = false;
      }
    }
    this.perfTime = 0;
    this.perfFrames = 0;
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("touchstart", this.onTouch);
    window.removeEventListener("touchmove", this.onTouch);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.sculpture.dispose();
    this.signals.dispose();
    this.backdrop.dispose();
    this.dust.dispose();
    this.blueprint.dispose();
    this.rogueElements.dispose();
    this.envMap.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
