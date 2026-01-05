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
  // Beginner method stores all stages in one file
  const filePath = methodId === "beginner" 
    ? join(DATA_DIR, methodId, "all", "all-cases.json")
    : join(DATA_DIR, methodId, stageId, "all-cases.json");
  
  try {
    const content = await readFile(filePath, "utf-8");
    const rawCases = JSON.parse(content) as any[];
    
    // Validate it's an array
    if (!Array.isArray(rawCases)) {
      throw new Error(`Invalid algorithm data: expected array`);
    }
    
    // Transform raw cases to include primaryAlg
    const cases = rawCases.map((c) => {
      // Find the recommended algorithm, or use the first one
      const primaryAlg = c.algorithms.find((alg: any) => alg.recommended) || c.algorithms[0];
      
      // Ensure each algorithm has an id
      const algorithmsWithIds = c.algorithms.map((alg: any, index: number) => ({
        ...alg,
        id: alg.id || `${c.id}-alg-${index}`,
      }));
      
      return {
        ...c,
        algorithms: algorithmsWithIds,
        primaryAlg: {
          ...primaryAlg,
          id: primaryAlg.id || `${c.id}-alg-0`,
        },
      };
    });
    
    // For beginner method, filter by stage
    if (methodId === "beginner") {
      const filtered = cases.filter((c: any) => c.stage === stageId);
      // Return empty array for intuitive stages (like white-cross)
      return filtered;
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
 * Load algorithm cases grouped by category
 * @param methodId - Method ID
 * @param stageId - Stage ID
 * @returns Object with categories as keys, each containing name, description, and cases
 */
export async function loadAlgorithmsByCategory(
  methodId: string,
  stageId: string
): Promise<Record<string, { name: string; description: string; cases: AlgorithmCase[] }>> {
  try {
    const cases = await loadAlgorithms(methodId, stageId);
    
    const categorized: Record<string, { name: string; description: string; cases: AlgorithmCase[] }> = {};
    
    for (const algorithmCase of cases) {
      const category = algorithmCase.category || "uncategorized";
      
      if (!categorized[category]) {
        categorized[category] = {
          name: formatCategoryName(category),
          description: getCategoryDescription(category),
          cases: [],
        };
      }
      
      categorized[category].cases.push(algorithmCase);
    }
    
    return categorized;
  } catch (error) {
    // Return empty object for stages without algorithms (e.g., Cross, F2L)
    return {};
  }
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get category description based on category name
 */
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "dot": "No edges oriented correctly",
    "line": "Two opposite edges oriented",
    "square": "Two adjacent edges oriented",
    "fish": "Three edges oriented in fish pattern",
    "l-shape": "Three edges oriented in L pattern",
    "i-shape": "Four edges oriented in line",
    "corners-oriented": "All corners oriented, edges need fixing",
    "edges-only": "Permute edges only, corners already solved",
    "corners-only": "Permute corners only, edges already solved",
    "adjacent-swap": "Swap two adjacent pieces",
    "diagonal-swap": "Swap two diagonal pieces",
    "all": "General solving techniques",
    "uncategorized": "Miscellaneous cases",
  };
  
  return descriptions[category] || "Algorithm cases for this category";
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
