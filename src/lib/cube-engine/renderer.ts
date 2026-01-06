/**
 * 2D Cube Renderer
 * Renders cube state as SVG flat net diagram
 */

import type { CubeState, FaceState, FaceColor, FaceName } from "@/src/types/cube";

/**
 * Color mapping for cube faces (hex values)
 */
export const COLOR_MAP: Record<FaceColor, string> = {
  white: "#FFFFFF",
  yellow: "#FFD500",
  green: "#009B48",
  blue: "#0051BA",
  red: "#B71234",
  orange: "#FF5800",
};

/**
 * Render options for SVG cube
 */
export interface RenderOptions {
  stickerSize?: number;
  stickerGap?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  /** Grayscale non-yellow stickers (for OLL cases) */
  grayscaleNonYellow?: boolean;
}

/**
 * Default render options
 */
const DEFAULT_OPTIONS: Required<RenderOptions> = {
  stickerSize: 30,
  stickerGap: 2,
  borderWidth: 1,
  borderColor: "#000000",
  backgroundColor: "#F3F4F6", // gray-100
  grayscaleNonYellow: false,
};

/**
 * Face layout in the net (cross pattern)
 * 
 *       [U]
 *   [L] [F] [R] [B]
 *       [D]
 */
interface FaceLayout {
  face: FaceName;
  x: number;
  y: number;
}

/**
 * Calculate face positions in the net
 */
function getFaceLayouts(
  stickerSize: number,
  gap: number
): FaceLayout[] {
  const faceSize = stickerSize * 3 + gap * 2;
  const spacing = faceSize + gap * 2;

  return [
    { face: "U" as FaceName, x: spacing, y: 0 },
    { face: "L" as FaceName, x: 0, y: spacing },
    { face: "F" as FaceName, x: spacing, y: spacing },
    { face: "R" as FaceName, x: spacing * 2, y: spacing },
    { face: "B" as FaceName, x: spacing * 3, y: spacing },
    { face: "D" as FaceName, x: spacing, y: spacing * 2 },
  ];
}

/**
 * Render a single sticker (3x3 grid position)
 */
function renderSticker(
  color: FaceColor,
  x: number,
  y: number,
  size: number,
  options: Required<RenderOptions>
): string {
  let fill = COLOR_MAP[color];
  
  // Apply grayscale effect for non-yellow colors if option is enabled
  if (options.grayscaleNonYellow && color !== 'yellow') {
    fill = "#9CA3AF"; // gray-400
  }
  
  const stroke = options.borderColor;
  const strokeWidth = options.borderWidth;

  return `<rect
    x="${x}"
    y="${y}"
    width="${size}"
    height="${size}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    rx="2"
  />`;
}

/**
 * Render a face label (for debugging/reference)
 */
function renderFaceLabel(
  faceName: FaceName,
  x: number,
  y: number,
  faceSize: number
): string {
  const centerX = x + faceSize / 2;
  const centerY = y - 5;

  return `<text
    x="${centerX}"
    y="${centerY}"
    text-anchor="middle"
    font-family="monospace"
    font-size="12"
    font-weight="bold"
    fill="#6B7280"
  >${faceName}</text>`;
}

/**
 * Render a single face (3x3 grid of stickers)
 */
function renderFace(
  face: FaceState,
  faceName: FaceName,
  x: number,
  y: number,
  options: Required<RenderOptions>,
  showLabels: boolean = false
): string {
  const { stickerSize, stickerGap } = options;
  const stickers: string[] = [];

  // Render 3x3 grid of stickers
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const color = face[index];
      const stickerX = x + col * (stickerSize + stickerGap);
      const stickerY = y + row * (stickerSize + stickerGap);

      stickers.push(renderSticker(color, stickerX, stickerY, stickerSize, options));
    }
  }

  // Add face label if requested
  const faceSize = stickerSize * 3 + stickerGap * 2;
  const label = showLabels ? renderFaceLabel(faceName, x, y, faceSize) : "";

  return label + stickers.join("\n");
}

/**
 * Render complete cube state as SVG string
 */
