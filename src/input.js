// Input handling — mouse and keyboard
// Exports: initInput(), getInputState(), disposeInput()

import { PLAYFIELD_X, PADDLE_WIDTH } from "./constants.js";

/** @type {{ mouseX: number | null, restart: boolean, left: boolean, right: boolean, launch: boolean } | null} */
let inputState = null;

/** @type {Set<string>} */
let keysDown = null;

/** @type {HTMLElement | null} */
let canvasEl = null;

let restartFlag = false;
let launchFlag = false;

function onMouseMove(e) {
  const rect = canvasEl.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  inputState.mouseX = x * PLAYFIELD_X;
}

function onTouchMove(e) {
  e.preventDefault();
  const rect = canvasEl.getBoundingClientRect();
  const touch = e.touches[0];
  const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
  inputState.mouseX = x * PLAYFIELD_X;
}

function onKeyDown(e) {
  keysDown.add(e.key);
  if (e.key === "r" || e.key === "R") {
    restartFlag = true;
  }
  if (e.key === " " || e.key === "Enter") {
    launchFlag = true;
  }
}

function onKeyUp(e) {
  keysDown.delete(e.key);
}

export function initInput(canvas) {
  canvasEl = canvas;
  keysDown = new Set();
  restartFlag = false;

  inputState = {
    mouseX: null,
    restart: false,
    left: false,
    right: false,
    launch: false,
  };

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return inputState;
}

export function getInputState() {
  if (!inputState) return null;
  inputState.left =
    keysDown.has("ArrowLeft") || keysDown.has("a") || keysDown.has("A");
  inputState.right =
    keysDown.has("ArrowRight") || keysDown.has("d") || keysDown.has("D");
  inputState.restart = restartFlag;
  restartFlag = false;
  inputState.launch = launchFlag;
  launchFlag = false;
  return inputState;
}

export function disposeInput() {
  if (!canvasEl) return;
  canvasEl.removeEventListener("mousemove", onMouseMove);
  canvasEl.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  canvasEl = null;
  keysDown = null;
  inputState = null;
}
