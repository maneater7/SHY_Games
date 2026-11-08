import { ArrowLeft } from "lucide-react";
import type { GameId } from "@/components/GamesHub";

const gameSources: Record<Exclude<GameId, "game1" | "game2">, { src: string; title: string }> = {
  game3: {
    src: "/games/game3/code.html",
    title: "Red Flag or Green Flag?",
  },
  game4: {
    src: "/games/game4/code.html",
    title: "What Would You Do?",
  },
};

interface GameFrameProps {
  gameId: Exclude<GameId, "game1" | "game2">;
  onBack: () => void;
}

export function GameFrame({ gameId, onBack }: GameFrameProps) {
  const game = gameSources[gameId];

  return (
    <main className="relative min-h-screen bg-ink">
      <button
        type="button"
        onClick={onBack}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-cream px-3 py-2 text-sm font-black text-ink shadow-chunky-sm transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Games Hub
      </button>
      <iframe
        title={game.title}
        src={game.src}
        className="block min-h-screen w-full border-0"
      />
    </main>
  );
}
