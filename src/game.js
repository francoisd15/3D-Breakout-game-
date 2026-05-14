// Game — state machine that owns paddle, ball, bricks, runs physics
// Exports: Game class

import * as THREE from "three";
import {
  createPaddle,
  updatePaddle,
  setPaddleTarget,
  disposePaddle,
} from "./paddle.js";
import { createBall, updateBall, resetBall, disposeBall } from "./ball.js";
import {
  createBrickField,
  getBrickBoxes,
  destroyBrick,
  disposeBrickField,
} from "./bricks.js";
import {
  ballBoxCollision,
  resolveBounce,
  enforceMinVertical,
  clampSpeed,
} from "./physics.js";
import { createUI, updateUI, disposeUI } from "./ui.js";
import { initInput, getInputState, disposeInput } from "./input.js";
import {
  PLAYFIELD_X,
  PADDLE_WIDTH,
  PADDLE_Y,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  BALL_DEATH_Y,
  BALL_INITIAL_DIR_X,
  BALL_INITIAL_DIR_Y,
  BALL_BASE_SPEED,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_DEPTH,
  INITIAL_LIVES,
  POINTS_PER_BRICK,
  PADDLE_SPEED,
  LEVEL_SPEED_BONUS,
  BRICK_COLS,
  BRICK_ROWS,
  BRICK_FIELD_Y_TOP,
} from "./constants.js";

const Phase = Object.freeze({
  READY: "ready",
  PLAYING: "playing",
  OVER: "over",
  WON: "won",
});

