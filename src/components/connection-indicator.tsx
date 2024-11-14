import { useGame } from "@/hooks/use-game";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function ConnectionIndicator() {
  const { connected } = useSocket();
  const { uuid, nickname } = useGame();

  return (
    <div className="flex flex-row flex-nowrap gap-4 ml-auto items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "py-1 px-2 rounded-full text-secondary-foreground text-xs flex justify-center items-center",
                connected ? "bg-green-600" : "bg-secondary",
              )}
            >
              {nickname}
            </div>
          </TooltipTrigger>
          <TooltipContent className="mr-8">
            <p>Verbindungsstatus: {connected ? "Verbunden" : "Getrennt"}</p>
            <p>UUID: {uuid}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
