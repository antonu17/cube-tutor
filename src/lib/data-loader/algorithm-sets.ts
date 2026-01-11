/**
 * Algorithm Sets Data Loader
 * Loads algorithm set data from JSON files
 */

import { readFile } from "fs/promises";
import { join } from "path";
import type { AlgorithmSet, AlgorithmSetGroup } from "@/src/types/data";

const DATA_DIR = join(process.cwd(), "src/data");

/**
 * Load a single algorithm set
 */
export async function loadAlgorithmSet(
  puzzleId: string,
  algSetId: string
): Promise<AlgorithmSet | null> {
  try {
    const filePath = join(DATA_DIR, "algorithm-sets", puzzleId, `${algSetId}.json`);
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent) as AlgorithmSet;
    return data;
  } catch (error) {
    console.error(`Failed to load algorithm set ${puzzleId}/${algSetId}:`, error);
    return null;
  }
}

/**
 * Load all algorithm sets for a puzzle
 */
export async function loadAlgorithmSetsForPuzzle(
  puzzleId: string
): Promise<AlgorithmSet[]> {
  // For now, we know the available sets for 3x3x3
  // In the future, this could read from a directory or puzzle metadata
  const algSetIds = ["cross", "f2l", "oll", "pll", "beginner"];
  
  const sets = await Promise.all(
    algSetIds.map(id => loadAlgorithmSet(puzzleId, id))
  );
  
  return sets.filter((set): set is AlgorithmSet => set !== null);
}

/**
 * Load all algorithm sets across all puzzles
 */
export async function loadAllAlgorithmSets(): Promise<AlgorithmSet[]> {
  // For now, only 3x3x3 is supported
  return loadAlgorithmSetsForPuzzle("3x3x3");
}

/**
 * Load algorithm sets grouped by their origin (method)
 */
export async function loadAlgorithmSetsByGroup(
  puzzleId: string
): Promise<AlgorithmSetGroup[]> {
  const sets = await loadAlgorithmSetsForPuzzle(puzzleId);
  
  // Group sets by their origin
  const groupMap = new Map<string, AlgorithmSet[]>();
  
  for (const set of sets) {
    const existing = groupMap.get(set.origin) || [];
    existing.push(set);
    groupMap.set(set.origin, existing);
  }
  
  // Convert to AlgorithmSetGroup array
  const groups: AlgorithmSetGroup[] = [];
  
  for (const [originId, algorithmSets] of groupMap.entries()) {
    // Sort sets by order
    algorithmSets.sort((a, b) => a.order - b.order);
    
    // Use the first set's originName as the group name
    const originName = algorithmSets[0]?.originName || originId;
    
    // Get description from a known source or construct it
    let description = "";
    if (originId === "cfop") {
      description = "Advanced speedsolving method using Cross, F2L (First Two Layers), OLL (Orient Last Layer), and PLL (Permute Last Layer). The most popular method for speedcubing.";
    } else if (originId === "beginner") {
      description = "Layer-by-layer solving method ideal for learning. Solves the cube in 7 intuitive steps using a small set of easy-to-remember algorithms.";
    }
    
    groups.push({
      id: originId,
      name: originName,
      description,
      algorithmSets,
    });
  }
  
  return groups;
}
