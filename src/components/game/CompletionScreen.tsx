import { CheckCircle2, RotateCcw, SkipForward } from "lucide-react";
import { Character } from "@/components/Character";
import { SupportPanel } from "@/components/game/SupportPanel";
import { panel, primaryButton } from "@/components/game/ui";
import type { Question } from "@/data/questions";

const CONFETTI: { left: number; delay: number; tone: string }[] = [
  { left: 6, delay: 0, tone: "bg-turquoise" },
  { left: 16, delay: 300, tone: "bg-soft-pink" },
  { left: 27, delay: 120, tone: "bg-sun" },
  { left: 38, delay: 480, tone: "bg-lavender" },
  { left: 49, delay: 200, tone: "bg-turquoise" },
  { left: 60, delay: 640, tone: "bg-peach" },
  { left: 71, delay: 80, tone: "bg-soft-pink" },
  { left: 82, delay: 360, tone: "bg-sun" },
  { left: 92, delay: 520, tone: "bg-lavender" },
];

interface CompletionScreenProps {
  answeredQuestions: Question[];
  skippedCount: number;
  onPlayAgain: () => void;
}

export function CompletionScreen({ answeredQuestions, skippedCount, onPlayAgain }: CompletionScreenProps) {
  return (
    <section className="relative space-y-6 pov-rise-in">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 h-72 overflow-hidden">
        {CONFETTI.map((piece) => (
          <span
            key={piece.left}
            className={`pov-confetti absolute top-0 h-4 w-3 rounded-sm border-2 border-ink ${piece.tone}`}
            style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}ms` }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 pt-4 text-center">
        <Character expression="happy" pose="cheer" className="h-48 w-48 sm:h-60 sm:w-60" />
        <h1
          tabIndex={-1}
          className="text-3xl font-extrabold leading-tight focus:outline-none sm:text-5xl"
        >
          Thank you for playing!
        </h1>
        <p className="max-w-md text-lg font-semibold leading-relaxed">
          You made it to the end. Thinking about how to respond to a friend, even in a made-up message, is a real
          skill, and you can keep building it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${panel("bg-turquoise")} text-center`}>
          <CheckCircle2 className="mx-auto h-7 w-7" aria-hidden="true" />
          <p className="mt-1 text-4xl font-extrabold">{answeredQuestions.length}</p>
          <p className="text-sm font-bold">Answered</p>
        </div>
        <div className={`${panel("bg-lavender")} text-center`}>
          <SkipForward className="mx-auto h-7 w-7" aria-hidden="true" />
          <p className="mt-1 text-4xl font-extrabold">{skippedCount}</p>
          <p className="text-sm font-bold">Skipped</p>
        </div>
      </div>

      {answeredQuestions.length > 0 && (
        <section aria-labelledby="lessons-heading" className={`${panel()} space-y-5`}>
          <h2 id="lessons-heading" className="text-xl font-extrabold">
            Key lessons
          </h2>
          <ul className="space-y-5">
            {answeredQuestions.map((question) => (
              <li key={question.id} className="space-y-1 border-l-4 border-turquoise pl-4">
                <p className="font-extrabold">{question.topic}</p>
                <p className="font-semibold leading-relaxed">{question.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SupportPanel />

      <div className="flex justify-center pt-2">
        <button type="button" onClick={onPlayAgain} className={primaryButton}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Play again
        </button>
      </div>
    </section>
  );
}
