import { useEffect, useState } from "react";
import { v4 } from "uuid";

type GameStore = {
  uuid: string;
  nickname: string;
  setNickname: (nickname: string) => void;
};

export function useGame(): GameStore {
  const [uuid, setUuid] = useState(v4());
  const [nickname, setNick] = useState("");

  useEffect(() => {
    const uuidItem = localStorage.getItem("uuid");
    if (uuidItem) {
      setUuid(uuidItem);
    } else {
      localStorage.setItem("uuid", uuid);
    }

    const nickItem = localStorage.getItem("nickname");
    if (nickItem) {
      setNick(nickItem);
    }
  }, [uuid]);

  function setNickname(nickname: string): void {
    localStorage.setItem("nickname", nickname);
    setNick(nickname);
  }

  return {
    uuid,
    nickname,
    setNickname,
  };
}
