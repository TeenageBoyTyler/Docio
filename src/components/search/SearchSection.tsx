import React, { useEffect } from "react";
import styled from "styled-components";
import { SearchProvider, useSearch } from "../../context/SearchContext";
import { useNavigation } from "../../context/NavigationContext";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import SelectionActions from "./SelectionActions";
import PdfCreationView from "./PdfCreationView";

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
  const { navigateToSearchStep, currentSearchStep } = useNavigation();

  // Synchronisiere Search-Steps mit NavigationContext
  useEffect(() => {
    if (currentStep !== currentSearchStep) {
      navigateToSearchStep(currentStep);
    }
  }, [currentStep, currentSearchStep, navigateToSearchStep]);

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
  background-color: transparent; /* Vom übergeordneten Element übernehmen */
  overflow-y: auto;
`;

// Exportiere den Wrapper, der den Provider enthält
export default SearchSectionWrapper;
