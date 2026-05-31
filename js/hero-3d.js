/* ============================================================
   Thoth & Son — Hero 3D
   Wireframe icosaedros + cabeça humana, parallax via cursor
   ES Module (importmap em default.html)
   ============================================================ */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const DEV = (typeof window !== 'undefined') && window.IS_DEV_MODE === true;
const LOG = DEV ? (...a) => console.log('%c[hero-3d]', 'color:#C8A030;font-weight:bold', ...a) : () => {};
const ERR = (...a) => console.error('[hero-3d]', ...a);

function init() {
  const canvas = document.getElementById('hero-3d');
  if (!canvas) { ERR('canvas #hero-3d não encontrado'); return; }

  LOG('THREE', THREE.REVISION, '— canvas OK');

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = 0xC8A030;
  const WHITE = 0xF5F5F5;

  // ── Scene ────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
  } catch (e) { ERR('WebGL falhou:', e); return; }

  const group = new THREE.Group();
  scene.add(group);

  // ── Outer icosahedron (largo) ───────────────────────────────
  const outerGroup = new THREE.Group();
  group.add(outerGroup);

  const outerGeo = new THREE.IcosahedronGeometry(3.4, 2);
  outerGroup.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.50 })
  ));
  // pontos brancos nos vértices externos
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(outerGeo.attributes.position.array, 3));
  outerGroup.add(new THREE.Points(
    dotsGeo,
    new THREE.PointsMaterial({ color: WHITE, size: 0.05, transparent: true, opacity: 0.75 })
  ));

  // ── Inner icosahedron (médio) ───────────────────────────────
  const innerGroup = new THREE.Group();
  group.add(innerGroup);

  const innerGeo = new THREE.IcosahedronGeometry(2.4, 1);
  innerGroup.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.85 })
  ));

  // ── Brain (GLB real) ────────────────────────────────────────
  const brainGroup = new THREE.Group();
  group.add(brainGroup);

  const loader = new GLTFLoader();
  // Luz: ambient quase total para manter o branco branco; key light dá só uma
  // diferenciação sutil de planos sem escurecer o material
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.30);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  loader.load('/assets/models/brain.glb', (gltf) => {  // sem callback de progresso
    const brain = gltf.scene;

    brain.traverse((obj) => {
      if (obj.isMesh && obj.geometry) {
        // Superfície branca: Lambert + emissive forte para garantir brilho real
        obj.material = new THREE.MeshLambertMaterial({
          color: 0xF8F8F8,       // branco quase puro
          emissive: 0xE0E0E0,
          emissiveIntensity: 0.55,
        });

        // Arestas pronunciadas (sulcos)
        const edges = new THREE.EdgesGeometry(obj.geometry, 18);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xF0A8A8,         // rosa suave (vermelho lavado em branco)
          transparent: true,
          opacity: 0.90,
        });
        const lines = new THREE.LineSegments(edges, lineMat);
        obj.add(lines);
      }
    });

    // Wrapper que recebe rotação artística sem afetar o cálculo do bounding box
    const orient = new THREE.Group();
    orient.add(brain);

    // Centralizar baseado no bounding box do mesh original (antes de rotacionar)
    const box = new THREE.Box3().setFromObject(brain);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    brain.position.sub(center);   // mesh agora pivota no seu próprio centro

    // Vista lateral: rotacionar 90° em Y para mostrar o perfil (mais reconhecível)
    // e leve inclinação em X para dar dinamismo
    orient.rotation.y = Math.PI / 2;
    orient.rotation.x = -0.15;

    // Escala uniforme baseada na maior dimensão após orientação
    const targetSize = 2.2;
    const scale = targetSize / Math.max(size.x, size.y, size.z);
    orient.scale.setScalar(scale);

    brainGroup.add(orient);

    LOG('cérebro carregado — escala', scale.toFixed(3),
        'dims:', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2));
  }, undefined, (err) => {
    ERR('falha ao carregar brain.glb:', err);
  });

  // ── Resize ──────────────────────────────────────────────────
  function resize() {
    const rect = canvas.getBoundingClientRect();
    let w = Math.floor(rect.width), h = Math.floor(rect.height);
    if (w === 0 || h === 0) { w = 400; h = 400; }
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Mouse parallax ──────────────────────────────────────────
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // Scroll fade
  function updateFade() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const heroH = rect.height || 1;
    const passed = Math.max(0, -rect.top);
    const fade = Math.max(0, 1 - (passed / heroH) * 1.4);
    canvas.style.opacity = fade.toFixed(3);
  }
  window.addEventListener('scroll', updateFade, { passive: true });

  // ── Loop ────────────────────────────────────────────────────
  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!prefersReduce) {
      // Auto-rotation: cada camada em velocidade diferente
      outerGroup.rotation.y += dt * 0.08;
      outerGroup.rotation.x += dt * 0.03;
      innerGroup.rotation.y -= dt * 0.14;
      innerGroup.rotation.x -= dt * 0.05;
      brainGroup.rotation.y += dt * 0.10;
      brainGroup.rotation.x += dt * 0.02;
    }

    // Parallax suave no grupo inteiro
    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;
    group.rotation.y = current.x * 0.6;
    group.rotation.x = -current.y * 0.4;

    // Cérebro responde mais ao cursor (núcleo mais sensível)
    brainGroup.rotation.x += -current.y * 0.002;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  LOG('loop iniciado');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
