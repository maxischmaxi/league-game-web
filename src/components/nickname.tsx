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

export function Nickname() {
  const { nickname, setNickname, sayHello, connected } = useSocket();

  const form = useForm<z.infer<typeof setNickSchema>>({
    resolver: zodResolver(setNickSchema),
    disabled: !connected,
    defaultValues: {
      nickname: "",
    },
  });

  const open = useMemo(() => {
    if (!connected) {
      return false;
    }
    if (nickname === "") {
      return true;
    }

    return false;
  }, [connected, nickname]);

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
            sayHello();
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
            <Button disabled={!connected} type="submit">
              Speichern
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
