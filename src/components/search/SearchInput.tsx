import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import SearchFilterButtons from "./SearchFilterButtons";
import TagFilterList from "./TagFilterList";
// Import standardisierte Komponenten
import Icon from "../shared/icons/Icon";
import { IconButton } from "../shared/buttons";
import {
  FadeTransition,
  ModalTransition,
  SlideTransition,
} from "../shared/transitions";

const SearchInput: React.FC = () => {
  const {
    query,
    setQuery,
    search,
    clearFilters,
    results,
    selectedDocuments,
    goToStep,
    filter,
    selectedTags,
  } = useSearch();

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSelectedPreview, setShowSelectedPreview] = useState(false);

  // Automatischer Fokus auf das Suchfeld beim Laden
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  // Handle Änderungen im Suchfeld
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle Suche bei Drücken der Enter-Taste
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      search();
    }
  };

  // Bereinigt nur die Suche und setzt den Fokus zurück ins Suchfeld
  const handleClearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // Bereinigt nur die Tag-Filter
  const handleClearTagFilters = () => {
    clearFilters();
    inputRef.current?.focus();
  };

  // Zählt nur die ausgewählten Tags
  const getTagFiltersCount = () => {
    return selectedTags ? selectedTags.length : 0;
  };

  const tagFiltersCount = getTagFiltersCount();

  // Zeigt die Vorschau der ausgewählten Elemente an
  const toggleSelectedPreview = () => {
    setShowSelectedPreview(!showSelectedPreview);
  };

  // Geht zur Aktionsansicht, wenn bereits Elemente ausgewählt sind
  const handleProceedWithSelection = () => {
    if (selectedDocuments && selectedDocuments.length > 0) {
      goToStep("actions");
    }
  };

  return (
    <Container>
      <ContentWrapper>
        {/* Anzeige für ausgewählte Elemente */}
        <AnimatePresence>
          {selectedDocuments && selectedDocuments.length > 0 && (
            <SlideTransition
              direction="down"
              isVisible={selectedDocuments.length > 0}
              duration={0.4}
              distance={30}
            >
              <SelectedIndicator
                onClick={toggleSelectedPreview}
                as={motion.div}
                animate={{
                  boxShadow: [
                    "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "0 4px 8px rgba(0, 0, 0, 0.15)",
                    "0 2px 4px rgba(0, 0, 0, 0.1)",
                  ],
                  transition: {
                    duration: 1.5,
                    repeat: 0,
                    repeatDelay: 3,
                  },
                }}
              >
                <SelectedCount>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: {
                        duration: 0.5,
                        repeat: 0,
                        repeatDelay: 4,
                      },
                    }}
                  >
                    <Icon name="Check" size="small" color="#4CAF50" />
                  </motion.div>
                  <span>
                    {selectedDocuments.length}{" "}
                    {selectedDocuments.length === 1 ? "item" : "items"} selected
                  </span>
                </SelectedCount>
                <ViewSelectionButton
                  onClick={handleProceedWithSelection}
                  as={motion.button}
                  whileHover={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    color: (theme) => theme.colors.primary,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Proceed
                </ViewSelectionButton>
              </SelectedIndicator>
            </SlideTransition>
          )}
        </AnimatePresence>

        {/* Ausgewählte Elemente Vorschau */}
        <AnimatePresence>
          {showSelectedPreview && selectedDocuments && (
            <ModalTransition
              isVisible={showSelectedPreview}
              onBackdropClick={() => setShowSelectedPreview(false)}
            >
              <SelectedPreviewContent
                onClick={(e) => e.stopPropagation()}
                as={motion.div}
              >
                <SelectedPreviewHeader>
                  <SelectedPreviewTitle>Selected Items</SelectedPreviewTitle>
                  <IconButton
                    iconName="X"
                    variant="text"
                    onClick={() => setShowSelectedPreview(false)}
                  />
                </SelectedPreviewHeader>

                <SelectedItemsGrid>
                  {selectedDocuments.map((item, index) => (
                    <SelectedItemThumb
                      key={item.id}
                      as={motion.div}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.03,
                          duration: 0.3,
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <img src={item.preview} alt={item.name} />
                    </SelectedItemThumb>
                  ))}
                </SelectedItemsGrid>

                <SlideTransition
                  direction="up"
                  isVisible={true}
                  distance={20}
                  delay={0.2}
                >
                  <ProceedButton
                    onClick={handleProceedWithSelection}
                    as={motion.button}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue with Selection
                  </ProceedButton>
                </SlideTransition>
              </SelectedPreviewContent>
            </ModalTransition>
          )}
        </AnimatePresence>

        {/* Hauptsuchfeld */}
        <SearchFieldContainer
          $isFocused={isFocused}
          as={motion.div}
          animate={{
            scale: results && results.length > 0 ? 0.95 : 1,
            y: results && results.length > 0 ? -20 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <SearchIconWrapper>
            <Icon name="Search" size="medium" color="currentColor" />
          </SearchIconWrapper>

          <SearchField
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />

          <InputActionsContainer>
            {/* "X" Button erscheint nur, wenn Text vorhanden ist */}
            {query && (
              <ClearButton
                onClick={handleClearSearch}
                as={motion.button}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon name="X" size="small" color="currentColor" />
              </ClearButton>
            )}

            {/* Der Filter-Counter erscheint nur, wenn Tags ausgewählt sind */}
            {tagFiltersCount > 0 && (
              <ClearButton
                onClick={handleClearTagFilters}
                as={motion.button}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="filter-counter-button"
              >
                <TagFilterContainer>
                  <TagCount>{tagFiltersCount}</TagCount>
                  <Icon name="Tag" size="medium" color="#BB86FC" />
                </TagFilterContainer>
              </ClearButton>
            )}
          </InputActionsContainer>

          <SearchButton
            onClick={() => query && query.trim() && search()}
            disabled={!query || !query.trim()}
            as={motion.button}
            whileHover={query && query.trim() ? { scale: 1.05 } : undefined}
            whileTap={query && query.trim() ? { scale: 0.95 } : undefined}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                fill="currentColor"
              />
            </svg>
          </SearchButton>
        </SearchFieldContainer>

        {/* Filter-Optionen */}
        <FiltersContainer
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <SearchFilterButtons />
        </FiltersContainer>

        {/* Tag-Filter */}
        <TagsContainer
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <TagFilterList />
        </TagsContainer>
      </ContentWrapper>
    </Container>
  );
};

