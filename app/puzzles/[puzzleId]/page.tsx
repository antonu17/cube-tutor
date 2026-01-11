import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs, AlgorithmSetGroupCard } from "@/src/components/navigation";
import { loadPuzzle, loadAlgorithmSetsByGroup } from "@/src/lib/data-loader";

interface PuzzlePageProps {
  params: Promise<{ puzzleId: string }>;
}

export async function generateMetadata({ params }: PuzzlePageProps): Promise<Metadata> {
  const { puzzleId } = await params;
  
  try {
    const puzzle = await loadPuzzle(puzzleId);

    if (!puzzle) {
      return {
        title: "Puzzle Not Found",
      };
    }

    const description = `Learn algorithms for ${puzzle.name}. ${puzzle.description}`;

    return {
      title: puzzle.name,
      description,
      openGraph: {
        title: `${puzzle.name} - Algorithms`,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${puzzle.name} - Algorithms`,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Puzzle Not Found",
    };
  }
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
  const { puzzleId } = await params;
  const puzzle = await loadPuzzle(puzzleId);

  if (!puzzle) {
    notFound();
  }

  const algorithmSetGroups = await loadAlgorithmSetsByGroup(puzzleId);

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

        <div className="space-y-6">
          {algorithmSetGroups.map((group) => (
            <AlgorithmSetGroupCard
              key={group.name}
              puzzleId={puzzleId}
              group={group}
            />
          ))}
        </div>

        {algorithmSetGroups.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No algorithm sets available for this puzzle yet.
          </div>
        )}
      </div>
    </Container>
  );
}
