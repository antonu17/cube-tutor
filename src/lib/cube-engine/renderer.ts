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
  const fill = COLOR_MAP[color];
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
