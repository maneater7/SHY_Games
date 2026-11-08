import { useEffect, useReducer, useRef } from "react";
import { HeartHandshake, LogOut } from "lucide-react";
import { Backdrop } from "@/components/game/Backdrop";
import { CompletionScreen } from "@/components/game/CompletionScreen";
import { FeedbackScreen } from "@/components/game/FeedbackScreen";
import { IntroScreen } from "@/components/game/IntroScreen";
import { ScenarioScreen } from "@/components/game/ScenarioScreen";
import type { TrailSegment } from "@/components/game/ProgressTrail";
import { WelcomeScreen } from "@/components/game/WelcomeScreen";
import { secondaryButton } from "@/components/game/ui";
import { questions, type Question } from "@/data/questions";
import { createInitialState, gameReducer, type GameEvent, type GameState } from "@/game/gameState";
import { submitGameResults } from "@/lib/analytics";

interface PovGameProps {
  onEvent?: (event: GameEvent) => void;
  onExitToHub?: () => void;
}

function segmentsFor(state: GameState, current: number): TrailSegment[] {
  return questions.map((question, i) => {
    if (i === current) return "current";
    if (state.firstChoices[question.id] !== undefined) return "done";
    if (state.skipped.includes(question.id)) return "skipped";
    return "todo";
  });
}

export function PovGame({ onEvent, onExitToHub }: PovGameProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const hasSubmittedRef = useRef(false);
  const { phase } = state;
  const total = questions.length;

  useEffect(() => {
    if (phase.name !== "complete" || hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;
    void submitGameResults({
      answers: state.firstChoices,
      skippedQuestionIds: state.skipped,
    });
  }, [phase.name, state.firstChoices, state.skipped]);

  const handleAnswer = (question: Question, optionId: string) => {
    if (state.firstChoices[question.id] === undefined) {
      onEvent?.({ questionId: question.id, action: "answered", optionId });
    }
    dispatch({ type: "answer", questionId: question.id, optionId });
  };

  const handleSkip = (question: Question) => {
    onEvent?.({ questionId: question.id, action: "skipped" });
    dispatch({ type: "skip", questionId: question.id });
  };

  const renderPhase = () => {
    switch (phase.name) {
      case "welcome":
        return <WelcomeScreen onStart={() => dispatch({ type: "newGame" })} />;

      case "intro":
        return <IntroScreen onBegin={() => dispatch({ type: "begin" })} />;

      case "scenario": {
        const question = questions[phase.index];
        return (
          <ScenarioScreen
            key={question.id}
            index={phase.index}
            total={total}
            question={question}
            options={state.orders[question.id]}
            earlierChoiceId={state.firstChoices[question.id]}
            justSkipped={state.lastSkipped}
            segments={segmentsFor(state, phase.index)}
            onAnswer={(optionId) => handleAnswer(question, optionId)}
            onSkip={() => handleSkip(question)}
          />
        );
      }

      case "feedback": {
        const question = questions[phase.index];
        return (
          <FeedbackScreen
            key={`${question.id}-${phase.chosenId}`}
            index={phase.index}
            total={total}
            question={question}
            chosenId={phase.chosenId}
            segments={segmentsFor(state, phase.index)}
            onTryAgain={() => dispatch({ type: "tryAgain" })}
            onContinue={() => dispatch({ type: "continue" })}
          />
        );
      }

      case "complete":
        return (
          <CompletionScreen
            answeredQuestions={questions.filter((question) => state.firstChoices[question.id] !== undefined)}
            skippedCount={state.skipped.length}
            onPlayAgain={() => {
              hasSubmittedRef.current = false;
              dispatch({ type: "newGame" });
            }}
          />
        );
    }
  };

  return (
    <div className="relative isolate min-h-screen text-ink">
      <Backdrop />

      <header className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-cream px-3 py-2 shadow-chunky-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-turquoise">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-wide">SHY</p>
            <p className="text-xs font-semibold">Sexual Health for Youth</p>
          </div>
        </div>
        {phase.name !== "welcome" && (
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "exit" });
              onExitToHub?.();
            }}
            className={secondaryButton}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Exit
          </button>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8">{renderPhase()}</main>
    </div>
  );
}
