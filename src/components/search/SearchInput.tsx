import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import SearchFilterButtons from "./SearchFilterButtons";
import TagFilterList from "./TagFilterList";
// Importieren der standardisierten Komponenten
import { Button } from "../shared/buttons";
import { SearchField } from "../shared/inputs";

const SearchInput: React.FC = () => {
  const {
    query,
    setQuery,
    search,
    isLoading,
    selectedDocuments,
    clearSelection,
    goToStep,
    selectedTags,
    clearFilters,
  } = useSearch();

  // Handler für Suchanfrage-Änderung
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handler für Suche
  const handleSearch = () => {
    search();
  };

  // Handler für Eingabe löschen
  const handleClearQuery = () => {
    setQuery("");
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

  // Handler für Filter-Button-Klick (jetzt zum Löschen aller Filter)
  const handleFilterClick = () => {
    clearFilters();
  };

  // Aktive Filter anzeigen
  const activeFiltersCount = selectedTags.length;

  return (
    <Container>
      <AnimatePresence>
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
            <Button variant="text" onClick={handleClearSelection} size="small">
              Auswahl löschen
            </Button>
          </SelectionIndicator>
        )}
      </AnimatePresence>

      <SearchForm
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        {/* Standardisierte SearchField-Komponente */}
        <SearchField
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Dokumente durchsuchen..."
          onSearch={handleSearch}
          onClear={handleClearQuery}
          isLoading={isLoading}
          showFilterButton={activeFiltersCount > 0}
          onFilterClick={handleFilterClick}
          activeFilters={activeFiltersCount}
          fullWidth
          type="text" // Ändere den Typ von "search" zu "text", um das native X zu vermeiden
        />

        <Button variant="primary" type="submit" disabled={isLoading}>
          Suchen
        </Button>
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

export default SearchInput;
