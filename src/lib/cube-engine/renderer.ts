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
  const backRow = renderTopRow(state.B, backX, backY, opts);
  
  // Left: Left face right column (left of U)
  const leftX = padding;
  const leftY = centerY;
  const leftCol = renderRightCol(state.L, leftX, leftY, opts);
  
  // Right: Right face left column (right of U)
  const rightX = centerX + faceSize + spacing;
  const rightY = centerY;
  const rightCol = renderLeftCol(state.R, rightX, rightY, opts);
  
  // Bottom: Front face top row (below U)
  const frontX = centerX;
  const frontY = centerY + faceSize + spacing;
  const frontRow = renderTopRow(state.F, frontX, frontY, opts);

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
 * Render just the top row of a face (for case view)
 */
function renderTopRow(
  face: FaceState,
  x: number,
  y: number,
  options: Required<RenderOptions>
): string {
  const { stickerSize, stickerGap } = options;
  const stickers: string[] = [];

  for (let col = 0; col < 3; col++) {
    const color = face[col]; // Top row: indices 0, 1, 2
    const stickerX = x + col * (stickerSize + stickerGap);
    stickers.push(renderSticker(color, stickerX, y, stickerSize, options));
  }

  return stickers.join("\n");
}

/**
 * Render just the left column of a face (for case view)
 */
function renderLeftCol(
  face: FaceState,
  x: number,
  y: number,
  options: Required<RenderOptions>
): string {
  const { stickerSize, stickerGap } = options;
  const stickers: string[] = [];

  for (let row = 0; row < 3; row++) {
    const color = face[row * 3]; // Left column: indices 0, 3, 6
    const stickerY = y + row * (stickerSize + stickerGap);
    stickers.push(renderSticker(color, x, stickerY, stickerSize, options));
  }

  return stickers.join("\n");
}

/**
 * Render just the right column of a face (for case view)
 */
function renderRightCol(
  face: FaceState,
  x: number,
  y: number,
  options: Required<RenderOptions>
): string {
  const { stickerSize, stickerGap } = options;
  const stickers: string[] = [];

  for (let row = 0; row < 3; row++) {
    const color = face[row * 3 + 2]; // Right column: indices 2, 5, 8
    const stickerY = y + row * (stickerSize + stickerGap);
    stickers.push(renderSticker(color, x, stickerY, stickerSize, options));
  }

  return stickers.join("\n");
}
