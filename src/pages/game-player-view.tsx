import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/use-socket";
import { Game } from "@/lib/definitions";
import { UseQueryResult } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";

type Props = {
  game: UseQueryResult<Game | null, unknown>;
};

export function GamePlayerView(props: Props) {
  const { game } = props;
  const { canType, setAnswer, currentText } = useSocket();
  const [answer, set] = useState("");

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    set(e.currentTarget.value);
    if (game.data?.id) {
      setAnswer(game.data.id.toString(), e.currentTarget.value);
    }
  }

  return (
    <div className="col-span-3 flex flex-col w-full h-full gap-2 p-8">
      <p className="text-center w-full text-4xl my-auto">{currentText}</p>
      <p className="text-xs">
        {canType
          ? "Du kannst nun tippen."
          : "Der Moderator hat die Eingabe deaktiviert."}
      </p>
      <Textarea
        value={answer}
        rows={5}
        disabled={!canType}
        onChange={onChange}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        placeholder="Deine Antwort"
      />
    </div>
  );
}
