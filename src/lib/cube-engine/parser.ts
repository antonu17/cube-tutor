/**
 * WCA Notation Parser
 * Parses standard WCA (World Cube Association) notation for Rubik's cube moves
 */

import type { Move, BaseMoveType, MoveModifier, WideMove } from "@/src/types/cube";

// Valid base moves
const BASE_MOVES = ["U", "D", "F", "B", "L", "R", "M", "E", "S", "x", "y", "z"] as const;

// Valid wide moves
const WIDE_MOVES = ["Uw", "Dw", "Fw", "Bw", "Lw", "Rw", "u", "d", "f", "b", "l", "r"] as const;

// Valid modifiers
const MODIFIERS: MoveModifier[] = ["", "'", "2", "2'"];

/**
 * Parse a single move string into a Move object
 * @param moveStr - Move string (e.g., "R", "U'", "F2", "Rw")
 * @returns Parsed Move object
 * @throws Error if move notation is invalid
 */
export function parseMove(moveStr: string): Move {
  // Trim whitespace
  const trimmed = moveStr.trim();

  if (!trimmed) {
    throw new Error("Move string cannot be empty");
  }

  // Check for 2-character wide moves first (Uw, Dw, etc.)
  if (trimmed.length >= 2) {
    const potentialWide = trimmed.slice(0, 2);
    if (WIDE_MOVES.includes(potentialWide as WideMove)) {
      const modifier = trimmed.slice(2) as MoveModifier;
      
      if (!MODIFIERS.includes(modifier)) {
        throw new Error(`Invalid modifier '${modifier}' in move '${trimmed}'`);
      }

      return {
        base: potentialWide as WideMove,
        modifier,
        notation: trimmed,
      };
    }
  }

  // Check for single-character lowercase wide moves (u, d, f, b, l, r)
  const base = trimmed[0];
  const modifier = trimmed.slice(1) as MoveModifier;

  if (WIDE_MOVES.includes(base as WideMove)) {
    if (!MODIFIERS.includes(modifier)) {
      throw new Error(`Invalid modifier '${modifier}' in move '${trimmed}'`);
    }

    return {
      base: base as WideMove,
      modifier,
      notation: trimmed,
    };
  }

  // Parse standard single-character moves
  if (!BASE_MOVES.includes(base as BaseMoveType)) {
    throw new Error(`Invalid move '${base}' in '${trimmed}'`);
  }

  if (!MODIFIERS.includes(modifier)) {
    throw new Error(`Invalid modifier '${modifier}' in move '${trimmed}'`);
  }

  return {
    base: base as BaseMoveType,
    modifier,
    notation: trimmed,
  };
}

/**
 * Parse an algorithm string into an array of Move objects
 * @param notation - Algorithm notation string (e.g., "R U R' U'")
 * @returns Array of parsed Move objects
 * @throws Error if any move notation is invalid
 */
export function parseAlgorithm(notation: string): Move[] {
  // Handle empty string
  if (!notation || !notation.trim()) {
    return [];
  }

  // Remove comments (text in parentheses)
  const withoutComments = notation.replace(/\([^)]*\)/g, "");

  // Split by whitespace
  const moveStrings = withoutComments
    .trim()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  // Parse each move
  return moveStrings.map((moveStr) => {
    try {
      return parseMove(moveStr);
    } catch (error) {
      throw new Error(
        `Failed to parse move '${moveStr}' in algorithm '${notation}': ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });
}

/**
 * Get the inverse of a move
 * @param move - Move to invert
 * @returns Inverted move
 */
export function invertMove(move: Move): Move {
  let newModifier: MoveModifier;

  switch (move.modifier) {
    case "":
      newModifier = "'";
      break;
    case "'":
      newModifier = "";
      break;
    case "2":
      newModifier = "2"; // 180° moves are their own inverse
      break;
    case "2'":
      newModifier = "2"; // 180° counterclockwise inverts to 180° clockwise
      break;
    default:
      throw new Error(`Invalid modifier: ${move.modifier}`);
  }

  const notation = `${move.base}${newModifier}`;

  return {
    base: move.base,
    modifier: newModifier,
    notation,
  };
}

/**
 * Get the inverse of an algorithm
 * @param moves - Array of moves
 * @returns Inverted algorithm (reversed with each move inverted)
 */
export function invertAlgorithm(moves: Move[]): Move[] {
  return moves
    .slice()
    .reverse()
    .map((move) => invertMove(move));
}

/**
 * Convert an array of moves back to notation string
 * @param moves - Array of Move objects
 * @returns Notation string (e.g., "R U R' U'")
 */
export function movesToNotation(moves: Move[]): string {
  return moves.map((m) => m.notation).join(" ");
}
