/**
 * Cube State Management
 * Functions for creating, cloning, and checking cube states
 */

import type { CubeState, FaceState, FaceColor, FACE_COLORS } from "@/src/types/cube";

/**
 * Create a solved cube state
 * Each face has all stickers of the same color (the face's center color)
 * @returns Solved CubeState
 */
export function createSolvedState(): CubeState {
  return {
    U: createSolvedFace("white"),
    D: createSolvedFace("yellow"),
    F: createSolvedFace("green"),
    B: createSolvedFace("blue"),
    L: createSolvedFace("orange"),
    R: createSolvedFace("red"),
  };
}

/**
 * Create a face with all stickers of the same color
 * @param color - Color for all stickers on this face
 * @returns FaceState with 9 stickers of the given color
 */
function createSolvedFace(color: FaceColor): FaceState {
  return [
    color, color, color,
    color, color, color,
    color, color, color,
  ];
}

/**
 * Deep clone a cube state for immutability
 * @param state - CubeState to clone
 * @returns Independent copy of the cube state
 */
export function cloneState(state: CubeState): CubeState {
  return {
    U: [...state.U] as FaceState,
    D: [...state.D] as FaceState,
    F: [...state.F] as FaceState,
    B: [...state.B] as FaceState,
    L: [...state.L] as FaceState,
    R: [...state.R] as FaceState,
  };
}

/**
 * Check if a cube state is solved
 * A cube is solved if each face has all stickers of the same color
 * @param state - CubeState to check
 * @returns True if the cube is solved, false otherwise
 */
export function isStateSolved(state: CubeState): boolean {
  // Check each face
  return (
    isFaceSolved(state.U) &&
    isFaceSolved(state.D) &&
    isFaceSolved(state.F) &&
    isFaceSolved(state.B) &&
    isFaceSolved(state.L) &&
    isFaceSolved(state.R)
  );
}

/**
 * Check if a single face is solved (all stickers the same color)
 * @param face - FaceState to check
 * @returns True if all stickers match, false otherwise
 */
function isFaceSolved(face: FaceState): boolean {
  const firstColor = face[0];
  return face.every((color) => color === firstColor);
}

/**
 * Check if two cube states are equal
 * @param state1 - First CubeState
 * @param state2 - Second CubeState
 * @returns True if states are identical, false otherwise
 */
export function statesEqual(state1: CubeState, state2: CubeState): boolean {
  return (
    facesEqual(state1.U, state2.U) &&
    facesEqual(state1.D, state2.D) &&
    facesEqual(state1.F, state2.F) &&
    facesEqual(state1.B, state2.B) &&
    facesEqual(state1.L, state2.L) &&
    facesEqual(state1.R, state2.R)
  );
}

/**
 * Check if two face states are equal
 * @param face1 - First FaceState
 * @param face2 - Second FaceState
 * @returns True if faces are identical, false otherwise
 */
function facesEqual(face1: FaceState, face2: FaceState): boolean {
  for (let i = 0; i < 9; i++) {
    if (face1[i] !== face2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Get a string representation of a cube state for debugging
 * @param state - CubeState to stringify
 * @returns Multi-line string representation
 */
export function stateToString(state: CubeState): string {
  const faceToStr = (face: FaceState, name: string): string => {
    const colorInitial = (c: FaceColor): string => c[0].toUpperCase();
    return `${name}:\n${colorInitial(face[0])}${colorInitial(face[1])}${colorInitial(face[2])}\n${colorInitial(face[3])}${colorInitial(face[4])}${colorInitial(face[5])}\n${colorInitial(face[6])}${colorInitial(face[7])}${colorInitial(face[8])}`;
  };

  return [
    faceToStr(state.U, "U"),
    faceToStr(state.F, "F"),
    faceToStr(state.R, "R"),
    faceToStr(state.B, "B"),
    faceToStr(state.L, "L"),
    faceToStr(state.D, "D"),
  ].join("\n\n");
}
