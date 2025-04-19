// src/App.tsx
import React from "react";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthCallback from "./components/auth/AuthCallback";
import GlobalStyles from "./styles/globalStyles"; // Changed from named import to default import
import { theme } from "./styles/theme";

// Import providers
import { ToastProvider } from "./context/ToastContext";
import { NavigationProvider } from "./context/NavigationContext";
import ProfileProvider from "./context/ProfileContext";
import UploadProvider from "./context/UploadContext";
import SearchProvider from "./context/SearchContext";

// Import TagSynchronizer for tag coordination between contexts
import TagSynchronizer from "./components/shared/tags/TagSynchronizer";

// Import any required polyfills or utils
import "./index.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      {/* Context providers in proper order:
          1. ToastProvider - for notifications
          2. NavigationProvider - for app navigation
          3. ProfileProvider - contains tag management (source of truth)
          4. UploadProvider - needs tags from ProfileProvider
          5. SearchProvider - needs tags from ProfileProvider
      */}
      <ToastProvider>
        <NavigationProvider>
          <ProfileProvider>
            <UploadProvider>
              <SearchProvider>
                {/* Add TagSynchronizer to coordinate tags between contexts */}
                <TagSynchronizer />

                <Router>
                  <Routes>
                    <Route path="/" element={<MainLayout />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </SearchProvider>
            </UploadProvider>
          </ProfileProvider>
        </NavigationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
