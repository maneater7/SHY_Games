import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import type { GameId } from "@/components/GamesHub";

const gameSources: Record<Extract<GameId, "game3">, { src: string; title: string }> = {
  game3: {
    src: "/games/game3/code.html",
    title: "Red Flag or Green Flag?",
  },
};

interface GameFrameProps {
  gameId: Extract<GameId, "game3">;
  onBack: () => void;
}

export function GameFrame({ gameId, onBack }: GameFrameProps) {
  const game = gameSources[gameId];
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frameRef.current?.contentWindow &&
        event.data?.type === "shy:exit-to-hub"
      ) {
        onBack();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onBack]);

  return (
    <main className="relative min-h-screen bg-cream">
      <button
        type="button"
        onClick={onBack}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-cream px-3 py-2 text-sm font-black text-ink shadow-chunky-sm transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Games Hub
      </button>
      <iframe
        ref={frameRef}
        title={game.title}
        src={game.src}
        className="block min-h-screen w-full border-0"
      />
    </main>
  );
}
