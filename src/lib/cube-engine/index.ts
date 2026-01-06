/**
 * Cube Engine
 * Main exports for the Rubik's cube logic engine
 */

// Parser
export { parseMove, parseAlgorithm, invertMove, invertAlgorithm, movesToNotation } from "./parser";

// State management
export { createSolvedState, cloneState, isStateSolved, statesEqual, stateToString } from "./state";

// Rendering
export { renderCubeSVG, renderTopFaceSVG, renderCaseViewSVG, renderCubeNet, COLOR_MAP } from "./renderer";
export type { RenderOptions } from "./renderer";

// Move execution
export { applyMove, applyAlgorithm, applyAlgorithmStepByStep } from "./executor";

// Validation
export {
  isValidMove,
  isValidAlgorithm,
  validateAlgorithmData,
  validateAlgorithmBatch,
} from "./validator";

// Re-export types
export type { ValidationResult } from "./validator";
