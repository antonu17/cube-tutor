/**
 * Notation Validator
 * Validates WCA notation without throwing errors
 */

import { parseMove, parseAlgorithm } from "./parser";
import type { Algorithm } from "@/src/types/cube";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Check if a move string is valid WCA notation
 * @param moveStr - Move string to validate
 * @returns True if valid, false otherwise
 */
export function isValidMove(moveStr: string): boolean {
  try {
    parseMove(moveStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an algorithm string is valid WCA notation
 * @param notation - Algorithm notation string
 * @returns True if valid, false otherwise
 */
export function isValidAlgorithm(notation: string): boolean {
  try {
    parseAlgorithm(notation);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate an Algorithm object
 * @param algorithm - Algorithm to validate
 * @returns ValidationResult with details
 */
export function validateAlgorithmData(algorithm: Algorithm): ValidationResult {
  const errors: string[] = [];

  // Check if notation is valid
  if (!isValidAlgorithm(algorithm.notation)) {
    errors.push(`Invalid notation: "${algorithm.notation}"`);
  }

  // Check if moves array exists
  if (!algorithm.moves || !Array.isArray(algorithm.moves)) {
    errors.push("Moves array is missing or invalid");
    return { valid: false, errors };
  }

  // Check if moves can be parsed from notation
  try {
    const parsedMoves = parseAlgorithm(algorithm.notation);
    
    // Check if move count matches
    if (parsedMoves.length !== algorithm.moves.length) {
      errors.push(
        `Move count mismatch: notation has ${parsedMoves.length} moves but moves array has ${algorithm.moves.length}`
      );
    }

    // Check if individual moves match
    for (let i = 0; i < Math.min(parsedMoves.length, algorithm.moves.length); i++) {
      if (parsedMoves[i].notation !== algorithm.moves[i].notation) {
        errors.push(
          `Move mismatch at position ${i}: notation has "${parsedMoves[i].notation}" but moves array has "${algorithm.moves[i].notation}"`
        );
      }
    }
  } catch (error) {
    errors.push(
      `Failed to parse notation: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Check if ID exists
  if (!algorithm.id || typeof algorithm.id !== "string" || algorithm.id.trim() === "") {
    errors.push("Algorithm ID is missing or invalid");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get validation summary for multiple algorithms
 * @param algorithms - Array of algorithms to validate
 * @returns Summary with counts and list of invalid algorithms
 */
export function validateAlgorithmBatch(algorithms: Algorithm[]): {
  total: number;
  valid: number;
  invalid: number;
  invalidAlgorithms: Array<{ id: string; errors: string[] }>;
} {
  const results = algorithms.map((alg) => ({
    id: alg.id,
    result: validateAlgorithmData(alg),
  }));

  const invalid = results.filter((r) => !r.result.valid);

  return {
    total: algorithms.length,
    valid: results.length - invalid.length,
    invalid: invalid.length,
    invalidAlgorithms: invalid.map((r) => ({
      id: r.id,
      errors: r.result.errors,
    })),
  };
}
