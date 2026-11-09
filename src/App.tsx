import { useState } from "react";
import { GamesHub, type GameId } from "@/components/GamesHub";
import { GameFrame } from "@/components/GameFrame";
import { PovGame } from "@/components/game/PovGame";
import MythOrFactGame from "@/components/myth-or-fact/MythOrFactGame";
import { WhatWouldYouDoGame } from "@/components/what-would-you-do/WhatWouldYouDoGame";

function App() {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  if (selectedGame === "game1") {
    return <PovGame onExitToHub={() => setSelectedGame(null)} />;
  }

  if (selectedGame === "game2") {
    return <MythOrFactGame onExitToHub={() => setSelectedGame(null)} />;
  }

  if (selectedGame === "game4") {
    return <WhatWouldYouDoGame onExitToHub={() => setSelectedGame(null)} />;
  }

  if (selectedGame === "game3") {
    return <GameFrame gameId={selectedGame} onBack={() => setSelectedGame(null)} />;
  }

  return <GamesHub onSelectGame={setSelectedGame} />;
}

export default App;
