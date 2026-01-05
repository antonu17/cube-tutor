import type { Algorithm } from "@/src/types/cube";

interface AlgorithmMetadataProps {
  algorithm: Algorithm;
  className?: string;
}

/**
 * AlgorithmMetadata component for displaying algorithm metadata
 */
export function AlgorithmMetadata({ algorithm, className }: AlgorithmMetadataProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Move Count:</span>{" "}
          <span className="font-medium">{algorithm.moves.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Algorithm ID:</span>{" "}
          <span className="font-mono text-xs">{algorithm.id}</span>
        </div>
      </div>
    </div>
  );
}
