import { useEffect, useState } from "react";
import { GamesHub, type GameId } from "@/components/GamesHub";
import { GameFrame } from "@/components/GameFrame";
import { PovGame } from "@/components/game/PovGame";
import MythOrFactGame from "@/components/myth-or-fact/MythOrFactGame";
import { WhatWouldYouDoGame } from "@/components/what-would-you-do/WhatWouldYouDoGame";
import { PlayerRegistration } from "@/components/PlayerRegistration";
import { clearPlayer, currentPlayer } from "@/lib/booth";
import { resultSaveState, retryResults } from "@/lib/analytics";

function App() {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [registered, setRegistered] = useState(() => !!currentPlayer());
  const [save, setSave] = useState(resultSaveState);
  useEffect(() => {
    const update = () => setSave(resultSaveState());
    window.addEventListener("shy:result-save", update);
    const warn = (e: BeforeUnloadEvent) => { if (resultSaveState().pending) { e.preventDefault(); } };
    window.addEventListener("beforeunload", warn);
    return () => { window.removeEventListener("shy:result-save", update); window.removeEventListener("beforeunload", warn); };
  }, []);
  if (!registered) return <PlayerRegistration onReady={() => setRegistered(true)} />;
  const back = () => { setSelectedGame(null); window.scrollTo(0, 0); };
  const newPlayer = () => {
    if (resultSaveState().pending || !window.confirm("Finish this player’s session and start a new player? Saved games will be kept.")) return;
    clearPlayer();
    setSelectedGame(null);
    setRegistered(false);
    window.scrollTo(0, 0);
  };
  return <>
    {save.pending > 0 && <div role="status" className="sticky top-0 z-50 border-b-2 border-ink bg-yellow-100 p-3 text-center font-bold">
      {save.saving ? "Saving completed game…" : save.error}
      {!save.saving && <button type="button" className="ml-3 underline" onClick={() => void retryResults()}>Retry saving</button>}
      <span className="block text-sm">Please save before refreshing or switching players.</span>
    </div>}
    {selectedGame === "game1" ? <PovGame onExitToHub={back} />
      : selectedGame === "game2" ? <MythOrFactGame onExitToHub={back} />
      : selectedGame === "game4" ? <WhatWouldYouDoGame onExitToHub={back} />
      : selectedGame === "game3" ? <GameFrame gameId={selectedGame} onBack={back} />
      : <GamesHub onSelectGame={setSelectedGame} onNewPlayer={newPlayer} switchingDisabled={save.pending > 0} />}
  </>;
}

export default App;
