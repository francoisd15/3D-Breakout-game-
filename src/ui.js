// HUD — DOM overlay for score, lives, game state messages
// Exports: createUI(), updateUI(score, lives, phase), disposeUI()

import {
  HUD_FONT,
  HUD_FONT_SIZE,
  HUD_COLOR,
  HUD_OVERLAY_FONT_SIZE,
  HUD_OVERLAY_COLOR,
} from "./constants.js";

/** @type {HTMLElement | null} */
let overlay = null;

/** @type {HTMLElement | null} */
let scoreEl = null;

/** @type {HTMLElement | null} */
let livesEl = null;

/** @type {HTMLElement | null} */
let levelEl = null;

/** @type {HTMLElement | null} */
let messageEl = null;

export function createUI() {
  overlay = document.createElement("div");
  overlay.id = "hud-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    font-family: ${HUD_FONT};
    font-size: ${HUD_FONT_SIZE};
    color: ${HUD_COLOR};
    padding: 12px 16px;
    box-sizing: border-box;
    z-index: 10;
  `;

  scoreEl = document.createElement("div");
  scoreEl.id = "score";
  scoreEl.textContent = "Score: 0";
  overlay.appendChild(scoreEl);

  livesEl = document.createElement("div");
  livesEl.id = "lives";
  livesEl.textContent = "Lives: \u2665\u2665\u2665";
  overlay.appendChild(livesEl);

  levelEl = document.createElement("div");
  levelEl.id = "level";
  levelEl.style.cssText = `
    position: absolute;
    top: 12px;
    right: 16px;
    font-family: ${HUD_FONT};
    font-size: ${HUD_FONT_SIZE};
    color: ${HUD_COLOR};
  `;
  levelEl.textContent = "Level: 1";
  overlay.appendChild(levelEl);

  messageEl = document.createElement("div");
  messageEl.id = "message";
  messageEl.style.cssText = `
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: ${HUD_FONT};
    font-size: ${HUD_OVERLAY_FONT_SIZE};
    color: ${HUD_OVERLAY_COLOR};
    text-align: center;
    pointer-events: none;
  `;
  overlay.appendChild(messageEl);

  document.body.appendChild(overlay);
}

let currentLevel = 1;

export function updateUI(score, lives, phase, level) {
  if (!scoreEl || !livesEl || !messageEl || !levelEl) return;

  scoreEl.textContent = "Score: " + score;
  livesEl.textContent = "Lives: " + "\u2665".repeat(Math.max(0, lives));
  if (level !== undefined) {
    currentLevel = level;
    levelEl.textContent = "Level: " + level;
  }

  if (phase === "over") {
    messageEl.style.display = "block";
    messageEl.textContent = "Game Over! Press R to restart";
  } else if (phase === "won") {
    messageEl.style.display = "block";
    const nextLevel = currentLevel + 1;
    messageEl.textContent =
      "Level " + currentLevel + " Complete! Press R for Level " + nextLevel;
  } else {
    messageEl.style.display = "none";
  }
}

export function disposeUI() {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  overlay = null;
  scoreEl = null;
  livesEl = null;
  messageEl = null;
}
