import { z } from "zod";

export const createGameSchema = z.object({
  name: z
    .string({
      required_error: "Der Name des Spiels wird benötigt",
    })
    .min(3, {
      message: "Der Name des Spiels muss mindestens 3 Zeichen lang sein",
    }),
});

export const setNickSchema = z.object({
  nickname: z
    .string({
      required_error: "Dein Name wird benötigt",
    })
    .min(3, {
      message: "Dein Name muss mindestens 3 Zeichen lang sein",
    }),
});
