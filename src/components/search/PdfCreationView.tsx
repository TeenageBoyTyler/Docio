import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearch } from "../../context/SearchContext";
// Importieren der standardisierten Komponenten
import { Button, IconTextButton } from "../shared/buttons";
import { Spinner, LoadingOverlay, LoadingText } from "../shared/loading";
import {
  BackButton,
  BackButtonContainer,
  HeaderContainer,
  Title,
} from "../shared/navigation";
import Icon from "../shared/icons/Icon";

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

    if (selectedDocuments && selectedDocuments.length > 0 && !pdfUrl) {
      generatePdf();
    }
  }, [selectedDocuments, createPdf, orientation, pdfUrl]);

  // Wenn keine Dokumente ausgewählt sind, zurück zur Auswahl
  useEffect(() => {
    if (!selectedDocuments || selectedDocuments.length === 0) {
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
          {/* Standardisierte Spinner-Komponente verwenden */}
          <Spinner size="large" showLabel labelText="PDF wird erstellt..." />
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
            <Icon name="AlertCircle" size="large" color="currentColor" />
          </ErrorIcon>
          <ErrorTitle>Fehler bei der PDF-Erstellung</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <Button
            variant="primary"
            onClick={() => {
              setError(null);
              setPdfUrl(null);
            }}
          >
            Erneut versuchen
          </Button>
        </ErrorContainer>
      );
    }

    if (pdfUrl) {
      return (
        <SuccessContainer>
          <SuccessIcon>
            <Icon name="CheckCircle" size="large" color="currentColor" />
          </SuccessIcon>
          <SuccessTitle>PDF erfolgreich erstellt</SuccessTitle>
          <SuccessText>
            {selectedDocuments?.length || 0}{" "}
            {(selectedDocuments?.length || 0) === 1
              ? "Dokument wurde"
              : "Dokumente wurden"}{" "}
            zu einem PDF zusammengefügt.
          </SuccessText>

          <ButtonGroup>
            <IconTextButton
              icon={<Icon name="Download" size="medium" color="currentColor" />}
              onClick={handleDownload}
              variant="primary"
            >
              PDF herunterladen
            </IconTextButton>

            <Button variant="text" onClick={handleNewSearch}>
              Neue Suche starten
            </Button>
          </ButtonGroup>
        </SuccessContainer>
      );
    }

    // Fallback, wenn noch kein Zustand festgelegt ist
    return (
      <ProcessingContainer>
        {/* Standardisierte LoadingText-Komponente verwenden */}
        <LoadingText text="Initialisiere PDF-Erstellung" size="medium" />
      </ProcessingContainer>
    );
  };

  return (
    <Container>
      {/* LoadingOverlay für den gesamten Prozess, wenn isLoading true ist */}
      <LoadingOverlay
        isVisible={
          isLoading && selectedDocuments && selectedDocuments.length > 3
        }
        text="PDF wird erstellt..."
        blockInteraction={true}
        opacity={0.7}
      />

      {/* Verwendung des standardisierten HeaderContainer */}
      <HeaderContainer>
        <BackButton
          onClick={goToPreviousStep}
          label="Zurück zu Aktionen"
          showLabel={true}
          variant="text"
        />
        <Title size="large">PDF erstellen</Title>
      </HeaderContainer>

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
  gap: ${(props) => props.theme.spacing.lg};
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

export default PdfCreationView;
