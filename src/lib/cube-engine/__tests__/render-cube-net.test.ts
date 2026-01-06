/**
 * Tests for renderCubeNet function
 */

import { describe, test, expect } from "vitest";
import { createSolvedState } from "../state";
import { renderCubeNet } from "../renderer";
import { applyAlgorithm } from "../executor";
import { parseAlgorithm } from "../parser";

describe("renderCubeNet", () => {
  test("should render a solved cube correctly", () => {
    const state = createSolvedState();
    const result = renderCubeNet(state);
    
    console.log("\n=== SOLVED CUBE ===");
    console.log(result);
    
    // Check for expected structure
    expect(result).toContain("WWW");
    expect(result).toContain("OOO GGG RRR BBB");
    expect(result).toContain("YYY");
    
    // Verify it has 9 lines (3 for U, 3 for middle row, 3 for D)
    const lines = result.split('\n');
    expect(lines).toHaveLength(9);
    
    // Verify top face (U) is indented
    expect(lines[0]).toMatch(/^\s{4}WWW$/);
    expect(lines[1]).toMatch(/^\s{4}WWW$/);
    expect(lines[2]).toMatch(/^\s{4}WWW$/);
    
    // Verify middle row format (L F R B)
    expect(lines[3]).toBe("OOO GGG RRR BBB");
    expect(lines[4]).toBe("OOO GGG RRR BBB");
    expect(lines[5]).toBe("OOO GGG RRR BBB");
    
    // Verify bottom face (D) is indented
    expect(lines[6]).toMatch(/^\s{4}YYY$/);
    expect(lines[7]).toMatch(/^\s{4}YYY$/);
    expect(lines[8]).toMatch(/^\s{4}YYY$/);
  });

  test("should render T-Perm result correctly", () => {
    const state = createSolvedState();
    const tPerm = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
    const result = applyAlgorithm(state, tPerm);
    
    const rendered = renderCubeNet(result);
    
    console.log("\n=== T-PERM RESULT ===");
    console.log(rendered);
    
    // T-Perm keeps top face solved (all white)
    const lines = rendered.split('\n');
    expect(lines[0]).toMatch(/^\s{4}WWW$/);
    expect(lines[1]).toMatch(/^\s{4}WWW$/);
    expect(lines[2]).toMatch(/^\s{4}WWW$/);
    
    // Bottom face should still be all yellow
    expect(lines[6]).toMatch(/^\s{4}YYY$/);
    expect(lines[7]).toMatch(/^\s{4}YYY$/);
    expect(lines[8]).toMatch(/^\s{4}YYY$/);
    
    // Middle row should show scrambled edges (not all same colors)
    expect(lines[3]).not.toBe("OOO GGG RRR BBB");
  });

  test("should render R move correctly", () => {
    const state = createSolvedState();
    const rMove = parseAlgorithm("R");
    const result = applyAlgorithm(state, rMove);
    
    const rendered = renderCubeNet(result);
    
    console.log("\n=== AFTER R MOVE ===");
    console.log(rendered);
    
    const lines = rendered.split('\n');
    
    // After R move, U face right column should have green (from F)
    expect(lines[0]).toBe("    WWG");
    expect(lines[1]).toBe("    WWG");
    expect(lines[2]).toBe("    WWG");
    
    // F face right column should have yellow (from D)
    expect(lines[3]).toBe("OOO GGY RRR WBB");
    expect(lines[4]).toBe("OOO GGY RRR WBB");
    expect(lines[5]).toBe("OOO GGY RRR WBB");
    
    // D face right column should have blue (from B)
    expect(lines[6]).toBe("    YYB");
    expect(lines[7]).toBe("    YYB");
    expect(lines[8]).toBe("    YYB");
    
    // B face left column should have white (from U)
    expect(lines[3]).toContain("WBB");
    expect(lines[4]).toContain("WBB");
    expect(lines[5]).toContain("WBB");
  });

  test("should handle scrambled cube", () => {
    const state = createSolvedState();
    const scramble = parseAlgorithm("R U R' U' F' R U R' U' R' F R2");
    const result = applyAlgorithm(state, scramble);
    
    const rendered = renderCubeNet(result);
    
    console.log("\n=== SCRAMBLED CUBE ===");
    console.log(rendered);
    
    // Should have 9 lines
    const lines = rendered.split('\n');
    expect(lines).toHaveLength(9);
    
    // Should contain various color initials
    const fullText = lines.join('');
    expect(fullText).toMatch(/W/);
    expect(fullText).toMatch(/Y/);
    expect(fullText).toMatch(/G/);
    expect(fullText).toMatch(/B/);
    expect(fullText).toMatch(/R/);
    expect(fullText).toMatch(/O/);
  });
});
