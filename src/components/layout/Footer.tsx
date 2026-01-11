import Link from "next/link";
import { Container } from "./Container";

/**
 * Footer component with credits and links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800" style={{ backgroundColor: '#1a1a1a', color: '#ededed' }}>
      <Container>
        <div className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <p className="text-sm opacity-60">
              © {currentYear} Cube Tutor. Algorithm data from SpeedCubeDB.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/antonu17/cube-tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              GitHub
            </Link>
            <Link
              href="https://www.speedcubedb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              SpeedCubeDB
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
