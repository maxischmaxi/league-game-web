import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EnterGame } from "./components/enter-game";
import { Toaster } from "./components/ui/toaster";
import { CreateGame } from "./components/create-game";

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <main className="h-screen w-screen flex flex-row gap-8 justify-center items-center">
          <CreateGame />
          <EnterGame />
        </main>
        <div className="fixed bottom-8 right-8">
          <ModeToggle />
        </div>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
