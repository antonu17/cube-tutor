"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CubeView } from "./CubeView";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseCardProps {
  puzzleId: string;
  methodId: string;
  stageId: string;
  algorithmCase: AlgorithmCase;
}

const difficultyLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Very Easy",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Very Hard",
};

const difficultyColors: Record<1 | 2 | 3 | 4 | 5, "default" | "secondary" | "destructive"> = {
  1: "default",
  2: "default",
  3: "secondary",
  4: "destructive",
  5: "destructive",
};

/**
 * CaseCard component for displaying algorithm case information in a card format
 */
export function CaseCard({ puzzleId, methodId, stageId, algorithmCase }: CaseCardProps) {
  // Generate cube state from setup moves (memoized for performance)
  const setupState = useMemo(() => {
    if (!algorithmCase.setupMoves) return null;
    
    try {
      const solvedState = createSolvedState();
      const setupAlgorithm = parseAlgorithm(algorithmCase.setupMoves);
      return applyAlgorithm(solvedState, setupAlgorithm);
    } catch (error) {
      console.error("Failed to parse setup moves:", error);
      return null;
    }
  }, [algorithmCase.setupMoves]);

  return (
    <Link href={`/puzzles/${puzzleId}/${methodId}/${stageId}/${algorithmCase.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{algorithmCase.name}</CardTitle>
            <Badge variant={difficultyColors[algorithmCase.difficulty]}>
              {difficultyLabels[algorithmCase.difficulty]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Cube visualization */}
            {setupState && (
              <div className="flex justify-center bg-muted/50 rounded-lg py-3">
                <CubeView state={setupState} mode="case" options={{ stickerSize: 15 }} />
              </div>
            )}
            
            {algorithmCase.primaryAlg && (
              <div className="text-sm">
                <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                  {algorithmCase.primaryAlg.notation}
                </code>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {algorithmCase.primaryAlg && (
                <span>{algorithmCase.primaryAlg.moves.length} moves</span>
              )}
              {algorithmCase.category && (
                <>
                  <span>•</span>
                  <span className="capitalize">{algorithmCase.category}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
