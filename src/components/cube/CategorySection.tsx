import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { CaseCard } from "./CaseCard";
import type { AlgorithmCase } from "@/src/types/cube";

interface CategorySectionProps {
  puzzleId: string;
  methodId: string;
  stageId: string;
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
  methodId,
  stageId,
  category,
  categoryKey,
  defaultOpen = false,
}: CategorySectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? categoryKey : undefined}>
      <AccordionItem value={categoryKey}>
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full pr-4">
            <div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <span className="text-sm text-muted-foreground">
              {category.cases.length} case{category.cases.length !== 1 ? "s" : ""}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {category.cases.map((algorithmCase) => (
              <CaseCard
                key={algorithmCase.id}
                puzzleId={puzzleId}
                methodId={methodId}
                stageId={stageId}
                algorithmCase={algorithmCase}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
