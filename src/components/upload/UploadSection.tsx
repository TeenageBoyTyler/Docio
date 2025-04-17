import React from "react";
import styled from "styled-components";
import { UploadProvider, useUpload } from "../../context/UploadContext";
import DragDropFileUpload from "./DragDropFileUpload";
import FilePreview from "./FilePreview";
import TaggingView from "./TaggingView";

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
  const { currentStep, files, goToNextStep } = useUpload();

  // Automatisch zum nächsten Schritt, wenn Dateien ausgewählt wurden
  React.useEffect(() => {
    if (currentStep === "selection" && files.length > 0) {
      goToNextStep();
    }
  }, [currentStep, files, goToNextStep]);

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
        return (
          <ComingSoonStep>
            <ProcessingIcon>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="currentColor"
                />
                <path d="M12 6V12L16 14" fill="currentColor" />
              </svg>
            </ProcessingIcon>
            <StepTitle>Processing Documents</StepTitle>
            <StepDescription>
              This step will extract text and recognize content in your images.
            </StepDescription>
          </ComingSoonStep>
        );
      case "uploading":
        return (
          <ComingSoonStep>
            <ProcessingIcon>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z"
                  fill="currentColor"
                />
              </svg>
            </ProcessingIcon>
            <StepTitle>Uploading to Cloud Storage</StepTitle>
            <StepDescription>
              Your documents are being securely stored in your cloud storage.
            </StepDescription>
          </ComingSoonStep>
        );
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
            <StepDescription>
              Your documents have been successfully uploaded and processed.
            </StepDescription>
            <ActionButtons>
              <ActionButton variant="primary">View Documents</ActionButton>
              <ActionButton variant="secondary">Upload More</ActionButton>
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
