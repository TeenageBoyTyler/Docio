// src/context/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { ActiveSection } from "../components/layouts/MainLayout";

// Definiere die Typen für die verschiedenen Bereiche
export type ProfileView = "home" | "documents" | "tags" | "settings";
export type UploadStep =
  | "selection"
  | "preview"
  | "tagging"
  | "processing"
  | "uploading"
  | "success";
export type SearchStep = "input" | "results" | "actions" | "pdfCreation";

interface NavigationContextType {
  // Hauptnavigation
  activeSection: ActiveSection;
  navigateTo: (section: ActiveSection) => void;

  // Profile-Bereich
  currentProfileView: ProfileView;
  navigateToProfileView: (view: ProfileView) => void;

  // Upload-Bereich
  currentUploadStep: UploadStep;
  navigateToUploadStep: (step: UploadStep) => void;

  // Search-Bereich
  currentSearchStep: SearchStep;
  navigateToSearchStep: (step: SearchStep) => void;

  // Verknüpfungsnavigation
  navigateToDocuments: () => void;
  navigateToUpload: () => void;
  navigateToSearch: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  // Hauptnavigation
  const [activeSection, setActiveSection] = useState<ActiveSection>("upload");

  // Zustand für die verschiedenen Bereiche
  const [currentProfileView, setCurrentProfileView] =
    useState<ProfileView>("home");
  const [currentUploadStep, setCurrentUploadStep] =
    useState<UploadStep>("selection");
  const [currentSearchStep, setCurrentSearchStep] =
    useState<SearchStep>("input");

  // Navigationshandler
  const navigateTo = useCallback((section: ActiveSection) => {
    setActiveSection(section);
  }, []);

  const navigateToProfileView = useCallback(
    (view: ProfileView) => {
      if (activeSection !== "profile") {
        setActiveSection("profile");
      }
      setCurrentProfileView(view);
    },
    [activeSection]
  );

  const navigateToUploadStep = useCallback(
    (step: UploadStep) => {
      if (activeSection !== "upload") {
        setActiveSection("upload");
      }
      setCurrentUploadStep(step);
    },
    [activeSection]
  );

  const navigateToSearchStep = useCallback(
    (step: SearchStep) => {
      if (activeSection !== "search") {
        setActiveSection("search");
      }
      setCurrentSearchStep(step);
    },
    [activeSection]
  );

  // Verknüpfungsnavigation
  const navigateToDocuments = useCallback(() => {
    navigateToProfileView("documents");
  }, [navigateToProfileView]);

  const navigateToUpload = useCallback(() => {
    navigateTo("upload");
    setCurrentUploadStep("selection");
  }, [navigateTo]);

  const navigateToSearch = useCallback(() => {
    navigateTo("search");
    setCurrentSearchStep("input");
  }, [navigateTo]);

  const value = {
    activeSection,
    navigateTo,
    currentProfileView,
    navigateToProfileView,
    currentUploadStep,
    navigateToUploadStep,
    currentSearchStep,
    navigateToSearchStep,
    navigateToDocuments,
    navigateToUpload,
    navigateToSearch,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
