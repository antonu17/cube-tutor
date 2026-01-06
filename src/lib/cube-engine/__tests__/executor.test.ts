/**
 * Tests for move executor
 */

import { describe, it, expect } from "vitest";
import { applyMove, applyAlgorithm, applyAlgorithmStepByStep } from "../executor";
import { createSolvedState, isStateSolved, statesEqual } from "../state";
import { parseMove, parseAlgorithm } from "../parser";

describe("applyMove - basic moves", () => {
  it("should apply R move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("R");
    const newState = applyMove(state, move);
    
    // R face should be rotated but still all red
    expect(newState.R.every((c) => c === "red")).toBe(true);
    
    // Adjacent faces should have changed
    expect(newState.F[2]).toBe("yellow"); // From D
    expect(newState.U[2]).toBe("green");  // From F
    expect(newState.B[6]).toBe("white");  // From U
    expect(newState.D[2]).toBe("blue");   // From B
  });

  it("should apply U move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("U");
    const newState = applyMove(state, move);
    
    // U face should still be all white
    expect(newState.U.every((c) => c === "white")).toBe(true);
    
    // Top rows should have cycled
    expect(newState.F[0]).toBe("red");    // From R
    expect(newState.R[0]).toBe("blue");   // From B
    expect(newState.B[0]).toBe("orange"); // From L
    expect(newState.L[0]).toBe("green");  // From F
  });

  it("should apply F move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("F");
    const newState = applyMove(state, move);
    
    // F face should still be all green
    expect(newState.F.every((c) => c === "green")).toBe(true);
    
    // Check a few key positions
    expect(newState.U[6]).toBe("orange"); // From L
    expect(newState.R[0]).toBe("white");  // From U
    expect(newState.D[2]).toBe("red");    // From R
    expect(newState.L[8]).toBe("yellow"); // From D
  });

  it("should apply D move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("D");
    const newState = applyMove(state, move);
    
    // D face should still be all yellow
    expect(newState.D.every((c) => c === "yellow")).toBe(true);
    
    // Bottom rows should have cycled
    expect(newState.F[6]).toBe("orange"); // From L
    expect(newState.L[6]).toBe("blue");   // From B
    expect(newState.B[6]).toBe("red");    // From R
    expect(newState.R[6]).toBe("green");  // From F
  });

  it("should apply L move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("L");
    const newState = applyMove(state, move);
    
    // L face should still be all orange
    expect(newState.L.every((c) => c === "orange")).toBe(true);
    
    // Check left column changes
    expect(newState.F[0]).toBe("white");  // From U
    expect(newState.D[0]).toBe("green");  // From F
    expect(newState.B[8]).toBe("yellow"); // From D
    expect(newState.U[0]).toBe("blue");   // From B
  });

  it("should apply B move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("B");
    const newState = applyMove(state, move);
    
    // B face should still be all blue
    expect(newState.B.every((c) => c === "blue")).toBe(true);
    
    // Check back face adjacent changes
    expect(newState.U[2]).toBe("red");    // From R
    expect(newState.R[8]).toBe("yellow"); // From D
    expect(newState.D[6]).toBe("orange"); // From L
    expect(newState.L[0]).toBe("white");  // From U
  });
});

describe("applyMove - modifiers", () => {
  it("should apply prime move (counterclockwise)", () => {
    const state = createSolvedState();
    const move = parseMove("R'");
    const newState = applyMove(state, move);
    
    // R' should move pieces opposite to R
    // R moves: F->U, U->B, B->D, D->F
    // R' moves: F->D, D->B, B->U, U->F
    expect(newState.F[2]).toBe("white");  // From U (opposite of R)
    expect(newState.D[2]).toBe("green");  // From F (opposite of R)
  });

  it("should apply double move (180°)", () => {
    const state = createSolvedState();
    const move = parseMove("R2");
    const newState = applyMove(state, move);
    
    // R2 should flip pieces
    expect(newState.F[2]).toBe("blue");   // From B
    expect(newState.B[6]).toBe("green");  // From F
    expect(newState.U[2]).toBe("yellow"); // From D
    expect(newState.D[2]).toBe("white");  // From U
  });
});

