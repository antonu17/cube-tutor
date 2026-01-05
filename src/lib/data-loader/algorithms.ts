/**
 * Algorithm Data Loader
 * Functions for loading algorithm cases
 */

import type { AlgorithmCase } from "@/src/types/cube";
import { readFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "data", "algorithms");

/**
 * Load all algorithm cases for a specific method/stage
 * @param methodId - Method ID (e.g., "cfop", "beginner")
 * @param stageId - Stage ID (e.g., "oll", "pll")
 * @returns Array of algorithm cases
 * @throws Error if file not found or invalid JSON
 */
export async function loadAlgorithms(
  methodId: string,
  stageId: string
): Promise<AlgorithmCase[]> {
  const filePath = join(DATA_DIR, methodId, stageId, "all-cases.json");
  
  try {
    const content = await readFile(filePath, "utf-8");
    const cases = JSON.parse(content) as AlgorithmCase[];
    
    // Validate it's an array
    if (!Array.isArray(cases)) {
      throw new Error(`Invalid algorithm data: expected array`);
    }
    
    return cases;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Algorithms not found: ${methodId}/${stageId}`);
    }
    throw error;
  }
}

/**
 * Load a specific algorithm case by ID
 * @param methodId - Method ID
 * @param stageId - Stage ID
 * @param caseId - Case ID
 * @returns Algorithm case
 * @throws Error if case not found
 */
export async function loadCase(
  methodId: string,
  stageId: string,
  caseId: string
): Promise<AlgorithmCase> {
  const cases = await loadAlgorithms(methodId, stageId);
  const algorithmCase = cases.find((c) => c.id === caseId);
  
  if (!algorithmCase) {
    throw new Error(`Case not found: ${caseId} in ${methodId}/${stageId}`);
  }
  
  return algorithmCase;
}

/**
 * Load all algorithm cases for a method (all stages combined)
 * @param methodId - Method ID
 * @returns Array of all algorithm cases
 */
export async function loadMethodAlgorithms(methodId: string): Promise<AlgorithmCase[]> {
  // For CFOP: load OLL and PLL
  // For Beginner: load from beginner directory
  const stages: string[] = methodId === "cfop" ? ["oll", "pll"] : ["all"];
  
  const allCases = await Promise.all(
    stages.map((stage) => loadAlgorithms(methodId, stage).catch(() => []))
  );
  
  return allCases.flat();
}
