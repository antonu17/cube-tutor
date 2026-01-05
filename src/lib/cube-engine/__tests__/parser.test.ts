/**
 * Tests for WCA notation parser
 */

import { describe, it, expect } from "vitest";
import {
  parseMove,
  parseAlgorithm,
  invertMove,
  invertAlgorithm,
  movesToNotation,
} from "../parser";

describe("parseMove", () => {
  it("should parse basic moves", () => {
    const move = parseMove("R");
    expect(move.base).toBe("R");
    expect(move.modifier).toBe("");
    expect(move.notation).toBe("R");
  });

  it("should parse prime moves", () => {
    const move = parseMove("U'");
    expect(move.base).toBe("U");
    expect(move.modifier).toBe("'");
    expect(move.notation).toBe("U'");
  });

  it("should parse double moves", () => {
    const move = parseMove("F2");
    expect(move.base).toBe("F");
    expect(move.modifier).toBe("2");
    expect(move.notation).toBe("F2");
  });

  it("should parse all six face moves", () => {
    const moves = ["R", "L", "U", "D", "F", "B"];
    moves.forEach((m) => {
      const parsed = parseMove(m);
      expect(parsed.base).toBe(m);
    });
  });

  it("should parse slice moves", () => {
    const move = parseMove("M");
    expect(move.base).toBe("M");
    expect(move.modifier).toBe("");
  });

  it("should parse rotation moves", () => {
    ["x", "y", "z"].forEach((m) => {
      const parsed = parseMove(m);
      expect(parsed.base).toBe(m);
    });
  });

  it("should parse wide moves", () => {
    const move = parseMove("Rw");
    expect(move.base).toBe("Rw");
    expect(move.modifier).toBe("");
    expect(move.notation).toBe("Rw");
  });

  it("should parse lowercase wide moves", () => {
    const move = parseMove("r");
    expect(move.base).toBe("r");
    expect(move.modifier).toBe("");
  });

  it("should parse wide moves with modifiers", () => {
    const move = parseMove("Uw'");
    expect(move.base).toBe("Uw");
    expect(move.modifier).toBe("'");
  });

  it("should handle whitespace", () => {
    const move = parseMove("  R  ");
    expect(move.base).toBe("R");
    expect(move.notation).toBe("R");
  });

  it("should throw error for empty string", () => {
    expect(() => parseMove("")).toThrow("Move string cannot be empty");
  });

  it("should throw error for invalid move", () => {
    expect(() => parseMove("X")).toThrow("Invalid move");
  });

  it("should throw error for invalid modifier", () => {
    expect(() => parseMove("R3")).toThrow("Invalid modifier");
  });
});

describe("parseAlgorithm", () => {
  it("should parse simple algorithm", () => {
    const moves = parseAlgorithm("R U R' U'");
    expect(moves).toHaveLength(4);
    expect(moves[0].notation).toBe("R");
    expect(moves[1].notation).toBe("U");
    expect(moves[2].notation).toBe("R'");
    expect(moves[3].notation).toBe("U'");
  });

  it("should parse complex algorithm", () => {
    const moves = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
    expect(moves).toHaveLength(14);
  });

  it("should handle empty string", () => {
    const moves = parseAlgorithm("");
    expect(moves).toHaveLength(0);
  });

  it("should handle whitespace only", () => {
    const moves = parseAlgorithm("   ");
    expect(moves).toHaveLength(0);
  });

  it("should handle multiple spaces", () => {
    const moves = parseAlgorithm("R   U    R'");
    expect(moves).toHaveLength(3);
  });

  it("should remove comments", () => {
    const moves = parseAlgorithm("R U (sexy move) R' U'");
    expect(moves).toHaveLength(4);
    expect(moves.map((m) => m.notation)).toEqual(["R", "U", "R'", "U'"]);
  });

  it("should parse algorithm with wide moves", () => {
    const moves = parseAlgorithm("Rw U Rw' U'");
    expect(moves).toHaveLength(4);
    expect(moves[0].base).toBe("Rw");
  });

  it("should throw error for invalid move in algorithm", () => {
    expect(() => parseAlgorithm("R U X")).toThrow("Failed to parse move");
  });
});

describe("invertMove", () => {
  it("should invert basic move to prime", () => {
    const move = parseMove("R");
    const inverted = invertMove(move);
    expect(inverted.notation).toBe("R'");
  });

  it("should invert prime move to basic", () => {
    const move = parseMove("U'");
    const inverted = invertMove(move);
    expect(inverted.notation).toBe("U");
  });

  it("should keep double move as double", () => {
    const move = parseMove("F2");
    const inverted = invertMove(move);
    expect(inverted.notation).toBe("F2");
  });

  it("should invert wide moves", () => {
    const move = parseMove("Rw");
    const inverted = invertMove(move);
    expect(inverted.notation).toBe("Rw'");
  });
});

describe("invertAlgorithm", () => {
  it("should invert sexy move", () => {
    const moves = parseAlgorithm("R U R' U'");
    const inverted = invertAlgorithm(moves);
    const notation = movesToNotation(inverted);
    expect(notation).toBe("U R U' R'");
  });

  it("should invert complex algorithm", () => {
    const moves = parseAlgorithm("R U2 R'");
    const inverted = invertAlgorithm(moves);
    const notation = movesToNotation(inverted);
    expect(notation).toBe("R U2 R'"); // Palindrome
  });

  it("should handle empty algorithm", () => {
    const inverted = invertAlgorithm([]);
    expect(inverted).toHaveLength(0);
  });
});

describe("movesToNotation", () => {
  it("should convert moves to notation string", () => {
    const moves = parseAlgorithm("R U R' U'");
    const notation = movesToNotation(moves);
    expect(notation).toBe("R U R' U'");
  });

  it("should handle empty array", () => {
    const notation = movesToNotation([]);
    expect(notation).toBe("");
  });

  it("should preserve wide move notation", () => {
    const moves = parseAlgorithm("Rw U Rw'");
    const notation = movesToNotation(moves);
    expect(notation).toBe("Rw U Rw'");
  });
});
