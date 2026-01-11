import { Metadata } from "next";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";

export const metadata: Metadata = {
  title: "Speedsolving Timer",
  description: "Track your solve times and improve your speed - Coming Soon",
  openGraph: {
    title: "Speedsolving Timer - Cube Tutor",
    description: "Track your solve times and improve your speed",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Speedsolving Timer - Cube Tutor",
    description: "Track your solve times and improve your speed",
  },
};

export default function TimerPage() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Practice", href: "#" },
            { label: "Timer" },
          ]}
        />

        <PageHeader
          title="Speedsolving Timer"
          subtitle="Coming Soon"
        />

        <div className="rounded-lg border border-dashed p-12 text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Track your solve times and improve your speed
          </p>
          <p className="text-sm text-muted-foreground">
            This feature is under development and will be available soon.
          </p>
        </div>
      </div>
    </Container>
  );
}
