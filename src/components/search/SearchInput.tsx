import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import SearchFilterButtons from "./SearchFilterButtons";
import TagFilterList from "./TagFilterList";

const SearchInput: React.FC = () => {
  const {
    query,
    setQuery,
    search,
    isLoading,
    selectedDocuments,
    clearSelection,
    goToStep,
  } = useSearch();

  // State für Eingabe-Animation
  const [isFocused, setIsFocused] = useState(false);

  // Handler für Suchanfrage-Änderung
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handler für Formular-Absenden
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  // Handler für Enter-Taste
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      search();
    }
  };

  // Zeige Auswahl-Indikator, wenn Dokumente ausgewählt sind
  const showSelectionIndicator = selectedDocuments.length > 0;

  // Handler für Klick auf Selection-Indikator
  const handleSelectionClick = () => {
    goToStep("results");
  };

  // Handler für Abbrechen der Auswahl
  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <Container>
      {/* Auswahl-Indikator, wenn Dokumente ausgewählt wurden */}
      {showSelectionIndicator && (
        <SelectionIndicator
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SelectionText onClick={handleSelectionClick}>
            {selectedDocuments.length}{" "}
            {selectedDocuments.length === 1 ? "Dokument" : "Dokumente"}{" "}
            ausgewählt
          </SelectionText>
          <ClearSelectionButton onClick={handleClearSelection}>
            Auswahl löschen
          </ClearSelectionButton>
        </SelectionIndicator>
      )}

      <SearchForm onSubmit={handleSubmit}>
        <SearchContainer
          isFocused={isFocused}
          as={motion.div}
          whileTap={{ scale: 0.98 }}
        >
          <SearchIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                fill="currentColor"
              />
            </svg>
          </SearchIcon>
          <SearchInputField
            type="text"
            placeholder="Dokumente durchsuchen..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {query && (
            <ClearButton onClick={() => setQuery("")} title="Suche löschen">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </ClearButton>
          )}
          {isLoading && (
            <LoadingIndicator>
              <svg
                width="20"
                height="20"
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
            </LoadingIndicator>
          )}
        </SearchContainer>

        <SearchButton
          type="submit"
          disabled={isLoading}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Suchen
        </SearchButton>
      </SearchForm>

      {/* Filter-Buttons für Text/Objekte */}
      <SearchFilterButtons />

      {/* Tag-Filter-Liste */}
      <TagFilterList />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};
  height: 100%;
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

interface SearchContainerProps {
  isFocused: boolean;
}

const SearchContainer = styled.div<SearchContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  border: 2px solid
    ${(props) =>
      props.isFocused
        ? props.theme.colors.primary
        : props.theme.colors.divider};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    border-color: ${(props) =>
      props.isFocused
        ? props.theme.colors.primary
        : props.theme.colors.text.disabled};
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const SearchInputField = styled.input`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md};
  background: transparent;
  border: none;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.primary};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xs};
  margin-right: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: color ${(props) => props.theme.transitions.short};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.primary};
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SearchButton = styled.button`
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xl};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${(props) => props.theme.transitions.short};
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}CC;
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    margin-top: ${(props) => props.theme.spacing.sm};
  }
`;

const SelectionIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.primary}20;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.primary}40;
`;

const SelectionText = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ClearSelectionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  transition: color ${(props) => props.theme.transitions.short};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.error};
  }
`;

export default SearchInput;
