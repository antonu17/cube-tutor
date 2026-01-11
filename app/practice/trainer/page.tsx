import { Metadata } from "next";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";

export const metadata: Metadata = {
  title: "Algorithm Trainer",
  description: "Practice algorithms with scrambles and timing - Coming Soon",
  openGraph: {
    title: "Algorithm Trainer - Cube Tutor",
    description: "Practice algorithms with scrambles and timing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Algorithm Trainer - Cube Tutor",
    description: "Practice algorithms with scrambles and timing",
  },
};

export default function TrainerPage() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Practice", href: "#" },
            { label: "Trainer" },
          ]}
        />

        <PageHeader
          title="Algorithm Trainer"
          subtitle="Coming Soon"
        />

        <div className="rounded-lg border border-dashed p-12 text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Practice algorithms with scrambles and timing
          </p>
          <p className="text-sm text-muted-foreground">
            This feature is under development and will be available soon.
          </p>
        </div>
      </div>
    </Container>
  );
}
