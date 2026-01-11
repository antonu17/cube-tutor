"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { AlgorithmSetCard } from "./AlgorithmSetCard";
import type { AlgorithmSetGroup } from "@/src/types/data";

interface AlgorithmSetGroupCardProps {
  puzzleId: string;
  group: AlgorithmSetGroup;
}

/**
 * AlgorithmSetGroupCard component for displaying a group of algorithm sets
 * Groups algorithm sets by their origin (e.g., CFOP, Beginner)
 */
export function AlgorithmSetGroupCard({
  puzzleId,
  group,
}: AlgorithmSetGroupCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{group.name}</CardTitle>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {group.algorithmSets.map((algSet) => (
            <AlgorithmSetCard
              key={algSet.id}
              puzzleId={puzzleId}
              algorithmSet={algSet}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
