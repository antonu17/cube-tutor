/**
 * Utility to add parsed moves to algorithm data
 * Run with: bun run scripts/parse-algorithms.ts
 */

import { readFile, writeFile } from "fs/promises";
import { parseAlgorithm } from "../src/lib/cube-engine/parser";
import type { AlgorithmCase } from "../src/types/cube";

async function parseAlgorithmsInFile(filePath: string): Promise<void> {
  console.log(`Processing: ${filePath}`);
  
  // Read file
  const content = await readFile(filePath, "utf-8");
  const cases = JSON.parse(content) as AlgorithmCase[];
  
  // Parse moves for each algorithm
  for (const algorithmCase of cases) {
    for (const algorithm of algorithmCase.algorithms) {
      try {
        const moves = parseAlgorithm(algorithm.notation);
        algorithm.moves = moves;
        console.log(`  ✓ ${algorithmCase.id}: ${algorithm.notation} (${moves.length} moves)`);
      } catch (error) {
        console.error(`  ✗ ${algorithmCase.id}: Failed to parse "${algorithm.notation}"`);
        console.error(`    Error: ${error}`);
      }
    }
  }
  
  // Write back with moves
  await writeFile(filePath, JSON.stringify(cases, null, 2));
  console.log(`✓ Updated ${filePath}\n`);
}

async function main() {
  const files = [
    "src/data/algorithms/beginner/all/all-cases.json",
    "src/data/algorithms/cfop/oll/all-cases.json",
    "src/data/algorithms/cfop/pll/all-cases.json",
  ];
  
  for (const file of files) {
    try {
      await parseAlgorithmsInFile(file);
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }
  
  console.log("✓ All algorithms processed");
}

main();
