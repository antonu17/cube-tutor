/**
 * Example usage of renderCubeNet function
 * Run with: bun run src/lib/cube-engine/__examples__/render-cube-net-example.ts
 */

import { createSolvedState, renderCubeNet } from "../state";
import { applyAlgorithm } from "../executor";
import { parseAlgorithm } from "../parser";

console.log("=== Cube Net Rendering Examples ===\n");

// Example 1: Solved cube
console.log("1. Solved Cube:");
const solved = createSolvedState();
console.log(renderCubeNet(solved));

// Example 2: After R move
console.log("\n2. After R move:");
const afterR = applyAlgorithm(solved, parseAlgorithm("R"));
console.log(renderCubeNet(afterR));

// Example 3: After Sexy Move
console.log("\n3. After Sexy Move (R U R' U'):");
const afterSexy = applyAlgorithm(solved, parseAlgorithm("R U R' U'"));
console.log(renderCubeNet(afterSexy));

// Example 4: T-Perm
console.log("\n4. After T-Perm:");
const afterTPerm = applyAlgorithm(solved, parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'"));
console.log(renderCubeNet(afterTPerm));

// Example 5: Scrambled
console.log("\n5. Scrambled Cube:");
const scrambled = applyAlgorithm(solved, parseAlgorithm("R U R' U' F' R U R' U' R' F R2"));
console.log(renderCubeNet(scrambled));

console.log("\n=== Legend ===");
console.log("W = White (U face)");
console.log("Y = Yellow (D face)");
console.log("G = Green (F face)");
console.log("B = Blue (B face)");
console.log("O = Orange (L face)");
console.log("R = Red (R face)");
