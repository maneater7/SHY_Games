import { supabase } from "@/lib/supabase";

const GAME_ID = "pov-friend-texted-you-this";

export interface GameResultSummary {
  answers: Record<string, string>;
  skippedQuestionIds: string[];
}

export type SubmissionStatus = "submitted" | "failed" | "unavailable";

export async function submitGameResults(summary: GameResultSummary): Promise<SubmissionStatus> {
  if (!supabase) return "unavailable";

  const { data, error } = await supabase.rpc("record_game_completion", {
    p_game_id: GAME_ID,
    p_answers: Object.entries(summary.answers).map(([questionId, optionId]) => ({
      question_id: questionId,
      option_id: optionId,
    })),
    p_skipped_question_ids: summary.skippedQuestionIds,
  });

  return error || data?.recorded !== true ? "failed" : "submitted";
}
