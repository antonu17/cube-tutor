/**
 * Move Executor
 * Applies moves and algorithms to cube states
 */

import type { CubeState, FaceState, Move } from "@/src/types/cube";
import { cloneState } from "./state";

/**
 * Apply a single move to a cube state
 * @param state - Current CubeState
 * @param move - Move to apply
 * @returns New CubeState with move applied
 */
export function applyMove(state: CubeState, move: Move): CubeState {
  const newState = cloneState(state);

  // Handle modifiers
  switch (move.modifier) {
    case "":
      // Single clockwise turn
      applyBasicMove(newState, move.base);
      break;
    case "'":
      // Counter-clockwise turn (do clockwise 3 times)
      applyBasicMove(newState, move.base);
      applyBasicMove(newState, move.base);
      applyBasicMove(newState, move.base);
      break;
    case "2":
      // 180° turn (do clockwise 2 times)
      applyBasicMove(newState, move.base);
      applyBasicMove(newState, move.base);
      break;
  }

  return newState;
}

/**
 * Apply a basic (clockwise) move to a cube state (mutates state)
 * @param state - CubeState to modify
 * @param moveBase - Base move (R, U, F, etc.)
 */
function applyBasicMove(state: CubeState, moveBase: string): void {
  switch (moveBase) {
    case "R":
      applyR(state);
      break;
    case "L":
      applyL(state);
      break;
    case "U":
      applyU(state);
      break;
    case "D":
      applyD(state);
      break;
    case "F":
      applyF(state);
      break;
    case "B":
      applyB(state);
      break;
    // Slice and rotation moves - implement later if needed
    case "M":
    case "E":
    case "S":
    case "x":
    case "y":
    case "z":
    // Wide moves - implement later if needed
    case "Rw":
    case "Lw":
    case "Uw":
    case "Dw":
    case "Fw":
    case "Bw":
    case "r":
    case "l":
    case "u":
    case "d":
    case "f":
    case "b":
      throw new Error(`Move '${moveBase}' not yet implemented`);
    default:
      throw new Error(`Unknown move: ${moveBase}`);
  }
}

/**
 * Rotate a face 90° clockwise
 * @param face - FaceState to rotate
 */
function rotateFaceClockwise(face: FaceState): void {
  // Store original positions
  const temp = [...face];
  
  // Map positions: corners rotate, edges rotate
  // Original:  0 1 2
  //            3 4 5
  //            6 7 8
  // Rotated:   6 3 0
  //            7 4 1
  //            8 5 2
  face[0] = temp[6];
  face[1] = temp[3];
  face[2] = temp[0];
  face[3] = temp[7];
  face[4] = temp[4]; // Center stays
  face[5] = temp[1];
  face[6] = temp[8];
  face[7] = temp[5];
  face[8] = temp[2];
}

/**
 * Apply R move (right face clockwise)
 * Rotates R face + moves edge pieces
 */
function applyR(state: CubeState): void {
  // Rotate R face
  rotateFaceClockwise(state.R);
  
  // Move edge pieces (right column of each adjacent face)
  // Cycle: F[2,5,8] -> U[2,5,8] -> B[6,3,0] -> D[2,5,8] -> F[2,5,8]
  const temp = [state.F[2], state.F[5], state.F[8]];
  
  state.F[2] = state.D[2];
  state.F[5] = state.D[5];
  state.F[8] = state.D[8];
  
  state.D[2] = state.B[6];
  state.D[5] = state.B[3];
  state.D[8] = state.B[0];
  
  state.B[6] = state.U[2];
  state.B[3] = state.U[5];
  state.B[0] = state.U[8];
  
  state.U[2] = temp[0];
  state.U[5] = temp[1];
  state.U[8] = temp[2];
}

/**
 * Apply L move (left face clockwise)
 */
function applyL(state: CubeState): void {
  // Rotate L face
  rotateFaceClockwise(state.L);
  
  // Move edge pieces (left column)
  // Cycle: F[0,3,6] -> D[0,3,6] -> B[8,5,2] -> U[0,3,6] -> F[0,3,6]
  const temp = [state.F[0], state.F[3], state.F[6]];
  
  state.F[0] = state.U[0];
  state.F[3] = state.U[3];
  state.F[6] = state.U[6];
  
  state.U[0] = state.B[8];
  state.U[3] = state.B[5];
  state.U[6] = state.B[2];
  
  state.B[8] = state.D[0];
  state.B[5] = state.D[3];
  state.B[2] = state.D[6];
  
  state.D[0] = temp[0];
  state.D[3] = temp[1];
  state.D[6] = temp[2];
}

