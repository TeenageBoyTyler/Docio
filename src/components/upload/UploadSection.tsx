import React from "react";
import styled from "styled-components";
import { UploadProvider, useUpload } from "../../context/UploadContext";
import DragDropFileUpload from "./DragDropFileUpload";
import FilePreview from "./FilePreview";
import TaggingView from "./TaggingView";
import ProcessingView from "./ProcessingView";
import CloudUploadView from "./CloudUploadView";

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

  // Automatisch zum nächsten Schritt, wenn Dateien ausgewählt wurden
  React.useEffect(() => {
    if (currentStep === "selection" && files.length > 0) {
      goToNextStep();
    }
  }, [currentStep, files, goToNextStep]);

  // Handler für die Success-View Buttons
  const handleViewDocuments = () => {
    // In einer echten Anwendung würde dies zur Dokument-Archiv-Ansicht führen
    console.log("View documents");
    // Hier könnten wir zur Profil-Sektion navigieren
  };

  const handleUploadMore = () => {
    clearFiles();
    goToStep("selection");
  };

  // Zeige den entsprechenden Schritt basierend auf currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case "selection":
        return <DragDropFileUpload />;
      case "preview":
        return <FilePreview />;
      case "tagging":
        return <TaggingView />;
      case "processing":
        return <ProcessingView />;
      case "uploading":
        return <CloudUploadView />;
      case "success":
        return (
          <ComingSoonStep>
            <SuccessIcon>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
                  fill="currentColor"
                />
              </svg>
            </SuccessIcon>
            <StepTitle>Upload Complete!</StepTitle>
            <ActionButtons>
              <ActionButton variant="primary" onClick={handleViewDocuments}>
                View Documents
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleUploadMore}>
                Upload More
              </ActionButton>
            </ActionButtons>
          </ComingSoonStep>
        );
      default:
        return <DragDropFileUpload />;
    }
  };

  return <Container>{renderStepContent()}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.surface};
`;

// Styled Components für die "Coming Soon" Schritte
const ComingSoonStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
`;

const ProcessingIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SuccessIcon = styled.div`
  color: ${(props) => props.theme.colors.success};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const StepTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xxl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.primary};
`;

const StepDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  max-width: 500px;
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

interface ActionButtonProps {
  variant: "primary" | "secondary";
}

const ActionButton = styled.button<ActionButtonProps>`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};

  background-color: ${(props) =>
    props.variant === "primary" ? props.theme.colors.primary : "transparent"};

  color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.background
      : props.theme.colors.text.primary};

  border: ${(props) =>
    props.variant === "primary"
      ? "none"
      : `1px solid ${props.theme.colors.divider}`};

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary"
        ? `${props.theme.colors.primary}CC`
        : props.theme.colors.background};
  }
`;

export default UploadSectionWrapper;