// Main container for the entire search section - centers everything vertically
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

// Wrapper to ensure all content is grouped together properly
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  padding: ${(props) => props.theme.spacing.lg};
`;

interface SearchFieldContainerProps {
  $isFocused: boolean;
}

const SearchFieldContainer = styled.div<SearchFieldContainerProps>`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid
    ${(props) =>
      props.$isFocused ? props.theme.colors.primary : "transparent"};
  transition: all ${(props) => props.theme.transitions.medium};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  position: relative;

  /* Prevent focus ring from appearing on click */
  &:focus {
    outline: none;
  }

  /* Only show focus ring on keyboard navigation */
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SearchIconWrapper = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-right: ${(props) => props.theme.spacing.md};
  display: flex;
  align-items: center;
`;

const SearchField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.primary};
  caret-color: ${(props) => props.theme.colors.primary};

  &::placeholder {
    color: ${(props) => props.theme.colors.text.disabled};
  }

  /* Prevent outline on focus for better visual consistency */
  &:focus {
    outline: none;
  }
`;

// Container for the X button and filter counter to keep them together
const InputActionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  .filter-counter-button {
    margin-left: ${(props) => props.theme.spacing.xs};
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: 50%;
  cursor: pointer;
  position: relative;

  /* Ensure the cursor property cascades to all children */
  svg,
  path,
  * {
    cursor: pointer !important;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
  }

  /* Remove hover background for tag filter button */
  &.filter-counter-button:hover {
    background-color: transparent;
  }

  /* Remove outline on click */
  &:focus {
    outline: none;
  }

  /* Only show outline for keyboard navigation */
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const TagFilterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* Explicitly set pointer cursor */

  /* Make sure the icon is properly sized and visible */
  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2px; /* Make the icon lines thicker */
    cursor: pointer; /* Ensure cursor is set on the SVG itself */
  }

  /* Ensure the cursor property cascades to all children */
  * {
    cursor: pointer !important;
  }
`;

const TagCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 12px;
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.primary};
`;

const SearchButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  width: 40px;
  height: 40px;
  padding: 0; /* Ensure icon is visible */
  border-radius: 50%;
  margin-left: ${(props) => props.theme.spacing.md};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ensure SVG is properly sized */
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-width: 600px;
  width: 100%;
`;

const TagsContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 600px;
  width: 100%;
`;

const SelectedIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  width: 100%;
  max-width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SelectedCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`;

const ViewSelectionButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: none;
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

// This styling is now handled by the ModalTransition component
// Keeping this empty styled component for backward compatibility
const SelectedPreviewOverlay = styled.div``;

const SelectedPreviewContent = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin: ${(props) => props.theme.spacing.md};

  /* Smooth scroll behavior for the modal content */
  scroll-behavior: smooth;

  /* Improved scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.divider};
    border-radius: ${(props) => props.theme.borderRadius.md};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text.disabled};
  }
`;

const SelectedPreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SelectedPreviewTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const SelectedItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  max-height: 50vh;
  overflow-y: auto;
  padding-right: ${(props) => props.theme.spacing.sm}; /* For scrollbar */

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

const SelectedItemThumb = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProceedButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: #000;
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: none;
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.short};
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

export default SearchInput;
