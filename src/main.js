// Entry point — creates renderer, scene, camera, lights, and owns the game loop

import * as THREE from "three";
import {
  BACKGROUND_COLOR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_POS,
  AMBIENT_COLOR,
  AMBIENT_INTENSITY,
  DIR_LIGHT_COLOR,
  DIR_LIGHT_INTENSITY,
  DIR_LIGHT_POS,
  FILL_LIGHT_COLOR,
  FILL_LIGHT_INTENSITY,
  FILL_LIGHT_POS,
  RIM_LIGHT_COLOR,
  RIM_LIGHT_INTENSITY,
  RIM_LIGHT_POS,
} from "./constants.js";
import { Game } from "./game.js";

let game = null;
/** @type {THREE.WebGLRenderer} */
let renderer;
/** @type {THREE.Scene} */
let scene;
/** @type {THREE.PerspectiveCamera} */
let camera;

let lastTime = 0;

function init() {
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);

  // Camera
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CAMERA_NEAR,
    CAMERA_FAR,
  );
  camera.position.set(CAMERA_POS[0], CAMERA_POS[1], CAMERA_POS[2]);
  camera.lookAt(0, 0, 0);

  // Lights
  const ambient = new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(
    DIR_LIGHT_COLOR,
    DIR_LIGHT_INTENSITY,
  );
  dirLight.position.set(DIR_LIGHT_POS[0], DIR_LIGHT_POS[1], DIR_LIGHT_POS[2]);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(
    FILL_LIGHT_COLOR,
    FILL_LIGHT_INTENSITY,
  );
  fillLight.position.set(
    FILL_LIGHT_POS[0],
    FILL_LIGHT_POS[1],
    FILL_LIGHT_POS[2],
  );
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(
    RIM_LIGHT_COLOR,
    RIM_LIGHT_INTENSITY,
  );
  rimLight.position.set(RIM_LIGHT_POS[0], RIM_LIGHT_POS[1], RIM_LIGHT_POS[2]);
  scene.add(rimLight);

  // Game
  game = new Game(scene);
  game.init(renderer.domElement);

  // Start loop
  lastTime = performance.now();
  requestAnimationFrame(loop);

  // Resize
  window.addEventListener("resize", onResize);
}

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  if (game) {
    game.update(dt);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

init();
