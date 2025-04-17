import React from "react";
import styled from "styled-components";
import { SearchProvider } from "../../context/SearchContext";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import SelectionActions from "./SelectionActions";
import PdfCreationView from "./PdfCreationView";
import { useSearch } from "../../context/SearchContext";

// Wrapper-Komponente, die den SearchProvider bereitstellt
const SearchSectionWrapper: React.FC = () => {
  return (
    <SearchProvider>
      <SearchSectionContent />
    </SearchProvider>
  );
};

// Komponente mit Zugriff auf den SearchContext
const SearchSectionContent: React.FC = () => {
  const { currentStep } = useSearch();

  // Rendere den entsprechenden Schritt je nach currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case "input":
        return <SearchInput />;
      case "results":
        return <SearchResults />;
      case "actions":
        return <SelectionActions />;
      case "pdfCreation":
        return <PdfCreationView />;
      default:
        return <SearchInput />;
    }
  };

  return <Container>{renderStepContent()}</Container>;
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.surface};
  overflow-y: auto;
`;

// Exportiere den Wrapper, der den Provider enthält
export default SearchSectionWrapper;
