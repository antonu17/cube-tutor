/**
 * Tests for cube state management
 */

import { describe, it, expect } from "vitest";
import {
  createSolvedState,
  cloneState,
  isStateSolved,
  statesEqual,
  stateToString,
} from "../state";
import type { CubeState } from "@/src/types/cube";

describe("createSolvedState", () => {
  it("should create a solved cube", () => {
    const state = createSolvedState();
    
    // Check all faces exist
    expect(state.U).toBeDefined();
    expect(state.D).toBeDefined();
    expect(state.F).toBeDefined();
    expect(state.B).toBeDefined();
    expect(state.L).toBeDefined();
    expect(state.R).toBeDefined();
  });

  it("should have correct colors for each face", () => {
    const state = createSolvedState();
    
    // U face should be all white
    expect(state.U.every((c) => c === "white")).toBe(true);
    
    // D face should be all yellow
    expect(state.D.every((c) => c === "yellow")).toBe(true);
    
    // F face should be all green
    expect(state.F.every((c) => c === "green")).toBe(true);
    
    // B face should be all blue
    expect(state.B.every((c) => c === "blue")).toBe(true);
    
    // L face should be all orange
    expect(state.L.every((c) => c === "orange")).toBe(true);
    
    // R face should be all red
    expect(state.R.every((c) => c === "red")).toBe(true);
  });

  it("should have 9 stickers per face", () => {
    const state = createSolvedState();
    
    expect(state.U).toHaveLength(9);
    expect(state.D).toHaveLength(9);
    expect(state.F).toHaveLength(9);
    expect(state.B).toHaveLength(9);
    expect(state.L).toHaveLength(9);
    expect(state.R).toHaveLength(9);
  });
});

describe("cloneState", () => {
  it("should create an independent copy", () => {
    const original = createSolvedState();
    const clone = cloneState(original);
    
    // Modify the clone
    clone.U[0] = "red";
    
    // Original should be unchanged
    expect(original.U[0]).toBe("white");
    expect(clone.U[0]).toBe("red");
  });

  it("should have the same values initially", () => {
    const original = createSolvedState();
    const clone = cloneState(original);
    
    expect(statesEqual(original, clone)).toBe(true);
  });

  it("should handle modified states", () => {
    const state = createSolvedState();
    state.R[4] = "blue"; // Modify center
    
    const clone = cloneState(state);
    expect(clone.R[4]).toBe("blue");
    
    // Modify clone
    clone.R[4] = "green";
    expect(state.R[4]).toBe("blue"); // Original unchanged
  });
});

describe("isStateSolved", () => {
  it("should return true for solved state", () => {
    const state = createSolvedState();
    expect(isStateSolved(state)).toBe(true);
  });

  it("should return false for unsolved state", () => {
    const state = createSolvedState();
    state.U[0] = "red"; // Swap one sticker
    expect(isStateSolved(state)).toBe(false);
  });

  it("should return false if only one face is unsolved", () => {
    const state = createSolvedState();
    state.R[8] = "yellow"; // Change corner
    expect(isStateSolved(state)).toBe(false);
  });

  it("should handle all faces being wrong", () => {
    const state = createSolvedState();
    // Scramble by swapping colors
    state.U[0] = "red";
    state.D[0] = "green";
    state.F[0] = "blue";
    state.B[0] = "orange";
    state.L[0] = "white";
    state.R[0] = "yellow";
    
    expect(isStateSolved(state)).toBe(false);
  });
});

describe("statesEqual", () => {
  it("should return true for identical states", () => {
    const state1 = createSolvedState();
    const state2 = createSolvedState();
    expect(statesEqual(state1, state2)).toBe(true);
  });

  it("should return false for different states", () => {
    const state1 = createSolvedState();
    const state2 = createSolvedState();
    state2.U[0] = "red";
    expect(statesEqual(state1, state2)).toBe(false);
  });

  it("should return true when comparing state to itself", () => {
    const state = createSolvedState();
    expect(statesEqual(state, state)).toBe(true);
  });

  it("should return false if any face differs", () => {
    const state1 = createSolvedState();
    const state2 = cloneState(state1);
    state2.B[4] = "green"; // Change center of back face
    expect(statesEqual(state1, state2)).toBe(false);
  });
});

describe("stateToString", () => {
  it("should generate a string representation", () => {
    const state = createSolvedState();
    const str = stateToString(state);
    
    expect(str).toContain("U:");
    expect(str).toContain("D:");
    expect(str).toContain("F:");
    expect(str).toContain("B:");
    expect(str).toContain("L:");
    expect(str).toContain("R:");
  });

  it("should show correct color initials for solved state", () => {
    const state = createSolvedState();
    const str = stateToString(state);
    
    // U face should be all W (white)
    expect(str).toContain("WWW\nWWW\nWWW");
    // Check at least one other face
    expect(str).toContain("GGG\nGGG\nGGG"); // Green (F face)
  });

  it("should handle modified state", () => {
    const state = createSolvedState();
    state.U[0] = "red"; // Top-left corner
    const str = stateToString(state);
    
    // Should show R for red in first position
    expect(str).toContain("RWW");
  });
});
