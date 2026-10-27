import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface CarController {
  setPaint: (hex: number) => void;
  nudge: (dir: number) => void;
  destroy: () => void;
}

export async function mountCar(
  container: HTMLElement,
  modelUrl: string,
  initialHex: number
): Promise<CarController> {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: !isCoarsePointer,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarsePointer ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  let animFrameId = 0;
  let isIntersecting = true;
  let isRendering = false;

  const scene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  const light1 = new THREE.DirectionalLight(0xffffff, 1.6);
  light1.position.set(-4, 3, -5);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.1);
  light2.position.set(4, 5, 4);
  scene.add(light2);

  // Initialize MeshoptDecoder
  if (MeshoptDecoder.ready) {
    await MeshoptDecoder.ready;
  }
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const gltf = await loader.loadAsync(modelUrl);
  const loadedScene = gltf.scene;

  const box = new THREE.Box3().setFromObject(loadedScene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  loadedScene.position.sub(center);
  loadedScene.position.y += size.y / 2 - size.y * 0.04;

  const carGroup = new THREE.Group();
  carGroup.add(loadedScene);
  scene.add(carGroup);

  const carSizeRadius = Math.max(size.x, size.z) * 0.62;
  const carCenterY = size.y;

  let paintMaterial: THREE.MeshStandardMaterial | null = null;
  loadedScene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.material) {
      const mat = mesh.material as THREE.Material;
      if (mat.name === 'Paint_Color') {
        paintMaterial = mat as THREE.MeshStandardMaterial;
      }
    }
  });

  const setPaint = (hex: number) => {
    if (paintMaterial) {
      paintMaterial.color.setHex(hex);
      paintMaterial.metalness = 0.6;
      paintMaterial.roughness = 0.28;
      paintMaterial.needsUpdate = true;
      requestFrame();
    }
  };

  setPaint(initialHex);

  // Orbit & interaction state
  let rotY = -0.62;
  let velocity = 0;
  let isPointerDown = false;
  let lastClientX = 0;
  let lastTime = 0;
  let lastInteractionTime = performance.now();
  const idleSpeed = prefersReducedMotion ? 0 : 0.0016;

  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y';

  function renderFrame() {
    isRendering = false;
    if (!isPointerDown) {
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.0002) velocity = 0;
      rotY += velocity;
      if (performance.now() - lastInteractionTime > 2200) {
        rotY += idleSpeed;
      }
    }
    carGroup.rotation.y = rotY;
    renderer.render(scene, camera);

    if ((isPointerDown || velocity !== 0 || idleSpeed > 0) && isIntersecting && !document.hidden) {
      isRendering = true;
      animFrameId = requestAnimationFrame(renderFrame);
    }
  }

  function requestFrame() {
    if (!isRendering && isIntersecting && !document.hidden) {
      isRendering = true;
      animFrameId = requestAnimationFrame(renderFrame);
    } else {
      renderer.render(scene, camera);
    }
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const distW = (carSizeRadius * 0.62) / Math.tan(fovRad / 2);
    const distH = (carSizeRadius * 0.98) / (Math.tan(fovRad / 2) * camera.aspect);
    const dist = Math.max(distW, distH);
    camera.position.set(0, dist * 0.24, dist);
    camera.lookAt(0, carCenterY * 0.38, 0);
    camera.updateProjectionMatrix();
    requestFrame();
  }

  const onPointerDown = (e: PointerEvent) => {
    isPointerDown = true;
    lastClientX = e.clientX;
    lastTime = performance.now();
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
    container.classList.add('grabbing');
    requestFrame();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    const now = performance.now();
    const deltaX = (e.clientX - lastClientX) * 0.0085;
    rotY += deltaX;
    velocity = (deltaX / Math.max(1, now - lastTime)) * 16;
    lastClientX = e.clientX;
    lastTime = now;
  };

  const onPointerUp = () => {
    isPointerDown = false;
    lastInteractionTime = performance.now();
    container.classList.remove('grabbing');
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  const observer = new IntersectionObserver(([entry]) => {
    isIntersecting = entry.isIntersecting;
    if (isIntersecting) requestFrame();
  });
  observer.observe(container);

  const onVisibilityChange = () => {
    if (!document.hidden) requestFrame();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  resize();
  requestFrame();

  return {
    setPaint,
    nudge(dir: number) {
      velocity = dir * (prefersReducedMotion ? 0 : 0.06);
      if (prefersReducedMotion) rotY += dir * 0.6;
      lastInteractionTime = performance.now();
      requestFrame();
    },
    destroy() {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);

      loadedScene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => {
            Object.values(mat).forEach((val) => {
              if (val instanceof THREE.Texture) val.dispose();
            });
            mat.dispose();
          });
        }
      });

      envTexture.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

