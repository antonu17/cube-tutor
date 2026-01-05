import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { PhaseCard } from "@/src/components/navigation";
import { loadPuzzle, loadMethod } from "@/src/lib/data-loader";

interface MethodPageProps {
  params: Promise<{ puzzleId: string; methodId: string }>;
}

export default async function MethodPage({ params }: MethodPageProps) {
  const { puzzleId, methodId } = await params;
  
  const [puzzle, method] = await Promise.all([
    loadPuzzle(puzzleId),
    loadMethod(puzzleId, methodId),
  ]);

  if (!puzzle || !method) {
    notFound();
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name, href: `/puzzles/${puzzleId}` },
            { label: method.name },
          ]}
        />

        <PageHeader
          title={method.name}
          subtitle={method.description}
        />

        {method.stages && method.stages.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Stages</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {method.stages.map((stage) => (
                <PhaseCard
                  key={stage.id}
                  puzzleId={puzzleId}
                  methodId={methodId}
                  phase={stage}
                />
              ))}
            </div>
          </div>
        )}

        {(!method.stages || method.stages.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            This method has no defined stages yet.
          </div>
        )}
      </div>
    </Container>
  );
}
