import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { AlgorithmNotation, AlgorithmMetadata, AlgorithmAnimation, CaseDescription } from "@/src/components/cube";
import { CubeView } from "@/src/components/cube/CubeView";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { loadPuzzle, loadAlgorithmSet, loadCase } from "@/src/lib/data-loader";
import { parseAlgorithm, invertAlgorithm } from "@/src/lib/cube-engine/parser";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";

interface CasePageProps {
  params: Promise<{ puzzleId: string; algSetId: string; caseId: string }>;
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { puzzleId, algSetId, caseId } = await params;
  
  try {
    const [puzzle, algorithmSet, algorithmCase] = await Promise.all([
      loadPuzzle(puzzleId),
      loadAlgorithmSet(puzzleId, algSetId),
      loadCase(algSetId, algSetId, caseId),
    ]);

    if (!puzzle || !algorithmSet || !algorithmCase) {
      return {
        title: "Case Not Found",
      };
    }

    const description = `Learn ${algorithmCase.name} - ${algorithmSet.name} algorithm for ${puzzle.name}. Includes notation, fingertricks, and recognition hints.`;

    return {
      title: `${algorithmCase.name} - ${algorithmSet.name}`,
      description,
      openGraph: {
        title: `${algorithmCase.name} - ${algorithmSet.name}`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${algorithmCase.name} - ${algorithmSet.name}`,
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
  const { puzzleId, algSetId, caseId } = await params;
  
  const [puzzle, algorithmSet, algorithmCase] = await Promise.all([
    loadPuzzle(puzzleId),
    loadAlgorithmSet(puzzleId, algSetId),
    loadCase(algSetId, algSetId, caseId),
  ]);

  if (!puzzle || !algorithmSet || !algorithmCase) {
    notFound();
  }

  // Generate setup moves for animation
  // If setupMoves exist, use them. Otherwise, use inverse of primary algorithm.
  // For OLL/PLL, prepend z2 to start with yellow on top.
  let effectiveSetupMoves: string | undefined = algorithmCase.setupMoves;
  const isOllOrPll = algSetId === 'oll' || algSetId === 'pll';
  
  if (!algorithmCase.setupMoves) {
    try {
      // Use inverse of primary algorithm to create case state
      const primaryMoves = parseAlgorithm(algorithmCase.primaryAlg.notation);
      const inverseMoves = invertAlgorithm(primaryMoves);
      // Store inverse notation for animation component
      effectiveSetupMoves = inverseMoves.map(m => m.notation).join(' ');
    } catch (error) {
      console.error("Failed to generate setup moves:", error);
    }
  }
  
  // Prepend z2 for OLL/PLL cases (to start with yellow on top)
  if (isOllOrPll) {
    effectiveSetupMoves = effectiveSetupMoves 
      ? 'z2 ' + effectiveSetupMoves 
      : 'z2';
  }

  // Generate cube state for thumbnail
  let caseState = createSolvedState();
  try {
    if (effectiveSetupMoves) {
      const setupAlgorithm = parseAlgorithm(effectiveSetupMoves);
      caseState = applyAlgorithm(caseState, setupAlgorithm);
    }
  } catch (error) {
    console.error("Failed to generate case state:", error);
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name, href: `/puzzles/${puzzleId}` },
            { label: algorithmSet.name, href: `/puzzles/${puzzleId}/${algSetId}` },
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

        {/* Main content with sidebar layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
          {/* Left column - Main content */}
          <div className="space-y-8">
            {/* Primary Algorithm */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Primary Algorithm</h2>
              <div className="space-y-4">
                <AlgorithmNotation notation={algorithmCase.primaryAlg.notation} />
                <AlgorithmMetadata algorithm={algorithmCase.primaryAlg} />
              </div>
            </div>

            {/* Alternative Algorithms */}
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

            <Separator />

            {/* Algorithm Animation */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Algorithm Animation</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Watch the algorithm solve the case step by step. The animation starts from the case state and ends with a solved cube:
              </p>
              <AlgorithmAnimation
                notation={algorithmCase.primaryAlg.notation}
                setupMoves={effectiveSetupMoves}
                mode="case"
                stageId={algSetId}
              />
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="sticky top-4 self-start">
            {/* Case Info Card */}
            <div className="rounded-lg border bg-card p-6">
              <div className="grid grid-cols-[140px_1fr] gap-6">
                {/* Left: 2D Case Thumbnail */}
                <div className="flex items-start justify-center pt-2">
                  <CubeView 
                    state={caseState} 
                    mode={isOllOrPll ? "case" : "top"}
                    options={{ 
                      stickerSize: 20,
                      grayscaleNonYellow: algSetId === 'oll'
                    }} 
                  />
                </div>

                {/* Right: Setup Moves and Recognition */}
                <div className="space-y-6">
                  {/* Setup Moves */}
                  {algorithmCase.setupMoves && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Setup Moves</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Apply these moves to a solved cube to create this case:
                      </p>
                      <code className="block rounded-lg bg-muted px-3 py-2 text-sm">
                        {algorithmCase.setupMoves}
                      </code>
                    </div>
                  )}

                  {/* Recognition Hints */}
                  {algorithmCase.recognitionHints.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recognition Hints</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {algorithmCase.recognitionHints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
