/**
 * Test simple F move sequences
 */

import { describe, test, expect } from "vitest";
import { createSolvedState, isStateSolved } from "../state";
import { applyMove } from "../executor";
import { parseMove } from "../parser";
import type { CubeState } from "@/src/types/cube";

function printState(state: CubeState) {
  const faces: Array<keyof CubeState> = ["U", "D", "F", "B", "L", "R"];
  for (const face of faces) {
    const f = state[face];
    console.log(`${face}: [${f[0]}${f[1]}${f[2]} ${f[3]}${f[4]}${f[5]} ${f[6]}${f[7]}${f[8]}]`);
  }
}

describe("F Move Detailed Tests", () => {
  test("Single F move - check each affected piece", () => {
    const solved = createSolvedState();
    let state = createSolvedState();
    
    state = applyMove(state, parseMove("F"));
    
    console.log("\n=== AFTER F MOVE ===");
    console.log("\nU face (white) - bottom row should have left colors (orange):");
    console.log(`  U[6]: ${solved.U[6]} → ${state.U[6]} (should be ${solved.L[8]})`);
    console.log(`  U[7]: ${solved.U[7]} → ${state.U[7]} (should be ${solved.L[5]})`);
    console.log(`  U[8]: ${solved.U[8]} → ${state.U[8]} (should be ${solved.L[2]})`);
    
    console.log("\nR face (red) - left column should have up colors (white):");
    console.log(`  R[0]: ${solved.R[0]} → ${state.R[0]} (should be ${solved.U[6]})`);
    console.log(`  R[3]: ${solved.R[3]} → ${state.R[3]} (should be ${solved.U[7]})`);
    console.log(`  R[6]: ${solved.R[6]} → ${state.R[6]} (should be ${solved.U[8]})`);
    
    console.log("\nD face (yellow) - top row should have right colors (red) REVERSED:");
    console.log(`  D[0]: ${solved.D[0]} → ${state.D[0]} (should be ${solved.R[6]})`);
    console.log(`  D[1]: ${solved.D[1]} → ${state.D[1]} (should be ${solved.R[3]})`);
    console.log(`  D[2]: ${solved.D[2]} → ${state.D[2]} (should be ${solved.R[0]})`);
    
    console.log("\nL face (orange) - right column should have down colors (yellow) REVERSED:");
    console.log(`  L[2]: ${solved.L[2]} → ${state.L[2]} (should be ${solved.D[0]})`);
    console.log(`  L[5]: ${solved.L[5]} → ${state.L[5]} (should be ${solved.D[1]})`);
    console.log(`  L[8]: ${solved.L[8]} → ${state.L[8]} (should be ${solved.D[2]})`);
    
    // Verify expectations
    expect(state.U[6]).toBe(solved.L[8]);
    expect(state.U[7]).toBe(solved.L[5]);
    expect(state.U[8]).toBe(solved.L[2]);
    
    expect(state.R[0]).toBe(solved.U[6]);
    expect(state.R[3]).toBe(solved.U[7]);
    expect(state.R[6]).toBe(solved.U[8]);
    
    expect(state.D[0]).toBe(solved.R[6]);
    expect(state.D[1]).toBe(solved.R[3]);
    expect(state.D[2]).toBe(solved.R[0]);
    
    expect(state.L[2]).toBe(solved.D[0]);
    expect(state.L[5]).toBe(solved.D[1]);
    expect(state.L[8]).toBe(solved.D[2]);
  });
});
