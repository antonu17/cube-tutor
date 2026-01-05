/**
 * Integration tests for cube engine
 * Tests the complete flow: parse → execute → validate
 */

import { describe, it, expect } from "vitest";
import {
  parseAlgorithm,
  createSolvedState,
  applyAlgorithm,
  isStateSolved,
  invertAlgorithm,
  movesToNotation,
  isValidAlgorithm,
  applyAlgorithmStepByStep,
} from "../index";

describe("Cube Engine Integration", () => {
  it("should handle complete workflow: parse → apply → check", () => {
    // Parse algorithm
    const moves = parseAlgorithm("R U R' U'");
    expect(moves).toHaveLength(4);

    // Create solved state
    const solvedState = createSolvedState();
    expect(isStateSolved(solvedState)).toBe(true);

    // Apply algorithm
    const scrambledState = applyAlgorithm(solvedState, moves);
    expect(isStateSolved(scrambledState)).toBe(false);
  });

  it("should solve cube with algorithm + inverse", () => {
    const algo = "R U R' U' F' R U R' U' R' F R2";
    const moves = parseAlgorithm(algo);
    const inverse = invertAlgorithm(moves);

    let state = createSolvedState();
    state = applyAlgorithm(state, moves);
    expect(isStateSolved(state)).toBe(false);

    state = applyAlgorithm(state, inverse);
    expect(isStateSolved(state)).toBe(true);
  });

  it("should work with real OLL algorithm", () => {
    // OLL 21 (H case): R U R' U R U' R' U R U2 R'
    const notation = "R U R' U R U' R' U R U2 R'";
    expect(isValidAlgorithm(notation)).toBe(true);

    const moves = parseAlgorithm(notation);
    const state = createSolvedState();
    const result = applyAlgorithm(state, moves);

    expect(isStateSolved(result)).toBe(false);
  });

  it("should work with real PLL algorithm", () => {
    // T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
    const notation = "R U R' U' R' F R2 U' R' U' R U R' F'";
    expect(isValidAlgorithm(notation)).toBe(true);

    const moves = parseAlgorithm(notation);
    const state = createSolvedState();
    const result = applyAlgorithm(state, moves);

    expect(isStateSolved(result)).toBe(false);
  });

  it("should handle sexy move properties", () => {
    // Sexy move (R U R' U') has order 6
    const moves = parseAlgorithm("R U R' U'");
    let state = createSolvedState();

    // Apply 6 times - should return to solved
    for (let i = 0; i < 6; i++) {
      state = applyAlgorithm(state, moves);
      
      if (i < 5) {
        expect(isStateSolved(state)).toBe(false);
      }
    }

    expect(isStateSolved(state)).toBe(true);
  });

  it("should generate step-by-step states for tutorial", () => {
    const moves = parseAlgorithm("R U R' U'");
    const solvedState = createSolvedState();
    const states = applyAlgorithmStepByStep(solvedState, moves);

    expect(states).toHaveLength(5); // Initial + 4 moves

    // First state is solved
    expect(isStateSolved(states[0])).toBe(true);

    // Intermediate states are not solved
    for (let i = 1; i < states.length; i++) {
      expect(isStateSolved(states[i])).toBe(false);
    }
  });

  it("should handle algorithm reconstruction", () => {
    const notation = "R U2 R' F' R U R' U' R' F R2 U' R' U'";
    const moves = parseAlgorithm(notation);
    const reconstructed = movesToNotation(moves);

    expect(reconstructed).toBe(notation);
  });

  it("should handle commutators", () => {
    // [R, U] = R U R' U'
    const notation = "R U R' U'";
    const moves = parseAlgorithm(notation);

    let state = createSolvedState();
    
    // A commutator always affects 3-cycles
    state = applyAlgorithm(state, moves);
    expect(isStateSolved(state)).toBe(false);
  });

  it("should validate and execute in one flow", () => {
    const notation = "R U R' U'";

    // Validate first
    if (!isValidAlgorithm(notation)) {
      throw new Error("Invalid algorithm");
    }

    // Parse
    const moves = parseAlgorithm(notation);

    // Execute
    const state = createSolvedState();
    const result = applyAlgorithm(state, moves);

    expect(result).toBeDefined();
    expect(isStateSolved(result)).toBe(false);
  });

  it("should handle complex algorithm chains", () => {
    // Chain multiple algorithms
    const alg1 = parseAlgorithm("R U R' U'");
    const alg2 = parseAlgorithm("F R U R' U' F'");
    const alg3 = parseAlgorithm("R U2 R'");

    let state = createSolvedState();
    state = applyAlgorithm(state, alg1);
    state = applyAlgorithm(state, alg2);
    state = applyAlgorithm(state, alg3);

    expect(isStateSolved(state)).toBe(false);

    // Apply inverse chain
    const inv3 = invertAlgorithm(alg3);
    const inv2 = invertAlgorithm(alg2);
    const inv1 = invertAlgorithm(alg1);

    state = applyAlgorithm(state, inv3);
    state = applyAlgorithm(state, inv2);
    state = applyAlgorithm(state, inv1);

    expect(isStateSolved(state)).toBe(true);
  });

  it("should handle edge case: empty algorithm", () => {
    const moves = parseAlgorithm("");
    const state = createSolvedState();
    const result = applyAlgorithm(state, moves);

    expect(isStateSolved(result)).toBe(true);
  });

  it("should maintain state immutability through workflow", () => {
    const moves = parseAlgorithm("R U R' U'");
    const initialState = createSolvedState();
    const finalState = applyAlgorithm(initialState, moves);

    // Initial state should still be solved
    expect(isStateSolved(initialState)).toBe(true);
    // Final state should be different
    expect(isStateSolved(finalState)).toBe(false);
  });
});

describe("Performance Tests", () => {
  it("should handle 100 moves quickly", () => {
    const state = createSolvedState();
    const move = parseAlgorithm("R")[0];
    
    const start = performance.now();
    let currentState = state;
    for (let i = 0; i < 100; i++) {
      currentState = applyAlgorithm(currentState, [move]);
    }
    const elapsed = performance.now() - start;

    // Should complete in under 10ms
    expect(elapsed).toBeLessThan(10);
  });

  it("should handle typical algorithm application quickly", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
    
    const start = performance.now();
    applyAlgorithm(state, moves);
    const elapsed = performance.now() - start;

    // Should complete in under 1ms
    expect(elapsed).toBeLessThan(1);
  });
});
