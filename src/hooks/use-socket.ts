import { SocketContext } from "@/lib/socket";
import { useContext } from "react";

export function useSocket() {
  return useContext(SocketContext);
}
