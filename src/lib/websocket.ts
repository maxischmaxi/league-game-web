import { SocketMessage, SocketMessageType } from "./definitions";

class WebsocketWrapper {
  url: string | null;
  socket: WebSocket | null;
  connecting: boolean;
  connected: boolean;
  eventHandlers: {
    [SocketMessageType.NICK_REQUEST]: ((payload: string | object) => void)[];
    [SocketMessageType.PLAYER_DISCONNECTED]: ((
      payload: string | object,
    ) => void)[];
    [SocketMessageType.ALL_ANSWERS]: ((payload: string | object) => void)[];
    [SocketMessageType.SET_UUID]: ((payload: string | object) => void)[];
    [SocketMessageType.GET_GAMES]: ((payload: string | object) => void)[];
    [SocketMessageType.GET_ROUNDS]: ((payload: string | object) => void)[];
    [SocketMessageType.PLAYER_CONNECTED]: ((
      payload: string | object,
    ) => void)[];
    [SocketMessageType.SET_TEXT]: ((payload: string | object) => void)[];
    [SocketMessageType.SET_NICK_SUCCESS]: ((
      payload: string | object,
    ) => void)[];
    [SocketMessageType.GET_GAME]: ((payload: string | object) => void)[];
    [SocketMessageType.LEAVE_GAME]: ((payload: string | object) => void)[];
    [SocketMessageType.GAME_DELETED]: ((payload: string | object) => void)[];
    [SocketMessageType.GET_CONNECTED_PLAYERS]: ((
      payload: string | object,
    ) => void)[];
    [SocketMessageType.JOIN_GAME]: ((payload: string | object) => void)[];
    open: (() => void)[];
    closed: (() => void)[];
    error: (() => void)[];
    gameLeft: (() => void)[];
  };

  constructor() {
    this.eventHandlers = {
      [SocketMessageType.NICK_REQUEST]: [],
      [SocketMessageType.PLAYER_DISCONNECTED]: [],
      [SocketMessageType.ALL_ANSWERS]: [],
      [SocketMessageType.SET_UUID]: [],
      [SocketMessageType.GET_GAMES]: [],
      [SocketMessageType.GET_ROUNDS]: [],
      [SocketMessageType.PLAYER_CONNECTED]: [],
      [SocketMessageType.SET_TEXT]: [],
      [SocketMessageType.SET_NICK_SUCCESS]: [],
      [SocketMessageType.GET_GAME]: [],
      [SocketMessageType.LEAVE_GAME]: [],
      [SocketMessageType.GAME_DELETED]: [],
      [SocketMessageType.GET_CONNECTED_PLAYERS]: [],
      [SocketMessageType.JOIN_GAME]: [],
      open: [],
      closed: [],
      error: [],
      gameLeft: [],
    };
    this.socket = null;
    this.url = null;
    this.connected = false;
    this.connecting = false;
  }

  init(url: string) {
    this.connecting = true;
    this.url = url;
    this.connect();
    console.log("Websocket initialized");
  }

  connect() {
    if (this.url === null) {
      this.connecting = false;
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      this.eventHandlers.open.forEach((handler) => handler());
      this.connected = true;
      this.connecting = false;
    });

    this.socket.addEventListener("close", () => {
      this.eventHandlers.closed.forEach((handler) => handler());
      this.connected = false;
      this.connecting = false;
    });

    this.socket.addEventListener("error", () => {
      this.eventHandlers.error.forEach((handler) => handler());
      this.connected = false;
      this.connecting = false;
    });

