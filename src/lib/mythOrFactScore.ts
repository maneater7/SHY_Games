import type { ScoreSummary } from "@/game/mythOrFactState";

const STORAGE_KEY = "shy.game3.latest-score.v1";

function isScoreSummary(value: unknown): value is ScoreSummary {
  if (!value || typeof value !== "object") return false;

  const result = value as Partial<ScoreSummary>;
  return (
    result.gameId === "myth-or-fact" &&
    Number.isInteger(result.score) &&
    Number.isInteger(result.total) &&
    Number.isInteger(result.answered) &&
    Number.isInteger(result.skipped) &&
    (result.score ?? -1) >= 0 &&
    (result.total ?? 0) === 12 &&
    (result.answered ?? -1) >= 0 &&
    (result.skipped ?? -1) >= 0
  );
}

export function readLatestScore(): ScoreSummary | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    return isScoreSummary(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLatestScore(result: ScoreSummary): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    return;
  }
}

export function clearLatestScore(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
