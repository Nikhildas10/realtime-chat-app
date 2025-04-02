import { ThemeProvider } from "./components/themeProvider";
import { Router } from "./router";
import { Toaster } from "sonner";
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="chat-app-theme">
      <Router />
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}

export default App;
