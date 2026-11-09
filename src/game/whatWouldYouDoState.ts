import { scenarios, type ScenarioOption } from "../data/whatWouldYouDoScenarios.ts";

export type Phase =
  | { name: "welcome" }
  | { name: "scene"; index: number }
  | { name: "outcome"; index: number; chosenId: string }
  | { name: "complete" };

export interface GameState {
  phase: Phase;
  orders: Record<string, ScenarioOption[]>;
  firstChoices: Record<string, string>;
  skipped: string[];
}

export type GameAction =
  | { type: "start" }
  | { type: "choose"; optionId: string }
  | { type: "skip" }
  | { type: "retry" }
  | { type: "next" }
  | { type: "exit" };

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createInitialState(): GameState {
  return { phase: { name: "welcome" }, orders: {}, firstChoices: {}, skipped: [] };
}

export function startRun(random = Math.random): GameState {
  return {
    ...createInitialState(),
    phase: { name: "scene", index: 0 },
    orders: Object.fromEntries(scenarios.map((scenario) => [scenario.id, shuffle(scenario.options, random)])),
  };
}

function phaseAfter(index: number): Phase {
  return index + 1 < scenarios.length ? { name: "scene", index: index + 1 } : { name: "complete" };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const { phase } = state;
  switch (action.type) {
    case "start":
      return startRun();

    case "choose": {
      if (phase.name !== "scene") return state;
      const scenario = scenarios[phase.index];
      if (!scenario.options.some((option) => option.id === action.optionId)) return state;
      return {
        ...state,
        phase: { name: "outcome", index: phase.index, chosenId: action.optionId },
        firstChoices: { ...state.firstChoices, [scenario.id]: state.firstChoices[scenario.id] ?? action.optionId },
      };
    }

    case "skip": {
      if (phase.name !== "scene") return state;
      const { id } = scenarios[phase.index];
      if (state.firstChoices[id] !== undefined) return state;
      return {
        ...state,
        phase: phaseAfter(phase.index),
        skipped: state.skipped.includes(id) ? state.skipped : [...state.skipped, id],
      };
    }

    case "retry":
      return phase.name === "outcome" ? { ...state, phase: { name: "scene", index: phase.index } } : state;

    case "next":
      return phase.name === "outcome" ? { ...state, phase: phaseAfter(phase.index) } : state;

    case "exit":
      return createInitialState();
  }
}

export interface RunSummary {
  answered: number;
  skipped: number;
  safest: number;
}

export function summarize(state: GameState): RunSummary {
  const safest = scenarios.filter((scenario) =>
    scenario.options.some((option) => option.isBest && option.id === state.firstChoices[scenario.id]),
  ).length;
  return { answered: Object.keys(state.firstChoices).length, skipped: state.skipped.length, safest };
}
