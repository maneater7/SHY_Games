import { currentPlayer, localBoothPreview, saveBoothRun } from "@/lib/booth";
import { supabase } from "@/lib/supabase";

export type AnalyticsGameId = "pov-friend-texted-you-this" | "myth-or-fact" | "red-or-green-flag" | "what-would-you-do";

export interface GameRun {
  answers: Record<string, string>;
  skippedQuestionIds: string[];
  retriedQuestionIds?: string[];
}

export type SubmissionStatus = "submitted" | "failed" | "unavailable";

let runId = crypto.randomUUID();

export function beginAnalyticsSession() {
  runId = crypto.randomUUID();
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

const pending = new Map<string, () => Promise<void>>();
const saved = new Set<string>();
let saving = false;
let saveError = "";
export function resultSaveState() { return { pending: pending.size, saving, error: saveError }; }
function notify() { window.dispatchEvent(new Event("shy:result-save")); }
export async function retryResults() {
  if (saving) return;
  saving = true;
  saveError = "";
  notify();
  try {
    for (const [id, save] of [...pending]) {
      await save();
      pending.delete(id);
      saved.add(id);
    }
  } catch (error) {
    saveError = error instanceof Error ? error.message : "Could not save results.";
  } finally {
    saving = false;
    notify();
  }
}

export function recordGameStart(gameId: AnalyticsGameId) {
  runId = crypto.randomUUID();
  if (localBoothPreview || !currentPlayer()) return Promise.resolve<SubmissionStatus>("submitted");
  return call("record_booth_start", { p_game_id: gameId, p_token: currentPlayer()!.token });
}

export async function submitGameRun(gameId: AnalyticsGameId, run: GameRun): Promise<SubmissionStatus> {
  const id = runId;
  if (saved.has(id)) return "submitted";
  pending.set(id, () => saveBoothRun(id, gameId, run.answers, run.skippedQuestionIds, run.retriedQuestionIds ?? []));
  await retryResults();
  return pending.has(id) ? "failed" : "submitted";
}

export function recordGameExit(gameId: AnalyticsGameId, questionId: string) {
  if (localBoothPreview) return Promise.resolve<SubmissionStatus>("submitted");
  return call("record_game_exit", { p_game_id: gameId, p_question_id: questionId });
}
