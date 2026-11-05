/* eslint-disable */
// All GLSL for the experience. Written for three r187 (WebGL2 / GLSL ES 3.0 via three's prefixes).

export const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 q0 = vec3(a0.xy, h.x);
  vec3 q1 = vec3(a0.zw, h.y);
  vec3 q2 = vec3(a1.xy, h.z);
  vec3 q3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(q0, q0), dot(q1, q1), dot(q2, q2), dot(q3, q3)));
  q0 *= norm.x; q1 *= norm.y; q2 *= norm.z; q3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(q0, x0), dot(q1, x1), dot(q2, x2), dot(q3, x3)));
}
`;

/** Attributes + uniforms shared by the rods and the signals that travel along them. */
export const ROD_HEADER = /* glsl */ `
#define R_PI 3.14159265359
#define R_TAU 6.28318530718
attribute float aShell;
attribute float aU;
attribute float aFam;
attribute float aRank;
attribute float aOrder;
attribute vec4 aRand;
uniform float uTime;
uniform float uRadius[5];
uniform float uHeight[5];
uniform float uWidth[5];
uniform float uSpin[5];
uniform float uTwist[5];
uniform float uLen[5];
uniform float uEmerge;
uniform float uFlow;
uniform float uData;
uniform float uSort;
uniform float uBreath;
uniform float uAttention;
uniform float uAttnRadius;
uniform float uFlip;
uniform float uHeightMul;
uniform vec3 uMouse;
uniform float uLineCenter;
uniform float uLineAngle;
uniform float uLineLength;
uniform float uKick;
`;

/**
 * Each member is a ruling of a hyperboloid of one sheet: a straight segment from
 * angle (theta - phi/2) on the lower circle to (theta + phi/2) on the upper circle.
 */
export const ROD_FUNCS = /* glsl */ `
${NOISE}

struct RodFrame {
  vec3 p0;
  vec3 p1;
  vec3 radial;
  float grow;
  float len;
  float lineMix;
  float width;
  float theta;
};

RodFrame computeRod() {
  RodFrame r;
  int si = int(aShell + 0.5);
  float R = uRadius[si];
  float H = uHeight[si] * uHeightMul;
  float isLine = step(aOrder, -0.01);

  // data sorting: slide to the slot given by rank (shortest way round)
  float du = aRank - aU;
  du -= floor(du + 0.5);
  float u = aU + du * uSort;

  float theta = R_TAU * u + 1.5707963 + uSpin[si];
  float phi = aFam * uTwist[si];
  float hv = mix(1.0, 0.16 + 0.84 * aRand.x, uData);
  float hh = 0.5 * H * hv;
  float a0 = theta - 0.5 * phi;
  float a1 = theta + 0.5 * phi;
  r.p0 = vec3(R * cos(a0), -hh, R * sin(a0));
  r.p1 = vec3(R * cos(a1), hh, R * sin(a1));
  r.radial = vec3(cos(theta), 0.0, sin(theta));

  // the very first member can leave the system and become "the single line"
  float lc = isLine * uLineCenter;
  float lh = 0.5 * uHeight[4] * uLineLength;
  vec3 q1 = vec3(-sin(uLineAngle) * lh, cos(uLineAngle) * lh, 0.0);
  r.p0 = mix(r.p0, -q1, lc);
  r.p1 = mix(r.p1, q1, lc);
  r.radial = normalize(mix(r.radial, vec3(0.0, 0.0, 1.0), lc) + vec3(0.0, 0.0, 0.0001));

  // emergence: members are drawn into existence in a choreographed order
  float w = 0.14;
  float g = clamp((uEmerge * (1.0 + w) - aOrder) / w, 0.0, 1.0);
  r.grow = g * g * (3.0 - 2.0 * g);
  r.len = mix(uLen[si], 1.0, isLine);
  r.lineMix = lc;
  r.width = uWidth[si];
  r.theta = theta;
  return r;
}

