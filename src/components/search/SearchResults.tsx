import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { SearchResult } from "../../services/searchService";
import { loadPreviewsForResults } from "../../services/searchService";
// Importieren der standardisierten Komponenten
import { Button, IconTextButton } from "../shared/buttons";
import { EmptySearch } from "../shared/empty";
import { BackButton } from "../shared/navigation";

// In einer vollständigen Implementierung würden wir react-window für die Virtualisierung verwenden
// Für jetzt implementieren wir eine einfache Version ohne Virtualisierung
const SearchResults: React.FC = () => {
  const {
    results,
    selectDocument,
    unselectDocument,
    selectedDocuments,
    goToNextStep,
    goToPreviousStep,
    isLoading,
    searchQuery, // Wir benötigen den searchQuery für die EmptySearch-Komponente
  } = useSearch();

  const [resultsWithPreviews, setResultsWithPreviews] = useState<
    SearchResult[]
  >([]);
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  // Lade Vorschaubilder für die Ergebnisse
  useEffect(() => {
    const loadPreviews = async () => {
      if (results.length === 0) return;

      setLoadingPreviews(true);
      try {
        const withPreviews = await loadPreviewsForResults(results);
        setResultsWithPreviews(withPreviews);
      } catch (error) {
        console.error("Error loading previews:", error);
      } finally {
        setLoadingPreviews(false);
      }
    };

    loadPreviews();
  }, [results]);

  // Prüfen, ob ein Dokument ausgewählt ist
  const isDocumentSelected = (id: string) => {
    return selectedDocuments.some((doc) => doc.id === id);
  };

  // Handler für Klick auf ein Dokument
  const handleDocumentClick = (result: SearchResult) => {
    // Erstelle ein SearchDocument aus dem SearchResult
    const document = {
      id: result.id,
      name: result.name,
      path: result.path,
      preview: result.preview || "",
      tags: result.tags,
      uploadDate: result.uploadDate,
    };

    if (isDocumentSelected(result.id)) {
      unselectDocument(result.id);
    } else {
      selectDocument(document);
    }
  };

  // Handler für "Weiter"-Button
  const handleProceed = () => {
    if (selectedDocuments.length > 0) {
      goToNextStep();
    }
  };

  // Rendere eine Nachricht, wenn keine Ergebnisse gefunden wurden
  if (results.length === 0 && !isLoading) {
    return (
      <Container>
        <EmptySearch
          searchTerm={searchQuery}
          onBackToSearch={goToPreviousStep}
          description="Bitte versuchen Sie es mit anderen Suchbegriffen oder Filtern."
          primaryActionText="Zurück zur Suche"
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={goToPreviousStep} label="Zurück" />
        <ResultsCount>
          {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"}{" "}
          gefunden
        </ResultsCount>
        <SelectionCount>{selectedDocuments.length} ausgewählt</SelectionCount>
      </Header>

      {/* Ergebnisse als Grid anzeigen */}
      <ResultsGrid>
        <AnimatePresence>
          {resultsWithPreviews.map((result) => (
            <GridItem
              key={result.id}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleDocumentClick(result)}
              isSelected={isDocumentSelected(result.id)}
            >
              {result.preview ? (
                <DocumentPreview src={result.preview} alt={result.name} />
              ) : (
                <PlaceholderPreview>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                      fill="currentColor"
                    />
                  </svg>
                </PlaceholderPreview>
              )}
              <DocumentInfo>
                <DocumentName>{result.name}</DocumentName>
                <DocumentDetails>
                  {new Date(result.uploadDate).toLocaleDateString()}
                </DocumentDetails>
              </DocumentInfo>
              {isDocumentSelected(result.id) && (
                <SelectionIndicator>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor"
                    />
                  </svg>
                </SelectionIndicator>
              )}
            </GridItem>
          ))}
        </AnimatePresence>
      </ResultsGrid>

      {/* Proceed-Button, wird angezeigt, wenn Dokumente ausgewählt sind */}
      {selectedDocuments.length > 0 && (
        <ProceedButtonContainer
          as={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <IconTextButton
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                  fill="currentColor"
                />
              </svg>
            }
            onClick={handleProceed}
            variant="primary"
            iconPosition="right"
          >
            Weiter
          </IconTextButton>
        </ProceedButtonContainer>
      )}
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
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const ResultsCount = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const SelectionCount = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

interface GridItemProps {
  isSelected: boolean;
}

const GridItem = styled.div<GridItemProps>`
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};
  border: 2px solid
    ${(props) =>
      props.isSelected ? props.theme.colors.primary : "transparent"};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px ${(props) => props.theme.colors.shadow};
  }
`;

const DocumentPreview = styled.img`
  width: 100%;
  height: 75%;
  object-fit: cover;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const PlaceholderPreview = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.disabled};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
`;

const DocumentInfo = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DocumentName = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocumentDetails = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProceedButtonContainer = styled.div`
  position: sticky;
  bottom: ${(props) => props.theme.spacing.md};
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${(props) => props.theme.spacing.md} 0;
  z-index: ${(props) => props.theme.zIndex.elevated};
`;

export default SearchResults;
