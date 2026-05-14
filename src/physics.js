import {
  BALL_RADIUS,
  BALL_MAX_SPEED,
  BALL_SPEED_MULTIPLIER,
  MIN_VERTICAL_VEL,
  MAX_DEFLECTION_ANGLE,
} from "./constants.js";

export function ballBoxCollision(ballPos, box) {
  const closestX = Math.max(
    box.x - box.w / 2,
    Math.min(ballPos.x, box.x + box.w / 2),
  );
  const closestY = Math.max(
    box.y - box.h / 2,
    Math.min(ballPos.y, box.y + box.h / 2),
  );
  const closestZ = Math.max(
    box.z - box.d / 2,
    Math.min(ballPos.z, box.z + box.d / 2),
  );
  const dx = ballPos.x - closestX;
  const dy = ballPos.y - closestY;
  const dz = ballPos.z - closestZ;
  const distSq = dx * dx + dy * dy + dz * dz;
  if (distSq >= BALL_RADIUS * BALL_RADIUS) return { hit: false, side: null };

  const halfW = box.w / 2 + BALL_RADIUS;
  const halfH = box.h / 2 + BALL_RADIUS;
  const halfD = box.d / 2 + BALL_RADIUS;
  const ox = halfW - Math.abs(ballPos.x - box.x);
  const oy = halfH - Math.abs(ballPos.y - box.y);
  const oz = halfD - Math.abs(ballPos.z - box.z);

  let side;
  if (ox < oy && ox < oz) {
    side = ballPos.x < box.x ? "left" : "right";
  } else if (oy < oz) {
    side = ballPos.y < box.y ? "bottom" : "top";
  } else {
    side = ballPos.z < box.z ? "back" : "front";
  }
  return { hit: true, side };
}

export function resolveBounce(dir, side, hitPos) {
  if (side === "paddle") {
    const angle = hitPos * MAX_DEFLECTION_ANGLE;
    dir.x = Math.sin(angle);
    dir.y = Math.cos(angle);
    const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    dir.x /= len;
    dir.y /= len;
    return BALL_SPEED_MULTIPLIER;
  }
  if (side === "left" || side === "right") {
    dir.x = -dir.x;
  } else if (side === "top" || side === "bottom") {
    dir.y = -dir.y;
  } else if (side === "front" || side === "back") {
    dir.z = -dir.z;
  }
  return BALL_SPEED_MULTIPLIER;
}

export function enforceMinVertical(dir, speed) {
  if (Math.abs(dir.y) * speed < MIN_VERTICAL_VEL) {
    const sign = dir.y >= 0 ? 1 : -1;
    dir.y = sign * (MIN_VERTICAL_VEL / speed);
    const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    dir.x /= len;
    dir.y /= len;
  }
}

export function clampSpeed(speed) {
  return Math.min(speed, BALL_MAX_SPEED);
}
