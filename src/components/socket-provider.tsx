import {
  Answer,
  Game,
  Player,
  GameRound,
  SocketMessageType,
  gateway,
} from "@/lib/definitions";
import { SocketContext } from "@/lib/socket";
import { ReactNode, useEffect, useState } from "react";
import { websocket } from "@/lib/websocket";

export function SocketProvider({ children }: { children: ReactNode }) {
  const [uuid, setUuid] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") ?? "",
  );
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [rounds, setRounds] = useState<GameRound[]>([]);

  useEffect(() => {
    const uuidItem = localStorage.getItem("uuid");
    if (uuidItem) {
      if (!uuidItem.includes("-")) {
        localStorage.removeItem("uuid");
        document.cookie = "uuid=; SameSite=Strict; Secure;";
        return;
      }
      setUuid(uuidItem);
      document.cookie = `uuid=${uuidItem}; SameSite=Strict; Secure;`;
    }

    const nickItem = localStorage.getItem("nickname");
    if (nickItem) {
      setNickname(nickItem);
    }
  }, []);

  useEffect(() => {
    if (nickname.length > 0 && !websocket.connected && !websocket.connecting) {
      websocket.init(`${gateway}/ws`);
    }

    function onNickRequest() {
      if (nickname) {
        websocket.setNick(nickname);
      }

      if (game !== null) {
        websocket.joinGame(game.id);
      }
    }

    function onPlayerDisconnected(payload: string | object) {
      const disconnectedPlayer = JSON.parse(payload as string) as Player;
      setConnectedPlayers((prev) =>
        prev.filter((x) => x.id !== disconnectedPlayer.id),
      );
    }

    function onAllAnswers(payload: string | object) {
      setAllAnswers(JSON.parse(payload as string));
    }

    function onSetUuid(payload: string | object) {
      localStorage.setItem("uuid", payload as string);
      document.cookie = `uuid=${payload}; SameSite=Strict; Secure;`;
      setUuid(payload as string);
    }

    function onGetGames(payload: string | object) {
      setGames(JSON.parse(payload as string));
    }

    function onGetRounds(payload: string | object) {
      setRounds(JSON.parse(payload as string));
    }

    function onPlayerConnected(payload: string | object) {
      const connectedPlayer = JSON.parse(payload as string) as Player;
      setConnectedPlayers((prev) => {
        const index = prev.findIndex((x) => x.id === connectedPlayer.id);
        if (index === -1) {
          return [...prev, connectedPlayer];
        }

        return prev;
      });
    }

    function onSetText(payload: string | object) {
      setCurrentText(payload as string);
    }

    function onSetNickSuccess(payload: string | object) {
      localStorage.setItem("nickname", payload as string);
      setNickname(payload as string);
    }

    function onGetGame(payload: string | object) {
      setGame(JSON.parse(payload as string));
    }

    function onLeaveGame(payload: string | object) {
      setConnectedPlayers((prev) => prev.filter((user) => user.id !== payload));
    }

    function onGameDeleted(payload: string | object) {
      const id = payload as string;
      if (game !== null && game.id === id) {
        setGame(null);
        setAllAnswers([]);
        setCurrentText("");
        setConnectedPlayers([]);
        setRounds([]);
        setGames([]);
      }
    }

    function onGetConnectedPlayers(payload: string | object) {
      setConnectedPlayers(JSON.parse(payload as string));
    }

    function onJoinGame(payload: string | object) {
      if (payload === "false") {
        setGame(null);
        return;
      }

      const game = JSON.parse(payload as string) as Game;
      setGame(game);
      websocket.getAllGames();
      websocket.getConnectedPlayers();
      websocket.getCurrentText();
      websocket.getRounds();
      websocket.getGame();
    }

    function onOpen() {
      setConnected(true);
      if (nickname) {
        websocket.sayHello();
      }
    }

    function onClose() {
      setConnected(false);
      setGame(null);
      setAllAnswers([]);
      setCurrentText("");
      setConnectedPlayers([]);
    }

    function onGameLeft() {
      setGame(null);
      setAllAnswers([]);
      setCurrentText("");
      setConnectedPlayers([]);
      setRounds([]);
      setGames([]);
    }

    websocket.on("open", onOpen);
    websocket.on("closed", onClose);
    websocket.on("error", onClose);
    websocket.on("gameLeft", onGameLeft);
    websocket.on(SocketMessageType.GET_GAME, onGetGame);
    websocket.on(SocketMessageType.GAME_DELETED, onGameDeleted);
    websocket.on(
      SocketMessageType.GET_CONNECTED_PLAYERS,
      onGetConnectedPlayers,
    );
    websocket.on(SocketMessageType.JOIN_GAME, onJoinGame);
    websocket.on(SocketMessageType.LEAVE_GAME, onLeaveGame);
    websocket.on(SocketMessageType.SET_NICK_SUCCESS, onSetNickSuccess);
    websocket.on(SocketMessageType.SET_TEXT, onSetText);
    websocket.on(SocketMessageType.PLAYER_CONNECTED, onPlayerConnected);
    websocket.on(SocketMessageType.GET_ROUNDS, onGetRounds);
    websocket.on(SocketMessageType.GET_GAMES, onGetGames);
    websocket.on(SocketMessageType.ALL_ANSWERS, onAllAnswers);
    websocket.on(SocketMessageType.PLAYER_DISCONNECTED, onPlayerDisconnected);
    websocket.on(SocketMessageType.SET_UUID, onSetUuid);
    websocket.on(SocketMessageType.NICK_REQUEST, onNickRequest);

    return () => {
      websocket.off("open", onOpen);
      websocket.off("closed", onClose);
      websocket.off("error", onClose);
      websocket.off("gameLeft", onGameLeft);
      websocket.off(SocketMessageType.JOIN_GAME, onJoinGame);
      websocket.off(
        SocketMessageType.GET_CONNECTED_PLAYERS,
        onGetConnectedPlayers,
      );
      websocket.off(SocketMessageType.GAME_DELETED, onGameDeleted);
      websocket.off(SocketMessageType.LEAVE_GAME, onLeaveGame);
      websocket.off(SocketMessageType.GET_GAME, onGetGame);
      websocket.off(SocketMessageType.SET_NICK_SUCCESS, onSetNickSuccess);
      websocket.off(SocketMessageType.SET_TEXT, onSetText);
      websocket.off(SocketMessageType.PLAYER_CONNECTED, onPlayerConnected);
      websocket.off(SocketMessageType.GET_ROUNDS, onGetRounds);
      websocket.off(SocketMessageType.GET_GAMES, onGetGames);
      websocket.off(SocketMessageType.ALL_ANSWERS, onAllAnswers);
      websocket.off(
        SocketMessageType.PLAYER_DISCONNECTED,
        onPlayerDisconnected,
      );
      websocket.off(SocketMessageType.SET_UUID, onSetUuid);
      websocket.off(SocketMessageType.NICK_REQUEST, onNickRequest);
    };
  }, [connected, game, nickname]);

  function setNick(nickname: string) {
    localStorage.setItem("nickname", nickname);
    setNickname(nickname);
  }

  function reconnect() {
    window.location.reload();
  }

  return (
    <SocketContext.Provider
      value={{
        setUuid,
        game,
        rounds,
        connected,
        games,
        reconnect,
        setNickname: setNick,
        nickname,
        uuid,
        connectedPlayers,
        currentText,
        allAnswers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
