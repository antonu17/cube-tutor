import { CaseListItem } from "./CaseListItem";
import type { AlgorithmCase } from "@/src/types/cube";

interface CategorySectionProps {
  puzzleId: string;
  algSetId: string;
  category: {
    name: string;
    description: string;
    cases: AlgorithmCase[];
  };
  categoryKey: string;
  defaultOpen?: boolean;
}

/**
 * CategorySection component for displaying algorithm cases grouped by category
 */
export function CategorySection({
  puzzleId,
  algSetId,
  category,
  categoryKey,
}: CategorySectionProps) {
  return (
    <div className="space-y-3" id={`category-${categoryKey}`}>
      {/* Category header */}
      <div className="border-b pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          <span className="text-sm text-muted-foreground">
            {category.cases.length} case{category.cases.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Cases list */}
      <div className="space-y-2">
        {category.cases.map((algorithmCase) => (
          <CaseListItem
            key={algorithmCase.id}
            puzzleId={puzzleId}
            algSetId={algSetId}
            algorithmCase={algorithmCase}
          />
        ))}
      </div>
    </div>
  );
}
