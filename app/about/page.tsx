import { Metadata } from "next";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Cube Tutor - your comprehensive guide to mastering the Rubik's Cube and other twisty puzzles.",
  openGraph: {
    title: "About Cube Tutor",
    description: "Learn more about Cube Tutor - your comprehensive guide to mastering the Rubik's Cube and other twisty puzzles.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Cube Tutor",
    description: "Learn more about Cube Tutor - your comprehensive guide to mastering the Rubik's Cube and other twisty puzzles.",
  },
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />

        <PageHeader 
          title="About Cube Tutor" 
          subtitle="Your comprehensive guide to mastering the Rubik's Cube"
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What is Cube Tutor?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cube Tutor is a comprehensive learning platform designed to help you master the Rubik's Cube 
              and other twisty puzzles. Whether you're a complete beginner or an experienced speedcuber 
              looking to improve your times, Cube Tutor provides structured learning paths, detailed 
              algorithm databases, and interactive tutorials.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Step-by-step tutorials for multiple solving methods (Beginner, CFOP, and more)</li>
              <li>Comprehensive algorithm databases for OLL, PLL, and other algorithm sets</li>
              <li>Algorithm filtering and categorization for easy learning</li>
              <li>Recognition hints and difficulty ratings for each algorithm</li>
              <li>Clean, modern interface optimized for learning</li>
              <li>Mobile-friendly design for learning on the go</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Supported Methods</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Beginner Method</h3>
                <p>Perfect for those just starting out. Learn to solve the cube step-by-step with easy-to-follow instructions.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">CFOP (Fridrich Method)</h3>
                <p>The most popular speedcubing method used by world champions. Master Cross, F2L, OLL, and PLL for faster solves.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ready to begin your cubing journey? Start with the{" "}
              <a href="/puzzles/3x3x3/beginner" className="text-primary hover:underline">
                Beginner Method
              </a>{" "}
              if you're new to cubing, or jump straight to{" "}
              <a href="/puzzles/3x3x3/cfop" className="text-primary hover:underline">
                CFOP
              </a>{" "}
              if you're ready to level up your speedcubing skills.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cube Tutor is an open-source project. We believe in making quality cubing education 
              accessible to everyone. If you'd like to contribute or report an issue, visit our{" "}
              <a 
                href="https://github.com/antonu17/cube-tutor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