    this.socket.addEventListener("message", (event) => {
      this.handleMessage(event);
    });
  }

  handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data) as SocketMessage;
      console.log(data);

      // @ts-ignore
      this.eventHandlers[data.type].forEach((handler) => handler(data.payload));
    } catch {
      console.error("Failed to parse message", event.data);
    }
  }

  on(
    eventType: SocketMessageType | "open" | "closed" | "error" | "gameLeft",
    callback: (payload: string | object) => void,
  ) {
    // @ts-ignore
    this.eventHandlers[eventType].push(callback);
  }

  off(
    eventType: SocketMessageType | "open" | "closed" | "error" | "gameLeft",
    callback: (payload: string | object) => void,
  ) {
    // @ts-ignore
    this.eventHandlers[eventType] = this.eventHandlers[eventType].filter(
      (cb: (payload: string | object) => void) => cb !== callback,
    );
  }

  sendMessage(type: SocketMessageType, payload: string | object) {
    if (!this.socket) {
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    if (typeof payload === "object") {
      payload = JSON.stringify(payload);
    }

    this.socket.send(JSON.stringify({ type, payload }));
  }

  close() {
    this.socket?.close();
  }

  getRounds() {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.GET_ROUNDS,
      payload: "",
    };

    this.socket.send(JSON.stringify(data));
  }

  getConnectedPlayers() {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.GET_CONNECTED_PLAYERS,
      payload: "",
    };

    this.socket.send(JSON.stringify(data));
  }

  getAllGames() {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.GET_GAMES,
      payload: "",
    };

    this.socket.send(JSON.stringify(data));
  }

  joinGame(gameId: string) {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.JOIN_GAME,
      payload: gameId,
    };
    this.socket.send(JSON.stringify(data));
  }

  getCurrentText() {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.GET_TEXT,
      payload: "",
    };
    this.socket.send(JSON.stringify(data));
  }

  getGame() {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.GET_GAME,
      payload: "",
    };
    this.socket.send(JSON.stringify(data));
  }

  sayHello() {
    if (!this.socket) {
      return;
    }

    const name = localStorage.getItem("nickname");
    if (!name) {
      return;
    }

    const uuid = localStorage.getItem("uuid");

    const data: SocketMessage = {
      type: SocketMessageType.SAY_HELLO,
      payload: JSON.stringify({
        name,
        uuid: uuid ?? "",
      }),
    };

    this.socket.send(JSON.stringify(data));
  }

  deleteGame(gameId: string) {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.DELETE_GAME,
      payload: gameId,
    };

    this.socket.send(JSON.stringify(data));
  }

  setNick(nickname: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_NICK,
      payload: nickname,
    };

    this.socket.send(JSON.stringify(data));
  }

  setText(message: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_TEXT,
      payload: message,
    };

    this.socket.send(JSON.stringify(data));
  }

  setAnswer(answer: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER,
      payload: answer,
    };

    this.socket.send(JSON.stringify(data));
  }

  leaveGame(id: string) {
    this.eventHandlers.gameLeft.forEach((handler) => handler());

    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.LEAVE_GAME,
      payload: id,
    };

    this.socket.send(JSON.stringify(data));
  }

  setAnswerVisible(answerId: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER_VISIBLE,
      payload: answerId,
    };

    this.socket.send(JSON.stringify(data));
  }

  setAnswerInvisible(uuid: string) {
    if (!this.socket) {
      return;
    }
    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER_INVISIBLE,
      payload: uuid,
    };

    this.socket.send(JSON.stringify(data));
  }

  createGame(name: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.CREATE_GAME,
      payload: name,
    };

    this.socket.send(JSON.stringify(data));
  }

  goNextRound(gameId: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.GO_NEXT_ROUND,
      payload: JSON.stringify({
        gameId,
      }),
    };

    this.socket.send(JSON.stringify(data));
  }

  endRound() {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.END_ROUND,
      payload: "",
    };

    this.socket.send(JSON.stringify(data));
  }

  startRound() {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.START_ROUND,
      payload: "",
    };

    this.socket.send(JSON.stringify(data));
  }

  deleteAnswer(answerId: string) {
    if (!this.socket) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.DELETE_ANSWER,
      payload: answerId,
    };

    this.socket.send(JSON.stringify(data));
  }
}

export const websocket = new WebsocketWrapper();
