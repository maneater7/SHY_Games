import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import type { GameId } from "@/components/GamesHub";
import { beginAnalyticsSession, recordGameExit, recordGameStart, submitGameRun, type AnalyticsGameId } from "@/lib/analytics";

const gameSources: Record<Extract<GameId, "game3">, { src: string; title: string; analyticsId: AnalyticsGameId }> = {
  game3: {
    src: "/games/game3/code.html",
    title: "Red Flag or Green Flag?",
    analyticsId: "red-or-green-flag",
  },
};

interface GameFrameProps {
  gameId: Extract<GameId, "game3">;
  onBack: () => void;
}

const isStringRecord = (value: unknown): value is Record<string, string> =>
  !!value && typeof value === "object" && Object.values(value).every((v) => typeof v === "string");

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

export function GameFrame({ gameId, onBack }: GameFrameProps) {
  const game = gameSources[gameId];
  const frameRef = useRef<HTMLIFrameElement>(null);
  const progressRef = useRef<{ questionId: string | null; complete: boolean }>({ questionId: null, complete: false });

  const leave = useCallback(() => {
    const { questionId, complete } = progressRef.current;
    if (questionId && !complete) void recordGameExit(game.analyticsId, questionId);
    onBack();
  }, [game.analyticsId, onBack]);

  useEffect(() => {
    beginAnalyticsSession();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const data = event.data;
      switch (data?.type) {
        case "shy:exit-to-hub":
          leave();
          break;
        case "shy:game-exit":
          if (typeof data.questionId === "string" && !progressRef.current.complete) {
            void recordGameExit(game.analyticsId, data.questionId);
            progressRef.current = { questionId: null, complete: true };
          }
          break;
        case "shy:game-start":
          progressRef.current = { questionId: null, complete: false };
          void recordGameStart(game.analyticsId);
          break;
        case "shy:game-progress":
          if (typeof data.questionId === "string") progressRef.current.questionId = data.questionId;
          break;
        case "shy:game-complete":
          if (progressRef.current.complete || !isStringRecord(data.answers) || !isStringArray(data.skippedQuestionIds)) break;
          progressRef.current.complete = true;
          void submitGameRun(game.analyticsId, { answers: data.answers, skippedQuestionIds: data.skippedQuestionIds });
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [game.analyticsId, leave]);

  return (
    <main className="relative min-h-screen bg-cream">
      <button
        type="button"
        onClick={leave}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-cream px-3 py-2 text-sm font-black text-ink shadow-chunky-sm transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Games Hub
      </button>
      <iframe
        ref={frameRef}
        title={game.title}
        src={game.src}
        sandbox="allow-scripts allow-same-origin"
        className="block min-h-screen w-full border-0"
      />
    </main>
  );
}
