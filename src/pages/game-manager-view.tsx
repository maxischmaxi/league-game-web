import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/use-socket";
import { Game } from "@/lib/definitions";
import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  game: UseQueryResult<Game | null, unknown>;
};

export function GameManagerView(props: Props) {
  const { game } = props;
  const { allAnswers, currentText, setText } = useSocket();
  const [newText, setNewText] = useState("");

  function sendText() {
    if (newText.length === 0) {
      return;
    }

    if (!game.data) {
      return;
    }

    setText(game.data.id.toString(), newText);
  }

  return (
    <div className="col-span-3 p-8 flex flex-col gap-4">
      <div className="h-full overflow-y-auto px-4">
        <div className="space-y-2">
          <p>Aktuelleler Text:</p>
          <p className="text-center w-full text-3xl my-8">
            {currentText.length > 0 ? (
              currentText.replace(/\n/g, "<br />")
            ) : (
              <span className="text-muted">Kein Text vorhanden</span>
            )}
          </p>
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Neuer Text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <div className="flex flex-row w-full justify-end">
            <Button disabled={newText.length === 0} onClick={sendText}>
              Text anzeigen
            </Button>
          </div>
        </div>
        <p className="text-lg mt-8 mb-2">Antworten:</p>
        <ul className="flex flex-col gap-4">
          {allAnswers.map((answer) => (
            <li
              key={answer.uuid}
              className="bg-secondary text-secondary-foreground rounded-lg"
            >
              <p className="w-full font-bold pt-2 px-4">{answer.nickname}:</p>
              <p className="w-full pb-4 px-4">
                {answer.answer.length > 0 ? (
                  answer.answer
                ) : (
                  <span className="text-muted-foreground">
                    Nichts geschrieben...
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
