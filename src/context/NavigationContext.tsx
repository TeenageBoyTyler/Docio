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

  // Navigation confirmation
  showNavigationConfirmation: boolean;
  setShowNavigationConfirmation: (show: boolean) => void;
  pendingNavigation: ActiveSection | null;
  setPendingNavigation: (section: ActiveSection | null) => void;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
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

  // Navigation confirmation state
  const [showNavigationConfirmation, setShowNavigationConfirmation] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<ActiveSection | null>(null);

  // Confirm pending navigation
  const confirmNavigation = useCallback(() => {
    console.log("Confirming navigation to:", pendingNavigation);

    // Make sure we update state in the correct order
    if (pendingNavigation) {
      // First hide the dialog
      setShowNavigationConfirmation(false);

      // Store the navigation target in a local variable to avoid closure issues
      const targetSection = pendingNavigation;

      // Then perform the actual navigation with a small delay to allow UI to update
      setTimeout(() => {
        console.log("Now navigating to:", targetSection);
        setActiveSection(targetSection);

        // Reset steps if needed
        if (targetSection === "search") {
          setCurrentSearchStep("input");
        } else if (targetSection === "profile") {
          setCurrentProfileView("home");
        }

        // Clear pending navigation last
        setPendingNavigation(null);
      }, 100); // Slightly longer delay
    } else {
      setShowNavigationConfirmation(false);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, setCurrentSearchStep, setCurrentProfileView]);

  // Cancel pending navigation
  const cancelNavigation = useCallback(() => {
    console.log("Cancelling navigation");

    // First hide the dialog
    setShowNavigationConfirmation(false);

    // Then clear the pending navigation after a short delay
    setTimeout(() => {
      console.log("Clearing pending navigation");
      setPendingNavigation(null);
    }, 100);
  }, []);

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
    showNavigationConfirmation,
    setShowNavigationConfirmation,
    pendingNavigation,
    setPendingNavigation,
    confirmNavigation,
    cancelNavigation,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
