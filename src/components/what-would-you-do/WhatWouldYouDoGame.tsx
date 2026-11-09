import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake, Info, Lightbulb, RotateCcw, SkipForward } from "lucide-react";
import { QuestionProgress, type TrailSegment } from "@/components/game/ProgressTrail";
import { SupportPanel } from "@/components/game/SupportPanel";
import { badge, chip, optionCard, optionTones, panel, primaryButton, secondaryButton, skipButton } from "@/components/game/ui";
import { scenarios, type Mood, type Scenario, type ScenarioOption } from "@/data/whatWouldYouDoScenarios";
import { createInitialState, gameReducer, summarize, type GameState } from "@/game/whatWouldYouDoState";
import { CastLineup, SceneArt } from "./Scenes";
import "./what-would-you-do.css";

const LETTERS = ["A", "B", "C"];
const TOTAL = scenarios.length;

function segmentsFor(state: GameState, current: number): TrailSegment[] {
  return scenarios.map((scenario, i) => {
    if (i === current) return "current";
    if (state.firstChoices[scenario.id] !== undefined) return "done";
    if (state.skipped.includes(scenario.id)) return "skipped";
    return "todo";
  });
}

function useFocusOnMount<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, [key]);
  return ref;
}

function TownBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#FFE9D6] via-[#F6E3F1] to-[#E4DDF3]">
      <div className="absolute -left-10 top-16 h-44 w-44 rounded-full bg-sun/80 shadow-[0_0_0_22px_rgba(255,212,92,0.28)]" />
      <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 h-[24vh] w-full opacity-70">
        <path d="M0 210 H90 V150 H170 V190 H240 V120 H330 V180 H420 V140 H520 V200 H600 V110 H700 V170 H790 V150 H880 V195 H960 V130 H1060 V180 H1150 V140 H1240 V190 H1330 V160 H1440 V320 H0 Z" fill="#C7B9EC" />
        {[[260, 140], [282, 140], [620, 130], [642, 160], [980, 150], [1080, 196], [1180, 160]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="16" rx="2" fill="#FFE0A8" />
        ))}
        <path d="M0 250 C320 225 620 262 900 244 S1300 236 1440 248 V320 H0 Z" fill="#B3A3E6" />
        <path d="M0 286 C380 268 760 296 1100 280 S1380 284 1440 290 V320 H0 Z" fill="#FFF8ED" stroke="#2B2350" strokeWidth="3" />
      </svg>
    </div>
  );
}

function SceneFrame({ scenario, mood, children }: { scenario: Scenario; mood: Mood; children?: ReactNode }) {
  return (
    <div className="relative">
      <div className="aspect-[4/3] overflow-hidden rounded-[28px] border-[3px] border-ink bg-cream shadow-chunky sm:aspect-[16/9]">
        <SceneArt id={scenario.scene} mood={mood} />
      </div>
      {children}
    </div>
  );
}

