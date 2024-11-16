import { toast } from "sonner";
import {
  Answer,
  Game,
  gateway,
  Player,
  GameRound,
  SocketMessage,
  SocketMessageType,
} from "@/lib/definitions";
import { SocketContext } from "@/lib/socket";
import { ReactNode, useEffect, useState } from "react";

const ws = new WebSocket(`${gateway}/ws`);

function getRounds() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_ROUNDS,
    payload: "",
  };

  ws.send(JSON.stringify(data));
}

function getRound() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_ROUND,
    payload: "",
  };

  ws.send(JSON.stringify(data));
}

function getConnectedPlayers() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_CONNECTED_PLAYERS,
    payload: "",
  };

  ws.send(JSON.stringify(data));
}

function getAllGames() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_GAMES,
    payload: "",
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

function getGame() {
  const data: SocketMessage = {
    type: SocketMessageType.GET_GAME,
    payload: "",
  };
  ws.send(JSON.stringify(data));
}

function sayHello() {
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

  ws.send(JSON.stringify(data));
}

function deleteGame(gameId: string) {
  const data: SocketMessage = {
    type: SocketMessageType.DELETE_GAME,
    payload: gameId,
  };

  ws.send(JSON.stringify(data));
}

export function SockerProvider({ children }: { children: ReactNode }) {
  const [uuid, setUuid] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") ?? "",
  );
  const [round, setRound] = useState<GameRound | null>(null);
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [rounds, setRounds] = useState<GameRound[]>([]);

  useEffect(() => {
    const uuidItem = localStorage.getItem("uuid");
    if (uuidItem) {
      if (uuidItem.includes("-")) {
        localStorage.removeItem("uuid");
        return;
      }
      setUuid(uuidItem);
    }

    const nickItem = localStorage.getItem("nickname");
    if (nickItem) {
      setNickname(nickItem);
    }
  }, [connected]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);

      console.log("onConnect", nickname);
      if (nickname) {
        sayHello();
      }
    }

    function close() {
      setConnected(false);
      setGame(null);
      setAllAnswers([]);
      setCurrentText("");
      setConnectedPlayers([]);
    }

    function onDisconnect() {
      console.log("disconnected");
      close();
    }

    function onError() {
      console.log("error");
      close();
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

          if (game !== null) {
            joinGame(game.id);
          }
          break;
        case SocketMessageType.PLAYER_DISCONNECTED: {
          const disconnectedPlayer = JSON.parse(
            data.payload as string,
          ) as Player;
          setConnectedPlayers((prev) =>
            prev.filter((x) => x.id !== disconnectedPlayer.id),
          );
          toast(`${disconnectedPlayer.nickname} hat das Spiel verlassen`);
          break;
        }
        case SocketMessageType.ALL_ANSWERS:
          setAllAnswers(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.SET_UUID:
          localStorage.setItem("uuid", data.payload as string);
          setUuid(data.payload as string);
          break;
        case SocketMessageType.GET_GAMES:
          setGames(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.GET_ROUND:
          setRound(JSON.parse(data.payload as string));
          toast("Eine neue Runde wurde gestartet");
          break;
        case SocketMessageType.GET_ROUNDS:
          setRounds(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.PLAYER_CONNECTED: {
          const connectedPlayer = JSON.parse(data.payload as string) as Player;
          setConnectedPlayers((prev) => {
            const index = prev.findIndex((x) => x.id === connectedPlayer.id);
            if (index === -1) {
              return [...prev, connectedPlayer];
            }

            return prev;
          });
          toast(`${connectedPlayer.nickname} hat das Spiel betreten`);
          break;
        }
        case SocketMessageType.SET_TEXT: {
          setCurrentText(data.payload as string);
          toast("Ein neuer Text wurde gesetzt");
          break;
        }
        case SocketMessageType.SET_NICK_SUCCESS:
          localStorage.setItem("nickname", data.payload as string);
          setNickname(data.payload as string);
          break;
        case SocketMessageType.GET_GAME:
          setGame(JSON.parse(data.payload as string));
          toast("Du bist dem Spiel beigetreten");
          break;
        case SocketMessageType.LEAVE_GAME:
          setConnectedPlayers((prev) =>
            prev.filter((user) => user.id !== data.payload),
          );
          toast("Du hast das Spiel verlassen");
          break;
        case SocketMessageType.CREATE_GAME: {
          const game = JSON.parse(data.payload as string) as Game;
          setGame(game);
          getRound();
          getRounds();
          getAllGames();
          toast("Ein neues Spiel wurde erstellt");
          break;
        }
        case SocketMessageType.GAME_DELETED: {
          const id = data.payload as string;
          if (game !== null && game.id === id) {
            setGame(null);
            setRound(null);
            setAllAnswers([]);
            setCurrentText("");
            setConnectedPlayers([]);
            setRounds([]);
            setGames([]);
            toast("Das Spiel wurde gelöscht");
          }
          break;
        }
        case SocketMessageType.ERROR:
          console.error(data.payload);
          break;
        case SocketMessageType.GET_CONNECTED_PLAYERS:
          setConnectedPlayers(JSON.parse(data.payload as string));
          break;
        case SocketMessageType.JOIN_GAME: {
          if (data.payload === "false") {
            setGame(null);
            return;
          }

          const game = JSON.parse(data.payload as string) as Game;
          setGame(game);
          getAllGames();
          getConnectedPlayers();
          getCurrentText();
          getRound();
          getRounds();
          getGame();

          toast("Du bist dem Spiel beigetreten");

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
  }, [game, nickname, uuid]);

  function setNick(nickname: string) {
    localStorage.setItem("nickname", nickname);
    setNickname(nickname);
  }

  function setText(message: string) {
    if (!connected) {
      return;
    }

    if (!game) {
      return;
    }

    if (!round) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_TEXT,
      payload: message,
    };

    ws.send(JSON.stringify(data));
  }

  function setAnswer(answer: string) {
    if (!connected) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER,
      payload: answer,
    };

    ws.send(JSON.stringify(data));
  }

  function leaveGame() {
    if (!connected) {
      return;
    }

    if (!game) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.LEAVE_GAME,
      payload: game.id,
    };

    ws.send(JSON.stringify(data));
    setGame(null);
    setRound(null);
    setAllAnswers([]);
    setCurrentText("");
    setConnectedPlayers([]);
    setRounds([]);
    setGames([]);
  }

  function reconnect() {
    window.location.reload();
  }

  function setAnswerVisible(answerId: string) {
    if (!connected) {
      return;
    }

    if (!game) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER_VISIBLE,
      payload: answerId,
    };

    ws.send(JSON.stringify(data));
  }

  function setAnswerInvisible(uuid: string) {
    const data: SocketMessage = {
      type: SocketMessageType.SET_ANSWER_INVISIBLE,
      payload: uuid,
    };

    ws.send(JSON.stringify(data));
  }

  function createGame(name: string) {
    const data: SocketMessage = {
      type: SocketMessageType.CREATE_GAME,
      payload: name,
    };

    ws.send(JSON.stringify(data));
  }

  function goNextRound() {
    if (!game) {
      return;
    }

    if (!round) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.GO_NEXT_ROUND,
      payload: JSON.stringify({
        gameId: game.id,
        roundId: round.id,
      }),
    };

    ws.send(JSON.stringify(data));
  }

  function endRound() {
    if (!game) {
      return;
    }

    if (!round) {
      return;
    }

    if (round.ended) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.END_ROUND,
      payload: "",
    };

    ws.send(JSON.stringify(data));
  }

  function startRound() {
    if (!game) {
      return;
    }

    if (!round) {
      return;
    }

    if (round.started) {
      return;
    }

    const data: SocketMessage = {
      type: SocketMessageType.START_ROUND,
      payload: "",
    };

    ws.send(JSON.stringify(data));
  }

  function deleteAnswer(answerId: string) {
    const data: SocketMessage = {
      type: SocketMessageType.DELETE_ANSWER,
      payload: answerId,
    };

    ws.send(JSON.stringify(data));
  }

  return (
    <SocketContext.Provider
      value={{
        deleteAnswer,
        startRound,
        createGame,
        game,
        goNextRound,
        round,
        rounds,
        connected,
        games,
        setAnswerInvisible,
        setAnswerVisible,
        reconnect,
        leaveGame,
        setNickname: setNick,
        sayHello,
        nickname,
        uuid,
        joinGame,
        connectedPlayers,
        endRound,
        currentText,
        setText,
        setAnswer,
        deleteGame,
        allAnswers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