export class Game {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.level = 1;
    this.phase = Phase.READY;
    this.ballLaunched = false;
    this.paddle = null;
    this.ball = null;
    this.contourWalls = [];
  }

  init(canvas) {
    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.level = 1;
    this.phase = Phase.READY;
    this.ballLaunched = false;

    this.paddle = createPaddle();
    this.scene.add(this.paddle.mesh);

    this.ball = createBall();
    this.scene.add(this.ball.mesh);
    this.stickBallToPaddle();

    this.createContourWalls();
    createBrickField(this.scene, this.level);

    createUI();
    this.inputState = initInput(canvas);
  }

  createContourWalls() {
    this.disposeContourWalls();
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.4,
      roughness: 0.6,
    });

    // Bottom left and right corner pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x3a3a5a,
      metalness: 0.5,
      roughness: 0.4,
    });

    const wallDepth = 0.2;
    const wallHeight = 0.15;
    const halfField = PLAYFIELD_X;
    const topY = BRICK_FIELD_Y_TOP + 0.3;
    const bottomY = PADDLE_Y - 0.3;
    const sideLen = topY - bottomY;

    const walls = [
      // left wall
      {
        w: wallDepth,
        h: sideLen,
        d: wallDepth,
        x: -halfField - 0.1,
        y: (topY + bottomY) / 2,
        z: 0,
      },
      // right wall
      {
        w: wallDepth,
        h: sideLen,
        d: wallDepth,
        x: halfField + 0.1,
        y: (topY + bottomY) / 2,
        z: 0,
      },
      // top wall
      {
        w: halfField * 2 + 0.4,
        h: wallDepth,
        d: wallDepth,
        x: 0,
        y: topY + 0.1,
        z: 0,
      },
      // bottom wall
      {
        w: halfField * 2 + 0.4,
        h: wallDepth,
        d: wallDepth,
        x: 0,
        y: bottomY - 0.1,
        z: 0,
      },
    ];

    for (const w of walls) {
      const geom = new THREE.BoxGeometry(w.w, w.h, w.d);
      const mesh = new THREE.Mesh(geom, wallMat);
      mesh.position.set(w.x, w.y, w.z);
      this.scene.add(mesh);
      this.contourWalls.push(mesh);
    }

    // Corner pillars
    const pillarSize = 0.2;
    const corners = [
      [-halfField - 0.1, topY + 0.1],
      [halfField + 0.1, topY + 0.1],
      [-halfField - 0.1, bottomY - 0.1],
      [halfField + 0.1, bottomY - 0.1],
    ];
    for (const [cx, cy] of corners) {
      const geom = new THREE.BoxGeometry(pillarSize, pillarSize, pillarSize);
      const mesh = new THREE.Mesh(geom, pillarMat);
      mesh.position.set(cx, cy, 0);
      this.scene.add(mesh);
      this.contourWalls.push(mesh);
    }
  }

  disposeContourWalls() {
    for (const mesh of this.contourWalls) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.contourWalls = [];
  }

  stickBallToPaddle() {
    this.ballLaunched = false;
    this.ball.mesh.position.set(
      this.paddle.mesh.position.x,
      PADDLE_Y + BALL_RADIUS + PADDLE_HEIGHT / 2 + 0.01,
      0.3,
    );
    this.ball.dir.x = BALL_INITIAL_DIR_X;
    this.ball.dir.y = BALL_INITIAL_DIR_Y;
    this.ball.speed = BALL_BASE_SPEED;
  }

  update(dt) {
    const input = getInputState();
    if (!input) return;

    // Handle restart
    if (input.restart) {
      if (this.phase === Phase.OVER || this.phase === Phase.WON) {
        this.reset();
        return;
      }
    }

    // Update paddle from input
    if (input.mouseX !== null) {
      setPaddleTarget(input.mouseX);
    } else if (input.left) {
      const newTarget = this.paddle.mesh.position.x - PADDLE_SPEED * dt;
      setPaddleTarget(newTarget);
    } else if (input.right) {
      const newTarget = this.paddle.mesh.position.x + PADDLE_SPEED * dt;
      setPaddleTarget(newTarget);
    }
    updatePaddle(dt);

    // Stick ball to paddle when in ready phase
    if (!this.ballLaunched) {
      this.ball.mesh.position.x = this.paddle.mesh.position.x;
    }

    // Handle launch (mouse click OR space/enter)
    if (!this.ballLaunched && (input.mouseX !== null || input.launch)) {
      this.ballLaunched = true;
      this.phase = Phase.PLAYING;
    }

    updateUI(this.score, this.lives, this.phase, this.level);

    if (this.phase !== Phase.PLAYING) return;

    // Update ball
    updateBall(dt);

    // Wall collisions
    this.checkWallCollisions();

    // Paddle collision
    this.checkPaddleCollision();

    // Brick collisions
    this.checkBrickCollisions();

    enforceMinVertical(this.ball.dir, this.ball.speed);
    this.ball.speed = clampSpeed(this.ball.speed);

    // Death check
    if (this.ball.mesh.position.y < BALL_DEATH_Y) {
      this.onDeath();
    }

    // Win check
    if (getBrickBoxes().length === 0) {
      this.phase = Phase.WON;
      this.onWin();
    }

    updateUI(this.score, this.lives, this.phase, this.level);
  }

  checkWallCollisions() {
    const pos = this.ball.mesh.position;
    const halfField = PLAYFIELD_X;
    if (pos.x - BALL_RADIUS < -halfField) {
      pos.x = -halfField + BALL_RADIUS;
      this.ball.dir.x = -this.ball.dir.x;
    } else if (pos.x + BALL_RADIUS > halfField) {
      pos.x = halfField - BALL_RADIUS;
      this.ball.dir.x = -this.ball.dir.x;
    }
    const topWallY = BRICK_FIELD_Y_TOP + 0.5;
    if (pos.y + BALL_RADIUS > topWallY) {
      pos.y = topWallY - BALL_RADIUS;
      this.ball.dir.y = -this.ball.dir.y;
    }
  }

  checkPaddleCollision() {
    const pos = this.ball.mesh.position;
    const paddlePos = this.paddle.mesh.position;
    const paddleBox = {
      x: paddlePos.x,
      y: paddlePos.y,
      z: paddlePos.z,
      w: PADDLE_WIDTH + 0.1,
      h: PADDLE_HEIGHT + 0.1,
      d: 0.5,
    };
    const result = ballBoxCollision(pos, paddleBox);
    if (result.hit && this.ball.dir.y < 0) {
      const hitX = Math.max(
        -1,
        Math.min(1, (pos.x - paddlePos.x) / (PADDLE_WIDTH / 2)),
      );
      this.ball.speed *= resolveBounce(this.ball.dir, "paddle", hitX);
      pos.y = paddlePos.y + PADDLE_HEIGHT / 2 + BALL_RADIUS;
    }
  }

  checkBrickCollisions() {
    const pos = this.ball.mesh.position;
    const bricks = getBrickBoxes();
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (!brick.alive) continue;

      const brickBox = {
        x: brick.x,
        y: brick.y,
        z: brick.z,
        w: brick.w,
        h: brick.h,
        d: brick.d,
      };

      const result = ballBoxCollision(pos, brickBox);
      if (result.hit) {
        this.ball.speed *= resolveBounce(this.ball.dir, result.side, 0);
        this.score += POINTS_PER_BRICK;
        destroyBrick(i, this.scene);
        break;
      }
    }
  }

  onDeath() {
    this.lives--;
    if (this.lives <= 0) {
      this.phase = Phase.OVER;
    } else {
      this.phase = Phase.READY;
      this.stickBallToPaddle();
    }
  }

  onWin() {
    this.level++;
    // Reset ball speed to base plus level bonus
    this.ball.speed = BALL_BASE_SPEED + (this.level - 1) * LEVEL_SPEED_BONUS;
    // Regenerate bricks for the next level when the player restarts
    this._nextLevelReady = true;
  }

  reset() {
    const nextLevel = this._nextLevelReady ? this.level : 1;
    const saveLevel = nextLevel;
    this.dispose();
    this._nextLevelReady = false;
    this.level = saveLevel;
    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.phase = Phase.READY;
    this.ballLaunched = false;

    this.paddle = createPaddle();
    this.scene.add(this.paddle.mesh);

    this.ball = createBall();
    this.scene.add(this.ball.mesh);
    this.ball.speed = BALL_BASE_SPEED + (this.level - 1) * LEVEL_SPEED_BONUS;
    this.stickBallToPaddle();

    this.createContourWalls();
    createBrickField(this.scene, this.level);

    createUI();
    this.inputState = initInput(document.querySelector("canvas"));
  }

  dispose() {
    disposeUI();
    disposeInput();
    this.disposeContourWalls();
    if (this.paddle) {
      this.scene.remove(this.paddle.mesh);
      disposePaddle();
    }
    if (this.ball) {
      this.scene.remove(this.ball.mesh);
      disposeBall();
    }
    disposeBrickField();
    this.paddle = null;
    this.ball = null;
  }
}
