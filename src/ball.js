// Ball class — manages ball mesh, state, movement
// Exports: createBall(), updateBall(), resetBall(), disposeBall()

import * as THREE from "three";
import {
  BALL_RADIUS,
  BALL_BASE_SPEED,
  BALL_INITIAL_DIR_X,
  BALL_INITIAL_DIR_Y,
  PADDLE_Y,
  PADDLE_HEIGHT,
  BALL_COLOR,
  BALL_METALNESS,
  BALL_ROUGHNESS,
} from "./constants.js";

/** @type {{ mesh: THREE.Mesh, dir: { x: number, y: number }, speed: number } | null} */
let ball = null;

export function createBall() {
  const geometry = new THREE.SphereGeometry(BALL_RADIUS, 24, 16);
  const material = new THREE.MeshStandardMaterial({
    color: BALL_COLOR,
    metalness: BALL_METALNESS,
    roughness: BALL_ROUGHNESS,
    emissive: BALL_COLOR,
    emissiveIntensity: 0.15,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0.3;

  ball = {
    mesh,
    dir: { x: 0, y: 0 },
    speed: BALL_BASE_SPEED,
  };

  resetBall();
  return ball;
}

export function updateBall(dt) {
  if (!ball) return;

  ball.mesh.position.x += ball.dir.x * ball.speed * dt;
  ball.mesh.position.y += ball.dir.y * ball.speed * dt;
  // z remains 0 for gameplay
}

export function resetBall() {
  if (!ball) return;

  ball.mesh.position.set(
    0,
    PADDLE_Y + BALL_RADIUS + PADDLE_HEIGHT / 2 + 0.01,
    0.3,
  );
  ball.dir.x = BALL_INITIAL_DIR_X;
  ball.dir.y = BALL_INITIAL_DIR_Y;
  ball.speed = BALL_BASE_SPEED;
}

export function disposeBall() {
  if (!ball) return;

  ball.mesh.geometry.dispose();
  ball.mesh.material.dispose();
  ball = null;
}
