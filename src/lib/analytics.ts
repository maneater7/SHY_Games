import { supabase } from "@/lib/supabase";

// Anonymous aggregate analytics. Nothing here identifies a player: the database only
// increments counters. Every call is fire-and-forget so a network or config problem
// can never interrupt a game.

export type AnalyticsGameId = "pov-friend-texted-you-this" | "myth-or-fact" | "red-or-green-flag" | "what-would-you-do";

export interface GameRun {
  answers: Record<string, string>;
  skippedQuestionIds: string[];
  retriedQuestionIds?: string[];
}

export type SubmissionStatus = "submitted" | "failed" | "unavailable";

// A random id minted each time a player opens a game. It is anonymous — nothing
// ties it to a person or another sitting — and lets the backend tell "one player
// retrying" from "a new player" while staying aggregate-only.
let sessionId: string | null = null;

export function beginAnalyticsSession() {
  sessionId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : null;
}

async function call(fn: string, args: Record<string, unknown>): Promise<SubmissionStatus> {
  if (!supabase) return "unavailable";
  try {
    const { data, error } = await supabase.rpc(fn, args);
    return error || data?.recorded !== true ? "failed" : "submitted";
  } catch {
    return "failed";
  }
}

export function recordGameStart(gameId: AnalyticsGameId) {
  return call("record_game_start", { p_game_id: gameId, p_session_id: sessionId });
}

export function submitGameRun(gameId: AnalyticsGameId, run: GameRun) {
  return call("submit_game_run", {
    p_game_id: gameId,
    p_answers: Object.entries(run.answers).map(([question_id, option_id]) => ({ question_id, option_id })),
    p_skipped_question_ids: run.skippedQuestionIds,
    p_retried_question_ids: run.retriedQuestionIds ?? [],
    p_session_id: sessionId,
  });
}

export function recordGameExit(gameId: AnalyticsGameId, questionId: string) {
  return call("record_game_exit", { p_game_id: gameId, p_question_id: questionId });
}
