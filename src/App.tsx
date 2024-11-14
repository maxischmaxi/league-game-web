import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ConnectionIndicator } from "./components/connection-indicator";
import { Nickname } from "./components/nickname";
import { useSocket } from "./hooks/use-socket";
import { api } from "./lib/api";
import { useGame } from "./hooks/use-game";
import { GameManagerView } from "./pages/game-manager-view";
import { GamePlayerView } from "./pages/game-player-view";
import { EnterGame } from "./components/enter-game";
import { Button } from "./components/ui/button";
import { LoaderCircle } from "lucide-react";
import { TypeSettings } from "./components/type-settings";

export function App() {
  const { connectedUsers, connected, leaveGame, gameId } = useSocket();
  const { uuid } = useGame();

  const game = useQuery({
    queryKey: ["game", gameId],
    enabled: Boolean(gameId),
    async queryFn() {
      if (!gameId) return null;
      return await api.getGame(gameId);
    },
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <header className="flex items-center flex-row h-[70px] max-h-[70px] flex-nowrap w-full px-8 py-4 gap-4 border-b border-secondary">
        <p className="font-bold">{game.data?.name}</p>
        {gameId !== null && (
          <Button size="sm" variant="destructive" onClick={leaveGame}>
            Spiel verlassen
          </Button>
        )}
        {gameId !== null && uuid === game.data?.uuid && <TypeSettings />}
        <ConnectionIndicator />
        <ModeToggle />
      </header>
      <main
        className="overflow-hidden h-full w-full"
        style={{ maxHeight: "calc(100vh - 70px)" }}
      >
        <div
          className="grid grid-cols-4 h-full"
          style={{ minHeight: "calc(100vh - 70px)" }}
        >
          {!connected && (
            <div className="grid-cols-3 flex justify-center items-center">
              <p>Not connected</p>
            </div>
          )}
          {connected && gameId !== null && game.isPending && (
            <div className="col-span-3 flex justify-center items-center">
              <LoaderCircle className="w-10 h-10 animate-spin" />
            </div>
          )}
          {connected && gameId !== null && !game.isPending && game.data && (
            <>
              {game.data.uuid === uuid ? (
                <GameManagerView game={game} />
              ) : (
                <GamePlayerView game={game} />
              )}
            </>
          )}
          {connected && <EnterGame />}
          <div className="col-span-1 flex flex-col flex-nowrap gap-4 px-8 border-l border-secondary pt-8">
            <p>
              Moderator:{" "}
              <b>
                {game.data?.uuid === uuid
                  ? "Ich"
                  : connectedUsers.find((user) => user.uuid === game.data?.uuid)
                      ?.nickname}
              </b>
            </p>
            <p>Spieler:</p>
            <ul className="h-full overflow-y-auto flex flex-col gap-4">
              {connectedUsers
                .filter((user) => user.uuid !== uuid)
                .filter((user) => user.uuid !== game.data?.uuid)
                .filter((user) => {
                  if (gameId === null) return false;
                  return gameId === user.gameId;
                })
                .map((user) => (
                  <li
                    className="bg-secondary text-lg py-2 px-4 rounded-full text-secondary-foreground"
                    key={user.uuid}
                  >
                    {user.nickname}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
      <Nickname />
      <Toaster />
    </ThemeProvider>
  );
}