export function renderCubeSVG(
  state: CubeState,
  options: RenderOptions = {},
  showLabels: boolean = false
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { stickerSize, stickerGap, backgroundColor } = opts;

  const faceLayouts = getFaceLayouts(stickerSize, stickerGap);
  const faceSize = stickerSize * 3 + stickerGap * 2;
  const spacing = faceSize + stickerGap * 2;

  // Calculate SVG dimensions (4 faces wide, 3 faces tall)
  const width = spacing * 4 + stickerGap * 2;
  const height = spacing * 3 + stickerGap * 2;
  const padding = 20;

  // Render all faces
  const faces = faceLayouts.map((layout) =>
    renderFace(
      state[layout.face],
      layout.face,
      layout.x + padding,
      layout.y + padding + (showLabels ? 15 : 0),
      opts,
      showLabels
    )
  );

  // Assemble SVG
  return `<svg
    width="${width + padding * 2}"
    height="${height + padding * 2 + (showLabels ? 30 : 0)}"
    viewBox="0 0 ${width + padding * 2} ${height + padding * 2 + (showLabels ? 30 : 0)}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="100%"
      height="100%"
      fill="${backgroundColor}"
    />
    ${faces.join("\n")}
  </svg>`;
}

/**
 * Render only the top face (useful for thumbnails)
 */
export function renderTopFaceSVG(
  state: CubeState,
  options: RenderOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { stickerSize, stickerGap, backgroundColor } = opts;
  const faceSize = stickerSize * 3 + stickerGap * 2;
  const padding = 10;

  const face = renderFace(state.U, "U", padding, padding, opts, false);

  return `<svg
    width="${faceSize + padding * 2}"
    height="${faceSize + padding * 2}"
    viewBox="0 0 ${faceSize + padding * 2} ${faceSize + padding * 2}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="100%"
      height="100%"
      fill="${backgroundColor}"
    />
    ${face}
  </svg>`;
}

/**
 * Render OLL/PLL case view (top face + orientation indicators)
 */
export function renderCaseViewSVG(
  state: CubeState,
  options: RenderOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options, stickerSize: 20 };
  const { stickerSize, stickerGap, backgroundColor } = opts;
  const faceSize = stickerSize * 3 + stickerGap * 2;
  const edgeSize = stickerSize; // Single row/column thickness
  const padding = 10;
  const spacing = 4; // Gap between center face and edges
  
  // Layout (cross pattern):
  //        [B]
  //    [L] [U] [R]
  //        [F]
  
  // Center: Top face (U)
  const centerX = padding + edgeSize + spacing;
  const centerY = padding + edgeSize + spacing;
  const topFace = renderFace(state.U, "U", centerX, centerY, opts, false);
  
  // Top: Back face top row (above U)
  const backX = centerX;
  const backY = padding;
  const backRow = renderAdjacentStickers(state.B, 'B', backX, backY, opts);
  
  // Left: Left face right column (left of U)
  const leftX = padding;
  const leftY = centerY;
  const leftCol = renderAdjacentStickers(state.L, 'L', leftX, leftY, opts);
  
  // Right: Right face left column (right of U)
  const rightX = centerX + faceSize + spacing;
  const rightY = centerY;
  const rightCol = renderAdjacentStickers(state.R, 'R', rightX, rightY, opts);
  
  // Bottom: Front face top row (below U)
  const frontX = centerX;
  const frontY = centerY + faceSize + spacing;
  const frontRow = renderAdjacentStickers(state.F, 'F', frontX, frontY, opts);

  // Calculate SVG dimensions
  const width = padding * 2 + edgeSize + spacing + faceSize + spacing + edgeSize;
  const height = padding * 2 + edgeSize + spacing + faceSize + spacing + edgeSize;

  return `<svg
    width="${width}"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="100%"
      height="100%"
      fill="${backgroundColor}"
    />
    ${topFace}
    ${backRow}
    ${leftCol}
    ${rightCol}
    ${frontRow}
  </svg>`;
}

/**
 * Render the 3 stickers from a face that are adjacent to the U face.
 * All faces (F, B, L, R) share their top row (indices 0, 1, 2) with the U face.
 * F/B faces render horizontally, L/R faces render vertically.
 * R/B faces need reversed order (2, 1, 0) due to their orientation.
 */
function renderAdjacentStickers(
  face: FaceState,
  faceName: 'F' | 'B' | 'L' | 'R',
  x: number,
  y: number,
  options: Required<RenderOptions>
): string {
  const { stickerSize, stickerGap } = options;
  const stickers: string[] = [];
  const isHorizontal = faceName === 'F' || faceName === 'B';
  const shouldReverse = faceName === 'R' || faceName === 'B';
  
  // All adjacent faces share their top row with U face
  for (let i = 0; i < 3; i++) {
    const index = shouldReverse ? 2 - i : i; // Reverse for Right and Back
    const color = face[index];
    const stickerX = isHorizontal ? x + i * (stickerSize + stickerGap) : x;
    const stickerY = isHorizontal ? y : y + i * (stickerSize + stickerGap);
    stickers.push(renderSticker(color, stickerX, stickerY, stickerSize, options));
  }

  return stickers.join("\n");
}

