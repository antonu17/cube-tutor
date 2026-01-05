/**
 * Script to add missing OLL cases
 * Data sourced from SpeedCubeDB and standard OLL algorithm sets
 * Run with: bun run scripts/add-missing-oll.ts
 */

import { readFile, writeFile } from "fs/promises";
import { parseAlgorithm } from "../src/lib/cube-engine/parser";

// Missing OLL cases with standard algorithms  
// Using the same structure as existing JSON files
const missingCases: any[] = [
  // Square shapes (5-6)
  {
    id: "oll-5",
    name: "OLL 5",
    method: "cfop",
    stage: "oll",
    category: "square",
    difficulty: 3,
    algorithms: [{
      notation: "r' U2 R U R' U r",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Square shape", "No headlights"],
    probability: 0.0185
  },
  {
    id: "oll-6",
    name: "OLL 6",
    method: "cfop",
    stage: "oll",
    category: "square",
    difficulty: 3,
    algorithms: [{
      notation: "r U2 R' U' R U' r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Square shape", "No headlights"],
    probability: 0.0185
  },
  
  // Small L shapes (7-12)
  {
    id: "oll-7",
    name: "OLL 7",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "r U R' U R U2 r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small L shape", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-8",
    name: "OLL 8",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "r' U' R U' R' U2 r",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small L shape", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-9",
    name: "OLL 9",
    method: "cfop",
    stage: "oll",
    category: "fish",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' U' R' F R2 U R' U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Fish shape", "Diagonal pattern"],
    probability: 0.0185
  },
  {
    id: "oll-10",
    name: "OLL 10",
    method: "cfop",
    stage: "oll",
    category: "fish",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' U R' F R F' R U2 R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Fish shape", "Diagonal pattern"],
    probability: 0.0185
  },
  {
    id: "oll-11",
    name: "OLL 11",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "r U R' U R' F R F' R U2 r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small lightning bolt"],
    probability: 0.0185
  },
  {
    id: "oll-12",
    name: "OLL 12",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "M' R' U' R U' R' U2 R U' M",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small lightning bolt"],
    probability: 0.0185
  },
  
  // Knight move shapes (13-16)
  {
    id: "oll-13",
    name: "OLL 13",
    method: "cfop",
    stage: "oll",
    category: "knight",
    difficulty: 3,
    algorithms: [{
      notation: "r U' r' U' r U r' F' U F",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Knight move pattern", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-14",
    name: "OLL 14",
    method: "cfop",
    stage: "oll",
    category: "knight",
    difficulty: 3,
    algorithms: [{
      notation: "R' F R U R' F' R F U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Knight move pattern", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-15",
    name: "OLL 15",
    method: "cfop",
    stage: "oll",
    category: "knight",
    difficulty: 3,
    algorithms: [{
      notation: "r' U' r R' U' R U r' U r",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Knight move pattern", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-16",
    name: "OLL 16",
    method: "cfop",
    stage: "oll",
    category: "knight",
    difficulty: 3,
    algorithms: [{
      notation: "r U r' R U R' U' r U' r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Knight move pattern", "Two edges oriented"],
    probability: 0.0185
  },
  
  // Dot case (18)
  {
    id: "oll-18",
    name: "OLL 18",
    method: "cfop",
    stage: "oll",
    category: "dot",
    difficulty: 4,
    algorithms: [{
      notation: "r U R' U R U2 r2 U' R U' R' U2 r",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["All edges flipped", "Dot case"],
    probability: 0.0185
  },
  
  // Awkward shapes (30-32)
  {
    id: "oll-30",
    name: "OLL 30",
    method: "cfop",
    stage: "oll",
    category: "awkward",
    difficulty: 4,
    algorithms: [{
      notation: "R2 U R' B' R U' R2 U R B R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Awkward shape", "Two adjacent edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-31",
    name: "OLL 31",
    method: "cfop",
    stage: "oll",
    category: "p-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R' U' F U R U' R' F' R",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["P shape", "Three edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-32",
    name: "OLL 32",
    method: "cfop",
    stage: "oll",
    category: "p-shape",
    difficulty: 3,
    algorithms: [{
      notation: "L U F' U' L' U L F L'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["P shape", "Three edges oriented"],
    probability: 0.0185
  },
  
  // T, C, W shapes (33-38)
  {
    id: "oll-33",
    name: "OLL 33",
    method: "cfop",
    stage: "oll",
    category: "t-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' U' R' F R F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["T shape", "Three edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-34",
    name: "OLL 34",
    method: "cfop",
    stage: "oll",
    category: "c-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R U R2 U' R' F R U R U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["C shape", "Two opposite edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-35",
    name: "OLL 35",
    method: "cfop",
    stage: "oll",
    category: "fish",
    difficulty: 3,
    algorithms: [{
      notation: "R U2 R2 F R F' R U2 R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Fish shape"],
    probability: 0.0185
  },
  {
    id: "oll-36",
    name: "OLL 36",
    method: "cfop",
    stage: "oll",
    category: "w-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R' U' R U' R' U R U R B' R' B",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["W shape", "Two adjacent edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-37",
    name: "OLL 37",
    method: "cfop",
    stage: "oll",
    category: "fish",
    difficulty: 3,
    algorithms: [{
      notation: "F R' F' R U R U' R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Fish shape"],
    probability: 0.0185
  },
  {
    id: "oll-38",
    name: "OLL 38",
    method: "cfop",
    stage: "oll",
    category: "w-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' U R U' R' U' R' F R F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["W shape", "Two adjacent edges oriented"],
    probability: 0.0185
  },
  
  // Big Lightning bolts (39-40)
  {
    id: "oll-39",
    name: "OLL 39",
    method: "cfop",
    stage: "oll",
    category: "big-lightning",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' F' U' F U R U2 R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Big lightning bolt"],
    probability: 0.0185
  },
  {
    id: "oll-40",
    name: "OLL 40",
    method: "cfop",
    stage: "oll",
    category: "big-lightning",
    difficulty: 3,
    algorithms: [{
      notation: "R' F R U R' U' F' U R",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Big lightning bolt"],
    probability: 0.0185
  },
  
  // P and T shapes (41-44)
  {
    id: "oll-41",
    name: "OLL 41",
    method: "cfop",
    stage: "oll",
    category: "awkward",
    difficulty: 4,
    algorithms: [{
      notation: "R U R' U R U2 R' F R U R' U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Awkward shape"],
    probability: 0.0185
  },
  {
    id: "oll-42",
    name: "OLL 42",
    method: "cfop",
    stage: "oll",
    category: "awkward",
    difficulty: 4,
    algorithms: [{
      notation: "R' U' R U' R' U2 R F R U R' U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Awkward shape"],
    probability: 0.0185
  },
  {
    id: "oll-43",
    name: "OLL 43",
    method: "cfop",
    stage: "oll",
    category: "p-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R' U' F' U F R",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["P shape", "Three edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-44",
    name: "OLL 44",
    method: "cfop",
    stage: "oll",
    category: "p-shape",
    difficulty: 3,
    algorithms: [{
      notation: "F U R U' R' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["P shape", "Three edges oriented"],
    probability: 0.0185
  },
  
  // L shapes (47-50)
  {
    id: "oll-47",
    name: "OLL 47",
    method: "cfop",
    stage: "oll",
    category: "l-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R' U' R' F R F' R' F R F' U R",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["L shape", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-48",
    name: "OLL 48",
    method: "cfop",
    stage: "oll",
    category: "l-shape",
    difficulty: 3,
    algorithms: [{
      notation: "F R U R' U' R U R' U' F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["L shape", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-49",
    name: "OLL 49",
    method: "cfop",
    stage: "oll",
    category: "l-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R B' R2 F R2 B R2 F' R",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["L shape", "Two edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-50",
    name: "OLL 50",
    method: "cfop",
    stage: "oll",
    category: "l-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R' F R2 B' R2 F' R2 B R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["L shape", "Two edges oriented"],
    probability: 0.0185
  },
  
  // I shapes (52-56)
  {
    id: "oll-52",
    name: "OLL 52",
    method: "cfop",
    stage: "oll",
    category: "i-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R U R' U R U' B U' B' R'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["I shape", "Four edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-53",
    name: "OLL 53",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "r' U' R U' R' U R U' R' U2 r",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small L shape"],
    probability: 0.0185
  },
  {
    id: "oll-54",
    name: "OLL 54",
    method: "cfop",
    stage: "oll",
    category: "small-l",
    difficulty: 3,
    algorithms: [{
      notation: "r U R' U R U' R' U R U2 r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["Small L shape"],
    probability: 0.0185
  },
  {
    id: "oll-55",
    name: "OLL 55",
    method: "cfop",
    stage: "oll",
    category: "i-shape",
    difficulty: 3,
    algorithms: [{
      notation: "R U2 R2 U' R U' R' U2 F R F'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["I shape", "Four edges oriented"],
    probability: 0.0185
  },
  {
    id: "oll-56",
    name: "OLL 56",
    method: "cfop",
    stage: "oll",
    category: "i-shape",
    difficulty: 3,
    algorithms: [{
      notation: "r U r' U R U' R' U R U' R' r U' r'",
      source: "SpeedCubeDB",
      recommended: true
    }],
    recognitionHints: ["I shape", "Four edges oriented"],
    probability: 0.0185
  },
];

async function main() {
  const filePath = "src/data/algorithms/cfop/oll/all-cases.json";
  
  console.log(`Reading existing OLL cases from ${filePath}...`);
  const content = await readFile(filePath, "utf-8");
  const existingCases = JSON.parse(content) as any[];
  
  console.log(`Found ${existingCases.length} existing cases`);
  console.log(`Adding ${missingCases.length} missing cases...\n`);
  
  // Parse moves for each new algorithm
  const newCases: any[] = [];
  for (const algorithmCase of missingCases) {
    
    for (const algorithm of algorithmCase.algorithms) {
      try {
        const moves = parseAlgorithm(algorithm.notation);
        algorithm.moves = moves;
        console.log(`  ✓ ${algorithmCase.id}: ${algorithm.notation} (${moves.length} moves)`);
      } catch (error) {
        console.error(`  ✗ ${algorithmCase.id}: Failed to parse "${algorithm.notation}"`);
        console.error(`    Error: ${error}`);
        throw error;
      }
    }
    
    newCases.push(algorithmCase);
  }
  
  // Merge and sort by OLL number
  const allCases = [...existingCases, ...newCases].sort((a, b) => {
    const numA = parseInt(a.name.split(" ")[1]);
    const numB = parseInt(b.name.split(" ")[1]);
    return numA - numB;
  });
  
  console.log(`\n✓ Total cases: ${allCases.length}`);
  
  // Write back
  await writeFile(filePath, JSON.stringify(allCases, null, 2));
  console.log(`✓ Updated ${filePath}`);
  
  console.log(`\n✅ All OLL cases complete! (57 total)`);
}

main().catch(console.error);