function SpeechBubble({ scenario }: { scenario: Scenario }) {
  const { name, relation, line } = scenario.speaker;
  return (
    <figure className="pov-pop relative z-10 mx-3 -mt-6 rounded-3xl border-[3px] border-ink bg-cream px-5 py-4 shadow-chunky-sm sm:mx-8 sm:-mt-8">
      <span aria-hidden="true" className="absolute -top-[12px] right-[22%] h-5 w-5 rotate-45 border-l-[3px] border-t-[3px] border-ink bg-cream" />
      <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={`${chip} bg-lavender`}>{name}</span>
        <span className="text-sm font-semibold text-ink/70">{relation}</span>
      </figcaption>
      <blockquote className="mt-2 text-lg font-bold leading-snug sm:text-xl">“{line}”</blockquote>
    </figure>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  const steps = [
    ["Read the moment", "Someone says something. Take a second with it."],
    ["Make your move", "Pick what you’d really do. There’s no timer."],
    ["See how it lands", "Watch how they react, then try another move if you’re curious."],
  ];
  return (
    <section className="pov-rise-in">
      <div className="overflow-hidden rounded-[28px] border-[3px] border-ink shadow-chunky">
        <CastLineup />
      </div>

      <div className="mt-8 text-center">
        <p className="mx-auto w-fit -rotate-2 rounded-full border-[3px] border-ink bg-peach px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-chunky-sm">
          Game 04 · Decisions &amp; self-protection
        </p>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-6xl">What Would You Do?</h1>
        <p className="mt-2 text-xl font-extrabold text-lavender-deep sm:text-2xl">Put yourself in their shoes.</p>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-relaxed">
          Ten everyday moments: a hangout, a group chat, a clinic visit, a friend with a secret. You’re the main
          character. Choose your move and see how it plays out.
        </p>
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} className={`${panel(i === 0 ? "bg-turquoise/40" : i === 1 ? "bg-lavender/50" : "bg-soft-pink/50")} !p-4`}>
            <span className={`${badge} !h-8 !w-8`}>{i + 1}</span>
            <p className="mt-3 font-extrabold">{title}</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed">{body}</p>
          </li>
        ))}
      </ol>

      <div className={`${panel()} mx-auto mt-6 flex max-w-xl gap-3 text-left text-sm font-semibold leading-relaxed`}>
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          This game includes pressure from friends and partners, online safety, harassment and health worries. You
          can skip any scene, or leave whenever you want.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" onClick={onStart} className={`${primaryButton} text-xl`}>
          Start
          <ArrowRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function SceneScreen({
  state,
  index,
  onChoose,
  onSkip,
}: {
  state: GameState;
  index: number;
  onChoose: (optionId: string) => void;
  onSkip: () => void;
}) {
  const scenario = scenarios[index];
  const earlier = state.firstChoices[scenario.id];
  const headingRef = useFocusOnMount<HTMLHeadingElement>(`scene-${scenario.id}`);

  return (
    <section className="space-y-6 pov-rise-in">
      <h1 className="sr-only">What Would You Do? Scenario {index + 1}: {scenario.topic}</h1>
      <QuestionProgress label="Scenario" index={index} total={TOTAL} topic={scenario.topic} segments={segmentsFor(state, index)} />

      <div>
        <SceneFrame scenario={scenario} mood={scenario.startMood} />
        <SpeechBubble scenario={scenario} />
      </div>

      <p className="px-1 text-lg font-semibold leading-relaxed">{scenario.situation}</p>

      <div className="space-y-3">
        <h2
          ref={headingRef}
          tabIndex={-1}
          id="move-heading"
          className="inline-block rounded-full border-2 border-ink bg-cream px-4 py-1 text-sm font-extrabold focus:outline-none"
        >
          What would you do?
        </h2>
        <div role="group" aria-labelledby="move-heading" className="space-y-4">
          {state.orders[scenario.id].map((option, i) => (
            <button key={option.id} type="button" onClick={() => onChoose(option.id)} className={optionCard(optionTones[i])}>
              <span className={badge}>{LETTERS[i]}</span>
              <span className="flex-1">{option.text}</span>
              {option.id === earlier && <span className={`${chip} shrink-0 bg-cream`}>Your first pick</span>}
            </button>
          ))}
        </div>
      </div>

      {earlier === undefined && (
        <div className="flex justify-center pt-1">
          <button type="button" onClick={onSkip} className={skipButton}>
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            Skip this scene
          </button>
        </div>
      )}
    </section>
  );
}

