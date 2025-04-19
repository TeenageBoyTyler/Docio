import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { UploadProvider, useUpload } from "../../context/UploadContext";
import { useNavigation } from "../../context/NavigationContext";
import DragDropFileUpload from "./DragDropFileUpload";
import FilePreview from "./FilePreview";
// Use the original TaggingView here instead of SimpleTaggingView
import TaggingView from "./TaggingView";
import ProcessingView from "./ProcessingView";
import CloudUploadView from "./CloudUploadView";
import SuccessView from "./SuccessView";
// Standardized imports from index files
import { Icon } from "../shared/icons";
import { IconTextButton } from "../shared/buttons";
// Import transition components
import { PageTransition, useTransitionDirection } from "../shared/transitions";

// Wrapper für den Upload-Bereich mit Provider
const UploadSectionWrapper: React.FC = () => {
  return (
    <UploadProvider>
      <UploadSectionContent />
    </UploadProvider>
  );
};

// Inhalt des Upload-Bereichs (mit Zugriff auf den Kontext)
const UploadSectionContent: React.FC = () => {
  const { currentStep, files, goToNextStep, clearFiles, goToStep } =
    useUpload();
  const {
    navigateToDocuments,
    navigateToSearch,
    navigateToUploadStep,
    currentUploadStep,
  } = useNavigation();

  // Track if we're in "add more" mode
  const [isAddingMore, setIsAddingMore] = useState(false);
  const stepChangeTimestamp = useRef(Date.now());

  // Define step position map for spatial navigation
  const stepPositionMap: Record<string, number> = {
    selection: 0,
    preview: 1,
    tagging: 2,
    processing: 3,
    uploading: 4,
    success: 5,
  };

  // Use the transition direction hook to determine animation direction
  const { direction, previous } = useTransitionDirection({
    current: currentStep,
    positionMap: stepPositionMap,
  });

  // Synchronisiere Upload-Steps mit NavigationContext
  useEffect(() => {
    if (currentStep !== currentUploadStep) {
      navigateToUploadStep(currentStep);
    }

    // Update timestamp when step changes to ensure animations reset properly
    if (previous !== currentStep) {
      stepChangeTimestamp.current = Date.now();
    }
  }, [currentStep, currentUploadStep, navigateToUploadStep, previous]);

  // Handle step transitions based on files presence
  useEffect(() => {
    // Only auto-advance if we're not in "add more" mode
    if (currentStep === "selection" && files.length > 0 && !isAddingMore) {
      goToNextStep();
    }

    // Reset "add more" mode when we're no longer on the selection step
    if (currentStep !== "selection") {
      setIsAddingMore(false);
    }
  }, [currentStep, files, goToNextStep, isAddingMore]);

  // Handle "Add More" request from FilePreview
  const handleAddMore = () => {
    setIsAddingMore(true);
    goToStep("selection");
  };

  // Enhanced transition parameters based on step
  const getTransitionParams = (step: string) => {
    const baseParams = {
      transitionKey: `upload-${step}-${stepChangeTimestamp.current}`,
      direction,
      isActive: true,
    };

    // Customize transition based on step
    switch (step) {
      case "selection":
        return {
          ...baseParams,
          duration: 0.5, // slightly longer for the initial screen
          distance: 100, // more dramatic slide for entry/exit
        };
      case "preview":
        return {
          ...baseParams,
          duration: 0.4,
          distance: 80, // emphasize the grid transition
        };
      case "tagging":
        return {
          ...baseParams,
          duration: 0.45,
          distance: 90, // important step, make it noticeable
        };
      case "processing":
      case "uploading":
        return {
          ...baseParams,
          duration: 0.35,
          distance: 60, // more utilitarian steps, more subtle
        };
      case "success":
        return {
          ...baseParams,
          duration: 0.5,
          distance: 80, // celebratory final step
        };
      default:
        return {
          ...baseParams,
          duration: 0.4,
          distance: 70,
        };
    }
  };

  return (
    <Container>
      {/* Use AnimatePresence to handle component mounting/unmounting */}
      <AnimatePresence mode="wait">
        {currentStep === "selection" && (
          <PageTransition {...getTransitionParams("selection")}>
            <ContentWrapper>
              <DragDropFileUpload isAddingMore={isAddingMore} />
            </ContentWrapper>
          </PageTransition>
        )}

        {currentStep === "preview" && (
          <PageTransition {...getTransitionParams("preview")}>
            <ContentWrapper>
              <FilePreview onAddMore={handleAddMore} />
            </ContentWrapper>
          </PageTransition>
        )}

        {currentStep === "tagging" && (
          <PageTransition {...getTransitionParams("tagging")}>
            <ContentWrapper>
              {/* Use the original TaggingView component */}
              <TaggingView />
            </ContentWrapper>
          </PageTransition>
        )}

        {currentStep === "processing" && (
          <PageTransition {...getTransitionParams("processing")}>
            <ContentWrapper>
              <ProcessingView />
            </ContentWrapper>
          </PageTransition>
        )}

        {currentStep === "uploading" && (
          <PageTransition {...getTransitionParams("uploading")}>
            <ContentWrapper>
              <CloudUploadView />
            </ContentWrapper>
          </PageTransition>
        )}

        {currentStep === "success" && (
          <PageTransition {...getTransitionParams("success")}>
            <ContentWrapper>
              <SuccessView />
            </ContentWrapper>
          </PageTransition>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Ensure content is vertically centered */
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden; /* Prevent animation issues */
  position: relative; /* Ensure proper stacking of animated elements */
`;

// Add ContentWrapper to ensure consistent vertical centering
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

// Exportiere den Wrapper, der den Provider enthält
export default UploadSectionWrapper;