/**
 * Render cube state as ASCII text net (for debugging/testing)
 * 
 * Renders the cube in cross/net pattern:
 *       [U]
 *   [L] [F] [R] [B]
 *       [D]
 * 
 * Each face is shown as a 3x3 grid using first letter of color:
 * W = white, Y = yellow, G = green, B = blue, R = red, O = orange
 * 
 * Example output:
 * ```
 *     WWW
 *     WWW
 *     WWW
 * OOO GGG RRR BBB
 * OOO GGG RRR BBB
 * OOO GGG RRR BBB
 *     YYY
 *     YYY
 *     YYY
 * ```
 * 
 * @param state - CubeState to render
 * @returns String representation in cross/net pattern
 */
export function renderCubeNet(state: CubeState): string {
  const colorInitial = (c: FaceColor): string => c[0].toUpperCase();
  
  // Helper to render a face as a 3x3 grid
  const faceRow = (face: FaceState, row: number): string => {
    const start = row * 3;
    return colorInitial(face[start]) + colorInitial(face[start + 1]) + colorInitial(face[start + 2]);
  };
  
  // Build the net pattern
  const lines: string[] = [];
  
  // Top face (U) - indented with 4 spaces
  for (let row = 0; row < 3; row++) {
    lines.push(`    ${faceRow(state.U, row)}`);
  }
  
  // Middle row: L F R B (side by side)
  for (let row = 0; row < 3; row++) {
    const l = faceRow(state.L, row);
    const f = faceRow(state.F, row);
    const r = faceRow(state.R, row);
    const b = faceRow(state.B, row);
    lines.push(`${l} ${f} ${r} ${b}`);
  }
  
  // Bottom face (D) - indented with 4 spaces
  for (let row = 0; row < 3; row++) {
    lines.push(`    ${faceRow(state.D, row)}`);
  }
  
  return lines.join('\n');
}

/**
 * 3D Isometric Renderer
 * Renders cube in isometric 3D view using SVG
 */

/**
 * 3D Render options
 */
export interface Render3DOptions extends RenderOptions {
  view?: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
}

/**
 * 2D Point
 */
interface Point2D {
  x: number;
  y: number;
}

/**
 * 3D Point
 */
interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Convert 3D point to 2D isometric projection with minimal perspective
 * Using mostly isometric with tiny perspective hint
 */
function projectIsometric(p: Point3D): Point2D {
  // Apply isometric projection angles first
  const cos30 = Math.sqrt(3) / 2; // ~0.866
  const sin30 = 0.5;
  
  // Add just 2% perspective based on Z depth
  // Positive Z (front) = larger, Negative Z (back) = smaller
  const perspectiveAmount = 0.02;
  const scale = 1 + (p.z * perspectiveAmount);
  
  return {
    x: (p.x - p.z) * cos30 * scale,
    y: (-p.y + (p.x + p.z) * sin30) * scale,
  };
}

/**
 * Rotate 3D point around Y axis (for different view angles)
 */
function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos + p.z * sin,
    y: p.y,
    z: -p.x * sin + p.z * cos,
  };
}

/**
 * Rotate 3D point around X axis
 */
function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * cos - p.z * sin,
    z: p.y * sin + p.z * cos,
  };
}

/**
 * Rotate 3D point around Z axis
 */
function rotateZ(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos,
    z: p.z,
  };
}

/**
 * Apply view rotation to point
 */
function applyViewRotation(p: Point3D, view: string): Point3D {
  const PI = Math.PI;
  switch (view) {
    case 'front':
      return p; // Default view (Front face visible)
    case 'back':
      return rotateY(p, PI); // 180° around Y
    case 'right':
      return rotateY(p, -PI / 2); // -90° around Y
    case 'left':
      return rotateY(p, PI / 2); // 90° around Y
    case 'top':
      return rotateX(p, -PI / 2); // -90° around X
    case 'bottom':
      return rotateX(p, PI / 2); // 90° around X
    default:
      return p;
  }
}

/**
 * Calculate face normal vector (for visibility check)
 */