function OutcomeScreen({
  state,
  index,
  chosenId,
  onRetry,
  onNext,
}: {
  state: GameState;
  index: number;
  chosenId: string;
  onRetry: () => void;
  onNext: () => void;
}) {
  const scenario = scenarios[index];
  const chosen = scenario.options.find((option) => option.id === chosenId);
  const best = scenario.options.find((option) => option.isBest);
  const headingRef = useFocusOnMount<HTMLHeadingElement>(`outcome-${chosenId}`);
  if (!chosen || !best) return null;

  const others = state.orders[scenario.id].filter((option) => !option.isBest);
  const isLast = index === TOTAL - 1;

  return (
    <section className="space-y-6 pov-rise-in">
      <h1 className="sr-only">What Would You Do? Scenario {index + 1} outcome: {scenario.topic}</h1>
      <QuestionProgress label="Scenario" index={index} total={TOTAL} topic={scenario.topic} segments={segmentsFor(state, index)} />

      <div className="ml-auto max-w-[88%] rounded-3xl border-[3px] border-ink bg-peach px-5 py-4 shadow-chunky-sm">
        <span className="text-xs font-extrabold uppercase tracking-wider">Your move</span>
        <p className="mt-1 font-bold leading-relaxed">{chosen.text}</p>
      </div>

      <SceneFrame scenario={scenario} mood={chosen.outcome.mood}>
        <div className="pov-pop relative z-10 mx-3 -mt-6 rounded-3xl border-[3px] border-ink bg-cream px-5 py-4 shadow-chunky-sm sm:mx-8 sm:-mt-8">
          <p className="text-xs font-extrabold uppercase tracking-wider text-ink/70">What happens</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-extrabold leading-snug focus:outline-none sm:text-xl">
            {chosen.outcome.text}
          </h2>
        </div>
      </SceneFrame>

      <div aria-live="polite" className={`${panel()} space-y-3`}>
        {chosen.isBest ? (
          <span className={`${chip} bg-turquoise`}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Safest move
          </span>
        ) : (
          <span className={`${chip} bg-peach`}>
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            There’s a safer move
          </span>
        )}
        <p className="text-lg font-semibold leading-relaxed">{scenario.explanation}</p>
      </div>

      {!chosen.isBest && (
        <div className={`${panel("bg-turquoise/50")} space-y-2`}>
          <p className="font-extrabold">A safer move</p>
          <p className="font-semibold italic leading-relaxed">“{best.text}”</p>
        </div>
      )}

      <div className={`${panel("bg-white/70")} space-y-4`}>
        <p className="font-extrabold">Where the other moves fall short</p>
        <ul className="space-y-4">
          {others.map((option: ScenarioOption) => (
            <li key={option.id} className="space-y-1 border-l-4 border-soft-pink pl-4">
              <p className="text-sm font-bold italic leading-relaxed text-ink/80">
                “{option.text}”{option.id === chosen.id && <span className={`${chip} ml-2 bg-peach not-italic`}>Your move</span>}
              </p>
              <p className="font-semibold leading-relaxed">{option.whyNot}</p>
            </li>
          ))}
        </ul>
      </div>

      {scenario.showSupportPanel && <SupportPanel />}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <button type="button" onClick={onRetry} className={secondaryButton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try a different move
        </button>
        <button type="button" onClick={onNext} className={primaryButton}>
          {isLast ? "See your summary" : "Next scene"}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function Complete({ state, onPlayAgain, onExit }: { state: GameState; onPlayAgain: () => void; onExit?: () => void }) {
  const summary = summarize(state);
  const headingRef = useFocusOnMount<HTMLHeadingElement>("complete");
  const answered = scenarios.filter((scenario) => state.firstChoices[scenario.id] !== undefined);
  const stats: [string, number, string][] = [
    ["Scenes played", summary.answered, "bg-lavender/60"],
    ["Safest first moves", summary.safest, "bg-turquoise/60"],
    ["Skipped", summary.skipped, "bg-soft-pink/60"],
  ];

  return (
    <section className="space-y-6 pov-rise-in">
      <div className="text-center">
        <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-extrabold leading-tight focus:outline-none sm:text-5xl">
          That’s all ten.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg font-semibold leading-relaxed">
          There’s no pass or fail here. Every scene was practice for a moment that might really happen, and now you’ve
          already thought it through once.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(([label, value, tone]) => (
          <div key={label} className={`${panel(tone)} !p-4 text-center`}>
            <p className="text-3xl font-extrabold sm:text-4xl">{value}</p>
            <p className="mt-1 text-xs font-bold sm:text-sm">{label}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="moves-heading" className={`${panel()} space-y-4`}>
        <h2 id="moves-heading" className="text-xl font-extrabold">Your moves</h2>
        <ol className="divide-y-2 divide-ink/10">
          {scenarios.map((scenario, i) => {
            const pick = scenario.options.find((option) => option.id === state.firstChoices[scenario.id]);
            const status = !pick
              ? { text: "Skipped", tone: "bg-cream border-dashed" }
              : pick.isBest
                ? { text: "Safest move", tone: "bg-turquoise" }
                : { text: "Worth another look", tone: "bg-peach" };
            return (
              <li key={scenario.id} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3 font-bold">
                  <span className="w-6 text-right text-sm font-extrabold text-ink/75">{i + 1}</span>
                  {scenario.topic}
                </span>
                <span className={`${chip} shrink-0 ${status.tone}`}>{status.text}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {answered.length > 0 && (
        <section aria-labelledby="keep-heading" className={`${panel("bg-lavender/40")} space-y-4`}>
          <h2 id="keep-heading" className="text-xl font-extrabold">Worth keeping in mind</h2>
          <ul className="space-y-3">
            {answered.map((scenario) => (
              <li key={scenario.id} className="border-l-4 border-turquoise pl-4 font-semibold leading-relaxed">
                {scenario.takeaway}
              </li>
            ))}
          </ul>
        </section>
      )}

      <SupportPanel />

      <div className="flex flex-col-reverse justify-center gap-3 pt-2 sm:flex-row">
        {onExit && (
          <button type="button" onClick={onExit} className={secondaryButton}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Games Hub
          </button>
        )}
        <button type="button" onClick={onPlayAgain} className={primaryButton}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Play again
        </button>
      </div>
    </section>
  );
}

interface WhatWouldYouDoGameProps {
  onExitToHub?: () => void;
}

export function WhatWouldYouDoGame({ onExitToHub }: WhatWouldYouDoGameProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const { phase } = state;

  const renderPhase = () => {
    switch (phase.name) {
      case "welcome":
        return <Welcome onStart={() => dispatch({ type: "start" })} />;
      case "scene":
        return (
          <SceneScreen
            key={`scene-${phase.index}`}
            state={state}
            index={phase.index}
            onChoose={(optionId) => dispatch({ type: "choose", optionId })}
            onSkip={() => dispatch({ type: "skip" })}
          />
        );
      case "outcome":
        return (
          <OutcomeScreen
            key={`outcome-${phase.chosenId}`}
            state={state}
            index={phase.index}
            chosenId={phase.chosenId}
            onRetry={() => dispatch({ type: "retry" })}
            onNext={() => dispatch({ type: "next" })}
          />
        );
      case "complete":
        return <Complete state={state} onPlayAgain={() => dispatch({ type: "start" })} onExit={onExitToHub} />;
    }
  };

  return (
    <div className="relative isolate min-h-screen text-ink">
      <TownBackdrop />

      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-cream px-3 py-2 shadow-chunky-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-lavender">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-wide">SHY</p>
            <p className="hidden text-xs font-semibold min-[420px]:block">Sexual Health for Youth</p>
          </div>
        </div>
        {onExitToHub && (
          <button type="button" onClick={onExitToHub} className={`${secondaryButton} whitespace-nowrap`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Games Hub
          </button>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8">{renderPhase()}</main>
    </div>
  );
}
