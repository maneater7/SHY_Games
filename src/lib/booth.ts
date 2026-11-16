import { supabase } from "./supabase";
import { questions as pov } from "@/data/questions";
import { questions as myth } from "@/data/mythOrFactQuestions";
import { scenarios } from "@/data/whatWouldYouDoScenarios";

export const localBoothPreview = import.meta.env.DEV;
export interface BoothAnswer {
  question_id: string;
  option_id: string | null;
  correct_option_id: string;
  is_correct: boolean;
  skipped: boolean;
  retried: boolean;
}
export interface BoothResult {
  id: string;
  name: string;
  email: string;
  game_id: string;
  completed_at: string;
  score: number;
  question_count: number;
  skipped: number;
  answers: BoothAnswer[];
}
interface Player { token: string; name: string; email: string }
const PLAYER_KEY = "shy-booth-player";
const RESULTS_KEY = "shy-booth-results";
const stored = <T,>(key: string, storage: Storage): T | null => {
  try { const raw = storage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; }
};
let player: Player | null = stored<Player>(PLAYER_KEY, sessionStorage);
const catalog: Record<string, { id: string; best: string }[]> = {
  "pov-friend-texted-you-this": pov.map(q => ({ id: q.id, best: q.options.find(o => o.isHelpful)!.id })),
  "myth-or-fact": myth.map(q => ({ id: q.id, best: q.correctAnswer })),
  "what-would-you-do": scenarios.map(q => ({ id: q.id, best: q.options.find(o => o.isBest)!.id })),
  "red-or-green-flag": ["green", "red", "yellow", "red", "green", "yellow", "red", "green", "red", "yellow"].map((best, i) => ({ id: `s${i + 1}`, best })),
};
export function currentPlayer() { return player; }
export function clearPlayer() { player = null; sessionStorage.removeItem(PLAYER_KEY); }
export function localResults() { return stored<BoothResult[]>(RESULTS_KEY, localStorage) ?? []; }
function saveResult(row: BoothResult) {
  if (localResults().some(r => r.id === row.id)) return;
  localStorage.setItem(RESULTS_KEY, JSON.stringify([...localResults(), row]));
}
export async function registerPlayer(name: string, email: string) {
  const next = { token: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase() };
  if (!localBoothPreview) {
    if (!supabase) throw new Error("Registration is unavailable. Please ask the booth organiser.");
    const { data, error } = await supabase.rpc("register_booth_player", { p_token: next.token, p_name: next.name, p_email: next.email });
    if (error || data?.recorded !== true) throw new Error("Could not save registration. Please try again.");
  }
  player = next;
  sessionStorage.setItem(PLAYER_KEY, JSON.stringify(next));
  return next;
}
export async function saveBoothRun(id: string, game: string, answers: Record<string, string>, skipped: string[], retried: string[]) {
  const owner = player;
  if (!owner) throw new Error("Register before playing.");
  if (localBoothPreview) {
    const details = catalog[game].map(q => ({ question_id: q.id, option_id: answers[q.id] ?? null, correct_option_id: q.best, is_correct: answers[q.id] === q.best, skipped: skipped.includes(q.id), retried: retried.includes(q.id) }));
    saveResult({ id, name: owner.name, email: owner.email, game_id: game, completed_at: new Date().toISOString(), score: details.filter(q => q.is_correct).length, question_count: details.length, skipped: skipped.length, answers: details });
    return;
  }
  if (!supabase) throw new Error("Results service unavailable.");
  const { data, error } = await supabase.rpc("submit_booth_run", {
    p_token: owner.token, p_run_id: id, p_game_id: game,
    p_answers: Object.entries(answers).map(([question_id, option_id]) => ({ question_id, option_id })),
    p_skipped_question_ids: skipped, p_retried_question_ids: retried,
  });
  if (error || data?.recorded !== true) throw new Error("Results could not be saved. Please retry before switching players.");
}
