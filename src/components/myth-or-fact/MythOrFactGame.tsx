import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { questions, type Answer, type Question } from "@/data/mythOrFactQuestions";
import { CapybaraCard } from "./CapybaraCard";
import { Brand, NavigationIcon, PondBackdrop } from "./GameChrome";
import {
  createInitialState,
  gameReducer,
  scoreRun,
  type ScoreSummary,
} from "@/game/mythOrFactState";
import {
  clearLatestScore,
  readLatestScore,
  saveLatestScore,
} from "@/lib/mythOrFactScore";
import { beginAnalyticsSession, recordGameExit, recordGameStart, submitGameRun } from "@/lib/analytics";
import "./myth-or-fact.css";

const ANALYTICS_ID = "myth-or-fact";

interface MythOrFactGameProps {
  onComplete?: (result: ScoreSummary) => void;
  onExitToHub?: () => void;
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="arrow-icon">
      <path d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  );
}

function Progress({ state, question }: { state: ReturnType<typeof createInitialState>; question: Question }) {
  const currentNumber = state.currentIndex + 1;

  return (
    <div className="progress-block">
      <div className="progress-copy">
        <span className="progress-count">
          Question {currentNumber} <span>of {questions.length}</span>
        </span>
        <span className="topic-tag">{question.topic}</span>
      </div>
      <div
        aria-label={`Question ${currentNumber} of ${questions.length}`}
        aria-valuemax={questions.length}
        aria-valuemin={1}
        aria-valuenow={currentNumber}
        className="progress-track"
        role="progressbar"
      >
        {state.questionOrder.map((questionId, index) => {
          const answered = state.answers[questionId] !== undefined;
          const skipped = state.skippedQuestionIds.includes(questionId);
          const isCurrent = index === state.currentIndex;
          const status = isCurrent
            ? "current"
            : answered
              ? "answered"
              : skipped
                ? "skipped"
                : "upcoming";

          return (
            <span
              aria-hidden="true"
              className={`progress-segment ${status}`}
              key={questionId}
            />
          );
        })}
      </div>
    </div>
  );
}

function Welcome({
  latestScore,
  onStart,
  onClearScore,
}: {
  latestScore: ScoreSummary | null;
  onStart: () => void;
  onClearScore: () => void;
}) {
  return (
    <section className="welcome-layout game3-welcome screen-enter">
      <div className="welcome-guide"><CapybaraCard label="Myth or Fact?" happy /></div>
      <div className="welcome-copy">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Game 03 <span className="eyebrow-divider">/</span> Sexual health
        </p>
        <h1>
          Myth <span className="heading-join">or</span>
          <br />
          <span className="heading-accent">Fact?</span>
        </h1>
        <p className="welcome-subtitle">Let's talk sexual health.</p>
        <p className="intro-copy">
          Curious, unsure, or just here for the capybara? You're welcome here.
          Try twelve quick questions and discover something new at your own pace.
        </p>

        {latestScore && (
          <div className="latest-score">
            <div>
              <span className="latest-label">Your latest score</span>
              <strong>
                {latestScore.score}
                <span> / {latestScore.total}</span>
              </strong>
            </div>
            <button className="text-button" onClick={onClearScore} type="button">
              Clear score
            </button>
          </div>
        )}

        <button className="button button-primary start-button" onClick={onStart} type="button">
          Start Game <ArrowIcon />
        </button>
      </div>


    </section>
  );
}

