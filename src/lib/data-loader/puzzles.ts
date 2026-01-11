import type { Puzzle } from "@/src/types/data";
import type { MethodType } from "@/src/types/cube";

/**
 * Load all puzzles from the data directory
 */
export async function loadPuzzles(): Promise<Puzzle[]> {
  // For now, we only have 3x3x3
  // In the future, we can read from a directory or database
  const puzzle3x3 = await import("@/src/data/puzzles/3x3x3.json");
  
  return [
    {
      id: puzzle3x3.id,
      type: puzzle3x3.type,
      name: puzzle3x3.name,
      description: puzzle3x3.description,
      dimensions: puzzle3x3.dimensions,
      algorithmSetGroups: puzzle3x3.algorithmSetGroups,
    },
  ];
}

/**
 * Alias for backward compatibility
 */
export const loadAllPuzzles = loadPuzzles;

/**
 * Load a specific puzzle by ID
 */
export async function loadPuzzle(puzzleId: string): Promise<Puzzle | null> {
  const puzzles = await loadPuzzles();
  return puzzles.find((p) => p.id === puzzleId) || null;
}
