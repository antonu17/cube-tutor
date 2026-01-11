"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/src/components/ui/badge";
import { CubeView } from "./CubeView";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm, invertAlgorithm } from "@/src/lib/cube-engine/parser";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseListItemProps {
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
 * CaseListItem component for displaying algorithm case information in a list row format
 */
export function CaseListItem({ puzzleId, algSetId, algorithmCase }: CaseListItemProps) {
  // Check if this is an OLL or PLL case (should start with yellow on top)
  const isOllOrPll = algSetId === 'oll' || algSetId === 'pll';
  const isOll = algSetId === 'oll';
  
  // Generate cube state for visualization (memoized for performance)
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
      <div className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
        {/* Cube visualization */}
        {caseState && (
          <div className="flex-shrink-0">
            <CubeView 
              state={caseState} 
              mode={isOllOrPll ? "case" : "top"}
              options={{ 
                stickerSize: isOllOrPll ? 12 : 16,
                grayscaleNonYellow: isOll 
              }} 
            />
          </div>
        )}

        {/* Case info and algorithms */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm">{algorithmCase.name}</h4>
            <Badge variant={difficultyColors[algorithmCase.difficulty]} className="text-xs">
              {difficultyLabels[algorithmCase.difficulty]}
            </Badge>
            {algorithmCase.primaryAlg && (
              <span className="text-xs text-muted-foreground">
                {algorithmCase.primaryAlg.moves.length} moves
              </span>
            )}
          </div>
          
          {/* Primary algorithm */}
          {algorithmCase.primaryAlg && (
            <div className="mb-1">
              <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                {algorithmCase.primaryAlg.notation}
              </code>
            </div>
          )}

          {/* Additional algorithms */}
          {algorithmCase.algorithms && algorithmCase.algorithms.length > 1 && (
            <div className="space-y-1 mt-2">
              {algorithmCase.algorithms.slice(1, 3).map((alg, index) => (
                <div key={index}>
                  <code className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">
                    {alg.notation}
                  </code>
                </div>
              ))}
              {algorithmCase.algorithms.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{algorithmCase.algorithms.length - 3} more alg{algorithmCase.algorithms.length - 3 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Setup moves on the right */}
        {algorithmCase.setupMoves && (
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-muted-foreground mb-1">Setup:</div>
            <code className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded text-muted-foreground block">
              {algorithmCase.setupMoves}
            </code>
          </div>
        )}
      </div>
    </Link>
  );
}
