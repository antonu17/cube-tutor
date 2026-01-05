import { CaseDescription } from "./CaseDescription";
import { AlgorithmCard } from "./AlgorithmCard";
import { ErrorBoundary } from "@/src/components/ui/error-boundary";
import { Separator } from "@/src/components/ui/separator";
import type { AlgorithmCase } from "@/src/types/cube";

interface CaseDetailProps {
  algorithmCase: AlgorithmCase;
}

export function CaseDetail({ algorithmCase }: CaseDetailProps) {
  const caseData = algorithmCase as any; // Type assertion for extra fields

  return (
    <ErrorBoundary>
      <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
        {/* Left column: Case description */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <CaseDescription
            name={caseData.name}
            category={caseData.category}
            difficulty={caseData.difficulty}
            recognitionHints={caseData.recognitionHints || []}
            probability={caseData.probability}
            setupMoves={caseData.setupMoves}
          />
        </div>

        {/* Right column: Algorithms */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Algorithms ({caseData.algorithms?.length || 0})
            </h2>
            <Separator className="mb-6" />
          </div>

          {caseData.algorithms && caseData.algorithms.length > 0 ? (
            <div className="space-y-4">
              {caseData.algorithms.map((algorithm: any, index: number) => (
                <AlgorithmCard
                  key={index}
                  algorithm={algorithm}
                  title={`Algorithm ${index + 1}`}
                  showMetadata={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No algorithms available for this case.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