/**
 * Apply U move (up face clockwise)
 */
function applyU(state: CubeState): void {
  // Rotate U face
  rotateFaceClockwise(state.U);
  
  // Move edge pieces (top row)
  // Cycle: F[0,1,2] -> L[0,1,2] -> B[0,1,2] -> R[0,1,2] -> F[0,1,2]
  const temp = [state.F[0], state.F[1], state.F[2]];
  
  state.F[0] = state.R[0];
  state.F[1] = state.R[1];
  state.F[2] = state.R[2];
  
  state.R[0] = state.B[0];
  state.R[1] = state.B[1];
  state.R[2] = state.B[2];
  
  state.B[0] = state.L[0];
  state.B[1] = state.L[1];
  state.B[2] = state.L[2];
  
  state.L[0] = temp[0];
  state.L[1] = temp[1];
  state.L[2] = temp[2];
}

/**
 * Apply D move (down face clockwise)
 */
function applyD(state: CubeState): void {
  // Rotate D face
  rotateFaceClockwise(state.D);
  
  // Move edge pieces (bottom row)
  // Cycle: F[6,7,8] -> R[6,7,8] -> B[6,7,8] -> L[6,7,8] -> F[6,7,8]
  const temp = [state.F[6], state.F[7], state.F[8]];
  
  state.F[6] = state.L[6];
  state.F[7] = state.L[7];
  state.F[8] = state.L[8];
  
  state.L[6] = state.B[6];
  state.L[7] = state.B[7];
  state.L[8] = state.B[8];
  
  state.B[6] = state.R[6];
  state.B[7] = state.R[7];
  state.B[8] = state.R[8];
  
  state.R[6] = temp[0];
  state.R[7] = temp[1];
  state.R[8] = temp[2];
}

/**
 * Apply F move (front face clockwise)
 */
function applyF(state: CubeState): void {
  // Rotate F face
  rotateFaceClockwise(state.F);
  
  // Move edge pieces
  // Cycle: U[6,7,8] -> R[0,3,6] -> D[2,1,0] -> L[8,5,2] -> U[6,7,8]
  const temp = [state.U[6], state.U[7], state.U[8]];
  
  state.U[6] = state.L[8];
  state.U[7] = state.L[5];
  state.U[8] = state.L[2];
  
  state.L[8] = state.D[2];
  state.L[5] = state.D[1];
  state.L[2] = state.D[0];
  
  state.D[2] = state.R[6];
  state.D[1] = state.R[3];
  state.D[0] = state.R[0];
  
  state.R[6] = temp[0];
  state.R[3] = temp[1];
  state.R[0] = temp[2];
}

/**
 * Apply B move (back face clockwise)
 */
function applyB(state: CubeState): void {
  // Rotate B face
  rotateFaceClockwise(state.B);
  
  // Move edge pieces
  // Cycle: U[2,1,0] -> L[0,3,6] -> D[6,7,8] -> R[8,5,2] -> U[2,1,0]
  const temp = [state.U[2], state.U[1], state.U[0]];
  
  state.U[2] = state.R[8];
  state.U[1] = state.R[5];
  state.U[0] = state.R[2];
  
  state.R[8] = state.D[6];
  state.R[5] = state.D[7];
  state.R[2] = state.D[8];
  
  state.D[6] = state.L[0];
  state.D[7] = state.L[3];
  state.D[8] = state.L[6];
  
  state.L[0] = temp[0];
  state.L[3] = temp[1];
  state.L[6] = temp[2];
}

/**
 * Apply an algorithm (sequence of moves) to a cube state
 * @param state - Current CubeState
 * @param moves - Array of Move objects
 * @returns New CubeState with algorithm applied
 */
export function applyAlgorithm(state: CubeState, moves: Move[]): CubeState {
  let currentState = state;
  
  for (const move of moves) {
    currentState = applyMove(currentState, move);
  }
  
  return currentState;
}

/**
 * Apply an algorithm step by step, returning state after each move
 * Useful for animations and tutorials
 * @param state - Initial CubeState
 * @param moves - Array of Move objects
 * @returns Array of CubeStates (one per move + initial state)
 */
export function applyAlgorithmStepByStep(state: CubeState, moves: Move[]): CubeState[] {
  const states: CubeState[] = [cloneState(state)];
  let currentState = state;
  
  for (const move of moves) {
    currentState = applyMove(currentState, move);
    states.push(cloneState(currentState));
  }
  
  return states;
}
