import { useEffect, useState } from "react";
import { SkipForward } from "lucide-react";
import { Character } from "@/components/Character";
import { ChatBubble } from "@/components/game/ChatBubble";
import { QuestionProgress, type TrailSegment } from "@/components/game/ProgressTrail";
import { badge, chip, optionCard, optionTones, skipButton } from "@/components/game/ui";
import type { AnswerOption, Question } from "@/data/questions";

const LETTERS = ["A", "B", "C"];

interface ScenarioScreenProps {
  index: number;
  total: number;
  question: Question;
  options: AnswerOption[];
  earlierChoiceId?: string;
  justSkipped: boolean;
  segments: TrailSegment[];
  onAnswer: (optionId: string) => void;
  onSkip: () => void;
}

export function ScenarioScreen({
  index,
  total,
  question,
  options,
  earlierChoiceId,
  justSkipped,
  segments,
  onAnswer,
  onSkip,
}: ScenarioScreenProps) {
  const [noticeVisible, setNoticeVisible] = useState(justSkipped);
  const canSkip = earlierChoiceId === undefined;

  useEffect(() => {
    if (!justSkipped) return;
    const timer = window.setTimeout(() => setNoticeVisible(false), 2200);
    return () => window.clearTimeout(timer);
  }, [justSkipped]);

  return (
    <section className="space-y-6 pov-rise-in">
      <QuestionProgress index={index} total={total} topic={question.topic} segments={segments} />

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
        <Character expression={question.startExpression} pose="idle" className="h-44 w-44 shrink-0 sm:h-52 sm:w-52" />
        <ChatBubble live>
          <p>{question.friendMessage}</p>
        </ChatBubble>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mx-auto w-fit rounded-full border-2 border-ink bg-peach px-4 py-1.5 text-sm font-extrabold shadow-chunky-sm transition-opacity duration-300 ${
          noticeVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Let’s move on!
      </p>

      <div className="space-y-3">
        <p id="reply-heading" className="inline-block rounded-full border-2 border-ink bg-cream px-4 py-1 text-sm font-extrabold">
          How do you reply?
        </p>
        <div role="group" aria-labelledby="reply-heading" className="space-y-4">
          {options.map((option, i) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswer(option.id)}
              className={optionCard(optionTones[i])}
            >
              <span className={badge}>{LETTERS[i]}</span>
              <span className="flex-1">{option.text}</span>
              {option.id === earlierChoiceId && <span className={`${chip} shrink-0 bg-cream`}>You chose this</span>}
            </button>
          ))}
        </div>
      </div>

      {canSkip && (
        <div className="flex justify-center pt-1">
          <button type="button" onClick={onSkip} className={skipButton}>
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            Skip question
          </button>
        </div>
      )}
    </section>
  );
}
