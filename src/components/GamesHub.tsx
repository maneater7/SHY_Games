import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookHeart,
  Compass,
  FlagTriangleRight,
  Lightbulb,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import { Character } from "@/components/Character";

export type GameId = "game1" | "game2" | "game3" | "game4";

interface GameDefinition {
  id: GameId;
  title: string;
  description: string;
  accent: string;
  icon: LucideIcon;
  available: boolean;
}

const games: GameDefinition[] = [
  {
    id: "game1",
    title: "POV: Your Friend Texted You This",
    description: "Practice kind, supportive replies to messages from a friend.",
    accent: "bg-turquoise",
    icon: MessageCircleHeart,
    available: true,
  },
  {
    id: "game2",
    title: "Myth or Fact? – Let’s Talk Sexual Health",
    description: "Sort common sexual-health statements and learn what the facts say.",
    accent: "bg-lavender",
    icon: Lightbulb,
    available: false,
  },
  {
    id: "game3",
    title: "Red Flag or Green Flag?",
    description: "Explore relationship situations and decide what each one might mean.",
    accent: "bg-meadow",
    icon: FlagTriangleRight,
    available: true,
  },
  {
    id: "game4",
    title: "What Would You Do?",
    description: "Put yourself in someone else’s shoes and choose a caring next step.",
    accent: "bg-soft-pink",
    icon: Compass,
    available: true,
  },
];

function FlagDuck() {
  return (
    <svg viewBox="0 0 120 110" role="img" aria-label="Duck holding a green flag" className="hub-float h-32 w-32">
      <ellipse cx="55" cy="92" rx="38" ry="8" fill="#4DEBE3" stroke="#2B2350" strokeWidth="3" />
      <ellipse cx="55" cy="67" rx="30" ry="22" fill="#FFE0A8" stroke="#2B2350" strokeWidth="3" />
      <circle cx="76" cy="39" r="20" fill="#FFE0A8" stroke="#2B2350" strokeWidth="3" />
      <path d="M91 40 Q111 43 99 51 Z" fill="#FF8F80" stroke="#2B2350" strokeWidth="3" />
      <circle cx="82" cy="35" r="3.5" fill="#2B2350" className="hub-blink" />
      <path d="M39 67 Q53 56 65 68" fill="none" stroke="#2B2350" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="20" x2="24" y2="82" stroke="#2B2350" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 20 Q58 28 24 39 Z" fill="#86E0AE" stroke="#2B2350" strokeWidth="2.5" />
    </svg>
  );
}

function ThoughtfulHuman() {
  return (
    <svg viewBox="0 0 120 140" role="img" aria-label="Thoughtful young person exploring" className="hub-sway h-36 w-32">
      <ellipse cx="61" cy="130" rx="35" ry="6" fill="#B9A5F5" opacity="0.8" />
      <path d="M42 78 L34 126 L51 126 L60 92 L69 126 L87 126 L78 78 Z" fill="#2B2350" stroke="#2B2350" strokeWidth="3" />
      <path d="M37 62 Q60 52 83 62 L78 91 Q60 99 42 91 Z" fill="#4DEBE3" stroke="#2B2350" strokeWidth="3" />
      <circle cx="60" cy="39" r="25" fill="#E5A670" stroke="#2B2350" strokeWidth="3" />
      <path d="M37 35 Q42 7 65 14 Q83 12 86 37 Q70 23 37 35 Z" fill="#2B2350" />
      <circle cx="51" cy="39" r="3" fill="#2B2350" className="hub-blink" />
      <circle cx="69" cy="39" r="3" fill="#2B2350" className="hub-blink" />
      <path d="M54 54 Q62 58 69 53" fill="none" stroke="#2B2350" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M85 70 Q101 55 105 39" fill="none" stroke="#2B2350" strokeWidth="3" strokeLinecap="round" />
      <circle cx="106" cy="35" r="8" fill="#FFD45C" stroke="#2B2350" strokeWidth="2.5" />
      <path d="M106 30 V40 M101 35 H111" stroke="#2B2350" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GameCharacter({ gameId }: { gameId: GameId }) {
  if (gameId === "game1") {
    return <Character expression="happy" pose="hop" className="h-32 w-32" />;
  }
  if (gameId === "game2") {
    return (
      <span className="hub-sway inline-block">
        <Character expression="thoughtful" pose="lean" className="h-32 w-32" />
      </span>
    );
  }
  if (gameId === "game3") {
    return <FlagDuck />;
  }
  return <ThoughtfulHuman />;
}

interface GamesHubProps {
  onSelectGame: (gameId: GameId) => void;
}

export function GamesHub({ onSelectGame }: GamesHubProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-cream px-5 py-8 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-turquoise px-4 py-2 font-black uppercase tracking-wider shadow-chunky-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            SHY Games Hub
          </div>
          <div className="flex items-end justify-center gap-3">
            <Character expression="happy" pose="cheer" className="hidden h-28 w-28 sm:block" />
            <div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
                Learn, play, <span className="inline-block -rotate-2 rounded-2xl border-[3px] border-ink bg-sun px-3 shadow-chunky-sm">look out</span>
              </h1>
              <p className="mt-4 text-lg font-semibold leading-relaxed">
                Pick a game and explore healthy relationships, sexual health, and looking out for yourself and others.
              </p>
            </div>
          </div>
        </header>

        <section aria-labelledby="games-heading" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="games-heading" className="text-2xl font-extrabold sm:text-3xl">
              Choose your game
            </h2>
            <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase shadow-chunky-sm">
              Four ways to play
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <article
                  key={game.id}
                  className={`group relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-white p-5 shadow-chunky transition-transform duration-200 hover:-translate-y-1 ${
                    !game.available ? "opacity-90" : ""
                  }`}
                >
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full border-[3px] border-ink ${game.accent} opacity-80`} />
                  <div className="relative flex min-h-72 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-ink ${game.accent} shadow-chunky-sm`}>
                        {game.id === "game1" ? (
                          <BookHeart className="h-8 w-8" aria-hidden="true" />
                        ) : (
                          <Icon className="h-8 w-8" aria-hidden="true" />
                        )}
                      </div>
                      <span className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs font-black uppercase">
                        Game {index + 1}
                      </span>
                    </div>
                    <div className="pointer-events-none absolute right-2 top-16 z-0" aria-hidden="true">
                      <GameCharacter gameId={game.id} />
                    </div>
                    <h3 className="relative z-10 mt-6 max-w-[64%] text-2xl font-extrabold leading-tight">{game.title}</h3>
                    <p className="relative z-10 mt-3 max-w-[68%] text-base font-semibold leading-relaxed text-ink/80">{game.description}</p>
                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        disabled={!game.available}
                        onClick={() => game.available && onSelectGame(game.id)}
                        className={`inline-flex items-center gap-2 rounded-xl border-[3px] border-ink px-4 py-2.5 font-black shadow-chunky-sm transition-transform ${
                          game.available
                            ? "bg-turquoise hover:-translate-y-0.5"
                            : "cursor-not-allowed bg-cream text-ink/60"
                        }`}
                      >
                        {game.available ? "Play Game" : "Coming soon"}
                        {game.available && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-center gap-2 text-center text-sm font-bold text-ink/70">
          <span aria-hidden="true">🌱</span>
          Take your time. You can leave any game whenever you want.
          <span aria-hidden="true">🌱</span>
        </footer>
      </div>
    </main>
  );
}
