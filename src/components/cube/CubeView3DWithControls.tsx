"use client";

import React, { useState } from "react";
import type { CubeState } from "@/src/types/cube";
import { CubeView3D, type ViewAngle } from "./CubeView3D";
import { Button } from "../ui/button";

export interface CubeView3DWithControlsProps {
  /** Cube state to render */
  state: CubeState;
  /** Initial view angle (default: 'front') */
  initialView?: ViewAngle;
  /** Sticker size in pixels (default: 30) */
  stickerSize?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CubeView3DWithControls Component
 * 
 * Renders a 3D cube with view angle controls.
 * Users can switch between 6 different viewing angles.
 */
export const CubeView3DWithControls: React.FC<CubeView3DWithControlsProps> = ({
  state,
  initialView = 'front',
  stickerSize = 30,
  className = "",
}) => {
  const [view, setView] = useState<ViewAngle>(initialView);

  const viewButtons: { label: string; value: ViewAngle }[] = [
    { label: "Front", value: "front" },
    { label: "Back", value: "back" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
  ];

  return (
    <div className={`cube-view-3d-controls space-y-4 ${className}`.trim()}>
      {/* 3D Cube View */}
      <div className="flex justify-center">
        <CubeView3D
          state={state}
          view={view}
          stickerSize={stickerSize}
          ariaLabel={`3D cube visualization from ${view} view`}
        />
      </div>

      {/* View Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {viewButtons.map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => setView(value)}
            variant={view === value ? "default" : "outline"}
            size="sm"
            aria-label={`View from ${label.toLowerCase()}`}
            aria-pressed={view === value}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CubeView3DWithControls;
