/**
 * AlgorithmAnimation Component
 * Shows step-by-step animation of an algorithm execution
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { CubeView } from "./CubeView";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm, applyMove } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import type { CubeState, Move } from "@/src/types/cube";

export interface AlgorithmAnimationProps {
  /** Algorithm notation to animate */
  notation: string;
  /** Optional setup moves to apply first */
  setupMoves?: string;
  /** Render mode for cube view */
  mode?: "case" | "top";
  /** Auto-play animation on mount */
  autoPlay?: boolean;
  /** Animation speed in milliseconds */
  speed?: number;
}

/**
 * AlgorithmAnimation - Interactive step-by-step algorithm player
 */
export function AlgorithmAnimation({
  notation,
  setupMoves,
  mode = "case",
  autoPlay = false,
  speed = 800,
}: AlgorithmAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Parse algorithm and generate all states
  const { moves, states } = useMemo(() => {
    try {
      const parsedMoves = parseAlgorithm(notation);
      let initialState = createSolvedState();

      // Apply setup moves if provided
      if (setupMoves) {
        const setup = parseAlgorithm(setupMoves);
        initialState = applyAlgorithm(initialState, setup);
      }

      // Generate state for each step
      const allStates: CubeState[] = [initialState];
      let currentState = initialState;

      for (const move of parsedMoves) {
        currentState = applyMove(currentState, move);
        allStates.push(currentState);
      }

      return { moves: parsedMoves, states: allStates };
    } catch (error) {
      console.error("Failed to parse algorithm:", error);
      return { moves: [], states: [createSolvedState()] };
    }
  }, [notation, setupMoves]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= moves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, moves.length, speed]);

  const handlePlayPause = () => {
    if (currentStep >= moves.length) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(moves.length, prev + 1));
    setIsPlaying(false);
  };

  const currentState = states[currentStep] || states[0];
  const currentMove = currentStep > 0 ? moves[currentStep - 1] : null;

  return (
    <div className="space-y-4">
      {/* Cube visualization */}
      <div className="flex justify-center bg-card border rounded-lg p-6">
        <CubeView state={currentState} mode={mode} options={{ stickerSize: 25 }} />
      </div>

      {/* Current move indicator */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">
          Step {currentStep} of {moves.length}
          {setupMoves && currentStep === 0 && " (Setup applied)"}
        </div>
        {currentMove && (
          <div className="text-lg font-mono font-semibold">
            {currentMove.notation}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={currentStep === 0}
          aria-label="Reset to start"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={handlePlayPause}
          disabled={moves.length === 0}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentStep >= moves.length}
          aria-label="Next step"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Algorithm notation with highlighting */}
      <div className="flex flex-wrap gap-1 justify-center">
        {moves.map((move, index) => (
          <span
            key={index}
            className={`font-mono text-sm px-2 py-1 rounded ${
              index === currentStep - 1
                ? "bg-primary text-primary-foreground"
                : index < currentStep
                ? "bg-muted text-muted-foreground"
                : "bg-background border"
            }`}
          >
            {move.notation}
          </span>
        ))}
      </div>
    </div>
  );
}
