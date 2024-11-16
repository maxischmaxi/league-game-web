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
  round: GameRound | null;
  rounds: GameRound[];
  game: Game | null;
  reconnect: () => void;
  setNickname: (nickname: string) => void;
  setText: (text: string) => void;
  setAnswer: (answer: string) => void;
  deleteAnswer: (answerId: string) => void;
  joinGame: (gameId: string) => void;
  leaveGame: () => void;
  setAnswerVisible: (uuid: string) => void;
  setAnswerInvisible: (uuid: string) => void;
  sayHello: () => void;
  deleteGame: (gameId: string) => void;
  createGame: (name: string) => void;
  goNextRound: () => void;
  startRound: () => void;
  endRound: () => void;
};

export const SocketContext = createContext<IUseSocket>({
  deleteGame: () => null,
  connected: false,
  game: null,
  games: [],
  round: null,
  currentText: "",
  connectedPlayers: [],
  allAnswers: [],
  nickname: "",
  uuid: null,
  rounds: [],
  deleteAnswer: () => null,
  endRound: () => null,
  goNextRound: () => null,
  createGame: () => null,
  startRound: () => null,
  sayHello: () => null,
  reconnect: () => null,
  setNickname: () => null,
  setText: () => null,
  setAnswer: () => null,
  joinGame: () => null,
  leaveGame: () => null,
  setAnswerVisible: () => null,
  setAnswerInvisible: () => null,
});
