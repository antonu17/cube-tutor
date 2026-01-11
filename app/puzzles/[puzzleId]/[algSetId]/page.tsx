import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { CaseBrowser } from "@/src/components/cube";
import { loadPuzzle, loadAlgorithmSet, loadAlgorithmsByCategory } from "@/src/lib/data-loader";

interface AlgorithmSetPageProps {
  params: Promise<{ puzzleId: string; algSetId: string }>;
}

export async function generateMetadata({ params }: AlgorithmSetPageProps): Promise<Metadata> {
  const { puzzleId, algSetId } = await params;
  
  try {
    const [puzzle, algorithmSet] = await Promise.all([
      loadPuzzle(puzzleId),
      loadAlgorithmSet(puzzleId, algSetId),
    ]);

    if (!puzzle || !algorithmSet) {
      return {
        title: "Algorithm Set Not Found",
      };
    }

    const description = `Browse all ${algorithmSet.name} cases for ${puzzle.name}. ${algorithmSet.description}`;

    return {
      title: `${algorithmSet.name} - ${puzzle.name}`,
      description,
      openGraph: {
        title: `${algorithmSet.name} - ${puzzle.name}`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${algorithmSet.name} - ${puzzle.name}`,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Algorithm Set Not Found",
    };
  }
}

export default async function AlgorithmSetPage({ params }: AlgorithmSetPageProps) {
  const { puzzleId, algSetId } = await params;
  
  const [puzzle, algorithmSet, categories] = await Promise.all([
    loadPuzzle(puzzleId),
    loadAlgorithmSet(puzzleId, algSetId),
    loadAlgorithmsByCategory(algSetId, algSetId),
  ]);

  if (!puzzle || !algorithmSet) {
    notFound();
  }

  // Check if this is an intuitive set (no algorithms)
  const hasAlgorithms = Object.keys(categories).length > 0;
  const isIntuitive = !hasAlgorithms && algorithmSet.caseCount === 0;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name, href: `/puzzles/${puzzleId}` },
            { label: algorithmSet.name },
          ]}
        />

        <PageHeader
          title={algorithmSet.name}
          subtitle={algorithmSet.description}
        />

        {isIntuitive ? (
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Intuitive Step</h3>
            <p className="text-muted-foreground mb-4">
              This step is solved intuitively without memorizing specific algorithms.
              Practice and experimentation will help you understand how to solve this step.
            </p>
            <p className="text-sm text-muted-foreground">
              {algorithmSet.description}
            </p>
          </div>
        ) : (
          <CaseBrowser
            puzzleId={puzzleId}
            methodId={algSetId}
            stageId={algSetId}
            categories={categories}
          />
        )}
      </div>
    </Container>
  );
}
