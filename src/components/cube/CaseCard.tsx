"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CubeView } from "./CubeView";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm, invertAlgorithm } from "@/src/lib/cube-engine/parser";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseCardProps {
  puzzleId: string;
  algSetId: string;
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
export function CaseCard({ puzzleId, algSetId, algorithmCase }: CaseCardProps) {
  // Check if this is an OLL or PLL case (should start with yellow on top)
  const isOllOrPll = algSetId === 'oll' || algSetId === 'pll';
  const isOll = algSetId === 'oll';
  
  // Generate cube state for visualization (memoized for performance)
  // Use setup moves if available, otherwise use inverse of primary algorithm
  const caseState = useMemo(() => {
    try {
      const solvedState = createSolvedState();
      let setupNotation: string;
      
      if (algorithmCase.setupMoves) {
        // Use provided setup moves
        setupNotation = algorithmCase.setupMoves;
      } else {
        // Use inverse of primary algorithm to create case state
        const primaryMoves = parseAlgorithm(algorithmCase.primaryAlg.notation);
        const inverseMoves = invertAlgorithm(primaryMoves);
        setupNotation = inverseMoves.map(m => m.notation).join(' ');
      }
      
      // Prepend z2 for OLL/PLL cases (yellow on top)
      if (isOllOrPll) {
        setupNotation = 'z2 ' + setupNotation;
      }
      
      const setupAlgorithm = parseAlgorithm(setupNotation);
      return applyAlgorithm(solvedState, setupAlgorithm);
    } catch (error) {
      console.error("Failed to generate case state:", error);
      return null;
    }
  }, [algorithmCase.setupMoves, algorithmCase.primaryAlg.notation, isOllOrPll]);

  return (
    <Link href={`/puzzles/${puzzleId}/${algSetId}/${algorithmCase.id}`}>
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
            {/* Cube visualization - case view for OLL/PLL, top view for others */}
            {caseState && (
              <div className="flex justify-center bg-muted/50 rounded-lg py-3">
                <CubeView 
                  state={caseState} 
                  mode={isOllOrPll ? "case" : "top"}
                  options={{ 
                    stickerSize: isOllOrPll ? 15 : 20,
                    grayscaleNonYellow: isOll 
                  }} 
                />
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
