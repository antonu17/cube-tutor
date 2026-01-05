/**
 * Tests for 2D Cube Renderer
 */

import { describe, it, expect } from "vitest";
import { createSolvedState } from "../state";
import { renderCubeSVG, renderTopFaceSVG, renderCaseViewSVG, COLOR_MAP } from "../renderer";
import type { CubeState } from "@/src/types/cube";

describe("2D Cube Renderer", () => {
  describe("renderCubeSVG", () => {
    it("should render a solved cube", () => {
      const state = createSolvedState();
      const svg = renderCubeSVG(state);

      // Check SVG structure
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      expect(svg).toContain("<rect");
      
      // Check all colors are present
      expect(svg).toContain(COLOR_MAP.white);
      expect(svg).toContain(COLOR_MAP.yellow);
      expect(svg).toContain(COLOR_MAP.green);
      expect(svg).toContain(COLOR_MAP.blue);
      expect(svg).toContain(COLOR_MAP.red);
      expect(svg).toContain(COLOR_MAP.orange);
    });

    it("should render with custom options", () => {
      const state = createSolvedState();
      const svg = renderCubeSVG(state, {
        stickerSize: 40,
        borderColor: "#FF0000",
      });

      expect(svg).toContain("<svg");
      expect(svg).toContain('stroke="#FF0000"');
    });

    it("should render with face labels when requested", () => {
      const state = createSolvedState();
      const svg = renderCubeSVG(state, {}, true);

      expect(svg).toContain("<text");
      expect(svg).toContain(">U</text>");
      expect(svg).toContain(">D</text>");
      expect(svg).toContain(">F</text>");
      expect(svg).toContain(">B</text>");
      expect(svg).toContain(">L</text>");
      expect(svg).toContain(">R</text>");
    });

    it("should not render labels by default", () => {
      const state = createSolvedState();
      const svg = renderCubeSVG(state);

      expect(svg).not.toContain("<text");
    });

    it("should render a scrambled cube correctly", () => {
      const scrambledState: CubeState = {
        U: ["white", "yellow", "white", "green", "white", "red", "white", "blue", "white"],
        D: ["yellow", "white", "yellow", "orange", "yellow", "blue", "yellow", "green", "yellow"],
        F: ["green", "red", "green", "yellow", "green", "white", "green", "orange", "green"],
        B: ["blue", "orange", "blue", "white", "blue", "yellow", "blue", "red", "blue"],
        L: ["orange", "blue", "orange", "red", "orange", "green", "orange", "white", "orange"],
        R: ["red", "green", "red", "blue", "red", "orange", "red", "yellow", "red"],
      };

      const svg = renderCubeSVG(scrambledState);

      expect(svg).toContain("<svg");
      expect(svg).toContain(COLOR_MAP.white);
      expect(svg).toContain(COLOR_MAP.yellow);
    });
  });

  describe("renderTopFaceSVG", () => {
    it("should render only the top face", () => {
      const state = createSolvedState();
      const svg = renderTopFaceSVG(state);

      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      
      // Should contain white (top face color)
      expect(svg).toContain(COLOR_MAP.white);
      
      // Should be smaller than full cube
      const width = svg.match(/width="(\d+)"/)?.[1];
      expect(width).toBeDefined();
      expect(parseInt(width!)).toBeLessThan(400);
    });

    it("should work with custom sticker size", () => {
      const state = createSolvedState();
      const svg = renderTopFaceSVG(state, { stickerSize: 20 });

      expect(svg).toContain("<svg");
      
      // Smaller sticker size should result in smaller SVG
      const width = svg.match(/width="(\d+)"/)?.[1];
      expect(width).toBeDefined();
      expect(parseInt(width!)).toBeLessThan(100);
    });
  });

  describe("renderCaseViewSVG", () => {
    it("should render case view with top face and surrounding edges", () => {
      const state = createSolvedState();
      const svg = renderCaseViewSVG(state);

      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      
      // Should contain multiple colors from adjacent faces
      expect(svg).toContain(COLOR_MAP.white); // U
      expect(svg).toContain(COLOR_MAP.green); // F
      expect(svg).toContain(COLOR_MAP.red);   // R
      expect(svg).toContain(COLOR_MAP.blue);  // B
      expect(svg).toContain(COLOR_MAP.orange); // L
    });

    it("should be larger than top face only", () => {
      const state = createSolvedState();
      const topSvg = renderTopFaceSVG(state);
      const caseSvg = renderCaseViewSVG(state);

      const topWidth = topSvg.match(/width="(\d+)"/)?.[1];
      const caseWidth = caseSvg.match(/width="(\d+)"/)?.[1];

      expect(topWidth).toBeDefined();
      expect(caseWidth).toBeDefined();
      expect(parseInt(caseWidth!)).toBeGreaterThan(parseInt(topWidth!));
    });
  });

  describe("COLOR_MAP", () => {
    it("should have all 6 colors defined", () => {
      expect(COLOR_MAP.white).toBeDefined();
      expect(COLOR_MAP.yellow).toBeDefined();
      expect(COLOR_MAP.green).toBeDefined();
      expect(COLOR_MAP.blue).toBeDefined();
      expect(COLOR_MAP.red).toBeDefined();
      expect(COLOR_MAP.orange).toBeDefined();
    });

    it("should use valid hex colors", () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      
      expect(COLOR_MAP.white).toMatch(hexRegex);
      expect(COLOR_MAP.yellow).toMatch(hexRegex);
      expect(COLOR_MAP.green).toMatch(hexRegex);
      expect(COLOR_MAP.blue).toMatch(hexRegex);
      expect(COLOR_MAP.red).toMatch(hexRegex);
      expect(COLOR_MAP.orange).toMatch(hexRegex);
    });
  });
});
