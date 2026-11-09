import { questions, type AnswerOption, type Question } from "@/data/questions";

export interface GameEvent {
  questionId: string;
  action: "answered" | "skipped";
  optionId?: string;
}

export type Phase =
  | { name: "welcome" }
  | { name: "intro" }
  | { name: "scenario"; index: number }
  | { name: "feedback"; index: number; chosenId: string }
  | { name: "complete" };

export interface GameState {
  phase: Phase;
  orders: Record<string, AnswerOption[]>;
  questionOrder: string[];
  firstChoices: Record<string, string>;
  skipped: string[];
  lastSkipped: boolean;
}

export type GameAction =
  | { type: "newGame" }
  | { type: "begin" }
  | { type: "answer"; questionId: string; optionId: string }
  | { type: "skip"; questionId: string }
  | { type: "tryAgain" }
  | { type: "continue" }
  | { type: "exit" };

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildOrders(): Record<string, AnswerOption[]> {
  return Object.fromEntries(
    questions.map((question: Question) => [question.id, shuffle(question.options)]),
  );
}

export function createInitialState(): GameState {
  return {
    phase: { name: "welcome" },
    orders: {},
    questionOrder: [],
    firstChoices: {},
    skipped: [],
    lastSkipped: false,
  };
}

export function questionAt(state: GameState, index: number): Question {
  const id = state.questionOrder[index];
  return questions.find((question) => question.id === id) ?? questions[index];
}

function phaseAfter(index: number): Phase {
  const next = index + 1;
  return next < questions.length ? { name: "scenario", index: next } : { name: "complete" };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "newGame":
      return {
        ...createInitialState(),
        orders: buildOrders(),
        questionOrder: shuffle(questions.map((question) => question.id)),
        phase: { name: "intro" },
      };

    case "begin":
      return { ...state, phase: { name: "scenario", index: 0 } };

    case "answer": {
      if (state.phase.name !== "scenario") return state;
      return {
        ...state,
        phase: { name: "feedback", index: state.phase.index, chosenId: action.optionId },
        firstChoices: {
          ...state.firstChoices,
          [action.questionId]: state.firstChoices[action.questionId] ?? action.optionId,
        },
        lastSkipped: false,
      };
    }

    case "skip": {
      if (state.phase.name !== "scenario") return state;
      return {
        ...state,
        phase: phaseAfter(state.phase.index),
        skipped: state.skipped.includes(action.questionId)
          ? state.skipped
          : [...state.skipped, action.questionId],
        lastSkipped: true,
      };
    }

    case "tryAgain": {
      if (state.phase.name !== "feedback") return state;
      return { ...state, phase: { name: "scenario", index: state.phase.index } };
    }

    case "continue": {
      if (state.phase.name !== "feedback") return state;
      return { ...state, phase: phaseAfter(state.phase.index) };
    }

    case "exit":
      return createInitialState();
  }
}
