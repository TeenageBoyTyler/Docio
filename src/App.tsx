import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";
import MainLayout from "./components/layouts/MainLayout";
import AuthCallback from "./components/auth/AuthCallback";
import { ToastProvider } from "./context/ToastContext";
import { SearchProvider } from "./context/SearchContext";
import { UploadProvider } from "./context/UploadContext";
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <UploadProvider>
          <SearchProvider>
            <ProfileProvider>
              <GlobalStyles />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </BrowserRouter>
            </ProfileProvider>
          </SearchProvider>
        </UploadProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