vec3 rodCenter(RodFrame r, float sE, out float infl) {
  vec3 p = mix(r.p0, r.p1, 0.5 + sE);
  float freeAmt = 1.0 - r.lineMix;
  float br = 1.0 + uBreath * 0.05 * sin(uTime * 1.0472 + aShell * 0.4);
  p.xz *= mix(1.0, br, freeAmt);
  if (uFlow > 0.001) {
    vec3 q = p * 0.36 + vec3(0.0, -uTime * 0.16, uTime * 0.06);
    vec3 n = vec3(snoise(q), snoise(q + vec3(19.1, 7.3, 3.7)), snoise(q + vec3(-5.2, 13.7, 27.1)));
    p += n * (uFlow * 0.62 * (0.55 + 0.45 * aRand.y) * freeAmt);
  }
  vec3 d = p - uMouse;
  infl = exp(-dot(d, d) / (uAttnRadius * uAttnRadius)) * uAttention * freeAmt;
  p += normalize(d + vec3(0.0001)) * infl * 0.36;
  return p;
}
`;

/** Replaces <beginnormal_vertex> in MeshStandardMaterial. Defines objectNormal + rodPos. */
export const SCULPTURE_NORMAL = /* glsl */ `
RodFrame rf = computeRod();
float sL = position.y;
float sE = sL * rf.grow * rf.len;
vec3 rodT = normalize(rf.p1 - rf.p0 + vec3(0.0, 0.00001, 0.0));
float infl;
vec3 pc = rodCenter(rf, sE, infl);
vec3 N0 = normalize(rf.radial - dot(rf.radial, rodT) * rodT);
vec3 B0 = cross(rodT, N0);
float psi = uFlip * 0.85 * sin(rf.theta * 3.0 - uTime * 0.55 + aShell * 1.7 + aFam * 0.6)
          + infl * 2.3
          + uKick * (0.6 + aRand.z);
psi *= (1.0 - rf.lineMix);
float cps = cos(psi);
float sps = sin(psi);
vec3 rN = cps * N0 + sps * B0;
vec3 rB = cps * B0 - sps * N0;
float wScale = rf.width * mix(0.3, 1.0, rf.grow) * mix(1.0, 0.18, rf.lineMix);
vec3 rodPos = pc + rB * (position.x * wScale) + rN * (position.z * 0.0065);
vec3 objectNormal = normal.x * rB + normal.y * rodT + normal.z * rN;
#ifdef USE_TANGENT
  vec3 objectTangent = vec3( tangent.xyz );
#endif
int siC = int(aShell + 0.5);
vTint = uTint * uShellColor[siC];
float growPulse = rf.grow * (1.0 - rf.grow) * 4.0;
float tipMask = smoothstep(0.3, 0.5, abs(sL));
vGlow = uGlowColor * (growPulse * (0.18 + 2.4 * tipMask) * uGrowGlow + rf.lineMix * uLineGlow * 2.4);
`;

export const SCULPTURE_VERTEX_PARS = /* glsl */ `
${ROD_HEADER}
uniform vec3 uTint;
uniform vec3 uShellColor[5];
uniform vec3 uGlowColor;
uniform float uGrowGlow;
uniform float uLineGlow;
varying vec3 vTint;
varying vec3 vGlow;
${ROD_FUNCS}
`;

/* ── Signals: luminous packets travelling along members ─────────────── */
export const SIGNALS_VERT = /* glsl */ `
${ROD_HEADER}
attribute float aPhase;
attribute float aSpeed;
uniform float uSignalTime;
uniform float uSignals;
varying vec2 vSUv;
varying float vSAlpha;
${ROD_FUNCS}
void main() {
  RodFrame rf = computeRod();
  float dirSign = sign(aSpeed);
  float s = (fract(aPhase + uSignalTime * abs(aSpeed)) - 0.5) * dirSign;
  float sE = s * rf.grow * rf.len;
  vec3 rodT = normalize(rf.p1 - rf.p0 + vec3(0.0, 0.00001, 0.0));
  float infl;
  vec3 pc = rodCenter(rf, sE, infl);
  vec3 dir = rodT * dirSign;
  vec3 toCam = normalize(cameraPosition - pc);
  vec3 side = normalize(cross(dir, toCam) + vec3(0.00001));
  float len = 0.34 * (0.6 + 0.8 * aRand.w);
  vec3 pos = pc + dir * (position.y * len) + side * (position.x * 0.03) + toCam * 0.03;
  vSUv = uv;
  float endFade = sin(R_PI * clamp(s + 0.5, 0.0, 1.0));
  vSAlpha = uSignals * rf.grow * rf.len * (1.0 - step(aOrder, -0.01)) * endFade;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}
