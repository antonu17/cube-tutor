import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { PuzzleCard } from "@/src/components/navigation";
import { loadAllPuzzles } from "@/src/lib/data-loader";

export default async function PuzzlesPage() {
  const puzzles = await loadAllPuzzles();

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Puzzles" }]}
        />

        <PageHeader
          title="Puzzles"
          subtitle="Choose a puzzle to explore solving methods and algorithms"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {puzzles.map((puzzle) => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} />
          ))}
        </div>
      </div>
    </Container>
  );
}
