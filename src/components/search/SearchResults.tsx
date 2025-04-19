import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { EmptySearch } from "../shared/empty";
// Import standardisierte Komponenten
import Icon from "../shared/icons/Icon";
import { IconButton } from "../shared/buttons";
import { BackButton, BackButtonContainer } from "../shared/navigation";
import { FadeTransition, SlideTransition } from "../shared/transitions";

const SearchResults: React.FC = () => {
  const {
    query, // Geändert von searchQuery
    results, // Geändert von searchResults
    isLoading,
    selectedDocuments, // Geändert von selectedItems
    selectDocument, // Geändert von toggleItemSelection
    unselectDocument,
    clearFilters, // Geändert von clearSearch
    goToStep, // Verwende direkt goToStep statt goToNextStep
    goToPreviousStep,
  } = useSearch();

  const [showFloatingAction, setShowFloatingAction] = useState(false);

  // Toggle Funktion für die Auswahl von Dokumenten
  const toggleItemSelection = (itemId: string) => {
    const isSelected = selectedDocuments?.some((item) => item.id === itemId);
    if (isSelected) {
      unselectDocument(itemId);
    } else {
      const item = results?.find((result) => result.id === itemId);
      if (item) {
        // Umwandlung vom SearchResult zum SearchDocument
        selectDocument({
          id: item.id,
          name: item.title || "Unnamed Document",
          path: item.path || "",
          preview: item.thumbnail || "",
          tags: item.tags || [],
          uploadDate: item.date || new Date().toISOString(),
        });
      }
    }
  };

  // Zeige den schwebenden Aktionsbutton, wenn Elemente ausgewählt sind
  useEffect(() => {
    setShowFloatingAction(!!selectedDocuments && selectedDocuments.length > 0);
  }, [selectedDocuments]);

  // Gehe zum nächsten Schritt (Aktionen)
  const handleProceedToActions = () => {
    goToStep("actions");
  };

  // Vermeide leere Suchergebnisse
  if ((!results || results.length === 0) && !isLoading) {
    return (
      <Container>
        {/* Remove the BackButtonContainer for the empty state */}
        <EmptySearch
          query={query}
          onBackToSearch={() => goToPreviousStep()}
          onNewSearch={() => {
            clearFilters();
            goToStep("input");
          }}
        />
      </Container>
    );
  }

  return (
    <Container>
      <BackButtonContainer>
        <BackButton
          onClick={() => goToPreviousStep()}
          showLabel
          label="Back to Search"
        />
      </BackButtonContainer>

      <ResultsHeader>
        <ResultsInfo>
          <ResultsTitle>Search Results</ResultsTitle>
          <ResultsCount>
            {results?.length || 0}{" "}
            {(results?.length || 0) === 1 ? "document" : "documents"} found for
            "{query}"
          </ResultsCount>
        </ResultsInfo>

        <FilterActions>
          <SortButton>
            <Icon name="ArrowUpDown" size="small" color="currentColor" />
            <SortText>Sort</SortText>
          </SortButton>
          <FilterButton>
            <Icon name="Filter" size="small" color="currentColor" />
            <FilterText>Filter</FilterText>
          </FilterButton>
        </FilterActions>
      </ResultsHeader>

      <AnimatePresence>
        {selectedDocuments && selectedDocuments.length > 0 && (
          <FadeTransition
            isVisible={selectedDocuments.length > 0}
            duration={0.3}
            scale={true}
          >
            <SelectionCounter
              as={motion.div}
              animate={{
                backgroundColor:
                  selectedDocuments.length > 5
                    ? "rgba(135, 206, 250, 0.2)"
                    : undefined,
              }}
              transition={{ duration: 0.5 }}
            >
              <SelectedCountText>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: {
                      duration: 0.5,
                      repeat: 0,
                      repeatDelay: 2,
                    },
                  }}
                >
                  <Icon name="Check" size="small" color="#4CAF50" />
                </motion.div>
                <span>
                  {selectedDocuments.length}{" "}
                  {selectedDocuments.length === 1 ? "item" : "items"} selected
                </span>
              </SelectedCountText>
              <ClearSelectionButton
                onClick={() =>
                  selectedDocuments.forEach((item) => unselectDocument(item.id))
                }
                as={motion.button}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Clear
              </ClearSelectionButton>
            </SelectionCounter>
          </FadeTransition>
        )}
      </AnimatePresence>

      <ResultsGrid>
        <AnimatePresence>
          {results &&
            results.map((result, index) => {
              const isSelected = selectedDocuments?.some(
                (item) => item.id === result.id
              );
              return (
                <ResultItem
                  key={result.id}
                  onClick={() => toggleItemSelection(result.id)}
                  as={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                  $isSelected={!!isSelected}
                >
                  <ItemThumbnail
                    src={result.thumbnail}
                    alt={result.title || "Document"}
                  />
                  <AnimatePresence>
                    {isSelected && (
                      <SelectionIndicator
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          },
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Icon name="Check" size="small" color="#000" />
                      </SelectionIndicator>
                    )}
                  </AnimatePresence>
                </ResultItem>
              );
            })}
        </AnimatePresence>
      </ResultsGrid>

      <AnimatePresence>
        {showFloatingAction && (
          <SlideTransition
            direction="up"
            isVisible={showFloatingAction}
            distance={40}
            duration={0.4}
          >
            <FloatingActionButton
              onClick={handleProceedToActions}
              as={motion.button}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: [0, 5, 0, -5, 0],
                transition: {
                  duration: 0.5,
                  delay: 1,
                  repeat: 1,
                  repeatType: "reverse" as const,
                },
              }}
            >
              <Icon name="ArrowRight" size="medium" color="#000" />
            </FloatingActionButton>
          </SlideTransition>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing.lg};
  position: relative;
  overflow-y: auto;

  /* Subtle scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.divider};
    border-radius: ${(props) => props.theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text.disabled};
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
`;

const ResultsInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ResultsTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ResultsCount = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const FilterButton = styled(SortButton)``;

const SortText = styled.span``;

const FilterText = styled.span``;

const SelectionCounter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SelectedCountText = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const ClearSelectionButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

interface ResultItemProps {
  $isSelected: boolean;
}

const ResultItem = styled.div<ResultItemProps>`
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  border: 2px solid
    ${(props) =>
      props.$isSelected ? props.theme.colors.primary : "transparent"};
  transition: all ${(props) => props.theme.transitions.short};
`;

const ItemThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
  transition: all ${(props) => props.theme.transitions.short};
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

export default SearchResults;
