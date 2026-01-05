import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

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
 * PhaseCard component for displaying phase/stage information in a card format
 */
export function PhaseCard({
  puzzleId,
  methodId,
  phase,
  caseCount,
  isIntuitive = false,
}: PhaseCardProps) {
  return (
    <Link href={`/puzzles/${puzzleId}/${methodId}/${phase.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-muted-foreground">#{phase.order}</span>
              {phase.name}
            </CardTitle>
            {isIntuitive && <Badge variant="outline">Intuitive</Badge>}
          </div>
          <CardDescription>{phase.description}</CardDescription>
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
