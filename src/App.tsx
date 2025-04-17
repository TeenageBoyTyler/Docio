import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";
import MainLayout from "./components/layouts/MainLayout";
import AuthCallback from "./components/auth/AuthCallback";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
