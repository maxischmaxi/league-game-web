export type Game = {
  id: number;
  name: string;
  uuid: string;
};

console.log(import.meta.env);

export const gateway = import.meta.env.DEV
  ? (import.meta.env.VITE_API_GATEWAY as string)
  : "";

export enum SocketMessageType {
  SAY_HELLO = "say_hello",
  SET_NICK = "set_nick",
  SET_NICK_SUCCESS = "nick_set_success",
  NICK_REQUEST = "nick_request",
  GET_CONNECTED_USERS = "get_connected_users",
  GET_CONNECTED_USERS_RESPONSE = "get_connected_users_response",
  PLAYER_CONNECTED = "player_connected",
  PLAYER_DISCONNECTED = "player_disconnected",
  ERROR = "error",
  SET_TEXT = "set_text",
  TEXT_UPDATE = "text_update",
  SET_ANSWER = "set_answer",
  CAN_TYPE = "can_type",
  GET_CAN_TYPE = "get_can_type",
  GET_TEXT = "get_text",
  ALL_ANSWERS = "all_answers",
  JOIN_GAME = "join_game",
  LEAVE_GAME = "leave_game",
}

export type SocketMessage = {
  type: SocketMessageType;
  payload: string | object;
};

export type SetTextMessage = {
  text: string;
  gameId: string;
};

export type SetAnswerMessage = {
  answer: string;
  gameId: string;
};

export type Answer = {
  uuid: string;
  nickname: string;
  answer: string;
};

export type Player = { uuid: string; nickname: string; gameId: string };
