import { ThemeProvider } from "./components/themeProvider";
import { Router } from "./router";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="chat-app-theme">
      <Router />
    </ThemeProvider>
  );
}

export default App;
