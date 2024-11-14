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
import { useEffect, useState } from "react";
import { createGameSchema, enterGameSchama } from "@/lib/schemas";
import { useSocket } from "@/hooks/use-socket";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useGame } from "@/hooks/use-game";

export function EnterGame() {
  const { gameId, joinGame } = useSocket();
  const { uuid } = useGame();
  const [open, setOpen] = useState(false);
  const enterForm = useForm<z.infer<typeof enterGameSchama>>({
    resolver: zodResolver(enterGameSchama),
    defaultValues: {
      gameId: "",
    },
  });
  const form = useForm<z.infer<typeof createGameSchema>>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (gameId === null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [gameId]);

  const createGame = useMutation({
    async mutationFn(data: z.infer<typeof createGameSchema>) {
      const { id } = await api.createGame(data.name, uuid);
      joinGame(id);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spiel beitreten</DialogTitle>
          <DialogDescription>
            Gib die ID des Spiels ein, dem du beitreten möchtest, oder erstelle
            ein neues Spiel
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={enterForm.handleSubmit((data) => {
            joinGame(data.gameId);
          })}
          className="space-y-4 w-full"
        >
          <Input
            control={enterForm.control}
            name="gameId"
            placeholder="GAME ID"
            label="Game ID"
          />
          <div className="flex flex-row flex-nowrap justify-end">
            <Button type="submit">Beitreten</Button>
          </div>
        </form>
        <form
          className="w-full space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            await createGame.mutateAsync(data);
          })}
        >
          <Input
            placeholder="Name eingeben"
            control={form.control}
            name="name"
            label="Name des neuen Spiels"
          />
          <div className="flex flex-row flex-nowrap justify-end">
            <Button type="submit">Erstellen</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