export function QuestionView({
  question,
  state,
  onAnswer,
  onSkip,
}: {
  question: Question;
  state: ReturnType<typeof createInitialState>;
  onAnswer: (answer: Answer) => void;
  onSkip: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo(0, 0);
  }, [question.id]);
  return (
    <section className="game-view screen-enter">
      <Progress state={state} question={question} />
      <div className="question-card">
        <div className="question-kicker">
          <span className="question-number">
            {String(state.currentIndex + 1).padStart(2, "0")}
          </span>
          <span>Read the statement</span>
        </div>
        <h1 ref={headingRef} tabIndex={-1}>{question.statement}</h1>
        <p className="question-hint">What do you think?</p>
        <div aria-label="Choose Myth or Fact" className="answer-grid capybara-answers" role="group">
          {(["myth", "fact"] as const).map((option) => {
            return (
              <button
                aria-label={`Choose ${option}`}
                className={`answer-card capybara-option answer-${option} answer-unanswered`}
                key={option}
                onClick={() => onAnswer(option)}
                type="button"
              >
                <CapybaraCard label={option} />
                <span className="answer-status">Tap to choose</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="question-footer">
        <span>There is no penalty for skipping.</span>
        <button className="text-button skip-button" onClick={onSkip} type="button">
          Skip this one
        </button>
      </div>
    </section>
  );
}

export function FeedbackView({
  question,
  answer,
  onContinue,
}: {
  question: Question;
  answer: Answer;
  onContinue: () => void;
}) {
  const isCorrect = answer === question.correctAnswer;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo(0, 0);
  }, [question.id]);

  return (
    <section aria-labelledby="answer-reveal-title" className="feedback-view answer-reveal screen-enter">
      <p className="reveal-eyebrow">THE ANSWER REVEAL</p>
      <div className="feedback-ribbon">
        <span className={`feedback-icon ${isCorrect ? "is-correct" : "needs-a-look"}`}>
          {isCorrect ? "✓" : "?"}
        </span>
        <div>
          <p className="eyebrow">{isCorrect ? "That's right" : "Let's unpack that"}</p>
          <h1 ref={headingRef} tabIndex={-1} id="answer-reveal-title">
            The answer is <span>{question.correctAnswer}.</span>
          </h1>
        </div>
      </div>

      <p className="reveal-statement">“{question.statement}”</p>
      <div className="reveal-cards">
        <div className={`capybara-option reveal-card answer-${isCorrect ? "correct" : "incorrect"}`}>
          <CapybaraCard label={answer} happy={isCorrect} />
          <strong>Your choice · {isCorrect ? "Correct" : "Not quite"}</strong>
        </div>
        {!isCorrect && (
          <div className="capybara-option reveal-card answer-correct">
            <CapybaraCard label={question.correctAnswer} happy />
            <strong>The correct answer</strong>
          </div>
        )}
      </div>
      <div className="explanation-card">
        <p className="chosen-answer">
          You chose <strong>{answer}</strong>
        </p>
        <p className="explanation-copy">
          {isCorrect ? question.explanation : question.correction}
        </p>
        <div className="takeaway">
          <span className="takeaway-marker" aria-hidden="true">
            Key idea
          </span>
          <p>{question.takeaway}</p>
        </div>
      </div>

      <button className="button button-primary continue-button" onClick={onContinue} type="button">
        Continue <ArrowIcon />
      </button>
    </section>
  );
}

function Completion({
  state,
  onPlayAgain,
  onHome,
}: {
  state: ReturnType<typeof createInitialState>;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const result = scoreRun(state);
  const revisit = questions.filter(
    (question) =>
      state.skippedQuestionIds.includes(question.id) ||
      (state.answers[question.id] !== undefined &&
        state.answers[question.id] !== question.correctAnswer),
  );
  const takeaways = questions
    .filter((question) => state.answers[question.id] !== undefined)
    .map((question) => question.takeaway);

  return (
    <section className="completion-view screen-enter">
      <div className="completion-heading">
        <span className="completion-stamp" aria-hidden="true">
          NICE
          <br />
          WORK
        </span>
        <p className="eyebrow">That's a wrap</p>
        <h1>Thanks for playing.</h1>
        <p>
          This isn't a pass-or-fail test. Every question is a chance to learn
          something useful.
        </p>
      </div>

      <div className="result-card">
        <div className="result-score">
          <span>Your score</span>
          <strong>
            {result.score}
            <small> / {result.total}</small>
          </strong>
        </div>
        <div className="result-details">
          <div>
            <strong>{result.answered}</strong>
            <span>answered</span>
          </div>
          <div>
            <strong>{result.skipped}</strong>
            <span>skipped</span>
          </div>
        </div>
      </div>

      {revisit.length > 0 && (
        <section className="recap-card" aria-labelledby="revisit-title">
          <p className="eyebrow">No judgement, just a reminder</p>
          <h2 id="revisit-title">Topics to revisit</h2>
          <ul>
            {revisit.map((question) => (
              <li key={question.id}>{question.topic}</li>
            ))}
          </ul>
        </section>
      )}

      {takeaways.length > 0 && (
        <section className="recap-card takeaways-card" aria-labelledby="takeaways-title">
          <p className="eyebrow">Keep these in your pocket</p>
          <h2 id="takeaways-title">Key ideas from your run</h2>
          <ul>
            {takeaways.map((takeaway, index) => (
              <li key={`${index}-${takeaway}`}>{takeaway}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="completion-actions">
        <button className="button button-primary" onClick={onPlayAgain} type="button">
          Play again <ArrowIcon />
        </button>
        <button className="button button-secondary" onClick={onHome} type="button">
          Back to start
        </button>
      </div>
    </section>
  );
}

export default function MythOrFactGame({ onComplete, onExitToHub }: MythOrFactGameProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [latestScore, setLatestScore] = useState(() => readLatestScore());
  const savedCompletion = useRef(false);

  const currentQuestion = useMemo(() => {
    if (state.phase !== "question" && state.phase !== "feedback") return null;
    const id = state.questionOrder[state.currentIndex];
    return questions.find((question) => question.id === id) ?? null;
  }, [state]);

  useEffect(() => {
    beginAnalyticsSession();
  }, []);

  useEffect(() => {
    if (state.phase !== "complete" || savedCompletion.current) return;

    const result = scoreRun(state);
    savedCompletion.current = true;
    saveLatestScore(result);
    setLatestScore(result);
    void submitGameRun(ANALYTICS_ID, { answers: state.answers, skippedQuestionIds: state.skippedQuestionIds });
    onComplete?.(result);
  }, [onComplete, state]);

  const startGame = () => {
    savedCompletion.current = false;
    void recordGameStart(ANALYTICS_ID);
    dispatch({ type: "start" });
  };

  const playAgain = () => {
    savedCompletion.current = false;
    void recordGameStart(ANALYTICS_ID);
    dispatch({ type: "playAgain" });
  };

  const exitToHub = () => {
    if (currentQuestion) void recordGameExit(ANALYTICS_ID, currentQuestion.id);
    onExitToHub?.();
  };

  const clearScore = () => {
    clearLatestScore();
    setLatestScore(null);
  };

  return (
    <div className="site-shell">
      <PondBackdrop />

      <header className="site-header game-site-header">
        <Brand />
        <nav className="header-actions game-navigation" aria-label="Game navigation">
          {onExitToHub && (
            <button className="button button-exit" aria-label="Back to games hub" onClick={exitToHub} type="button">
              <NavigationIcon /> Games Hub
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        {state.phase === "welcome" && (
          <Welcome
            latestScore={latestScore}
            onClearScore={clearScore}
            onStart={startGame}
          />
        )}
        {state.phase === "question" && currentQuestion && (
          <QuestionView
            question={currentQuestion}
            state={state}
            onAnswer={(answer) => dispatch({ type: "answer", answer })}
            onSkip={() => dispatch({ type: "skip" })}
          />
        )}
        {state.phase === "feedback" && currentQuestion && state.answers[currentQuestion.id] && (
          <FeedbackView
            question={currentQuestion}
            answer={state.answers[currentQuestion.id]}
            onContinue={() => dispatch({ type: "continue" })}
          />
        )}
        {state.phase === "complete" && (
          <Completion
            state={state}
            onHome={() => dispatch({ type: "exit" })}
            onPlayAgain={playAgain}
          />
        )}
      </main>
    </div>
  );
}
