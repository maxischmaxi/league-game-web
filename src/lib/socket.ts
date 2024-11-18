import { createContext } from "react";
import { Answer, Game, Player, GameRound } from "./definitions";

type IUseSocket = {
  connected: boolean;
  connectedPlayers: Player[];
  currentText: string;
  allAnswers: Answer[];
  nickname: string;
  uuid: string | null;
  games: Game[];
  rounds: GameRound[];
  game: Game | null;
  setUuid: (uuid: string) => void;
  reconnect: () => void;
  setNickname: (nickname: string) => void;
};

export const SocketContext = createContext<IUseSocket>({
  setUuid: () => null,
  connected: false,
  game: null,
  games: [],
  currentText: "",
  connectedPlayers: [],
  allAnswers: [],
  nickname: "",
  uuid: null,
  rounds: [],
  setNickname: () => null,
  reconnect: () => null,
});
