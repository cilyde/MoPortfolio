import * as THREE from "three";

/**
 * A photographic studio, built procedurally and baked into a PMREM env map:
 * a warm key softbox (desert light), cool rim strips (London fog), a top strip
 * and a dim gradient dome so every polished member always reads.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const scene = new THREE.Scene();
  const disposables: { dispose: () => void }[] = [];

  const domeGeo = new THREE.SphereGeometry(30, 48, 24);
  const pos = domeGeo.getAttribute("position");
  const colors: number[] = [];
  const horizon = new THREE.Color(0.034, 0.032, 0.03);
  const zenith = new THREE.Color(0.085, 0.084, 0.09);
  const nadir = new THREE.Color(0.008, 0.007, 0.006);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 30;
    c.copy(horizon);
    if (y > 0) c.lerp(zenith, Math.pow(y, 0.8));
    else c.lerp(nadir, Math.pow(-y, 0.7));
    colors.push(c.r, c.g, c.b);
  }
  domeGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const domeMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
  scene.add(new THREE.Mesh(domeGeo, domeMat));
  disposables.push(domeGeo, domeMat);

  const panel = (w: number, h: number, rgb: [number, number, number], intensity: number, p: [number, number, number]) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    mat.color.setRGB(rgb[0] * intensity, rgb[1] * intensity, rgb[2] * intensity);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p[0], p[1], p[2]);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    disposables.push(geo, mat);
  };

  panel(7, 4.5, [1.0, 0.82, 0.62], 6.5, [-6, 5.5, 7]); // key softbox — warm, front-left, high
  panel(1.0, 12, [0.65, 0.76, 1.0], 7.0, [9, 0.5, -3]); // right rim strip — cool
  panel(1.0, 12, [0.7, 0.8, 1.0], 5.0, [-9.5, 0, -4]); // left rim strip — cool
  panel(14, 0.7, [1, 1, 1], 3.5, [0, 10, 1]); // top strip
  panel(4, 9, [1.0, 0.9, 0.8], 1.3, [7, 0, 7]); // soft fill — front-right
  panel(18, 18, [0.9, 0.7, 0.5], 0.06, [0, -12, 0]); // floor bounce

  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(scene, 0.035);
  pmrem.dispose();
  disposables.forEach((d) => d.dispose());
  return rt.texture;
}
