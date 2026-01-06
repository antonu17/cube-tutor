import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { AlgorithmNotation, AlgorithmMetadata, CubeView, AlgorithmAnimation } from "@/src/components/cube";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { loadPuzzle, loadMethod, loadCase } from "@/src/lib/data-loader";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";

interface CasePageProps {
  params: Promise<{ puzzleId: string; methodId: string; stageId: string; caseId: string }>;
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { puzzleId, methodId, stageId, caseId } = await params;
  
  try {
    const [puzzle, method, algorithmCase] = await Promise.all([
      loadPuzzle(puzzleId),
      loadMethod(puzzleId, methodId),
      loadCase(methodId, stageId, caseId),
    ]);

    if (!puzzle || !method || !algorithmCase) {
      return {
        title: "Case Not Found",
      };
    }

    const stage = method.stages?.find((s) => s.id === stageId);
    const stageName = stage?.name || stageId.toUpperCase();
    const description = `Learn ${algorithmCase.name} - ${method.name} ${stageName} algorithm for ${puzzle.name}. Includes notation, fingertricks, and recognition hints.`;

    return {
      title: `${algorithmCase.name} - ${stageName}`,
      description,
      openGraph: {
        title: `${algorithmCase.name} - ${method.name} ${stageName}`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${algorithmCase.name} - ${stageName}`,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Case Not Found",
    };
  }
}

const difficultyLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Very Easy",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Very Hard",
};

const difficultyColors: Record<1 | 2 | 3 | 4 | 5, "default" | "secondary" | "destructive"> = {
  1: "default",
  2: "default",
  3: "secondary",
  4: "destructive",
  5: "destructive",
};

export default async function CasePage({ params }: CasePageProps) {
  const { puzzleId, methodId, stageId, caseId } = await params;
  
  const [puzzle, method, algorithmCase] = await Promise.all([
    loadPuzzle(puzzleId),
    loadMethod(puzzleId, methodId),
    loadCase(methodId, stageId, caseId),
  ]);

  if (!puzzle || !method || !algorithmCase) {
    notFound();
  }

  const stage = method.stages?.find((s) => s.id === stageId);

  if (!stage) {
    notFound();
  }

  // Generate cube state from setup moves (if available)
  let setupState = null;
  if (algorithmCase.setupMoves) {
    try {
      const solvedState = createSolvedState();
      const setupAlgorithm = parseAlgorithm(algorithmCase.setupMoves);
      setupState = applyAlgorithm(solvedState, setupAlgorithm);
    } catch (error) {
      console.error("Failed to parse setup moves:", error);
    }
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name, href: `/puzzles/${puzzleId}` },
            { label: method.name, href: `/puzzles/${puzzleId}/${methodId}` },
            { label: stage.name, href: `/puzzles/${puzzleId}/${methodId}/${stageId}` },
            { label: algorithmCase.name },
          ]}
        />

        <div className="flex items-center justify-between">
          <PageHeader title={algorithmCase.name} />
          <Badge variant={difficultyColors[algorithmCase.difficulty]}>
            {difficultyLabels[algorithmCase.difficulty]}
          </Badge>
        </div>

        {algorithmCase.category && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Category:</span>
            <Badge variant="outline" className="capitalize">
              {algorithmCase.category}
            </Badge>
          </div>
        )}

        {setupState && (
          <>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold mb-4">Case Visualization</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is what the case looks like after applying the setup moves:
              </p>
              <div className="flex justify-center bg-card border rounded-lg p-6">
                <CubeView state={setupState} mode="case" options={{ stickerSize: 25 }} />
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Algorithm Animation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Watch how the algorithm transforms the cube step by step:
            </p>
            <AlgorithmAnimation
              notation={algorithmCase.primaryAlg.notation}
              setupMoves={algorithmCase.setupMoves}
              mode="case"
            />
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Primary Algorithm</h2>
            <div className="space-y-4">
              <AlgorithmNotation notation={algorithmCase.primaryAlg.notation} />
              <AlgorithmMetadata algorithm={algorithmCase.primaryAlg} />
            </div>
          </div>

          {algorithmCase.algorithms.length > 1 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Alternative Algorithms</h2>
                <div className="space-y-6">
                  {algorithmCase.algorithms
                    .filter((alg) => alg.id !== algorithmCase.primaryAlg.id)
                    .map((alg) => (
                      <div key={alg.id} className="space-y-4">
                        <AlgorithmNotation notation={alg.notation} />
                        <AlgorithmMetadata algorithm={alg} />
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {algorithmCase.recognitionHints.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Recognition Hints</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {algorithmCase.recognitionHints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {algorithmCase.setupMoves && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Setup Moves</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Apply these moves to a solved cube to create this case:
                </p>
                <code className="block rounded-lg bg-muted px-4 py-3 font-mono text-sm">
                  {algorithmCase.setupMoves}
                </code>
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
