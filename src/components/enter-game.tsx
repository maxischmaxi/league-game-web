import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { useMemo } from "react";
import { createGameSchema } from "@/lib/schemas";
import { useSocket } from "@/hooks/use-socket";

export function EnterGame() {
  const { createGame, game, games, nickname, joinGame } = useSocket();
  const form = useForm<z.infer<typeof createGameSchema>>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      name: "",
    },
  });

  const open = useMemo(() => {
    if (nickname === "") {
      return false;
    }

    if (game === null) {
      return true;
    }
    return false;
  }, [nickname, game]);

  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        className="h-full max-h-[80vh] min-w-[80vw] min-h-[80vh]"
      >
        <DialogHeader>
          <DialogTitle>Spiel beitreten</DialogTitle>
          <DialogDescription>
            Trete einem Spiel bei oder erstelle ein neues
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-3 gap-8 h-full">
          <div className="col-span-2 flex flex-col h-full gap-4">
            <p className="font-bold">Spiele</p>
            <ul className="h-full overflow-y-auto">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="rounded-lg border-2 p-4 hover:bg-secondary cursor-pointer"
                  onClick={() => {
                    joinGame(game.id);
                  }}
                >
                  {game.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <p className="font-bold">Neues Spiel erstellen</p>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={form.handleSubmit(async (data) => {
                createGame(data.name);
              })}
            >
              <Input
                placeholder="Name eingeben"
                control={form.control}
                name="name"
              />
              <div className="flex flex-row flex-nowrap justify-end">
                <Button type="submit">Erstellen</Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
