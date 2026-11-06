"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/** Model: "Car Concept" by Eric Chadwick / Darmstadt Graphics Group, CC BY 4.0 (see credits in the footer). */
const MODEL_URL = "/models/concept-car.glb";
/** Length the car is scaled to, in scene units (roughly metres). */
const CAR_LENGTH = 4.6;
/** Body paint: gloss black. */
const PAINT = { color: "#0d0f13", metalness: 0.5, roughness: 0.32 };

/**
 * Camera views the path passes through, with the car facing +Z:
 * headlights only → bonnet → half the car → the whole car.
 * The camera glides through them on one smooth curve, never stopping in between.
 */
const cameraPath = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0.62, 6.2),
    new THREE.Vector3(1.3, 2.5, 6.6),
    new THREE.Vector3(3.8, 1.7, 5.8),
    new THREE.Vector3(5.8, 2.2, 8.2),
  ],
  false,
  "centripetal",
);
const lookPath = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0.62, 2.2),
    new THREE.Vector3(0, 0.7, 1.2),
    new THREE.Vector3(0, 0.6, 0.5),
    new THREE.Vector3(0, 0.55, 0),
  ],
  false,
  "centripetal",
);

/** Scroll spans for each part of the motion (fractions of the hero's scroll). */
const HOLD_END = 0.06; // a moment on the headlights before anything moves
const PATH_END = 0.72; // camera reaches the whole-car view
const TURN_START = 0.6; // the turn begins as the camera settles, so there is no pause

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Gentle start and finish, steady in the middle. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function sample(p: number) {
  const progress = clamp01(p);
  const along = smooth(clamp01((progress - HOLD_END) / (PATH_END - HOLD_END)));
  return {
    pos: cameraPath.getPointAt(along),
    look: lookPath.getPointAt(along),
    // Lights come up steadily over the first two-thirds of the path.
    light: smooth(clamp01(along / 0.68)),
    turn: easeInOut(clamp01((progress - TURN_START) / (1 - TURN_START))) * Math.PI * 2,
  };
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(220,235,255,0.55)");
  g.addColorStop(1, "rgba(220,235,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

type CarSceneProps = {
  /** Scroll progress through the hero, 0..1, written by the parent on scroll. */
  progressRef: RefObject<number>;
  onReady?: () => void;
  onError?: () => void;
};

/** WebGL scene for the hero: a concept car revealed by the camera as the page scrolls. */
export default function CarScene({ progressRef, onReady, onError }: CarSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      onError?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const background = new THREE.Color("#08101f");
    scene.background = background;
    scene.fog = new THREE.Fog(background, 12, 26);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

    // Floor, soft shadow and lights.
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(30, 64),
      new THREE.MeshStandardMaterial({ color: "#0b1527", roughness: 0.55, metalness: 0.2 }),
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const shadowTex = shadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.005;
    scene.add(shadow);

    const hemi = new THREE.HemisphereLight("#c9d6ff", "#0b1527", 0);
    scene.add(hemi);
    const key = new THREE.SpotLight("#ffffff", 0, 30, 0.6, 0.6, 1.2);
    key.position.set(3, 7, 5);
    scene.add(key, key.target);
    const rimOrange = new THREE.PointLight("#f26a1b", 0, 14, 1.6);
    rimOrange.position.set(-4, 1.6, -3.5);
    scene.add(rimOrange);
    const rimCool = new THREE.PointLight("#6f8fd8", 0, 14, 1.6);
    rimCool.position.set(4.5, 1.4, -3);
    scene.add(rimCool);

    const car = new THREE.Group();
    scene.add(car);

    const glowTex = glowTexture();
    const glows: THREE.Sprite[] = [];
    const beams: THREE.SpotLight[] = [];

    let disposed = false;
    let loaded = false;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // Paint: a smooth colour coat under a glossy clear coat, like real car paint.
        // (The model's own paint is fully metallic with a tiled grain texture, which looks artificial.)
        model.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials as THREE.MeshPhysicalMaterial[]) {
            const name = material.name ?? "";
            if (name.startsWith("Paint 1")) {
              material.color.set(PAINT.color);
              material.metalness = PAINT.metalness;
              material.roughness = PAINT.roughness;
              material.normalMap = null;
              material.clearcoat = 1;
              material.clearcoatRoughness = 0.03;
              material.iridescence = 0;
              material.needsUpdate = true;
            } else if (name.startsWith("Paint 2")) {
              material.color.set("#15171c");
              material.metalness = 0.2;
              material.roughness = 0.45;
              material.normalMap = null;
              material.iridescence = 0;
              material.needsUpdate = true;
            } else if (name.startsWith("Interior 3")) material.color.set("#2a2f3a");
            // Brand-orange brake calipers, seen through the wheel spokes.
            else if (name === "Brake") material.color.set("#f26a1b");
          }
        });

        // Normalise: longest horizontal side becomes the car's length along Z, wheels on the floor.
        let box = new THREE.Box3().setFromObject(model, true);
        let size = box.getSize(new THREE.Vector3());
        if (size.x > size.z) model.rotation.y = Math.PI / 2;
        box = new THREE.Box3().setFromObject(model, true);
        size = box.getSize(new THREE.Vector3());
        const scale = CAR_LENGTH / size.z;
        model.scale.setScalar(scale);
        box = new THREE.Box3().setFromObject(model, true);
        const center = box.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -box.min.y, -center.z);

        // Face the headlights towards +Z.
        const headlights = model.getObjectByName("BodyHeadlights");
        car.add(model);
        if (headlights) {
          const lightsBox = new THREE.Box3().setFromObject(headlights, true);
          if (lightsBox.getCenter(new THREE.Vector3()).z < 0) {
            car.rotation.y = Math.PI;
          }
        }
        car.updateMatrixWorld(true);

        box = new THREE.Box3().setFromObject(car, true);
        size = box.getSize(new THREE.Vector3());
        shadow.scale.set(size.x * 1.6, size.z * 1.25, 1);

        // Glows and floor beams at each headlight.
        const lightsBox = headlights ? new THREE.Box3().setFromObject(headlights, true) : box;
        const lightsSize = lightsBox.getSize(new THREE.Vector3());
        const front = lightsBox.max.z;
        const y = (lightsBox.min.y + lightsBox.max.y) / 2;
        for (const side of [-1, 1]) {
          const x = (lightsBox.min.x + lightsBox.max.x) / 2 + side * lightsSize.x * 0.36;
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: glowTex,
              color: "#dbe7ff",
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              depthTest: false,
              transparent: true,
            }),
          );
          sprite.position.set(x, y, front + 0.02);
          scene.add(sprite);
          glows.push(sprite);

          const beam = new THREE.SpotLight("#e6eeff", 0, 16, 0.42, 0.75, 1.4);
          beam.position.set(x, y, front);
          beam.target.position.set(x * 1.4, 0, front + 7);
          scene.add(beam, beam.target);
          beams.push(beam);
        }

        loaded = true;
        onReady?.();
      },
      undefined,
      () => {
        if (!disposed) onError?.();
      },
    );

    // Size and frame the shot: car to the right of the text on wide screens, above it on tall ones.
    let width = 0;
    let height = 0;
    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      if (width >= 1024) camera.setViewOffset(width, height, -width * 0.2, 0, width, height);
      else camera.setViewOffset(width, height, 0, height * 0.24, width, height);
      camera.updateProjectionMatrix();
      needsRender = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let shown = progressRef.current ?? 0;
    let lastRendered = -1;
    let needsRender = true;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    const render = () => {
      const s = sample(shown);
      // Pull back on tall screens so the car still fits.
      const aspect = camera.aspect || 1;
      const pullBack = aspect < 1.25 ? Math.min(1.25 / aspect, 1.7) : 1;
      camera.position.copy(s.look).add(s.pos.clone().sub(s.look).multiplyScalar(pullBack));
      camera.lookAt(s.look);

      car.rotation.y = (car.userData.base ?? (car.userData.base = car.rotation.y)) + s.turn;
      // Glows and beams belong to the car's nose: hide them while the car is turned away.
      const facing = Math.cos(s.turn);
      const dark = 1 - s.light;

      // Lights come up with the square of the level, so the opening stays truly dark.
      const level = s.light * s.light;
      hemi.intensity = level * 1.1;
      key.intensity = level * 160;
      rimOrange.intensity = s.light * 30;
      rimCool.intensity = level * 18;
      scene.environmentIntensity = 0.003 + level * 0.9;
      for (const glow of glows) {
        const size = 0.55 + dark * 1.1;
        glow.scale.set(size, size * 0.55, 1);
        (glow.material as THREE.SpriteMaterial).opacity = Math.max(facing, 0) * (0.55 + dark * 0.45);
      }
      for (const beam of beams) beam.intensity = (8 + dark * 40) * Math.max(facing, 0);

      renderer.render(scene, camera);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = progressRef.current ?? 0;
      shown += (target - shown) * (1 - Math.pow(0.0015, dt));
      if (Math.abs(target - shown) < 0.0002) shown = target;
      if (loaded && (needsRender || Math.abs(shown - lastRendered) > 0.00005)) {
        render();
        lastRendered = shown;
        needsRender = false;
      }
    };
    resize();
    frame = requestAnimationFrame(tick);

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    visibility.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const materials = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
        for (const material of materials) {
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
          material.dispose();
        }
      });
      glowTex.dispose();
      shadowTex.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef, onReady, onError]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden />;
}
