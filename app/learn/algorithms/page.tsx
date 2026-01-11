import { Metadata } from "next";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs, AlgorithmSetGroupCard } from "@/src/components/navigation";
import { loadAllPuzzles, loadAlgorithmSetsByGroup } from "@/src/lib/data-loader";

export const metadata: Metadata = {
  title: "Algorithms",
  description: "Browse all algorithm sets grouped by puzzle and method",
  openGraph: {
    title: "Algorithms - Cube Tutor",
    description: "Browse all algorithm sets grouped by puzzle and method",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Algorithms - Cube Tutor",
    description: "Browse all algorithm sets grouped by puzzle and method",
  },
};

export default async function AlgorithmsPage() {
  // Load all puzzles
  const puzzles = await loadAllPuzzles();
  
  // Load algorithm set groups for each puzzle
  const puzzleGroups = await Promise.all(
    puzzles.map(async (puzzle) => ({
      puzzle,
      groups: await loadAlgorithmSetsByGroup(puzzle.id),
    }))
  );

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "#" },
            { label: "Algorithms" },
          ]}
        />

        <PageHeader
          title="Algorithms"
          subtitle="Browse all algorithm sets grouped by puzzle and method"
        />

        <div className="flex flex-col gap-8">
          {puzzleGroups.map(({ puzzle, groups }) => (
            <div key={puzzle.id} className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{puzzle.name}</h2>
                <p className="text-muted-foreground">{puzzle.description}</p>
              </div>
              
              <div className="flex flex-col gap-6">
                {groups.map((group) => (
                  <AlgorithmSetGroupCard
                    key={group.id}
                    puzzleId={puzzle.id}
                    group={group}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
