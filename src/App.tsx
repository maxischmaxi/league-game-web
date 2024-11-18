import { Toaster } from "@/components/ui/sonner";
import { Nickname } from "@/components/nickname";
import { useSocket } from "@/hooks/use-socket";
import { EnterGame } from "@/components/enter-game";
import { Button } from "@/components/ui/button";
import { lazy } from "react";

const GameManagerView = lazy(() =>
  import("@/pages/game-manager-view").then((mod) => ({
    default: mod.GameManagerView,
  })),
);

const GamePlayerView = lazy(() =>
  import("@/pages/game-player-view").then((mod) => ({
    default: mod.GamePlayerView,
  })),
);

export function App() {
  const { uuid, reconnect, connected, game } = useSocket();

  return (
    <main className="overflow-hidden h-screen w-full">
      {!connected && (
        <div className="flex justify-center items-center flex-col gap-4 pt-12">
          <p>Not connected</p>
          <Button onClick={reconnect} variant="outline">
            Reconnect
          </Button>
        </div>
      )}
      {connected && game && (
        <>
          {game.moderatorId === uuid ? <GameManagerView /> : <GamePlayerView />}
        </>
      )}
      {connected && <EnterGame />}
      <Nickname />
      <Toaster />
    </main>
  );
}
