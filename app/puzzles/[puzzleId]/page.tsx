import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { MethodCard } from "@/src/components/navigation";
import { loadPuzzle, loadAllMethods } from "@/src/lib/data-loader";

interface PuzzlePageProps {
  params: Promise<{ puzzleId: string }>;
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
  const { puzzleId } = await params;
  const puzzle = await loadPuzzle(puzzleId);

  if (!puzzle) {
    notFound();
  }

  const methods = await loadAllMethods(puzzleId);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Puzzles", href: "/puzzles" },
            { label: puzzle.name },
          ]}
        />

        <PageHeader
          title={puzzle.name}
          subtitle={puzzle.description}
        />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Solving Methods</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {methods.map((method) => (
              <MethodCard
                key={method.method}
                puzzleId={puzzleId}
                method={method}
              />
            ))}
          </div>
        </div>

        {methods.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No methods available for this puzzle yet.
          </div>
        )}
      </div>
    </Container>
  );
}
