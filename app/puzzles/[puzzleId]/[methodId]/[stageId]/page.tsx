import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { CaseBrowser } from "@/src/components/cube";
import { loadPuzzle, loadMethod, loadAlgorithmsByCategory } from "@/src/lib/data-loader";

interface StagePageProps {
  params: Promise<{ puzzleId: string; methodId: string; stageId: string }>;
}

export async function generateMetadata({ params }: StagePageProps): Promise<Metadata> {
  const { puzzleId, methodId, stageId } = await params;
  
  try {
    const [puzzle, method] = await Promise.all([
      loadPuzzle(puzzleId),
      loadMethod(puzzleId, methodId),
    ]);

    if (!puzzle || !method) {
      return {
        title: "Stage Not Found",
      };
    }

    const stage = method.stages?.find((s) => s.id === stageId);
    
    if (!stage) {
      return {
        title: "Stage Not Found",
      };
    }

    const description = `Browse all ${stage.name} cases for ${method.name} on ${puzzle.name}. ${stage.description}`;

    return {
      title: `${stage.name} - ${method.name}`,
      description,
      openGraph: {
        title: `${stage.name} - ${method.name}`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${stage.name} - ${method.name}`,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Stage Not Found",
    };
  }
}

export default async function StagePage({ params }: StagePageProps) {
  const { puzzleId, methodId, stageId } = await params;
  
  const [puzzle, method, categories] = await Promise.all([
    loadPuzzle(puzzleId),
    loadMethod(puzzleId, methodId),
    loadAlgorithmsByCategory(methodId, stageId),
  ]);

  if (!puzzle || !method) {
    notFound();
  }

  const stage = method.stages?.find((s) => s.id === stageId);

  if (!stage) {
    notFound();
  }

  // Check if this is an intuitive stage (no algorithms)
  const hasAlgorithms = Object.keys(categories).length > 0;
  const isIntuitive = !hasAlgorithms && (stage as any).caseCount === 0;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name, href: `/puzzles/${puzzleId}` },
            { label: method.name, href: `/puzzles/${puzzleId}/${methodId}` },
            { label: stage.name },
          ]}
        />

        <PageHeader
          title={stage.name}
          subtitle={stage.description}
        />

        {isIntuitive ? (
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Intuitive Step</h3>
            <p className="text-muted-foreground mb-4">
              This step is solved intuitively without memorizing specific algorithms.
              Practice and experimentation will help you understand how to solve this step.
            </p>
            <p className="text-sm text-muted-foreground">
              {stage.description}
            </p>
          </div>
        ) : (
          <CaseBrowser
            puzzleId={puzzleId}
            methodId={methodId}
            stageId={stageId}
            categories={categories}
          />
        )}
      </div>
    </Container>
  );
}
