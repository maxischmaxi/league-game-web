export const gateway = import.meta.env.DEV
  ? (import.meta.env.VITE_API_GATEWAY as string)
  : "";

export enum SocketMessageType {
  SAY_HELLO = "say_hello",
  SET_NICK = "set_nick",
  CREATE_GAME = "create_game",
  GET_ROUND = "get_round",
  SET_NICK_SUCCESS = "nick_set_success",
  NICK_REQUEST = "nick_request",
  GET_CONNECTED_PLAYERS = "get_connected_players",
  PLAYER_CONNECTED = "player_connected",
  GET_ROUNDS = "get_rounds",
  PLAYER_DISCONNECTED = "player_disconnected",
  ERROR = "error",
  SET_TEXT = "set_text",
  SET_ANSWER = "set_answer",
  CAN_TYPE = "can_type",
  GET_CAN_TYPE = "get_can_type",
  GET_TEXT = "get_text",
  ALL_ANSWERS = "all_answers",
  DELETE_ANSWER = "delete_answer",
  JOIN_GAME = "join_game",
  LEAVE_GAME = "leave_game",
  SET_ANSWER_VISIBLE = "set_answer_visible",
  SET_ANSWER_INVISIBLE = "set_answer_invisible",
  SET_PREVIEW = "set_preview",
  GET_GAME = "get_game",
  PREVIEWED_GAMES = "previewed_games",
  SET_UUID = "set_uuid",
  GET_GAMES = "get_games",
  GO_NEXT_ROUND = "go_next_round",
  START_ROUND = "start_round",
  END_ROUND = "end_round",
}

export type SocketMessage = {
  type: SocketMessageType;
  payload: string | object;
};

export type Answer = {
  id: string;
  gameId: string;
  playerId: string;
  roundId: string;
  text: string;
  revealedToPlayers: boolean;
};

export type Player = {
  id: string;
  nickname: string;
};

export type Game = {
  id: string;
  name: string;
  moderatorId: string;
  players: string[];
  active: boolean;
};

export type GameRound = {
  id: string;
  gameId: string;
  round: number;
  active: boolean;
  question: string;
  answers: Answer[];
  started: boolean;
  ended: boolean;
};
