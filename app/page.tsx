import Link from "next/link";
import { Container, PageHeader } from "@/src/components/layout";
import { Button } from "@/src/components/ui/button";

export default function Home() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Welcome to Cube Tutor"
          subtitle="Interactive platform for learning Rubik's cube solving methods and speedsolving algorithms"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Learn Methods</h2>
            <p className="text-sm text-muted-foreground">
              Master solving methods from beginner techniques to advanced
              speedsolving systems like CFOP, Roux, and ZZ.
            </p>
            <Button asChild className="mt-auto">
              <Link href="/puzzles">Browse Puzzles</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Practice Algorithms</h2>
            <p className="text-sm text-muted-foreground">
              Browse and practice algorithms organized by method, phase, and
              case with detailed metadata and fingertrick notes.
            </p>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/puzzles/3x3x3">3x3x3 Cube</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Track Progress</h2>
            <p className="text-sm text-muted-foreground">
              Coming soon: Track your learning progress, practice statistics,
              and algorithm mastery across all methods.
            </p>
            <Button variant="outline" disabled className="mt-auto">
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold mb-4">Currently Available</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Beginner Method:</strong> 9 algorithms across 7 stages
            </li>
            <li>
              <strong>CFOP Method:</strong> 20 OLL cases + 21 PLL cases
            </li>
            <li>
              <strong>Interactive Algorithm Browser:</strong> Search and filter
              by category, difficulty, and more
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
