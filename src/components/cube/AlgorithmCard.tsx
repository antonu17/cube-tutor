import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { AlgorithmNotation } from "./AlgorithmNotation";
import { AlgorithmMetadata } from "./AlgorithmMetadata";
import type { Algorithm } from "@/src/types/cube";

interface AlgorithmCardProps {
  algorithm: Algorithm & { source?: string; recommended?: boolean };
  title?: string;
  showMetadata?: boolean;
}

export function AlgorithmCard({ 
  algorithm, 
  title = "Algorithm",
  showMetadata = true 
}: AlgorithmCardProps) {
  const alg = algorithm as any; // Type assertion for extra fields

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            {alg.recommended && (
              <Badge variant="default">Recommended</Badge>
            )}
            {alg.source && (
              <Badge variant="outline">{alg.source}</Badge>
            )}
          </div>
        </div>
        {alg.name && (
          <CardDescription>{alg.name}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <AlgorithmNotation notation={algorithm.notation} />
        {showMetadata && <AlgorithmMetadata algorithm={algorithm} />}
      </CardContent>
    </Card>
  );
}
