import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { UploadProvider, useUpload } from "../../context/UploadContext";
import { useNavigation } from "../../context/NavigationContext";
import DragDropFileUpload from "./DragDropFileUpload";
import FilePreview from "./FilePreview";
import TaggingView from "./TaggingView";
import ProcessingView from "./ProcessingView";
import CloudUploadView from "./CloudUploadView";
import SuccessView from "./SuccessView";
// Standardized imports from index files
import { Icon } from "../shared/icons";
import { IconTextButton } from "../shared/buttons";

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

  // Synchronisiere Upload-Steps mit NavigationContext
  useEffect(() => {
    if (currentStep !== currentUploadStep) {
      navigateToUploadStep(currentStep);
    }
  }, [currentStep, currentUploadStep, navigateToUploadStep]);

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

  // Zeige den entsprechenden Schritt basierend auf currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case "selection":
        return <DragDropFileUpload isAddingMore={isAddingMore} />;
      case "preview":
        return <FilePreview onAddMore={handleAddMore} />;
      case "tagging":
        return <TaggingView />;
      case "processing":
        return <ProcessingView />;
      case "uploading":
        return <CloudUploadView />;
      case "success":
        return <SuccessView />;
      default:
        return <DragDropFileUpload isAddingMore={isAddingMore} />;
    }
  };

  return <Container>{renderStepContent()}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: transparent; /* Vom übergeordneten Element übernehmen */
`;

export default UploadSectionWrapper;