function getFaceNormal(face: string, view: string): Point3D {
  const normals: Record<string, Point3D> = {
    U: { x: 0, y: 1, z: 0 },   // Up
    D: { x: 0, y: -1, z: 0 },  // Down
    F: { x: 0, y: 0, z: 1 },   // Front
    B: { x: 0, y: 0, z: -1 },  // Back
    L: { x: -1, y: 0, z: 0 },  // Left
    R: { x: 1, y: 0, z: 0 },   // Right
  };
  
  const normal = normals[face];
  return applyViewRotation(normal, view);
}

/**
 * Check if face is visible from camera (backface culling)
 * In isometric view, camera looks from above and to the front-right
 * A face is visible if its normal points generally toward the camera
 */
function isFaceVisible(face: string, view: string): boolean {
  const normal = getFaceNormal(face, view);
  
  // For isometric view looking from front-right-top angle
  // Camera is positioned at approximately (1, 1, 1) looking toward origin
  // So camera direction (toward camera) is roughly (1, 1, 1) normalized
  const cameraDir = { x: 0.577, y: 0.577, z: 0.577 }; // normalized (1,1,1)
  const dotProduct = normal.x * cameraDir.x + normal.y * cameraDir.y + normal.z * cameraDir.z;
  
  // Face is visible if it's facing toward the camera (positive dot product)
  return dotProduct > 0.01;
}

/**
 * Get Z-depth for face (for sorting)
 */
function getFaceDepth(face: string, view: string): number {
  const center = getFaceCenter(face);
  const rotated = applyViewRotation(center, view);
  return rotated.z;
}

/**
 * Get center position of a face in 3D space
 */
function getFaceCenter(face: string): Point3D {
  const centers: Record<string, Point3D> = {
    U: { x: 0, y: 1.5, z: 0 },
    D: { x: 0, y: -1.5, z: 0 },
    F: { x: 0, y: 0, z: 1.5 },
    B: { x: 0, y: 0, z: -1.5 },
    L: { x: -1.5, y: 0, z: 0 },
    R: { x: 1.5, y: 0, z: 0 },
  };
  return centers[face];
}

/**
 * Render a 3x3 face in isometric view
 */
function render3DFace(
  face: FaceState,
  faceName: FaceName,
  view: string,
  stickerSize: number,
  options: Required<RenderOptions>
): string {
  if (!isFaceVisible(faceName, view)) {
    return ''; // Skip backfaces
  }

  const stickers: string[] = [];
  const { stickerGap } = options;
  
  // Calculate 3D positions for each sticker
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const color = face[index];
      
      // Get 3D position based on face
      const pos3D = getSticker3DPosition(faceName, row, col);
      const rotated = applyViewRotation(pos3D, view);
      const pos2D = projectIsometric(rotated);
      
      // Get sticker quad corners in 3D
      const corners3D = getStickerCorners(faceName, row, col);
      const corners2D = corners3D
        .map(p => applyViewRotation(p, view))
        .map(p => projectIsometric(p));
      
      // Scale to pixel coordinates
      const scale = stickerSize / (1 - stickerGap / stickerSize);
      const scaledCorners = corners2D.map(p => ({
        x: p.x * scale,
        y: p.y * scale,
      }));
      
      // Render as polygon
      stickers.push(render3DSticker(color, scaledCorners, options));
    }
  }
  
  return stickers.join('\n');
}

/**
 * Get 3D position of sticker center
 */
