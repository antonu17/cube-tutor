/**
 * Tests for notation validator
 */

import { describe, it, expect } from "vitest";
import {
  isValidMove,
  isValidAlgorithm,
  validateAlgorithmData,
  validateAlgorithmBatch,
} from "../validator";
import { parseAlgorithm } from "../parser";
import type { Algorithm } from "@/src/types/cube";

describe("isValidMove", () => {
  it("should return true for valid moves", () => {
    expect(isValidMove("R")).toBe(true);
    expect(isValidMove("U'")).toBe(true);
    expect(isValidMove("F2")).toBe(true);
    expect(isValidMove("Rw")).toBe(true);
    expect(isValidMove("M")).toBe(true);
  });

  it("should return false for invalid moves", () => {
    expect(isValidMove("X")).toBe(false);
    expect(isValidMove("R3")).toBe(false);
    expect(isValidMove("")).toBe(false);
    expect(isValidMove("ABC")).toBe(false);
  });

  it("should handle whitespace", () => {
    expect(isValidMove(" R ")).toBe(true);
    expect(isValidMove("   ")).toBe(false);
  });
});

describe("isValidAlgorithm", () => {
  it("should return true for valid algorithms", () => {
    expect(isValidAlgorithm("R U R' U'")).toBe(true);
    expect(isValidAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'")).toBe(true);
    expect(isValidAlgorithm("")).toBe(true); // Empty is valid
  });

  it("should return false for invalid algorithms", () => {
    expect(isValidAlgorithm("R U X")).toBe(false);
    expect(isValidAlgorithm("R U3 R'")).toBe(false);
  });

  it("should handle comments", () => {
    expect(isValidAlgorithm("R U (sexy move) R' U'")).toBe(true);
  });
});

describe("validateAlgorithmData", () => {
  it("should validate correct algorithm", () => {
    const algorithm: Algorithm = {
      id: "sexy-move",
      notation: "R U R' U'",
      moves: parseAlgorithm("R U R' U'"),
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect invalid notation", () => {
    const algorithm: Algorithm = {
      id: "invalid",
      notation: "R U X",
      moves: [],
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes("Invalid notation"))).toBe(true);
  });

  it("should detect move count mismatch", () => {
    const algorithm: Algorithm = {
      id: "mismatch",
      notation: "R U R' U'",
      moves: parseAlgorithm("R U"), // Only 2 moves
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Move count mismatch"))).toBe(true);
  });

  it("should detect move mismatch", () => {
    const algorithm: Algorithm = {
      id: "wrong-moves",
      notation: "R U R' U'",
      moves: parseAlgorithm("R U F D"), // Wrong moves
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Move mismatch"))).toBe(true);
  });

  it("should detect missing ID", () => {
    const algorithm: Algorithm = {
      id: "",
      notation: "R U R' U'",
      moves: parseAlgorithm("R U R' U'"),
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("ID"))).toBe(true);
  });

  it("should detect missing moves array", () => {
    const algorithm = {
      id: "missing-moves",
      notation: "R U R' U'",
      moves: null as any,
    };

    const result = validateAlgorithmData(algorithm);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Moves array"))).toBe(true);
  });
});

describe("validateAlgorithmBatch", () => {
  it("should validate multiple algorithms", () => {
    const algorithms: Algorithm[] = [
      {
        id: "alg1",
        notation: "R U R' U'",
        moves: parseAlgorithm("R U R' U'"),
      },
      {
        id: "alg2",
        notation: "F R U R' U' F'",
        moves: parseAlgorithm("F R U R' U' F'"),
      },
    ];

    const summary = validateAlgorithmBatch(algorithms);
    expect(summary.total).toBe(2);
    expect(summary.valid).toBe(2);
    expect(summary.invalid).toBe(0);
    expect(summary.invalidAlgorithms).toHaveLength(0);
  });

  it("should detect invalid algorithms in batch", () => {
    const algorithms: Algorithm[] = [
      {
        id: "good",
        notation: "R U R' U'",
        moves: parseAlgorithm("R U R' U'"),
      },
      {
        id: "bad",
        notation: "R U X",
        moves: [],
      },
    ];

    const summary = validateAlgorithmBatch(algorithms);
    expect(summary.total).toBe(2);
    expect(summary.valid).toBe(1);
    expect(summary.invalid).toBe(1);
    expect(summary.invalidAlgorithms).toHaveLength(1);
    expect(summary.invalidAlgorithms[0].id).toBe("bad");
  });

  it("should handle empty batch", () => {
    const summary = validateAlgorithmBatch([]);
    expect(summary.total).toBe(0);
    expect(summary.valid).toBe(0);
    expect(summary.invalid).toBe(0);
  });
});
