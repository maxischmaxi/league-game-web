import { useGame } from "@/hooks/use-game";
import {
  Answer,
  gateway,
  Player,
  SetAnswerMessage,
  SetTextMessage,
  SocketMessage,
  SocketMessageType,
} from "@/lib/definitions";
import { SocketContext } from "@/lib/socket";
import { ReactNode, useEffect, useState } from "react";

const ws = new WebSocket(`${gateway}/ws`);

function getCanType() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_CAN_TYPE,
    payload: "",
  };

  ws.send(JSON.stringify(data));
}

function getConnectedUsers() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_CONNECTED_USERS,
    payload: "",
  };

  ws.send(JSON.stringify(data));
}

function sayHello() {
  const uuid = localStorage.getItem("uuid");
  if (!uuid) {
    return;
  }

  const data: SocketMessage = {
    type: SocketMessageType.SAY_HELLO,
    payload: uuid,
  };
  ws.send(JSON.stringify(data));
}

function joinGame(gameId: string) {
  const data: SocketMessage = {
    type: SocketMessageType.JOIN_GAME,
    payload: gameId,
  };
  ws.send(JSON.stringify(data));
}

function getCurrentText() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_TEXT,
    payload: "",
  };
  ws.send(JSON.stringify(data));
}

export function SockerProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const { nickname, setNickname, uuid } = useGame();
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [canType, setCanType] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<Player[]>([]);
  const [gameId, setGameId] = useState<string | null>(
    localStorage.getItem("game-id") ?? null,
  );

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      sayHello();
    }

    function onDisconnect() {
      console.log("disconnected");
      setConnected(false);
    }

    function onError() {
      console.log("error");
      setConnected(false);
    }

    function onMessage(event: MessageEvent) {
      const data = JSON.parse(event.data) as SocketMessage;
      switch (data.type) {
        case SocketMessageType.NICK_REQUEST:
          if (nickname) {
            const data: SocketMessage = {
              type: SocketMessageType.SET_NICK,
              payload: nickname,
            };

            ws.send(JSON.stringify(data));
          }

          if (gameId !== null) {
            joinGame(gameId);
          }
          break;
        case SocketMessageType.PLAYER_DISCONNECTED: {
          const disconnectedUser = JSON.parse(data.payload as string) as {
            uuid: string;
            nickname: string;
            gameId: string;
          };
          setConnectedUsers((prev) => {
            return prev.filter((x) => x.uuid !== disconnectedUser.uuid);
          });
          break;
        }
        case SocketMessageType.ALL_ANSWERS:
          setAllAnswers(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.PLAYER_CONNECTED: {
          const connectedUser = JSON.parse(data.payload as string) as {
            uuid: string;
            nickname: string;
            gameId: string;
          };
          setConnectedUsers((prev) => {
            const index = prev.findIndex((x) => x.uuid === connectedUser.uuid);
            if (index === -1) {
              return [...prev, connectedUser];
            }

            return prev;
          });
          break;
        }
        case SocketMessageType.TEXT_UPDATE: {
          const x = JSON.parse(data.payload as string) as SetTextMessage;
          setCurrentText(() => {
            return x.text;
          });
          break;
        }
        case SocketMessageType.SET_NICK_SUCCESS:
          setNickname(data.payload as string);
          break;
        case SocketMessageType.CAN_TYPE: {
          if (!gameId) {
            setCanType(false);
            return;
          }

          const ids = JSON.parse(data.payload as string) as string[];
          setCanType(ids.includes(gameId));
          break;
        }
        case SocketMessageType.ERROR:
          console.error(data.payload);
          break;
        case SocketMessageType.GET_CONNECTED_USERS_RESPONSE:
          setConnectedUsers(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.JOIN_GAME: {
          const gameId = data.payload as string;
          if (gameId === "false") {
            localStorage.removeItem("game-id");
            setGameId(null);
            return;
          }

          localStorage.setItem("game-id", gameId);
          setGameId(gameId);
          getConnectedUsers();
          getCanType();
          getCurrentText();
          break;
        }
        default:
          break;
      }
    }

    ws.addEventListener("open", onConnect);
    ws.addEventListener("close", onDisconnect);
    ws.addEventListener("error", onError);
    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onConnect);
      ws.removeEventListener("close", onDisconnect);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("message", onMessage);
    };
  }, [gameId, nickname, setNickname, uuid]);

  function setNick(nickname: string) {
    if (!connected) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_NICK,
      payload: nickname,
    };

    ws.send(JSON.stringify(data));
  }

  function setText(gameId: string, message: string) {
    if (!connected) {
      return;
    }

    const payload: SetTextMessage = {
      text: message,
      gameId,
    };

    const data: SocketMessage = {
      type: SocketMessageType.SET_TEXT,
      payload: JSON.stringify(payload),
    };

    ws.send(JSON.stringify(data));
  }

  function setAnswer(gameId: string, answer: string) {
    if (!connected) {
      return;
    }

    const payload: SetAnswerMessage = {
      answer,
      gameId,
    };

    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER,
      payload: JSON.stringify(payload),
    };

    ws.send(JSON.stringify(data));
  }

  function updateCanType(value: boolean) {
    if (!connected) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.CAN_TYPE,
      payload: String(value),
    };

    ws.send(JSON.stringify(data));
  }

  function leaveGame() {
    localStorage.removeItem("game-id");
    setGameId(null);

    if (!connected) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.LEAVE_GAME,
      payload: "",
    };

    ws.send(JSON.stringify(data));
  }

  return (
    <SocketContext.Provider
      value={{
        connected,
        leaveGame,
        setNickname: setNick,
        joinGame,
        canType,
        connectedUsers,
        currentText,
        setText,
        setAnswer,
        updateCanType,
        allAnswers,
        gameId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
