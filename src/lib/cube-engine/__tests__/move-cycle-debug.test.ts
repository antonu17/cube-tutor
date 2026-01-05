/**
 * Debug tests to verify move cycles are correct
 * Tests that 4 applications of each move returns to solved state
 */

import { describe, test, expect } from "vitest";
import { createSolvedState } from "../state";
import { applyMove } from "../executor";
import { parseMove } from "../parser";
import type { CubeState } from "@/src/types/cube";

function statesEqual(a: CubeState, b: CubeState): boolean {
  const faces: Array<keyof CubeState> = ["U", "D", "F", "B", "L", "R"];
  for (const face of faces) {
    for (let i = 0; i < 9; i++) {
      if (a[face][i] !== b[face][i]) {
        return false;
      }
    }
  }
  return true;
}

function printFace(state: CubeState, faceName: keyof CubeState) {
  const face = state[faceName];
  return `${faceName}: [${face[0]}${face[1]}${face[2]} ${face[3]}${face[4]}${face[5]} ${face[6]}${face[7]}${face[8]}]`;
}

describe("Move Cycle Correctness", () => {
  test("F move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    // Apply F four times
    state = applyMove(state, parseMove("F"));
    state = applyMove(state, parseMove("F"));
    state = applyMove(state, parseMove("F"));
    state = applyMove(state, parseMove("F"));
    
    if (!statesEqual(state, original)) {
      console.log("\n=== F MOVE 4x CYCLE TEST FAILED ===");
      console.log("Expected (solved):", printFace(original, "U"));
      console.log("Got:               ", printFace(state, "U"));
      console.log("Expected (solved):", printFace(original, "R"));
      console.log("Got:               ", printFace(state, "R"));
      console.log("Expected (solved):", printFace(original, "D"));
      console.log("Got:               ", printFace(state, "D"));
      console.log("Expected (solved):", printFace(original, "L"));
      console.log("Got:               ", printFace(state, "L"));
    }
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("B move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    // Apply B four times
    state = applyMove(state, parseMove("B"));
    state = applyMove(state, parseMove("B"));
    state = applyMove(state, parseMove("B"));
    state = applyMove(state, parseMove("B"));
    
    if (!statesEqual(state, original)) {
      console.log("\n=== B MOVE 4x CYCLE TEST FAILED ===");
      console.log("Expected (solved):", printFace(original, "U"));
      console.log("Got:               ", printFace(state, "U"));
      console.log("Expected (solved):", printFace(original, "R"));
      console.log("Got:               ", printFace(state, "R"));
      console.log("Expected (solved):", printFace(original, "D"));
      console.log("Got:               ", printFace(state, "D"));
      console.log("Expected (solved):", printFace(original, "L"));
      console.log("Got:               ", printFace(state, "L"));
    }
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("R move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("R"));
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("L move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("L"));
    state = applyMove(state, parseMove("L"));
    state = applyMove(state, parseMove("L"));
    state = applyMove(state, parseMove("L"));
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("U move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("U"));
    state = applyMove(state, parseMove("U"));
    state = applyMove(state, parseMove("U"));
    state = applyMove(state, parseMove("U"));
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("D move: 4 applications should return to solved state", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("D"));
    state = applyMove(state, parseMove("D"));
    state = applyMove(state, parseMove("D"));
    state = applyMove(state, parseMove("D"));
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("F and F' should cancel out", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("F"));
    state = applyMove(state, parseMove("F'"));
    
    if (!statesEqual(state, original)) {
      console.log("\n=== F F' CANCEL TEST FAILED ===");
      console.log("Expected (solved):", printFace(original, "U"));
      console.log("Got:               ", printFace(state, "U"));
      console.log("Expected (solved):", printFace(original, "R"));
      console.log("Got:               ", printFace(state, "R"));
      console.log("Expected (solved):", printFace(original, "D"));
      console.log("Got:               ", printFace(state, "D"));
      console.log("Expected (solved):", printFace(original, "L"));
      console.log("Got:               ", printFace(state, "L"));
    }
    
    expect(statesEqual(state, original)).toBe(true);
  });

  test("B and B' should cancel out", () => {
    let state = createSolvedState();
    const original = createSolvedState();
    
    state = applyMove(state, parseMove("B"));
    state = applyMove(state, parseMove("B'"));
    
    if (!statesEqual(state, original)) {
      console.log("\n=== B B' CANCEL TEST FAILED ===");
      console.log("Expected (solved):", printFace(original, "U"));
      console.log("Got:               ", printFace(state, "U"));
      console.log("Expected (solved):", printFace(original, "R"));
      console.log("Got:               ", printFace(state, "R"));
      console.log("Expected (solved):", printFace(original, "D"));
      console.log("Got:               ", printFace(state, "D"));
      console.log("Expected (solved):", printFace(original, "L"));
      console.log("Got:               ", printFace(state, "L"));
    }
    
    expect(statesEqual(state, original)).toBe(true);
  });
});
