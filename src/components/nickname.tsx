import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setNickSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSocket } from "@/hooks/use-socket";
import { websocket } from "@/lib/websocket";

export function Nickname() {
  const { nickname, setNickname } = useSocket();

  const form = useForm<z.infer<typeof setNickSchema>>({
    resolver: zodResolver(setNickSchema),
    defaultValues: {
      nickname: "",
    },
  });

  const open = useMemo(() => {
    if (nickname.length <= 0) {
      return true;
    }

    return false;
  }, [nickname]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nickname</AlertDialogTitle>
          <AlertDialogDescription>
            Bitte wähle einen Nickname aus
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className="w-full space-y-4"
          onSubmit={form.handleSubmit((data) => {
            setNickname(data.nickname);
            websocket.sayHello();
          })}
        >
          <Input
            pattern="[A-Za-z0-9]{1,20}"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            type="text"
            placeholder="Nickname"
            label="Nickname"
            control={form.control}
            name="nickname"
          />
          <div className="flex flex-row justify-end">
            <Button type="submit">Speichern</Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