`;

export const SIGNALS_FRAG = /* glsl */ `
uniform vec3 uSignalColor;
varying vec2 vSUv;
varying float vSAlpha;
void main() {
  float across = 1.0 - abs(vSUv.x * 2.0 - 1.0);
  across *= across;
  float along = vSUv.y * vSUv.y * smoothstep(1.0, 0.82, vSUv.y);
  float a = across * along * vSAlpha;
  gl_FragColor = vec4(uSignalColor * a * 6.0, 1.0);
}
`;

/* ── Backdrop: a studio "background light" behind the subject ─────── */
export const BACKDROP_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const BACKDROP_FRAG = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uGlow;
uniform vec2 uGlowPos;
uniform float uGlowSize;
uniform float uAspect;
uniform vec3 uHorizonColor;
uniform float uHorizon;
varying vec2 vUv;
void main() {
  vec2 p = vUv - uGlowPos;
  p.x *= uAspect;
  float r2 = dot(p, p);
  float s2 = uGlowSize * uGlowSize;
  float g = exp(-r2 / s2) * 0.72 + exp(-r2 / (s2 * 5.0)) * 0.28;
  vec3 col = uBase * (0.7 + 0.6 * vUv.y) + uGlow * g;
  float dy = vUv.y - 0.5;
  float hx = exp(-pow((vUv.x - 0.5) * uAspect * 0.9, 2.0));
  float above = step(0.0, dy);
  float sky = exp(-max(dy, 0.0) * 7.0) * above;
  float ground = exp(-max(-dy, 0.0) * 28.0) * (1.0 - above);
  col += uHorizonColor * uHorizon * (sky * 0.11 + ground * 0.05) * (0.35 + 0.65 * hx);
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ── Dust motes drifting through the key light ──────────────────────── */
export const DUST_VERT = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime;
uniform float uPixelRatio;
uniform float uDust;
varying float vA;
void main() {
  vec3 p = position;
  float t = uTime * (0.05 + aSeed.x * 0.06);
  p.x += sin(t + aSeed.y * 6.2831) * 0.7;
  p.y += sin(t * 0.8 + aSeed.z * 6.2831) * 0.5 + sin(uTime * 0.03 + aSeed.w * 6.2831) * 0.4;
  p.z += cos(t * 0.9 + aSeed.x * 6.2831) * 0.7;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(-mv.z, 0.1);
  gl_PointSize = (0.9 + aSeed.w * 1.9) * uPixelRatio * (10.0 / dist);
  float lit = smoothstep(9.0, 1.5, length(p - vec3(-1.5, 2.5, 1.0)));
  float tw = 0.6 + 0.4 * sin(uTime * (0.6 + aSeed.z) + aSeed.y * 40.0);
  vA = (0.08 + 0.55 * lit) * tw * uDust * smoothstep(0.8, 3.5, dist);
}
`;

export const DUST_FRAG = /* glsl */ `
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  float a = smoothstep(0.25, 0.02, d) * vA;
  gl_FragColor = vec4(vec3(1.0, 0.9, 0.78) * a * 1.6, 1.0);
}
`;

/* ── Final pass: chromatic fringe, exposure, ACES, vignette, film grain ─ */
export const FINAL_SHADER = {
  name: "FinalPass",
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uExposure: { value: 1 },
    uGrain: { value: 0.045 },
    uVignette: { value: 0.55 },
    uCA: { value: 0.012 },
    uResolution: { value: null as unknown },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uExposure;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uCA;
    uniform vec2 uResolution;
    varying vec2 vUv;

    vec3 acesFilm(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }
    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    void main() {
      vec2 uv = vUv;
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);
      vec2 off = d * r2 * uCA;
      vec3 col;
      col.r = texture2D(tDiffuse, uv - off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + off).b;
      col *= uExposure;
      col = acesFilm(col);
      vec2 vd = d * vec2(1.0, 0.86);
      float vig = smoothstep(0.95, 0.25, length(vd) * 1.25);
      col *= mix(1.0, vig, uVignette);
      col = toSRGB(col);
      float n = hash12(uv * uResolution + fract(uTime * 7.31) * 517.0) - 0.5;
      col += n * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
