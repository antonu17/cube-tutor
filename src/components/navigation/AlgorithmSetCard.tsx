"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CubeView3D } from "@/src/components/cube/CubeView3D";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";
import type { AlgorithmSet } from "@/src/types/data";

interface AlgorithmSetCardProps {
  puzzleId: string;
  algorithmSet: AlgorithmSet;
}

/**
 * Get representative cube state for each algorithm set
 */
function getAlgorithmSetState(algSetId: string) {
  const solved = createSolvedState();

  // Create representative states for each algorithm set
  const algSetStates: Record<string, string> = {
    // Cross: solved cross on bottom
    cross: "R' U2' R2' U R2' U R2' U2' R' y",
    // F2L: cross + some F2L pairs
    f2l: "x2 R U R' U'",
    // OLL: F2L solved, yellow on top (pre-OLL state)
    oll: "z2 R U R' U R U2 R'",
    // PLL: OLL solved, needs permutation
    pll: "z2 R U R' U' R' F R2 U' R' U' R U R' F'",
    // Beginner: partially solved state
    beginner: "R U R' U'",
  };

  const algorithm = algSetStates[algSetId] || "";
  if (!algorithm) return solved;

  try {
    const moves = parseAlgorithm(algorithm);
    return applyAlgorithm(solved, moves);
  } catch {
    return solved;
  }
}

/**
 * AlgorithmSetCard component for displaying algorithm set information in a card format
 */
export function AlgorithmSetCard({
  puzzleId,
  algorithmSet,
}: AlgorithmSetCardProps) {
  // Generate cube state for this algorithm set
  const cubeState = useMemo(() => getAlgorithmSetState(algorithmSet.id), [algorithmSet.id]);
  
  const isIntuitive = algorithmSet.caseCount === 0;

  return (
    <Link href={`/puzzles/${puzzleId}/${algorithmSet.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <div className="flex items-start gap-4">
            {/* 3D Cube Thumbnail */}
            <div className="flex-shrink-0">
              <CubeView3D
                state={cubeState}
                view="front"
                stickerSize={8}
              />
            </div>

            {/* Algorithm Set Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {algorithmSet.shortName}
                </CardTitle>
                {isIntuitive && <Badge variant="outline">Intuitive</Badge>}
                {algorithmSet.difficulty && (
                  <Badge variant="secondary" className="capitalize">
                    {algorithmSet.difficulty}
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {algorithmSet.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {algorithmSet.caseCount} {isIntuitive ? "technique" : "algorithm"}
            {algorithmSet.caseCount !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
