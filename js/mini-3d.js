/* ============================================================
   Thoth & Son — Mini 3D
   Wireframe icosaedro pequeno para heros de páginas internas.
   Sem brain.glb (mais leve). Carregado por páginas que tenham
   um elemento <canvas id="mini-3d">.
   ============================================================ */
import * as THREE from 'three';

const DEV = window.IS_DEV_MODE === true;
const LOG = DEV ? (...a) => console.log('%c[mini-3d]', 'color:#C8A030;font-weight:bold', ...a) : () => {};

function init() {
  const canvas = document.getElementById('mini-3d');
  if (!canvas) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = 0xC8A030;
  const WHITE = 0xF5F5F5;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  scene.add(group);

  // Outer wireframe
  const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })
  ));
  // Vertex dots
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute('position',
    new THREE.Float32BufferAttribute(outerGeo.attributes.position.array, 3));
  group.add(new THREE.Points(
    dotsGeo,
    new THREE.PointsMaterial({ color: WHITE, size: 0.04, transparent: true, opacity: 0.75 })
  ));
  // Inner — opposite rotation
  const innerGeo = new THREE.IcosahedronGeometry(0.95, 1);
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.85 })
  );
  scene.add(inner);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    let w = Math.floor(rect.width), h = Math.floor(rect.height);
    if (w === 0 || h === 0) { w = 240; h = 240; }
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!prefersReduce) {
      group.rotation.y += dt * 0.12;
      group.rotation.x += dt * 0.04;
      inner.rotation.y -= dt * 0.20;
      inner.rotation.x -= dt * 0.07;
    }
    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;
    scene.rotation.y = current.x * 0.4;
    scene.rotation.x = -current.y * 0.3;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  LOG('mini-3d iniciado');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
