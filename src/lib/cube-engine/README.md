# Cube Engine API Documentation

The Cube Engine is the core logic system for Cube Tutor. It provides functions for parsing WCA notation, managing cube state, executing moves and algorithms, and validating notation.

## Table of Contents

- [Parser](#parser)
- [State Management](#state-management)
- [Move Execution](#move-execution)
- [Validation](#validation)
- [Types](#types)

## Parser

Functions for parsing WCA (World Cube Association) notation.

### `parseMove(moveStr: string): Move`

Parse a single move string into a Move object.

**Parameters:**
- `moveStr` - Move string (e.g., "R", "U'", "F2", "Rw")

**Returns:** `Move` object with `base`, `modifier`, and `notation` properties

**Throws:** `Error` if move notation is invalid

**Example:**
```typescript
import { parseMove } from "@/src/lib/cube-engine";

const move = parseMove("R'");
// { base: "R", modifier: "'", notation: "R'" }
```

### `parseAlgorithm(notation: string): Move[]`

Parse an algorithm string into an array of Move objects.

**Parameters:**
- `notation` - Algorithm notation string (e.g., "R U R' U'")

**Returns:** Array of `Move` objects

**Throws:** `Error` if any move notation is invalid

**Example:**
```typescript
const moves = parseAlgorithm("R U R' U'");
// [{ base: "R", ...}, { base: "U", ...}, ...]
```

### `invertMove(move: Move): Move`

Get the inverse of a move (clockwise ↔ counterclockwise).

### `invertAlgorithm(moves: Move[]): Move[]`

Get the inverse of an algorithm (reversed with each move inverted).

### `movesToNotation(moves: Move[]): string`

Convert an array of moves back to notation string.

## State Management

Functions for creating and managing cube states.

### `createSolvedState(): CubeState`

Create a solved cube state with each face having all stickers of the same color.

**Returns:** Solved `CubeState` object

**Example:**
```typescript
import { createSolvedState } from "@/src/lib/cube-engine";

const solved = createSolvedState();
// { U: [white, white, ...], D: [yellow, ...], ... }
```

### `cloneState(state: CubeState): CubeState`

Deep clone a cube state for immutability.

**Parameters:**
- `state` - CubeState to clone

**Returns:** Independent copy of the cube state

### `isStateSolved(state: CubeState): boolean`

Check if a cube state is solved (each face has all stickers of the same color).

**Example:**
```typescript
const solved = createSolvedState();
isStateSolved(solved); // true

const scrambled = applyMove(solved, parseMove("R"));
isStateSolved(scrambled); // false
```

### `statesEqual(state1: CubeState, state2: CubeState): boolean`

Check if two cube states are identical.

### `stateToString(state: CubeState): string`

Get a string representation of a cube state for debugging.

## Move Execution

Functions for applying moves and algorithms to cube states.

### `applyMove(state: CubeState, move: Move): CubeState`

Apply a single move to a cube state.

**Parameters:**
- `state` - Current CubeState
- `move` - Move to apply

**Returns:** New CubeState with move applied (original state unchanged)

**Example:**
```typescript
import { createSolvedState, applyMove, parseMove } from "@/src/lib/cube-engine";

const state = createSolvedState();
const move = parseMove("R");
const newState = applyMove(state, move);
```

### `applyAlgorithm(state: CubeState, moves: Move[]): CubeState`

Apply an algorithm (sequence of moves) to a cube state.

**Parameters:**
- `state` - Current CubeState
- `moves` - Array of Move objects

**Returns:** New CubeState with algorithm applied

**Example:**
```typescript
const state = createSolvedState();
const moves = parseAlgorithm("R U R' U'");
const result = applyAlgorithm(state, moves);
```

### `applyAlgorithmStepByStep(state: CubeState, moves: Move[]): CubeState[]`

Apply an algorithm step by step, returning state after each move. Useful for animations and tutorials.

**Parameters:**
- `state` - Initial CubeState
- `moves` - Array of Move objects

**Returns:** Array of CubeStates (one per move + initial state)

**Example:**
```typescript
const states = applyAlgorithmStepByStep(solved, parseAlgorithm("R U R' U'"));
// states[0] = initial (solved)
// states[1] = after R
// states[2] = after R U
// states[3] = after R U R'
// states[4] = after R U R' U'
```

## Validation

Functions for validating WCA notation without throwing errors.

### `isValidMove(moveStr: string): boolean`

Check if a move string is valid WCA notation (no errors thrown).

**Example:**
```typescript
isValidMove("R");   // true
isValidMove("U'");  // true
isValidMove("X");   // false
isValidMove("R3");  // false
```

### `isValidAlgorithm(notation: string): boolean`

Check if an algorithm string is valid WCA notation.

### `validateAlgorithmData(algorithm: Algorithm): ValidationResult`

Validate an Algorithm object comprehensively.

**Returns:** `ValidationResult` with `valid` boolean and `errors` array

**Example:**
```typescript
const result = validateAlgorithmData({
  id: "sexy-move",
  notation: "R U R' U'",
  moves: parseAlgorithm("R U R' U'"),
});

if (!result.valid) {
  console.error("Validation errors:", result.errors);
}
```

### `validateAlgorithmBatch(algorithms: Algorithm[]): ValidationSummary`

Validate multiple algorithms and get summary statistics.

## Types

### `CubeState`

Represents the complete state of a 3x3 Rubik's cube.

```typescript
interface CubeState {
  U: FaceState; // Up (white)
  D: FaceState; // Down (yellow)
  F: FaceState; // Front (green)
  B: FaceState; // Back (blue)
  L: FaceState; // Left (orange)
  R: FaceState; // Right (red)
}
```

### `FaceState`

Array of 9 colors representing stickers on a face.

```typescript
type FaceState = [
  FaceColor, FaceColor, FaceColor,  // Row 0: positions 0, 1, 2
  FaceColor, FaceColor, FaceColor,  // Row 1: positions 3, 4, 5
  FaceColor, FaceColor, FaceColor   // Row 2: positions 6, 7, 8
];
```

Layout:
```
0 1 2
3 4 5
6 7 8
```

### `Move`

Represents a single move in WCA notation.

```typescript
interface Move {
  base: BaseMoveType | WideMove;  // "R", "U", "Rw", etc.
  modifier: MoveModifier;          // "", "'", "2"
  notation: string;                // Full notation (e.g., "R'")
}
```

### `FaceColor`

```typescript
type FaceColor = "white" | "yellow" | "green" | "blue" | "red" | "orange";
```

## Supported Moves

### Basic Moves (6 faces)
- **R** - Right face clockwise
- **L** - Left face clockwise
- **U** - Up face clockwise
- **D** - Down face clockwise
- **F** - Front face clockwise
- **B** - Back face clockwise

### Modifiers
- **'** (prime) - Counter-clockwise turn (e.g., R')
- **2** - 180° turn (e.g., R2)

### Not Yet Implemented (MVP)
- Slice moves (M, E, S)
- Rotation moves (x, y, z)
- Wide moves (Rw, Uw, etc.)

These will be added in post-MVP if needed.

## Performance

The cube engine is optimized for speed:
- Parsing: < 0.1ms for typical algorithms
- Move application: < 0.01ms per move
- 100 moves: < 10ms total

## Immutability

All functions return new cube states; original states are never modified.

```typescript
const state1 = createSolvedState();
const state2 = applyMove(state1, parseMove("R"));

isStateSolved(state1); // true (unchanged)
isStateSolved(state2); // false (new state)
```

## Complete Example

```typescript
import {
  createSolvedState,
  parseAlgorithm,
  applyAlgorithm,
  isStateSolved,
  invertAlgorithm,
  movesToNotation,
} from "@/src/lib/cube-engine";

// Create solved cube
const solved = createSolvedState();

// Parse and apply algorithm
const moves = parseAlgorithm("R U R' U'");
const scrambled = applyAlgorithm(solved, moves);

console.log(isStateSolved(scrambled)); // false

// Get inverse and solve
const inverse = invertAlgorithm(moves);
const backToSolved = applyAlgorithm(scrambled, inverse);

console.log(isStateSolved(backToSolved)); // true
console.log(movesToNotation(inverse)); // "U R U' R'"
```