describe("applyMove - move cancellation", () => {
  it("should return to solved after R R R R", () => {
    let state = createSolvedState();
    const move = parseMove("R");
    
    state = applyMove(state, move);
    state = applyMove(state, move);
    state = applyMove(state, move);
    state = applyMove(state, move);
    
    expect(isStateSolved(state)).toBe(true);
  });

  it("should return to solved after R R'", () => {
    let state = createSolvedState();
    state = applyMove(state, parseMove("R"));
    state = applyMove(state, parseMove("R'"));
    
    expect(isStateSolved(state)).toBe(true);
  });

  it("should return to solved after R2 R2", () => {
    let state = createSolvedState();
    state = applyMove(state, parseMove("R2"));
    state = applyMove(state, parseMove("R2"));
    
    expect(isStateSolved(state)).toBe(true);
  });

  it("should work for all faces - U U U U", () => {
    let state = createSolvedState();
    for (let i = 0; i < 4; i++) {
      state = applyMove(state, parseMove("U"));
    }
    expect(isStateSolved(state)).toBe(true);
  });
});

describe("applyAlgorithm", () => {
  it("should apply sexy move (R U R' U')", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R U R' U'");
    const newState = applyAlgorithm(state, moves);
    
    // Cube should be scrambled
    expect(isStateSolved(newState)).toBe(false);
  });

  it("should return to solved after sexy move x6", () => {
    let state = createSolvedState();
    const sexyMove = parseAlgorithm("R U R' U'");
    
    // Sexy move has order 6
    for (let i = 0; i < 6; i++) {
      state = applyAlgorithm(state, sexyMove);
    }
    
    expect(isStateSolved(state)).toBe(true);
  });

  it("should handle empty algorithm", () => {
    const state = createSolvedState();
    const newState = applyAlgorithm(state, []);
    
    expect(statesEqual(state, newState)).toBe(true);
  });

  it("should handle single move algorithm", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R");
    const newState = applyAlgorithm(state, moves);
    
    // Should be same as applying R directly
    const directState = applyMove(state, parseMove("R"));
    expect(statesEqual(newState, directState)).toBe(true);
  });

  it("should apply complex algorithm", () => {
    const state = createSolvedState();
    // T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
    const moves = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
    const newState = applyAlgorithm(state, moves);
    
    // Should scramble the cube
    expect(isStateSolved(newState)).toBe(false);
  });
});

describe("applyMove - slice moves", () => {
  it("should apply M move (middle slice) correctly", () => {
    const state = createSolvedState();
    const move = parseMove("M");
    const newState = applyMove(state, move);
    
    // M follows L direction - middle column should cycle like L
    expect(newState.F[1]).toBe("white");  // From U
    expect(newState.D[1]).toBe("green");  // From F
    expect(newState.B[7]).toBe("yellow"); // From D
    expect(newState.U[1]).toBe("blue");   // From B
  });

  it("should apply E move (equatorial slice) correctly", () => {
    const state = createSolvedState();
    const move = parseMove("E");
    const newState = applyMove(state, move);
    
    // E follows D direction - middle row should cycle like D
    expect(newState.F[3]).toBe("orange"); // From L
    expect(newState.L[3]).toBe("blue");   // From B
    expect(newState.B[3]).toBe("red");    // From R
    expect(newState.R[3]).toBe("green");  // From F
  });

  it("should apply S move (standing slice) correctly", () => {
    const state = createSolvedState();
    const move = parseMove("S");
    const newState = applyMove(state, move);
    
    // S follows F direction - middle slice parallel to F should cycle
    expect(newState.U[4]).toBe("orange"); // From L
    expect(newState.R[4]).toBe("white");  // From U
    expect(newState.D[4]).toBe("red");    // From R
    expect(newState.L[4]).toBe("yellow"); // From D
  });

  it("should return to solved after M M M M", () => {
    let state = createSolvedState();
    const move = parseMove("M");
    
    for (let i = 0; i < 4; i++) {
      state = applyMove(state, move);
    }
    
    expect(isStateSolved(state)).toBe(true);
  });
});

