import { createContext } from "react";
import { Answer, Player } from "./definitions";

type IUseSocket = {
  connected: boolean;
  connectedUsers: Player[];
  currentText: string;
  canType: boolean;
  allAnswers: Answer[];
  gameId: string | null;
  setNickname: (nickname: string) => void;
  setText: (gameId: string, text: string) => void;
  setAnswer: (gameId: string, answer: string) => void;
  updateCanType: (value: boolean) => void;
  joinGame: (gameId: string) => void;
  leaveGame: () => void;
};

export const SocketContext = createContext<IUseSocket>({
  connected: false,
  currentText: "",
  connectedUsers: [],
  allAnswers: [],
  canType: false,
  gameId: null,
  setNickname: () => null,
  setText: () => null,
  setAnswer: () => null,
  updateCanType: () => null,
  joinGame: () => null,
  leaveGame: () => null,
});
