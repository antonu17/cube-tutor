import Link from "next/link";
import { Container, PageHeader } from "@/src/components/layout";
import { Button } from "@/src/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <PageHeader
            title="Page Not Found"
            subtitle="The page you're looking for doesn't exist or has been moved."
          />
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/puzzles">
              <Search className="mr-2 h-4 w-4" />
              Browse Puzzles
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Helpful links:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/puzzles/3x3x3" className="hover:underline">
                3x3x3 Cube Methods
              </Link>
            </li>
            <li>
              <Link href="/puzzles/3x3x3/cfop/oll" className="hover:underline">
                Browse OLL Cases
              </Link>
            </li>
            <li>
              <Link href="/puzzles/3x3x3/cfop/pll" className="hover:underline">
                Browse PLL Cases
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