describe("applyMove - wide moves", () => {
  it("should apply r (Rw) move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("r");
    const newState = applyMove(state, move);
    
    // r = R + M', should move right two layers
    // Right face should be rotated
    expect(newState.R.every((c) => c === "red")).toBe(true);
    
    // Both right and middle columns should move
    expect(newState.F[2]).toBe("yellow"); // From D (right column)
    expect(newState.F[1]).toBe("yellow"); // From D (middle column, via M')
  });

  it("should apply Uw move correctly", () => {
    const state = createSolvedState();
    const move = parseMove("Uw");
    const newState = applyMove(state, move);
    
    // Uw = U + E', should move upper two layers
    expect(newState.U.every((c) => c === "white")).toBe(true);
    
    // Top two rows should cycle
    expect(newState.F[0]).toBe("red");    // From R (top row)
    expect(newState.F[3]).toBe("red");    // From R (middle row, via E')
  });

  it("should return to solved after r r r r", () => {
    let state = createSolvedState();
    const move = parseMove("r");
    
    for (let i = 0; i < 4; i++) {
      state = applyMove(state, move);
    }
    
    expect(isStateSolved(state)).toBe(true);
  });
});

describe("applyMove - cube rotations", () => {
  it("should apply x rotation correctly", () => {
    const state = createSolvedState();
    const move = parseMove("x");
    const newState = applyMove(state, move);
    
    // x rotates cube like R, all layers should move
    // After x: F becomes U, U becomes B, B becomes D, D becomes F
    expect(newState.U.every((c) => c === "green")).toBe(true);  // Was F
    expect(newState.B.every((c) => c === "white")).toBe(true);  // Was U
    expect(newState.D.every((c) => c === "blue")).toBe(true);   // Was B
    expect(newState.F.every((c) => c === "yellow")).toBe(true); // Was D
  });

  it("should apply y rotation correctly", () => {
    const state = createSolvedState();
    const move = parseMove("y");
    const newState = applyMove(state, move);
    
    // y rotates cube like U, all layers should move
    // After y: F becomes L, L becomes B, B becomes R, R becomes F
    expect(newState.F.every((c) => c === "red")).toBe(true);    // Was R
    expect(newState.L.every((c) => c === "green")).toBe(true);  // Was F
    expect(newState.B.every((c) => c === "orange")).toBe(true); // Was L
    expect(newState.R.every((c) => c === "blue")).toBe(true);   // Was B
  });

  it("should apply z rotation correctly", () => {
    const state = createSolvedState();
    const move = parseMove("z");
    const newState = applyMove(state, move);
    
    // z rotates cube like F, all layers should move
    expect(newState.U[6]).toBe("orange"); // Check one position rotated like F
  });

  it("should return to solved after x x x x", () => {
    let state = createSolvedState();
    const move = parseMove("x");
    
    for (let i = 0; i < 4; i++) {
      state = applyMove(state, move);
    }
    
    expect(isStateSolved(state)).toBe(true);
  });

  it("should return to solved after y y y y", () => {
    let state = createSolvedState();
    const move = parseMove("y");
    
    for (let i = 0; i < 4; i++) {
      state = applyMove(state, move);
    }
    
    expect(isStateSolved(state)).toBe(true);
  });
});

describe("applyAlgorithmStepByStep", () => {
  it("should return array with initial state + one state per move", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R U R' U'");
    const states = applyAlgorithmStepByStep(state, moves);
    
    // Should have 5 states: initial + 4 moves
    expect(states).toHaveLength(5);
    
    // First state should be initial (solved)
    expect(isStateSolved(states[0])).toBe(true);
    
    // Last state should match applyAlgorithm result
    const finalState = applyAlgorithm(state, moves);
    expect(statesEqual(states[4], finalState)).toBe(true);
  });

  it("should have each state different from previous", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R U F");
    const states = applyAlgorithmStepByStep(state, moves);
    
    // Each state should be different
    expect(statesEqual(states[0], states[1])).toBe(false);
    expect(statesEqual(states[1], states[2])).toBe(false);
    expect(statesEqual(states[2], states[3])).toBe(false);
  });

  it("should handle empty algorithm", () => {
    const state = createSolvedState();
    const states = applyAlgorithmStepByStep(state, []);
    
    // Should only have initial state
    expect(states).toHaveLength(1);
    expect(isStateSolved(states[0])).toBe(true);
  });

  it("should preserve immutability", () => {
    const state = createSolvedState();
    const moves = parseAlgorithm("R U");
    const states = applyAlgorithmStepByStep(state, moves);
    
    // Modify one state
    states[1].U[0] = "red";
    
    // Other states should be unaffected
    expect(states[0].U[0]).toBe("white");
    expect(states[2].U[0]).not.toBe("red");
  });
});
