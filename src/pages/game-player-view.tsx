import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/use-socket";
import { useMemo, useState } from "react";

export function GamePlayerView() {
  const {
    allAnswers,
    round,
    connectedPlayers,
    game,
    setAnswer,
    uuid,
    currentText,
    previewed,
  } = useSocket();
  const [text, setText] = useState("");

  const isPreviewed = useMemo(() => {
    if (!game) {
      return false;
    }

    return previewed.includes(game.id);
  }, [game, previewed]);

  const myAnswer = useMemo(() => {
    if (!game) {
      return null;
    }
    if (!uuid) {
      return null;
    }
    return allAnswers.find((a) => a.playerId === uuid)?.text ?? null;
  }, [allAnswers, uuid, game]);

  return (
    <div className="flex flex-col w-full h-full gap-2 p-8">
      {round !== null && (
        <>
          <p className="font-bold text-3xl">Runde {round.round}</p>
          {!round?.started && !round?.ended && (
            <p className="text-muted-foreground">
              Der Moderator hat die Runde noch nicht gestartet
            </p>
          )}
          {round?.started && (
            <p
              className="w-full text-xl"
              dangerouslySetInnerHTML={{
                __html: currentText.replace(/\n/g, "<br>"),
              }}
            />
          )}

          {round.started && (
            <>
              {myAnswer !== null && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Deine Antwort:
                  </p>
                  <p
                    className="rounded-lg border p-4"
                    dangerouslySetInnerHTML={{
                      __html: myAnswer.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}
              <p className="text-muted-foreground text-sm">Antwort eingeben:</p>
              <Textarea
                value={text}
                rows={5}
                disabled={!round?.started}
                onChange={(e) => setText(e.currentTarget.value)}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                placeholder="Deine Antwort"
              />
              <div className="flex flex-row flex-nowrap justify-end">
                <Button
                  onClick={() => {
                    setAnswer(text);
                  }}
                >
                  Antwort senden
                </Button>
              </div>
            </>
          )}
          {round.ended && (
            <>
              <p className="text-muted-foreground mt-4">
                Die Runde ist vorbei. Hier sind alle Antworten der Spieler:
              </p>
              <ul className="flex flex-col gap-4 pt-2 overflow-y-auto max-h-full h-full">
                {allAnswers.map((a) => (
                  <li key={a.id} className="flex flex-col gap-1">
                    <p className="font-bold">
                      {
                        connectedPlayers.find((p) => p.id === a.playerId)
                          ?.nickname
                      }
                    </p>
                    {a.revealedToPlayers && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: a.text.replace(/\n/g, "<br />"),
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <Dialog open={isPreviewed}>
        <DialogContent hideClose className="w-[80vw] h-[80vh]">
          <p></p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
