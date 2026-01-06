import { CategorySection } from "./CategorySection";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseBrowserProps {
  puzzleId: string;
  methodId: string;
  stageId: string;
  categories: Record<
    string,
    {
      name: string;
      description: string;
      cases: AlgorithmCase[];
    }
  >;
}

/**
 * CaseBrowser component for browsing algorithm cases organized by category
 */
export function CaseBrowser({
  puzzleId,
  methodId,
  stageId,
  categories,
}: CaseBrowserProps) {
  const categoryEntries = Object.entries(categories);

  if (categoryEntries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No cases available for this stage.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categoryEntries.map(([key, category]) => (
        <CategorySection
          key={key}
          puzzleId={puzzleId}
          methodId={methodId}
          stageId={stageId}
          category={category}
          categoryKey={key}
        />
      ))}
    </div>
  );
}
