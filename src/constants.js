// Playfield dimensions
export const PLAYFIELD_X = 3.5;
export const PADDLE_Y = -4.0;
export const PADDLE_WIDTH = 1.5;
export const PADDLE_HEIGHT = 0.2;
export const PADDLE_DEPTH = 0.3;
export const BALL_RADIUS = 0.15;
export const BALL_BASE_SPEED = 3.0;
export const BALL_MAX_SPEED = 5.0;
export const BALL_SPEED_MULTIPLIER = 1.05;
export const BALL_DEATH_Y = -5.5;
export const MIN_VERTICAL_VEL = 0.5;

// Brick field
export const BRICK_WIDTH = 0.55;
export const BRICK_HEIGHT = 0.28;
export const BRICK_DEPTH = 0.5;
export const BRICK_GAP = 0.08;
export const BRICK_COLS = 12;
export const BRICK_ROWS = 7;
export const BRICK_FIELD_Y_TOP = 3.2;
export const MAX_DEFLECTION_ANGLE = Math.PI / 3;

// Ball initial direction (already normalized)
export const BALL_INITIAL_DIR_X = 0.5;
export const BALL_INITIAL_DIR_Y = 0.866;

// Row colors — super vibrant, high-saturation rainbow palette
// Row 0 (top): Hot pink
// Row 1: Orange
// Row 2: Yellow
// Row 3: Lime green
// Row 4: Cyan
// Row 5: Royal blue
// Row 6: Magenta purple
export const BRICK_ROW_COLORS = [
  0xff2d78, // hot pink
  0xff6b2d, // bright orange
  0xffd62d, // bright yellow
  0x2dff5a, // lime green
  0x2dd5ff, // bright cyan
  0x2d5aff, // royal blue
  0x9d2dff, // magenta purple
];

// Materials
export const BACKGROUND_COLOR = 0x0a0a12;

// Brighter ambient for more vibrancy
export const AMBIENT_COLOR = 0xffffff;
export const AMBIENT_INTENSITY = 0.55;

// Key: bright warm directional light
export const DIR_LIGHT_COLOR = 0xfff0e0;
export const DIR_LIGHT_INTENSITY = 1.2;
export const DIR_LIGHT_POS = [2.0, 3.0, 3.0];

// Fill: cool blue-white for contrast
export const FILL_LIGHT_COLOR = 0xc0d8ff;
export const FILL_LIGHT_INTENSITY = 0.5;
export const FILL_LIGHT_POS = [-1.5, 1.0, 2.0];

// Rim/back light for dramatic 3D edge lighting
export const RIM_LIGHT_COLOR = 0x8888ff;
export const RIM_LIGHT_INTENSITY = 0.4;
export const RIM_LIGHT_POS = [0, -1.0, -3.0];

// Paddle material — bright silver with a tint
export const PADDLE_COLOR = 0x4a8eff;
export const PADDLE_METALNESS = 0.7;
export const PADDLE_ROUGHNESS = 0.25;

// Ball — bright glowing white
export const BALL_COLOR = 0xffffff;
export const BALL_METALNESS = 0.3;
export const BALL_ROUGHNESS = 0.1;

// HUD
export const HUD_FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
export const HUD_FONT_SIZE = "20px";
export const HUD_COLOR = "#f0ece8";
export const HUD_OVERLAY_FONT_SIZE = "28px";
export const HUD_OVERLAY_COLOR = "#ffffff";

// Camera
export const CAMERA_FOV = 70;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_POS = [0, 0.8, 8.5];

// Game
export const INITIAL_LIVES = 3;
export const POINTS_PER_BRICK = 10;
export const PADDLE_SPEED = 7.0;
export const LEVEL_SPEED_BONUS = 0.5; // extra ball speed per level

// Paddle keyboard move smoothing
export const PADDLE_SMOOTHING = 0.15;
