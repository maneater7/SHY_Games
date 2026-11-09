import { chip } from "@/components/game/ui";

export type TrailSegment = "done" | "skipped" | "current" | "todo";

const SEGMENT_CLASS: Record<TrailSegment, string> = {
  done: "bg-turquoise",
  skipped: "bg-lavender",
  current: "bg-peach motion-safe:animate-pulse",
  todo: "bg-cream",
};

interface QuestionProgressProps {
  index: number;
  total: number;
  topic: string;
  segments: TrailSegment[];
  label?: string;
}

export function QuestionProgress({ index, total, topic, segments, label = "Question" }: QuestionProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`${chip} bg-peach`}>
          {label} {index + 1} of {total}
        </span>
        <span className="text-right text-sm font-bold">{topic}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Game progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        className="flex items-center gap-1.5 rounded-full border-[3px] border-ink bg-white/70 p-1.5"
      >
        {segments.map((segment, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`h-3 flex-1 rounded-full border-2 border-ink transition-colors duration-300 ${SEGMENT_CLASS[segment]}`}
          />
        ))}
      </div>
    </div>
  );
}
