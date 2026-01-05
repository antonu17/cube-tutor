/**
 * CubeNet Component
 * Displays a 2D flat net view of the cube state
 */

"use client";

import React, { useMemo } from "react";
import type { CubeState } from "@/src/types/cube";
import { renderCubeSVG, type RenderOptions } from "@/src/lib/cube-engine/renderer";

export interface CubeNetProps {
  /** Cube state to render */
  state: CubeState;
  /** Optional render customization */
  options?: RenderOptions;
  /** Show face labels (U, D, F, B, L, R) */
  showLabels?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CubeNet - 2D SVG visualization of cube state
 * Displays all 6 faces in a cross pattern
 */
export function CubeNet({
  state,
  options,
  showLabels = false,
  className = "",
}: CubeNetProps) {
  // Memoize SVG generation for performance
  const svgString = useMemo(
    () => renderCubeSVG(state, options, showLabels),
    [state, options, showLabels]
  );

  return (
    <div
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
