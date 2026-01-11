import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import type { Puzzle } from "@/src/types/data";

interface PuzzleCardProps {
  puzzle: Puzzle;
}

/**
 * PuzzleCard component for displaying puzzle information in a card format
 */
export function PuzzleCard({ puzzle }: PuzzleCardProps) {
  // Support both old (supportedMethods) and new (algorithmSetGroups) structure
  const itemCount = puzzle.algorithmSetGroups?.length || puzzle.supportedMethods?.length || 0;
  const itemLabel = puzzle.algorithmSetGroups ? "algorithm set" : "method";
  
  return (
    <Link href={`/puzzles/${puzzle.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{puzzle.name}</CardTitle>
          <CardDescription>{puzzle.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {itemCount} {itemLabel}{itemCount !== 1 ? "s" : ""} available
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
