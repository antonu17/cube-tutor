/**
 * Method Data Loader
 * Functions for loading solving method definitions
 */

import type { MethodData } from "@/src/types/data";
import { readFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "data", "methods");

/**
 * Load a specific method
 * @param puzzleId - Puzzle ID (e.g., "3x3x3")
 * @param methodId - Method ID (e.g., "cfop", "beginner")
 * @returns Method data
 * @throws Error if method not found or invalid JSON
 */
export async function loadMethod(puzzleId: string, methodId: string): Promise<MethodData> {
  const filePath = join(DATA_DIR, puzzleId, `${methodId}.json`);
  
  try {
    const content = await readFile(filePath, "utf-8");
    const method = JSON.parse(content) as MethodData;
    
    // Validate required fields
    if (!method.method || !method.name || !method.description) {
      throw new Error(`Invalid method data in ${methodId}.json: missing required fields`);
    }
    
    return method;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Method not found: ${puzzleId}/${methodId}`);
    }
    throw error;
  }
}

/**
 * Load all methods for a puzzle
 * @param puzzleId - Puzzle ID (e.g., "3x3x3")
 * @returns Array of all methods for this puzzle
 */
export async function loadAllMethods(puzzleId: string): Promise<MethodData[]> {
  // For now, we have beginner and cfop for 3x3x3
  const methodIds = ["beginner", "cfop"];
  
  const methods = await Promise.all(
    methodIds.map((id) => loadMethod(puzzleId, id).catch(() => null))
  );
  
  return methods.filter((m): m is MethodData => m !== null);
}
