/**
 * Data Loader
 * Main exports for loading puzzle, method, algorithm set, and algorithm data
 */

export { loadPuzzle, loadAllPuzzles } from "./puzzles";
export { loadMethod, loadAllMethods } from "./methods"; // Keep for backward compatibility
export { 
  loadAlgorithmSet, 
  loadAlgorithmSetsForPuzzle,
  loadAllAlgorithmSets,
  loadAlgorithmSetsByGroup 
} from "./algorithm-sets";
export { loadAlgorithms, loadAlgorithmsByCategory, loadCase, loadMethodAlgorithms } from "./algorithms";
