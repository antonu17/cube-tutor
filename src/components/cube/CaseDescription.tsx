import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";

interface CaseDescriptionProps {
  name: string;
  category?: string;
  difficulty: number;
  recognitionHints: string[];
  probability?: number;
  setupMoves?: string;
}

export function CaseDescription({
  name,
  category,
  difficulty,
  recognitionHints,
  probability,
  setupMoves,
}: CaseDescriptionProps) {
  const getDifficultyLabel = (diff: number): string => {
    const labels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
    return labels[diff - 1] || "Unknown";
  };

  const getDifficultyColor = (diff: number): string => {
    if (diff <= 2) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (diff === 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{name}</h1>
        <div className="flex flex-wrap gap-2">
          {category && (
            <Badge variant="outline" className="capitalize">
              {category.replace(/-/g, " ")}
            </Badge>
          )}
          <Badge className={getDifficultyColor(difficulty)}>
            {getDifficultyLabel(difficulty)}
          </Badge>
          {probability !== undefined && (
            <Badge variant="secondary">
              {(probability * 100).toFixed(2)}% probability
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3">Recognition</h2>
        <ul className="space-y-2">
          {recognitionHints.map((hint, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{hint}</span>
            </li>
          ))}
        </ul>
      </div>

      {setupMoves && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-3">Setup</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Use these moves to create this case from a solved cube:
            </p>
            <code className="block bg-muted rounded-md p-3 font-mono text-sm">
              {setupMoves}
            </code>
          </div>
        </>
      )}
    </div>
  );
}
