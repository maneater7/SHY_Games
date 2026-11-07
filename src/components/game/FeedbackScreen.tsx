import { ArrowRight, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { Character } from "@/components/Character";
import { ChatBubble, PlayerBubble } from "@/components/game/ChatBubble";
import { QuestionProgress, type TrailSegment } from "@/components/game/ProgressTrail";
import { SupportPanel } from "@/components/game/SupportPanel";
import { chip, panel, primaryButton, secondaryButton } from "@/components/game/ui";
import type { Question } from "@/data/questions";

const STILL_UNSURE_CAPTION = "Still unsure how to feel";

interface FeedbackScreenProps {
  index: number;
  total: number;
  question: Question;
  chosenId: string;
  segments: TrailSegment[];
  onTryAgain: () => void;
  onContinue: () => void;
}

export function FeedbackScreen({
  index,
  total,
  question,
  chosenId,
  segments,
  onTryAgain,
  onContinue,
}: FeedbackScreenProps) {
  const chosen = question.options.find((option) => option.id === chosenId);
  const helpful = question.options.find((option) => option.isHelpful);
  if (!chosen || !helpful) return null;

  const chosenIsHelpful = chosen.isHelpful;
  const reaction = chosenIsHelpful
    ? question.helpfulReaction
    : { expression: question.startExpression, caption: STILL_UNSURE_CAPTION };

  return (
    <section className="space-y-6 pov-rise-in">
      <QuestionProgress index={index} total={total} topic={question.topic} segments={segments} />

      <PlayerBubble>
        <p>“{chosen.text}”</p>
      </PlayerBubble>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
        <Character
          key={chosenId}
          expression={reaction.expression}
          pose={chosenIsHelpful ? "cheer" : "lean"}
          className="h-44 w-44 shrink-0 sm:h-52 sm:w-52"
        />
        <ChatBubble live>
          <p>{reaction.caption}</p>
        </ChatBubble>
      </div>

      <div className={`${panel("bg-lavender/60")} space-y-2`}>
        <p className="text-xs font-extrabold uppercase tracking-wider">Key idea</p>
        <p className="font-semibold leading-relaxed">{question.summary}</p>
      </div>

      <div aria-live="polite" className={`${panel()} space-y-4 pov-rise-in`}>
        <div className="flex flex-wrap items-center gap-2">
          {chosenIsHelpful ? (
            <span className={`${chip} bg-turquoise`}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Helpful reply
            </span>
          ) : (
            <span className={`${chip} bg-peach`}>
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Could be more supportive
            </span>
          )}
          <span className={`${chip} bg-soft-pink`}>You chose this</span>
        </div>
        <p className="leading-relaxed">{chosen.explanation}</p>
      </div>

      {!chosenIsHelpful && (
        <div className={`${panel("bg-turquoise/50")} space-y-3`}>
          <p className="font-extrabold">A more supportive reply could be:</p>
          <span className={`${chip} bg-turquoise`}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Helpful reply
          </span>
          <p className="font-semibold italic leading-relaxed">“{helpful.text}”</p>
        </div>
      )}

      {question.showSupportPanel && <SupportPanel />}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <button type="button" onClick={onTryAgain} className={secondaryButton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try another response
        </button>
        <button type="button" onClick={onContinue} className={primaryButton}>
          Continue
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
