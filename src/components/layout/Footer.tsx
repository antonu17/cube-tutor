import Link from "next/link";
import { Container } from "./Container";

/**
 * Footer component with credits and links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Cube Tutor. Algorithm data from SpeedCubeDB.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/antonu17/cube-tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.speedcubedb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              SpeedCubeDB
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
