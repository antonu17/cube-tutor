"use client";

import React, { useMemo } from "react";
import type { CubeState } from "@/src/types/cube";
import { renderCube3D, type Render3DOptions } from "@/src/lib/cube-engine/renderer";

export type ViewAngle = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

export interface CubeView3DProps {
  /** Cube state to render */
  state: CubeState;
  /** View angle (default: 'front') */
  view?: ViewAngle;
  /** Sticker size in pixels (default: 30) */
  stickerSize?: number;
  /** Background color (default: "#F3F4F6") */
  backgroundColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * CubeView3D Component
 * 
 * Renders a 3x3x3 cube state in isometric 3D view using SVG.
 * Supports multiple view angles.
 * 
 * @example
 * ```tsx
 * <CubeView3D 
 *   state={cubeState} 
 *   view="front"
 *   stickerSize={30}
 * />
 * ```
 */
export const CubeView3D: React.FC<CubeView3DProps> = ({
  state,
  view = 'front',
  stickerSize = 30,
  backgroundColor,
  className = "",
  ariaLabel = "3D cube visualization",
}) => {
  // Memoize the SVG rendering for performance
  const svg = useMemo(() => {
    const options: Render3DOptions = {
      stickerSize,
      view,
      ...(backgroundColor && { backgroundColor }),
    };
    return renderCube3D(state, options);
  }, [state, view, stickerSize, backgroundColor]);

  return (
    <div
      className={`cube-view-3d ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default CubeView3D;
