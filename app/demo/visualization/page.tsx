/**
 * Cube Visualization Demo Page
 * Showcases the 2D SVG renderer
 */

import { Metadata } from "next";
import { Container, PageHeader } from "@/src/components/layout";
import { Breadcrumbs } from "@/src/components/navigation";
import { CubeNet } from "@/src/components/cube/CubeNet";
import { CubeView } from "@/src/components/cube/CubeView";
import { createSolvedState } from "@/src/lib/cube-engine/state";
import { applyAlgorithm } from "@/src/lib/cube-engine/executor";
import { parseAlgorithm } from "@/src/lib/cube-engine/parser";
import type { CubeState } from "@/src/types/cube";

export const metadata: Metadata = {
  title: "Cube Visualization Demo",
  description: "Interactive demonstration of Cube Tutor's 2D SVG cube renderer",
};

// Create some example cube states
const solvedState = createSolvedState();

// Example 1: Simple R U moves (scrambles top layer and some edges)
const example1 = parseAlgorithm("R U R' U'");
const state1 = applyAlgorithm(solvedState, example1);

// Example 2: Sune-like pattern
const example2 = parseAlgorithm("R U R' U R U2 R'");
const state2 = applyAlgorithm(solvedState, example2);

// Example 3: F2L-like scramble
const example3 = parseAlgorithm("R U' R' U R U' R'");
const state3 = applyAlgorithm(solvedState, example3);

// Example 4: More complex scramble
const scramble = parseAlgorithm("R U R' U' R' F R2 U' R' U R");
const scrambledState = applyAlgorithm(solvedState, scramble);

// PLL Cases
const tPerm = parseAlgorithm("R U R' U' R' F R2 U' R' U' R U R' F'");
const tPermState = applyAlgorithm(solvedState, tPerm);

const uaPerm = parseAlgorithm("R U' R U R U R U' R' U' R2");
const uaPermState = applyAlgorithm(solvedState, uaPerm);

const hPerm = parseAlgorithm("M2 U M2 U2 M2 U M2");
// H-Perm uses M moves which aren't implemented yet, so use alternative
const hPermAlt = parseAlgorithm("R2 U2 R U2 R2 U2 R2 U2 R U2 R2");
const hPermState = applyAlgorithm(solvedState, hPermAlt);

const jaPerm = parseAlgorithm("R' U L' U2 R U' R' U2 R L");
const jaPermState = applyAlgorithm(solvedState, jaPerm);

export default function CubeVisualizationDemo() {
  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Cube Visualization Demo" },
          ]}
        />

        <PageHeader
          title="Cube Visualization Demo"
          subtitle="Interactive 2D SVG cube renderer showcase"
        />

        <div className="space-y-12">
          {/* Solved Cube - Full Net */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Cube Net View</h2>
              <p className="text-muted-foreground">
                Full 2D flat net showing all 6 faces in a cross pattern. This view is useful for
                understanding the complete state of the cube.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 flex justify-center">
              <CubeNet state={solvedState} showLabels={true} />
            </div>
          </section>

          {/* Case View Comparison */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Algorithm Examples</h2>
              <p className="text-muted-foreground">
                Compact view showing the top face with surrounding edges. This is the standard view
                for OLL and PLL case recognition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Solved */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Solved Cube</h3>
                <div className="flex justify-center">
                  <CubeView state={solvedState} mode="case" />
                </div>
              </div>

              {/* Example 1 */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Sexy Move Pattern</h3>
                <div className="flex justify-center">
                  <CubeView state={state1} mode="case" />
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Sune-like Pattern</h3>
                <div className="flex justify-center">
                  <CubeView state={state2} mode="case" />
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">F2L Pattern</h3>
                <div className="flex justify-center">
                  <CubeView state={state3} mode="case" />
                </div>
              </div>

              {/* Scrambled */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Scrambled Cube</h3>
                <div className="flex justify-center">
                  <CubeView state={scrambledState} mode="case" />
                </div>
              </div>
            </div>
          </section>

          {/* PLL Cases */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">PLL Cases</h2>
              <p className="text-muted-foreground">
                Examples of PLL (Permutation of the Last Layer) algorithm cases. Note: These show
                the result after applying the algorithm to a solved cube.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* T-Perm */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">T-Perm</h3>
                <p className="text-xs text-muted-foreground text-center mb-2">R U R' U' R' F R2 U' R' U' R U R' F'</p>
                <div className="flex justify-center">
                  <CubeView state={tPermState} mode="case" />
                </div>
              </div>

              {/* Ua-Perm */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Ua Perm</h3>
                <p className="text-xs text-muted-foreground text-center mb-2">R U' R U R U R U' R' U' R2</p>
                <div className="flex justify-center">
                  <CubeView state={uaPermState} mode="case" />
                </div>
              </div>

              {/* H-Perm */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">H Perm (Alt)</h3>
                <p className="text-xs text-muted-foreground text-center mb-2">R2 U2 R U2 R2 U2 R2 U2 R U2 R2</p>
                <div className="flex justify-center">
                  <CubeView state={hPermState} mode="case" />
                </div>
              </div>

              {/* Ja-Perm */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Ja Perm</h3>
                <p className="text-xs text-muted-foreground text-center mb-2">R' U L' U2 R U' R' U2 R L</p>
                <div className="flex justify-center">
                  <CubeView state={jaPermState} mode="case" />
                </div>
              </div>
            </div>
          </section>

          {/* Top Face Only */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Top Face Only</h2>
              <p className="text-muted-foreground">
                Minimal view showing just the top face. Useful for thumbnails and compact displays.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-card border rounded-lg p-3">
                <div className="flex justify-center">
                  <CubeView state={solvedState} mode="top" />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex justify-center">
                  <CubeView state={state1} mode="top" />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex justify-center">
                  <CubeView state={state2} mode="top" />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex justify-center">
                  <CubeView state={state3} mode="top" />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex justify-center">
                  <CubeView state={scrambledState} mode="top" />
                </div>
              </div>
            </div>
          </section>

          {/* Size Comparison */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Custom Sizing</h2>
              <p className="text-muted-foreground">
                The renderer supports custom sticker sizes for different use cases.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Small (20px)</h3>
                <div className="flex justify-center">
                  <CubeView state={solvedState} mode="case" options={{ stickerSize: 15 }} />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Medium (25px)</h3>
                <div className="flex justify-center">
                  <CubeView state={solvedState} mode="case" options={{ stickerSize: 25 }} />
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-medium mb-3 text-center">Large (35px)</h3>
                <div className="flex justify-center">
                  <CubeView state={solvedState} mode="case" options={{ stickerSize: 35 }} />
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Details */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Implementation Details</h2>
              <p className="text-muted-foreground">
                The 2D renderer is built with pure SVG and supports:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Full cube state visualization (all 6 faces)</li>
              <li>OLL/PLL case view (top face + surrounding edges)</li>
              <li>Top face only view (for thumbnails)</li>
              <li>Customizable sticker sizes and colors</li>
              <li>Face labels for debugging</li>
              <li>Efficient memoization for performance</li>
              <li>Fully responsive and scalable (SVG)</li>
            </ul>
          </section>
        </div>
      </div>
    </Container>
  );
}
