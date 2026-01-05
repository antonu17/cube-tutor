/**
 * Puzzle Data Loader
 * Functions for loading puzzle definitions
 */

import type { PuzzleInfo } from "@/src/types/cube";
import { readFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "data", "puzzles");

/**
 * Load a specific puzzle by ID
 * @param id - Puzzle ID (e.g., "3x3x3")
 * @returns Puzzle data
 * @throws Error if puzzle not found or invalid JSON
 */
export async function loadPuzzle(id: string): Promise<PuzzleInfo> {
  const filePath = join(DATA_DIR, `${id}.json`);
  
  try {
    const content = await readFile(filePath, "utf-8");
    const puzzle = JSON.parse(content) as PuzzleInfo;
    
    // Validate required fields
    if (!puzzle.type || !puzzle.name || !puzzle.supportedMethods) {
      throw new Error(`Invalid puzzle data in ${id}.json: missing required fields`);
    }
    
    return puzzle;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Puzzle not found: ${id}`);
    }
    throw error;
  }
}

/**
 * Load all available puzzles
 * @returns Array of all puzzles
 */
export async function loadAllPuzzles(): Promise<PuzzleInfo[]> {
  // For now, we only have 3x3x3
  // In the future, this could read the directory
  const puzzleIds = ["3x3x3"];
  
  const puzzles = await Promise.all(
    puzzleIds.map((id) => loadPuzzle(id).catch(() => null))
  );
  
  return puzzles.filter((p): p is PuzzleInfo => p !== null);
}
