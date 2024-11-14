import { z } from "zod";
import { enterGameSchama } from "./schemas";
import { Game, gateway } from "./definitions";

export const api = {
  async getGame(id: string): Promise<Game> {
    const res = await fetch(`${gateway}/game/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch game");
    }

    return await res.json();
  },
  async setNick(nickname: string, uuid: string): Promise<void> {
    const res = await fetch(`${gateway}/user/nick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, uuid }),
    });

    if (!res.ok) {
      throw new Error("Failed to set nickname");
    }
  },
  async createGame(name: string, uuid: string): Promise<{ id: string }> {
    const res = await fetch(`${gateway}/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, uuid }),
    });

    if (!res.ok) {
      throw new Error("Failed to create game");
    }

    return await res.json();
  },
  async joinGame(data: z.infer<typeof enterGameSchama>): Promise<void> {
    const res = await fetch(`${gateway}/game/join`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to join game");
    }

    return;
  },
};
