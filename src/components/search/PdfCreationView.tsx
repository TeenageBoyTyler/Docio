import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSearch } from "../../context/SearchContext";

const PdfCreationView: React.FC = () => {
  const {
    selectedDocuments,
    createPdf,
    goToPreviousStep,
    isLoading,
    goToStep,
  } = useSearch();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  // PDF erstellen, wenn die Komponente geladen wird
  useEffect(() => {
    const generatePdf = async () => {
      try {
        const url = await createPdf(orientation);
        setPdfUrl(url);
      } catch (err) {
        setError("PDF konnte nicht erstellt werden");
        console.error("PDF creation error:", err);
      }
    };

    if (selectedDocuments.length > 0 && !pdfUrl) {
      generatePdf();
    }
  }, [selectedDocuments, createPdf, orientation, pdfUrl]);

  // Wenn keine Dokumente ausgewählt sind, zurück zur Auswahl
  useEffect(() => {
    if (selectedDocuments.length === 0) {
      goToStep("results");
    }
  }, [selectedDocuments, goToStep]);

  // Handler für den Download-Button
  const handleDownload = () => {
    if (pdfUrl) {
      // In einer echten Implementierung würde hier der Download gestartet
      window.open(pdfUrl, "_blank");
    }
  };

  // Handler für "Neue Suche starten"
  const handleNewSearch = () => {
    goToStep("input");
  };

  // Render-Logik basierend auf dem Zustand
  const renderContent = () => {
    if (isLoading) {
      return (
        <ProcessingContainer>
          <ProcessingIcon>
            <svg
              width="64"
              height="64"
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
          <ProcessingTitle>PDF wird erstellt...</ProcessingTitle>
          <ProcessingText>
            Dokumente werden zusammengeführt und formatiert.
          </ProcessingText>
        </ProcessingContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                fill="currentColor"
              />
            </svg>
          </ErrorIcon>
          <ErrorTitle>Fehler bei der PDF-Erstellung</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <RetryButton
            onClick={() => {
              setError(null);
              setPdfUrl(null);
            }}
          >
            Erneut versuchen
          </RetryButton>
        </ErrorContainer>
      );
    }

    if (pdfUrl) {
      return (
        <SuccessContainer>
          <SuccessIcon>
            <svg
              width="64"
              height="64"
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
          <SuccessTitle>PDF erfolgreich erstellt</SuccessTitle>
          <SuccessText>
            {selectedDocuments.length}{" "}
            {selectedDocuments.length === 1
              ? "Dokument wurde"
              : "Dokumente wurden"}{" "}
            zu einem PDF zusammengefügt.
          </SuccessText>

          <ButtonGroup>
            <DownloadButton
              onClick={handleDownload}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DownloadIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"
                    fill="currentColor"
                  />
                </svg>
              </DownloadIcon>
              PDF herunterladen
            </DownloadButton>

            <NewSearchButton
              onClick={handleNewSearch}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Neue Suche starten
            </NewSearchButton>
          </ButtonGroup>
        </SuccessContainer>
      );
    }

    // Fallback, wenn noch kein Zustand festgelegt ist
    return (
      <ProcessingContainer>
        <ProcessingText>Initialisiere PDF-Erstellung...</ProcessingText>
      </ProcessingContainer>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={goToPreviousStep}>
          <BackIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                fill="currentColor"
              />
            </svg>
          </BackIcon>
          Zurück
        </BackButton>
        <Title>PDF erstellen</Title>
      </Header>

      <ContentContainer>{renderContent()}</ContentContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: color ${(props) => props.theme.transitions.short};
  margin-right: ${(props) => props.theme.spacing.lg};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const BackIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.xs};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

// Processing Components
const ProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
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

const ProcessingTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ProcessingText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

// Error Components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
`;

const ErrorIcon = styled.div`
  color: ${(props) => props.theme.colors.error};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ErrorTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ErrorText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const RetryButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

// Success Components
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
`;

const SuccessIcon = styled.div`
  color: ${(props) => props.theme.colors.success};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SuccessTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SuccessText = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  width: 100%;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }
`;

const DownloadIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.sm};
`;

const NewSearchButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.divider};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

export default PdfCreationView;
