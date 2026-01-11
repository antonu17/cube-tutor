/**
 * Data structure type definitions for algorithm and method data files
 */

import type {
  AlgorithmCase,
  BeginnerStep,
  MethodType,
  CFOPStage,
  OLLShape,
  PLLType,
} from "./cube";

// ============================================================================
// JSON Data File Structures
// ============================================================================

/**
 * Structure for beginner method JSON file
 */
export interface BeginnerMethodData {
  method: "beginner";
  name: string;
  description: string;
  steps: BeginnerStep[];
}

/**
 * Structure for OLL cases JSON file
 */
export interface OLLData {
  method: "cfop";
  stage: "oll";
  name: string;
  description: string;
  categories: {
    [key in OLLShape]: {
      name: string;
      description: string;
      cases: AlgorithmCase[];
    };
  };
}

/**
 * Structure for PLL cases JSON file
 */
export interface PLLData {
  method: "cfop";
  stage: "pll";
  name: string;
  description: string;
  categories: {
    [key in PLLType]: {
      name: string;
      description: string;
      cases: AlgorithmCase[];
    };
  };
}

/**
 * Generic method data structure
 */
export interface MethodData {
  method: MethodType;
  name: string;
  description: string;
  stages?: {
    id: string;
    name: string;
    description: string;
    order: number;
  }[];
}

/**
 * Puzzle data structure
 */
export interface Puzzle {
  id: string;
  type: string;
  name: string;
  description: string;
  dimensions: number[];
  supportedMethods?: MethodType[]; // Deprecated: use algorithmSetGroups
  algorithmSetGroups?: string[];
}

// ============================================================================
// Algorithm Set Structures (New)
// ============================================================================

/**
 * Category within an algorithm set
 */
export interface AlgorithmSetCategory {
  id: string;
  name: string;
  description: string;
  caseCount: number;
}

/**
 * Algorithm set data structure (replaces method+stage)
 */
export interface AlgorithmSet {
  id: string;                    // "oll", "pll", "f2l", "beginner"
  puzzleId: string;              // "3x3x3"
  name: string;                  // "OLL (Orient Last Layer)"
  shortName: string;             // "OLL"
  description: string;
  origin: string;                // "cfop", "beginner", "roux"
  originName: string;            // "CFOP Method"
  order: number;                 // Display order within origin
  caseCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  categories: AlgorithmSetCategory[];
}

/**
 * Algorithm set group (for display purposes)
 */
export interface AlgorithmSetGroup {
  id: string;                    // "cfop", "beginner"
  name: string;                  // "CFOP Method"
  description: string;
  algorithmSets: AlgorithmSet[];
}

// ============================================================================
// Data Loading & Caching
// ============================================================================

export interface DataLoaderOptions {
  method: MethodType;
  stage?: CFOPStage;
  category?: string;
}

export interface DataLoaderResult<T> {
  data: T;
  lastModified: Date;
  cached: boolean;
}
