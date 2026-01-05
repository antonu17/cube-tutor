/**
 * Test R move cycle in detail
 */

import { describe, test, expect } from "vitest";
import { createSolvedState } from "../state";
import { applyMove } from "../executor";
import { parseMove } from "../parser";

describe("R Move Detailed Cycle Test", () => {
  test("R move cycle: F right -> U right -> B left (reversed) -> D right -> F right", () => {
    const solved = createSolvedState();
    const state = applyMove(solved, parseMove("R"));
    
    console.log("\n=== R MOVE CYCLE TEST ===");
    console.log("\nExpected transformations:");
    console.log("F[2,5,8] (green) -> U[2,5,8]");
    console.log("U[2,5,8] (white) -> B[6,3,0] (REVERSED because back face)");
    console.log("B[6,3,0] (blue) -> D[2,5,8]");
    console.log("D[2,5,8] (yellow) -> F[2,5,8]");
    
    console.log("\nActual results:");
    console.log(`F[2]: ${solved.F[2]} -> U[2]: ${state.U[2]} (expected ${solved.F[2]})`);
    console.log(`F[5]: ${solved.F[5]} -> U[5]: ${state.U[5]} (expected ${solved.F[5]})`);
    console.log(`F[8]: ${solved.F[8]} -> U[8]: ${state.U[8]} (expected ${solved.F[8]})`);
    
    console.log(`\nU[2]: ${solved.U[2]} -> B[6]: ${state.B[6]} (expected ${solved.U[2]})`);
    console.log(`U[5]: ${solved.U[5]} -> B[3]: ${state.B[3]} (expected ${solved.U[5]})`);
    console.log(`U[8]: ${solved.U[8]} -> B[0]: ${state.B[0]} (expected ${solved.U[8]})`);
    
    console.log(`\nB[6]: ${solved.B[6]} -> D[2]: ${state.D[2]} (expected ${solved.B[6]})`);
    console.log(`B[3]: ${solved.B[3]} -> D[5]: ${state.D[5]} (expected ${solved.B[3]})`);
    console.log(`B[0]: ${solved.B[0]} -> D[8]: ${state.D[8]} (expected ${solved.B[0]})`);
    
    console.log(`\nD[2]: ${solved.D[2]} -> F[2]: ${state.F[2]} (expected ${solved.D[2]})`);
    console.log(`D[5]: ${solved.D[5]} -> F[5]: ${state.F[5]} (expected ${solved.D[5]})`);
    console.log(`D[8]: ${solved.D[8]} -> F[8]: ${state.F[8]} (expected ${solved.D[8]})`);
    
    // Verify F -> U
    expect(state.U[2]).toBe(solved.F[2]);
    expect(state.U[5]).toBe(solved.F[5]);
    expect(state.U[8]).toBe(solved.F[8]);
    
    // Verify U -> B (reversed)
    expect(state.B[6]).toBe(solved.U[2]);
    expect(state.B[3]).toBe(solved.U[5]);
    expect(state.B[0]).toBe(solved.U[8]);
    
    // Verify B -> D
    expect(state.D[2]).toBe(solved.B[6]);
    expect(state.D[5]).toBe(solved.B[3]);
    expect(state.D[8]).toBe(solved.B[0]);
    
    // Verify D -> F
    expect(state.F[2]).toBe(solved.D[2]);
    expect(state.F[5]).toBe(solved.D[5]);
    expect(state.F[8]).toBe(solved.D[8]);
  });
  
  test("Apply R then R' should return to solved", () => {
    let state = createSolvedState();
    const solved = createSolvedState();
    
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("R'"));
    
    // Check if all faces are solved
    const faces: Array<keyof typeof state> = ["U", "D", "F", "B", "L", "R"];
    for (const face of faces) {
      for (let i = 0; i < 9; i++) {
        if (state[face][i] !== solved[face][i]) {
          console.log(`\n${face}[${i}] mismatch: ${state[face][i]} !== ${solved[face][i]}`);
        }
        expect(state[face][i]).toBe(solved[face][i]);
      }
    }
  });
});
