import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ConnectionIndicator } from "@/components/connection-indicator";
import { Nickname } from "@/components/nickname";
import { useSocket } from "@/hooks/use-socket";
import { GameManagerView } from "@/pages/game-manager-view";
import { GamePlayerView } from "@/pages/game-player-view";
import { EnterGame } from "@/components/enter-game";
import { Button } from "@/components/ui/button";

export function App() {
  const { uuid, reconnect, connected, leaveGame, game } = useSocket();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <header className="flex items-center flex-row h-[70px] max-h-[70px] flex-nowrap w-full px-8 py-4 gap-4 border-b border-secondary">
        <p className="font-bold">{game?.name}</p>
        {game !== null && (
          <Button size="sm" variant="destructive" onClick={leaveGame}>
            Spiel verlassen
          </Button>
        )}
        <ConnectionIndicator />
        <ModeToggle />
      </header>
      <main
        className="overflow-hidden h-full w-full"
        style={{ maxHeight: "calc(100vh - 70px)" }}
      >
        <div className="h-full" style={{ minHeight: "calc(100vh - 70px)" }}>
          {!connected && (
            <div className="flex justify-center items-center flex-col gap-4">
              <p>Not connected</p>
              <Button onClick={reconnect} variant="outline">
                Reconnect
              </Button>
            </div>
          )}
          {connected && game && (
            <>
              {game.moderatorId === uuid ? (
                <GameManagerView />
              ) : (
                <GamePlayerView />
              )}
            </>
          )}
          {connected && <EnterGame />}
        </div>
      </main>
      <Nickname />
      <Toaster />
    </ThemeProvider>
  );
}
