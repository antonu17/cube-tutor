/**
 * Core type definitions for Cube Tutor application
 */

// ============================================================================
// Cube Face & Color Types
// ============================================================================

export type FaceColor = "white" | "yellow" | "green" | "blue" | "red" | "orange";
export type FaceName = "U" | "D" | "F" | "B" | "L" | "R";

export const FACE_COLORS: Record<FaceName, FaceColor> = {
  U: "white",   // Up face
  D: "yellow",  // Down face
  F: "green",   // Front face
  B: "blue",    // Back face
  L: "orange",  // Left face
  R: "red",     // Right face
};

// ============================================================================
// Cube State Types
// ============================================================================

/**
 * Represents a single sticker on the cube (0-8 for each face)
 */
export type StickerPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Face state - array of 9 colors representing stickers
 * Layout:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 */
export type FaceState = [
  FaceColor, FaceColor, FaceColor,
  FaceColor, FaceColor, FaceColor,
  FaceColor, FaceColor, FaceColor
];

/**
 * Complete cube state - all 6 faces
 */
export interface CubeState {
  U: FaceState; // Up (white)
  D: FaceState; // Down (yellow)
  F: FaceState; // Front (green)
  B: FaceState; // Back (blue)
  L: FaceState; // Left (orange)
  R: FaceState; // Right (red)
}

// ============================================================================
// Move Types (WCA Notation)
// ============================================================================

export type BaseMoveType = "U" | "D" | "F" | "B" | "L" | "R" | "M" | "E" | "S" | "x" | "y" | "z";
export type MoveModifier = "" | "'" | "2";
export type WideMove = "Uw" | "Dw" | "Fw" | "Bw" | "Lw" | "Rw" | "u" | "d" | "f" | "b" | "l" | "r";

/**
 * A single move in WCA notation (e.g., "R", "U'", "F2", "Rw")
 */
export interface Move {
  base: BaseMoveType | WideMove;
  modifier: MoveModifier;
  notation: string; // Full notation string (e.g., "R'")
}

/**
 * Algorithm - sequence of moves
 */
export interface Algorithm {
  id: string;
  moves: Move[];
  notation: string; // Full algorithm string (e.g., "R U R' U'")
}

// ============================================================================
// Method & Case Types
// ============================================================================

export type MethodType = "beginner" | "cfop" | "roux" | "zz";
export type CFOPStage = "cross" | "f2l" | "oll" | "pll";

/**
 * OLL case shape categories
 */
export type OLLShape = 
  | "dot"
  | "line"
  | "l-shape"
  | "t-shape"
  | "square"
  | "fish"
  | "w-shape"
  | "corners-oriented"
  | "awkward"
  | "lightning"
  | "p-shape"
  | "c-shape"
  | "i-shape";

/**
 * PLL case swap types
 */
export type PLLType = "edges-only" | "corners-only" | "adjacent-swap" | "diagonal-swap";

/**
 * Algorithm case (OLL/PLL/Beginner step)
 */
export interface AlgorithmCase {
  id: string;
  name: string;
  method: MethodType;
  stage?: CFOPStage;
  category?: OLLShape | PLLType | string;
  algorithms: Algorithm[];
  primaryAlg: Algorithm; // Most recommended algorithm
  recognitionHints: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  setupMoves?: string; // Moves to create this case from solved cube
}

/**
 * Beginner method step
 */
export interface BeginnerStep {
  id: string;
  name: string;
  description: string;
  order: number;
  algorithms: AlgorithmCase[];
  instructions: string[];
}

// ============================================================================
// Puzzle Types
// ============================================================================

export type PuzzleType = "3x3" | "2x2" | "4x4" | "5x5" | "pyraminx" | "megaminx";

export interface PuzzleInfo {
  type: PuzzleType;
  name: string;
  description: string;
  supportedMethods: MethodType[];
}

// ============================================================================
// UI State Types
// ============================================================================

export interface CubeInteractionState {
  selectedFace: FaceName | null;
  selectedSticker: StickerPosition | null;
  highlightedStickers: Array<{ face: FaceName; position: StickerPosition }>;
}

export interface AnimationState {
  isAnimating: boolean;
  currentMove: Move | null;
  progress: number; // 0-1
}
