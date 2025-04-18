// src/App.tsx
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";
import ToastProvider from "./context/ToastContext";
import UploadProvider from "./context/UploadContext";
import SearchProvider from "./context/SearchContext";
import ProfileProvider from "./context/ProfileContext";
import { NavigationProvider } from "./context/NavigationContext";
import MainLayout from "./components/layouts/MainLayout"; // Importiere das MainLayout
import AuthCallback from "./components/auth/AuthCallback";
import OfflineIndicator from "./components/common/OfflineIndicator";
import LoadingDemo from "./components/demo/LoadingDemo";
import EmptyDemo from "./components/demo/EmptyDemo";
import InputDemo from "./components/demo/InputDemo";
import ButtonDemo from "./components/demo/ButtonDemo";
import NavigationDemo from "./components/demo/NavigationDemo";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ToastProvider>
          <NavigationProvider>
            <UploadProvider>
              <SearchProvider>
                <ProfileProvider>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <MainContainer>
                          <OfflineIndicator />
                          <MainLayout />
                        </MainContainer>
                      }
                    />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/demo/loading" element={<LoadingDemo />} />
                    <Route path="/demo/empty" element={<EmptyDemo />} />
                    <Route path="/demo/input" element={<InputDemo />} />
                    <Route path="/demo/button" element={<ButtonDemo />} />
                    <Route
                      path="/demo/navigation"
                      element={<NavigationDemo />}
                    />
                    {/* Neue Route */}
                  </Routes>
                </ProfileProvider>
              </SearchProvider>
            </UploadProvider>
          </NavigationProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const MainContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.primary};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export default App;
