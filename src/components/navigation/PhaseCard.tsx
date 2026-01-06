"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CubeView3D } from "@/src/components/cube/CubeView3D";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";

interface PhaseData {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface PhaseCardProps {
  puzzleId: string;
  methodId: string;
  phase: PhaseData;
  caseCount?: number;
  isIntuitive?: boolean;
}

/**
 * Get representative cube state for each phase
 */
function getPhaseState(phaseId: string) {
  const solved = createSolvedState();
  
  // Create representative states for each phase
  const phaseStates: Record<string, string> = {
    // Cross: solved cross on bottom
    cross: "x2",
    // F2L: cross + some F2L pairs
    f2l: "x2 R U R' U'",
    // OLL: F2L solved, yellow on top (pre-OLL state)
    oll: "z2 R U R' U R U2 R'",
    // PLL: OLL solved, needs permutation
    pll: "z2 R U R' U' R' F R2 U' R' U' R U R' F'",
  };
  
  const algorithm = phaseStates[phaseId] || "";
  if (!algorithm) return solved;
  
  try {
    const moves = parseAlgorithm(algorithm);
    return applyAlgorithm(solved, moves);
  } catch {
    return solved;
  }
}

/**
 * PhaseCard component for displaying phase/stage information in a card format
 */
export function PhaseCard({
  puzzleId,
  methodId,
  phase,
  caseCount,
  isIntuitive = false,
}: PhaseCardProps) {
  // Generate cube state for this phase
  const cubeState = useMemo(() => getPhaseState(phase.id), [phase.id]);
  
  return (
    <Link href={`/puzzles/${puzzleId}/${methodId}/${phase.id}`}>
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
            
            {/* Phase Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-muted-foreground">#{phase.order}</span>
                  {phase.name}
                </CardTitle>
                {isIntuitive && <Badge variant="outline">Intuitive</Badge>}
              </div>
              <CardDescription>{phase.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {caseCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {caseCount} {isIntuitive ? "technique" : "algorithm"}
              {caseCount !== 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
