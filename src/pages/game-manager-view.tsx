import { ConnectionIndicator } from "@/components/connection-indicator";
import { DeleteGame } from "@/components/delete-game";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import { websocket } from "@/lib/websocket";
import { Eye, EyeOff, Plus, Trash } from "lucide-react";
import { useState } from "react";

export function GameManagerView() {
  const { allAnswers, connectedPlayers, game, currentText, rounds } =
    useSocket();
  const [newText, setNewText] = useState("");
  const round = rounds.find((r) => r.active);

  return (
    <div className="col-span-3 p-8 flex flex-col relative gap-8 h-full max-h-full">
      <div className="flex items-center flex-row flex-nowrap justify-between">
        <p className="text-xl font-bold">{game?.name}</p>
        <div className="flex flex-row flex-nowrap gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (game) {
                websocket.leaveGame(game.id);
              }
            }}
          >
            Spiel verlassen
          </Button>
          <DeleteGame />
          <ModeToggle />
          <ConnectionIndicator />
        </div>
      </div>
      <div className="h-full max-h-full flex gap-8 flex-row flex-nowrap w-full">
        <div className="max-w-[300px] shrink-0 w-full flex flex-col gap-4 h-full">
          <div className="flex flex-row flex-nowrap justify-between items-center">
            <p className="font-bold">Runden</p>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                if (game) {
                  websocket.goNextRound(game.id);
                }
              }}
            >
              <Plus />
            </Button>
          </div>
          <ul className="h-full overflow-y-auto flex flex-col gap-2 max-h-[800px]">
            {rounds
              .sort((a, b) => {
                if (a.round < b.round) {
                  return 1;
                }
                if (a.round > b.round) {
                  return -1;
                }
                return 0;
              })
              .map((r) => (
                <li
                  className={cn(
                    "border-2 p-4 rounded-md",
                    round?.id === r.id && "border-blue-400",
                  )}
                  key={r.id}
                >
                  RUNDE {r.round}
                </li>
              ))}
          </ul>
        </div>
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold">Frage</p>
          <div className="border-secondary border-2 w-full p-8 rounded-md">
            <p
              className="w-full text-3xl"
              dangerouslySetInnerHTML={{
                __html: currentText.replace(/\n/g, "<br>"),
              }}
            />
          </div>

          <Textarea
            value={newText}
            rows={10}
            onChange={(e) => setNewText(e.currentTarget.value)}
            placeholder="Neuer Text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {round != null && (
            <div className="flex flex-row flex-nowrap justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (!game?.id) {
                    return;
                  }
                  websocket.setText(newText);
                }}
              >
                Text setzen
              </Button>
              <Button
                onClick={() => {
                  if (!round.started && !round.ended) {
                    websocket.startRound();
                  }

                  if (!round.started && round.ended) {
                    websocket.startRound();
                  }

                  if (round.started && !round.ended) {
                    websocket.endRound();
                  }
                }}
              >
                {!round.started && !round.ended && "Runde starten"}
                {!round.started && round.ended && "Runde starten"}
                {round.started && !round.ended && "Runde beenden"}
              </Button>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold">Antworten</p>
          <div className="border-2 w-full rounded-md">
            <ul className="max-h-full overflow-y-auto flex flex-col gap-4">
              {allAnswers.length === 0 && (
                <p className="text-muted-foreground p-4">
                  Noch keine Antworten
                </p>
              )}
              {allAnswers.map((answer) => (
                <li key={answer.id} className="border-b-2 last:border-b-0">
                  <p className="w-full font-bold pt-2 px-4">
                    {
                      connectedPlayers.find((u) => u.id === answer.playerId)
                        ?.nickname
                    }
                  </p>
                  <p className="w-full px-4">
                    {answer.text.length > 0 ? (
                      answer.text
                    ) : (
                      <span className="text-muted-foreground">
                        Nichts geschrieben...
                      </span>
                    )}
                  </p>
                  <div className="flex flex-row flex-nowrap justify-end px-4 pb-4 gap-4">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        websocket.deleteAnswer(answer.id);
                      }}
                    >
                      <Trash />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        if (answer.revealedToPlayers) {
                          websocket.setAnswerInvisible(answer.id);
                        } else {
                          websocket.setAnswerVisible(answer.id);
                        }
                      }}
                    >
                      {answer.revealedToPlayers ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
