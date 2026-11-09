import { questions, type Answer } from "@/data/mythOrFactQuestions";

export type Phase = "welcome" | "question" | "feedback" | "complete";

export interface ScoreSummary {
  gameId: "myth-or-fact";
  score: number;
  total: number;
  answered: number;
  skipped: number;
}

export interface GameState {
  phase: Phase;
  questionOrder: string[];
  currentIndex: number;
  answers: Record<string, Answer>;
  skippedQuestionIds: string[];
}

export type GameAction =
  | { type: "start" }
  | { type: "answer"; answer: Answer }
  | { type: "continue" }
  | { type: "skip" }
  | { type: "playAgain" }
  | { type: "exit" };

export function createInitialState(): GameState {
  return {
    phase: "welcome",
    questionOrder: [],
    currentIndex: 0,
    answers: {},
    skippedQuestionIds: [],
  };
}

export function shuffledQuestionIds(random = Math.random): string[] {
  const ids = questions.map((question) => question.id);

  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }

  return ids;
}

function beginRun(): GameState {
  return {
    ...createInitialState(),
    phase: "question",
    questionOrder: shuffledQuestionIds(),
  };
}

function advance(state: GameState): GameState {
  const nextIndex = state.currentIndex + 1;

  if (nextIndex >= state.questionOrder.length) {
    return { ...state, phase: "complete" };
  }

  return { ...state, phase: "question", currentIndex: nextIndex };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "start":
    case "playAgain":
      return beginRun();
    case "answer": {
      if (state.phase !== "question") return state;
      const questionId = state.questionOrder[state.currentIndex];
      if (!questionId) return state;

      return {
        ...state,
        phase: "feedback",
        answers: { ...state.answers, [questionId]: action.answer },
      };
    }
    case "continue":
      return state.phase === "feedback" ? advance(state) : state;
    case "skip": {
      if (state.phase !== "question") return state;
      const questionId = state.questionOrder[state.currentIndex];
      if (!questionId) return state;

      return advance({
        ...state,
        skippedQuestionIds: [...state.skippedQuestionIds, questionId],
      });
    }
    case "exit":
      return createInitialState();
  }
}

export function scoreRun(state: GameState): ScoreSummary {
  const answersByQuestion = new Map(
    questions.map((question) => [question.id, question.correctAnswer]),
  );
  const score = Object.entries(state.answers).reduce(
    (total, [questionId, answer]) =>
      total + Number(answersByQuestion.get(questionId) === answer),
    0,
  );

  return {
    gameId: "myth-or-fact",
    score,
    total: questions.length,
    answered: Object.keys(state.answers).length,
    skipped: state.skippedQuestionIds.length,
  };
}
