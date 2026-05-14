import * as THREE from "three";
import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_DEPTH,
  BRICK_GAP,
  BRICK_COLS,
  BRICK_ROWS,
  BRICK_FIELD_Y_TOP,
  BRICK_ROW_COLORS,
} from "./constants.js";

let brickGroup = null;
let activeBricks = [];

export function createBrickField(scene, level) {
  disposeBrickField();
  brickGroup = new THREE.Group();
  activeBricks = [];

  const extraRows = Math.min((level || 1) - 1, 3); // max 3 extra rows at higher levels
  const totalRows = BRICK_ROWS + extraRows;
  const colorsLen = BRICK_ROW_COLORS.length;

  const totalW = BRICK_COLS * (BRICK_WIDTH + BRICK_GAP) - BRICK_GAP;
  const startX = -totalW / 2 + BRICK_WIDTH / 2;
  const startY = BRICK_FIELD_Y_TOP;

  for (let row = 0; row < totalRows; row++) {
    const colorIdx = row % colorsLen;
    for (let col = 0; col < BRICK_COLS; col++) {
      const x = startX + col * (BRICK_WIDTH + BRICK_GAP);
      const y = startY - row * (BRICK_HEIGHT + BRICK_GAP);

      // Main brick body
      const geom = new THREE.BoxGeometry(
        BRICK_WIDTH,
        BRICK_HEIGHT,
        BRICK_DEPTH,
      );
      const mat = new THREE.MeshStandardMaterial({
        color: BRICK_ROW_COLORS[colorIdx],
        metalness: 0.2,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, 0);

      // Brick edge rim for 3D prominence
      const edgeGeom = new THREE.EdgesGeometry(geom);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
      });
      const edgeLine = new THREE.LineSegments(edgeGeom, edgeMat);
      edgeLine.position.copy(mesh.position);

      scene.add(mesh);
      scene.add(edgeLine);
      activeBricks.push({
        mesh,
        edgeLine,
        x,
        y,
        z: 0,
        w: BRICK_WIDTH,
        h: BRICK_HEIGHT,
        d: BRICK_DEPTH,
        alive: true,
      });
    }
  }
}

export function getBrickBoxes() {
  return activeBricks;
}

export function destroyBrick(index, scene) {
  const brick = activeBricks[index];
  if (!brick) return;
  brick.alive = false;
  if (scene) {
    scene.remove(brick.mesh);
    scene.remove(brick.edgeLine);
  }
  brick.mesh.geometry.dispose();
  brick.mesh.material.dispose();
  if (brick.edgeLine) {
    brick.edgeLine.geometry.dispose();
    brick.edgeLine.material.dispose();
  }
  activeBricks.splice(index, 1);
}

export function disposeBrickField() {
  for (const brick of activeBricks) {
    if (brick.mesh.parent) brick.mesh.parent.remove(brick.mesh);
    if (brick.edgeLine && brick.edgeLine.parent)
      brick.edgeLine.parent.remove(brick.edgeLine);
    brick.mesh.geometry.dispose();
    brick.mesh.material.dispose();
    if (brick.edgeLine) {
      brick.edgeLine.geometry.dispose();
      brick.edgeLine.material.dispose();
    }
  }
  if (brickGroup && brickGroup.parent) brickGroup.parent.remove(brickGroup);
  brickGroup = null;
  activeBricks = [];
}
