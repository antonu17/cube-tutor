import { describe, it, expect } from "vitest";
import { applyZ2Rotation } from "../executor";
import { createSolvedState } from "../state";

describe("applyZ2Rotation", () => {
  it("should swap U and D faces", () => {
    const state = createSolvedState();
    const rotated = applyZ2Rotation(state);
    
    // After z2, yellow should be on top, white on bottom
    expect(rotated.U).toEqual(['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow']);
    expect(rotated.D).toEqual(['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white']);
  });

  it("should rotate side faces correctly", () => {
    const state = createSolvedState();
    const rotated = applyZ2Rotation(state);
    
    // After z2 (180° rotation around z-axis), the side faces swap and rotate:
    // F (green) stays as F (green)
    // B (blue) stays as B (blue)
    // L (orange) becomes R (orange from the right perspective)
    // R (red) becomes L (red from the left perspective)
    expect(rotated.F).toEqual(['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green']);
    expect(rotated.B).toEqual(['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']);
    expect(rotated.L).toEqual(['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']);
    expect(rotated.R).toEqual(['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']);
  });

  it("should not mutate the original state", () => {
    const state = createSolvedState();
    const originalU = [...state.U];
    
    applyZ2Rotation(state);
    
    // Original state should be unchanged
    expect(state.U).toEqual(originalU);
  });

  it("should be reversible (z2 + z2 = identity)", () => {
    const state = createSolvedState();
    const rotated = applyZ2Rotation(state);
    const rotatedBack = applyZ2Rotation(rotated);
    
    // After two z2 rotations, should be back to solved state
    expect(rotatedBack.U).toEqual(state.U);
    expect(rotatedBack.D).toEqual(state.D);
    expect(rotatedBack.F).toEqual(state.F);
    expect(rotatedBack.B).toEqual(state.B);
    expect(rotatedBack.L).toEqual(state.L);
    expect(rotatedBack.R).toEqual(state.R);
  });
});
