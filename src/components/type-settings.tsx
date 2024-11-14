import { useSocket } from "@/hooks/use-socket";
import { Button } from "./ui/button";

export function TypeSettings() {
  const { updateCanType, canType } = useSocket();

  function toggleCanType() {
    updateCanType(!canType);
  }

  return (
    <div className="flex flex-row items-center flex-nowrap gap-4">
      <p>
        {canType ? (
          "man kann tippen"
        ) : (
          <span>
            man kann <span className="text-red-500">nicht</span> tippen
          </span>
        )}
      </p>
      <Button size="sm" onClick={toggleCanType}>
        {canType ? "Deaktivieren" : "Aktivieren"}
      </Button>
    </div>
  );
}
