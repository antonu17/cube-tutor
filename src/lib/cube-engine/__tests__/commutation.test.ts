/**
 * Test if R and F commute properly
 */

import { describe, test, expect } from "vitest";
import { createSolvedState, isStateSolved, statesEqual } from "../state";
import { applyMove } from "../executor";
import { parseMove } from "../parser";

describe("Move Commutation Tests", () => {
  test("R F R' F' (commutator) should equal identity IF R and F commute (they shouldn't)", () => {
    let state = createSolvedState();
    
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("F"));
    state = applyMove(state, parseMove("R'"));
    state = applyMove(state, parseMove("F'"));
    
    console.log("\nR F R' F' result:");
    console.log("Is solved:", isStateSolved(state));
    
    // R and F don't commute, so this should NOT be solved
    // (This is actually a famous corner 3-cycle commutator)
    expect(isStateSolved(state)).toBe(false);
  });
  
  test("F R should NOT equal R F", () => {
    const state1 = createSolvedState();
    const state2 = createSolvedState();
    
    const fr = applyMove(applyMove(state1, parseMove("F")), parseMove("R"));
    const rf = applyMove(applyMove(state2, parseMove("R")), parseMove("F"));
    
    console.log("\nF R vs R F:");
    console.log("Are they equal:", statesEqual(fr, rf));
    
    // They should NOT be equal
    expect(statesEqual(fr, rf)).toBe(false);
  });
  
  test("U and D should commute (they affect different pieces)", () => {
    const state1 = createSolvedState();
    const state2 = createSolvedState();
    
    const ud = applyMove(applyMove(state1, parseMove("U")), parseMove("D"));
    const du = applyMove(applyMove(state2, parseMove("D")), parseMove("U"));
    
    console.log("\nU D vs D U:");
    console.log("Are they equal:", statesEqual(ud, du));
    
    // They SHOULD be equal because they don't share pieces
    expect(statesEqual(ud, du)).toBe(true);
  });
});
