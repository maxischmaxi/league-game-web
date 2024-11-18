import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/use-socket";
import { ChangeEvent, lazy, useMemo, useRef, useState } from "react";
import { websocket } from "@/lib/websocket";

const Li = lazy(() =>
  import("framer-motion").then((mod) => ({
    default: mod.motion.li,
  })),
);

const Textarea = lazy(() =>
  import("@/components/ui/textarea").then((mod) => ({
    default: mod.Textarea,
  })),
);

const ConnectionIndicator = lazy(() =>
  import("@/components/connection-indicator").then((mod) => ({
    default: mod.ConnectionIndicator,
  })),
);

const variants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export function GamePlayerView() {
  const { allAnswers, connectedPlayers, game, uuid, currentText, rounds } =
    useSocket();
  const [text, setText] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);

  const myAnswer = useMemo(() => {
    if (!game) {
      return null;
    }
    if (!uuid) {
      return null;
    }
    return allAnswers.find((a) => a.playerId === uuid)?.text ?? null;
  }, [allAnswers, uuid, game]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.currentTarget.value);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      websocket.setAnswer(event.currentTarget.value);
    }, 1000);
  }

  const round = rounds.find((r) => r.active) ?? null;

  return (
    <div
      className="flex flex-col w-full h-full gap-8 p-8"
      style={{
        background:
          "linear-gradient(22deg, rgba(78,69,224,1) 45%, rgba(167,29,189,1) 100%)",
      }}
    >
      <div className="flex flex-row items-center flex-nowrap justify-between">
        <p className="font-bold text-xl">{game?.name}</p>
        <div className="flex flex-row flex-nowrap gap-4 items-center">
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
          <ConnectionIndicator />
        </div>
      </div>
      <div className="flex flex-row justify-center items-start gap-4 max-h-full h-full pb-12">
        <ul className="flex flex-col gap-2 max-h-full overflow-y-auto">
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
              <Li
                className="bg-white/20 p-4 rounded-lg min-w-[400px] max-w-[800px]"
                key={r.round}
                variants={variants}
                initial="hidden"
                animate="visible"
              >
                {round !== null && r.id === round.id && (
                  <>
                    <p className="font-bold text-3xl">Runde {round.round}</p>
                    {!round.started && !round.ended && (
                      <p className="text-secondary-foreground mt-2">
                        Der Moderator hat die Runde noch nicht gestartet
                      </p>
                    )}
                    <div className="mt-4">
                      <p className="text-secondary-foreground text-sm">
                        Nico hat folgendes gesagt:
                      </p>
                      <p
                        className="w-full text-xl"
                        dangerouslySetInnerHTML={{
                          __html: currentText.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </>
                )}
                {round !== null && r.id !== round.id && (
                  <>
                    <p className="text-muted-foreground">Runde {r.round}</p>
                    <div className="mt-4">
                      <p className="text-secondary-foreground text-sm">
                        Nico hat folgendes gesagt:
                      </p>
                      <p
                        className="w-full text-xl"
                        dangerouslySetInnerHTML={{
                          __html: r.question.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </>
                )}
              </Li>
            ))}
        </ul>
        <div className="bg-white rounded-lg p-4 min-w-[400px] max-w-[800px]">
          {round !== null && (
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
              {round.started && (
                <>
                  <p className="text-black font-bold text-sm">
                    Antwort eingeben:
                  </p>
                  <Textarea
                    value={text}
                    rows={5}
                    disabled={!round?.started}
                    onChange={handleChange}
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    placeholder="Deine Antwort"
                    className="text-black"
                  />
                </>
              )}
              {round.ended && (
                <>
                  <p className="text-muted-foreground">Die Runde ist vorbei.</p>
                  {allAnswers.length > 0 && (
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
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
