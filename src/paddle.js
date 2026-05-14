// Paddle class — manages paddle mesh and input
// Exports: createPaddle(), updatePaddle(), resetPaddle(), setPaddleTarget(), disposePaddle()

import * as THREE from "three";
import {
  PLAYFIELD_X,
  PADDLE_Y,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_DEPTH,
  PADDLE_COLOR,
  PADDLE_METALNESS,
  PADDLE_ROUGHNESS,
  PADDLE_SMOOTHING,
} from "./constants.js";

/** @type {{ mesh: THREE.Mesh, targetX: number } | null} */
let paddle = null;

export function createPaddle() {
  const geometry = new THREE.BoxGeometry(
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_DEPTH,
  );
  const material = new THREE.MeshStandardMaterial({
    color: PADDLE_COLOR,
    metalness: PADDLE_METALNESS,
    roughness: PADDLE_ROUGHNESS,
    emissive: PADDLE_COLOR,
    emissiveIntensity: 0.08,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, PADDLE_Y, 0);

  paddle = {
    mesh,
    targetX: 0,
  };

  return paddle;
}

export function setPaddleTarget(x) {
  if (!paddle) return;
  paddle.targetX = x;
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function updatePaddle(dt) {
  if (!paddle) return;

  const maxX = PLAYFIELD_X - PADDLE_WIDTH / 2;
  paddle.targetX = clamp(paddle.targetX, -maxX, maxX);

  // Smooth interpolation toward target
  paddle.mesh.position.x +=
    (paddle.targetX - paddle.mesh.position.x) * PADDLE_SMOOTHING;
}

export function resetPaddle() {
  if (!paddle) return;

  paddle.mesh.position.x = 0;
  paddle.targetX = 0;
}

export function disposePaddle() {
  if (!paddle) return;

  paddle.mesh.geometry.dispose();
  paddle.mesh.material.dispose();
  paddle = null;
}