function getSticker3DPosition(
  face: FaceName,
  row: number,
  col: number
): Point3D {
  // Offset from face center (-1, 0, 1 for each axis)
  const offset = (i: number) => (i - 1);
  
  switch (face) {
    case 'U': // Top face (Y = 1.5) - looking DOWN at it from above
      // Row 0 = back edge, Row 2 = front edge
      // Col 0 = left edge, Col 2 = right edge
      return { x: offset(col), y: 1.5, z: offset(row) };
    case 'D': // Bottom face (Y = -1.5) - looking UP at it from below
      // Row 0 = front edge, Row 2 = back edge (inverted from U)
      return { x: offset(col), y: -1.5, z: -offset(row) };
    case 'F': // Front face (Z = 1.5) - looking at it from front
      // Row 0 = top, Row 2 = bottom
      // Col 0 = left, Col 2 = right
      return { x: offset(col), y: -offset(row), z: 1.5 };
    case 'B': // Back face (Z = -1.5) - looking at it from behind
      // Columns are mirrored when viewed from behind
      return { x: -offset(col), y: -offset(row), z: -1.5 };
    case 'L': // Left face (X = -1.5) - looking at it from the left
      // Col 0 = back edge, Col 2 = front edge
      return { x: -1.5, y: -offset(row), z: offset(col) };
    case 'R': // Right face (X = 1.5) - looking at it from the right
      // Col 0 = front edge, Col 2 = back edge (mirrored from L)
      return { x: 1.5, y: -offset(row), z: -offset(col) };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

/**
 * Get 4 corners of a sticker in 3D space (clockwise from top-left)
 */
function getStickerCorners(
  face: FaceName,
  row: number,
  col: number
): Point3D[] {
  const half = 0.45; // Half sticker size (with small gap)
  const center = getSticker3DPosition(face, row, col);
  
  // Define corners relative to face orientation
  switch (face) {
    case 'U': // Top face
      return [
        { x: center.x - half, y: center.y, z: center.z - half }, // TL
        { x: center.x + half, y: center.y, z: center.z - half }, // TR
        { x: center.x + half, y: center.y, z: center.z + half }, // BR
        { x: center.x - half, y: center.y, z: center.z + half }, // BL
      ];
    case 'D': // Bottom face
      return [
        { x: center.x - half, y: center.y, z: center.z - half },
        { x: center.x + half, y: center.y, z: center.z - half },
        { x: center.x + half, y: center.y, z: center.z + half },
        { x: center.x - half, y: center.y, z: center.z + half },
      ];
    case 'F': // Front face
      return [
        { x: center.x - half, y: center.y - half, z: center.z },
        { x: center.x + half, y: center.y - half, z: center.z },
        { x: center.x + half, y: center.y + half, z: center.z },
        { x: center.x - half, y: center.y + half, z: center.z },
      ];
    case 'B': // Back face
      return [
        { x: center.x - half, y: center.y - half, z: center.z },
        { x: center.x + half, y: center.y - half, z: center.z },
        { x: center.x + half, y: center.y + half, z: center.z },
        { x: center.x - half, y: center.y + half, z: center.z },
      ];
    case 'L': // Left face
      return [
        { x: center.x, y: center.y - half, z: center.z - half },
        { x: center.x, y: center.y - half, z: center.z + half },
        { x: center.x, y: center.y + half, z: center.z + half },
        { x: center.x, y: center.y + half, z: center.z - half },
      ];
    case 'R': // Right face
      return [
        { x: center.x, y: center.y - half, z: center.z - half },
        { x: center.x, y: center.y - half, z: center.z + half },
        { x: center.x, y: center.y + half, z: center.z + half },
        { x: center.x, y: center.y + half, z: center.z - half },
      ];
    default:
      return [];
  }
}

/**
 * Render a 3D sticker as SVG polygon
 */
function render3DSticker(
  color: FaceColor,
  corners: Point2D[],
  options: Required<RenderOptions>
): string {
  const fill = COLOR_MAP[color];
  const stroke = options.borderColor;
  const strokeWidth = options.borderWidth;
  
  // Create points string for polygon
  const points = corners.map(p => `${p.x},${p.y}`).join(' ');
  
  return `<polygon
    points="${points}"
    fill="${fill}"
    fill-opacity="1"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
  />`;
}

/**
 * Render cube in isometric 3D view
 */
export function renderCube3D(
  state: CubeState,
  options: Render3DOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const view = options.view || 'front';
  const { stickerSize, backgroundColor } = opts;
  
  // Determine which faces to render (back-to-front order)
  const faces: FaceName[] = ['U', 'D', 'F', 'B', 'L', 'R'];
  
  // Sort faces by depth (back to front) for proper layering
  const sortedFaces = faces
    .filter(face => isFaceVisible(face, view))
    .sort((a, b) => getFaceDepth(a, view) - getFaceDepth(b, view));
  
  // Render each visible face
  const renderedFaces = sortedFaces.map(face =>
    render3DFace(state[face], face, view, stickerSize, opts)
  );
  
  // Calculate SVG dimensions with extra padding to prevent cropping
  const scale = stickerSize / 0.9;
  const width = 6 * scale;
  const height = 5 * scale;
  const padding = scale * 1.2; // Increased from 0.5 to 1.2
  
  // Center the cube in the viewport
  const offsetX = width / 2 + padding;
  const offsetY = height / 2 + padding;
  
  return `<svg
    width="${width + padding * 2}"
    height="${height + padding * 2}"
    viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="100%"
      height="100%"
      fill="${backgroundColor}"
    />
    <g transform="translate(${offsetX}, ${offsetY})">
      ${renderedFaces.join('\n')}
    </g>
  </svg>`;
}
