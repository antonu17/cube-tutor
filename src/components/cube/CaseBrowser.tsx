import { CategorySection } from "./CategorySection";
import { CategoryNav } from "./CategoryNav";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseBrowserProps {
  puzzleId: string;
  algSetId: string;
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
  algSetId,
  categories,
}: CaseBrowserProps) {
  const categoryEntries = Object.entries(categories);

  if (categoryEntries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No cases available for this algorithm set.
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <CategoryNav categories={categories} />
      
      {/* Category sections */}
      <div className="space-y-8 p-4">
        {categoryEntries.map(([key, category]) => (
          <CategorySection
            key={key}
            puzzleId={puzzleId}
            algSetId={algSetId}
            category={category}
            categoryKey={key}
          />
        ))}
      </div>
    </div>
  );
}
