import { ArrowRight, Info } from "lucide-react";
import { Character } from "@/components/Character";
import { CapybaraCard } from "@/components/myth-or-fact/CapybaraCard";
import "./games-hub.css";

export type GameId = "game1" | "game2" | "game3" | "game4";

interface GameDefinition {
  id: GameId;
  title: string;
  description: string;
  topic: string;
  duration: string;
  available: boolean;
}

const games: GameDefinition[] = [
  {
    id: "game1",
    title: "POV: Your Friend Texted You This",
    description: "Practice kind, supportive replies to messages from a friend.",
    topic: "Empathy & peer support",
    duration: "5-7 min",
    available: true,
  },
  {
    id: "game2",
    title: "Myth or Fact? - Let's Talk Sexual Health",
    description: "Meet the capybara quiz buddies and untangle common myths about sexual and reproductive health.",
    topic: "Knowledge & misinformation",
    duration: "3-5 min",
    available: true,
  },
  {
    id: "game3",
    title: "Red Flag or Green Flag?",
    description: "Explore relationship situations and decide what each one might mean.",
    topic: "Consent & boundaries",
    duration: "3-5 min",
    available: true,
  },
  {
    id: "game4",
    title: "What Would You Do?",
    description: "You're the main character. Pick your move in ten tricky everyday moments.",
    topic: "Decisions & self-protection",
    duration: "5-7 min",
    available: true,
  },
];

function FlagDuck() {
  return (
    <svg viewBox="0 0 120 110" role="img" aria-label="Duck holding a green flag" className="hub-float">
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
    <svg viewBox="0 0 120 140" role="img" aria-label="Thoughtful young person exploring" className="hub-sway">
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
    return <Character expression="happy" pose="idle" className="lobby-character-svg hub-float" />;
  }
  if (gameId === "game2") {
    return <span className="hub-float"><CapybaraCard label="Myth or Fact?" happy /></span>;
  }
  if (gameId === "game3") {
    return <FlagDuck />;
  }
  return <ThoughtfulHuman />;
}

function GameCard({ game, index, onSelect }: { game: GameDefinition; index: number; onSelect: () => void }) {
  const scene = (
    <div className="lobby-card-scene" aria-hidden="true">
      <span className="lobby-scene-ring" />
      <span className="lobby-scene-spark">+</span>
      <div className="lobby-card-character">
        <GameCharacter gameId={game.id} />
      </div>
      <span className="lobby-level-number">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );

  const copy = (
    <div className="lobby-card-copy">
      <div className="lobby-card-meta">
        <span>GAME {String(index + 1).padStart(2, "0")}</span>
        <span>{game.available ? "READY TO PLAY" : "IN THE WORKS"}</span>
      </div>
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <div className="lobby-card-bottom">
        <span>
          {game.topic}
          <small>{game.duration} · at your pace</small>
        </span>
        <span className="lobby-play">
          {game.available ? "Play" : "Soon"}
          {game.available && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </div>
    </div>
  );

  return (
    <article className={`lobby-game-card lobby-card-${game.id} ${game.available ? "lobby-is-playable" : "lobby-is-coming-soon"}`}>
      {game.available ? (
        <button type="button" onClick={onSelect} className="lobby-game-link">
          {scene}
          {copy}
        </button>
      ) : (
        <div className="lobby-game-link">
          {scene}
          {copy}
        </div>
      )}
    </article>
  );
}

interface GamesHubProps {
  onSelectGame: (gameId: GameId) => void;
}

export function GamesHub({ onSelectGame }: GamesHubProps) {
  const readyCount = games.filter((game) => game.available).length;

  return (
    <div className="lobby-shell">
      <div className="lobby-backdrop" aria-hidden="true">
        <span className="lobby-orbit lobby-orbit-a" />
        <span className="lobby-orbit lobby-orbit-b" />
        <span className="lobby-bg-token">?</span>
      </div>

      <header className="lobby-header">
        <div className="lobby-wordmark">
          <img src="/tuki_logo.png" alt="SHY - Sexual Health for Youth" className="lobby-logo" />
          <div>
            THE PLAY ROOM
            <small>Sexual Health for Youth</small>
          </div>
        </div>
        <span className="lobby-live">
          <span />
          {readyCount} games live
        </span>
      </header>

      <main className="lobby-main">
        <section className="lobby-hero" aria-labelledby="hub-heading">
          <div className="lobby-hero-copy">
            <p className="lobby-eyebrow">A LITTLE PLAY. A NEW PERSPECTIVE.</p>
            <h1 id="hub-heading">
              Press play.
              <br />
              <span>Stay curious.</span>
            </h1>
            <p className="lobby-hero-description">
              Big questions. Small games. Explore friendships, boundaries, and
              sexual health in a space where you can just be you.
            </p>
            <a href="#game-library" className="lobby-choose">
              Choose your game <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="lobby-guide">
            <div className="lobby-speech">
              Your next little
              <br />
              plot twist starts here.
            </div>
            <span className="lobby-guide-spark lobby-spark-left" aria-hidden="true">✦</span>
            <div className="lobby-capy"><CapybaraCard label="Let's play!" happy /></div>
            <span className="lobby-guide-spark lobby-spark-right" aria-hidden="true">+</span>
            <span className="lobby-guide-platform" aria-hidden="true" />
            <span className="lobby-guide-tag">YOUR CAPYBARA CO-PILOT</span>
          </div>
        </section>

        <div className="lobby-heads-up" role="note">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            <strong>A gentle heads-up.</strong> These games touch on
            relationships, consent, STIs, contraception, menstrual health, and
            how we look out for each other. You can skip any question, or leave
            any game whenever you want.
          </p>
        </div>

        <section id="game-library" className="lobby-library" aria-labelledby="lobby-library-heading">
          <div className="lobby-library-top">
            <div>
              <p className="lobby-eyebrow">THE GAME SELECT</p>
              <h2 id="lobby-library-heading">Pick your next adventure.</h2>
            </div>
            <span className="lobby-availability">
              {readyCount} READY <span>/</span> {games.length} WORLDS
            </span>
          </div>
          <div className="lobby-games-grid">
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                onSelect={() => onSelectGame(game.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
