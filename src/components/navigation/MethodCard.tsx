import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import type { MethodData } from "@/src/types/data";

interface MethodCardProps {
  puzzleId: string;
  method: MethodData;
  caseCount?: number;
}

/**
 * MethodCard component for displaying method information in a card format
 */
export function MethodCard({ puzzleId, method, caseCount }: MethodCardProps) {
  const difficultyColor = {
    beginner: "default",
    cfop: "secondary",
    roux: "secondary",
    zz: "secondary",
  }[method.method] || "default";

  return (
    <Link href={`/puzzles/${puzzleId}/${method.method}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{method.name}</CardTitle>
            <Badge variant={difficultyColor as any}>
              {method.method.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>{method.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            {method.stages && (
              <div>{method.stages.length} stage{method.stages.length !== 1 ? "s" : ""}</div>
            )}
            {caseCount !== undefined && <div>{caseCount} algorithms</div>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
