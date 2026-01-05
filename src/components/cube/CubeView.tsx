/**
 * CubeView Component
 * Displays OLL/PLL case view (top face + surrounding edges)
 */

"use client";

import React, { useMemo } from "react";
import type { CubeState } from "@/src/types/cube";
import { renderCaseViewSVG, renderTopFaceSVG, type RenderOptions } from "@/src/lib/cube-engine/renderer";

export interface CubeViewProps {
  /** Cube state to render */
  state: CubeState;
  /** Render mode: 'case' (OLL/PLL view) or 'top' (top face only) */
  mode?: "case" | "top";
  /** Optional render customization */
  options?: RenderOptions;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CubeView - Compact cube visualization for case recognition
 * Shows top face with surrounding edges (OLL/PLL view)
 */
export function CubeView({
  state,
  mode = "case",
  options,
  className = "",
}: CubeViewProps) {
  // Memoize SVG generation for performance
  const svgString = useMemo(() => {
    if (mode === "top") {
      return renderTopFaceSVG(state, options);
    }
    return renderCaseViewSVG(state, options);
  }, [state, mode, options]);

  return (
    <div
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
