import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { SearchProvider, useSearch } from "../../context/SearchContext";
import { useNavigation } from "../../context/NavigationContext";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import SelectionActions from "./SelectionActions";
import PdfCreationView from "./PdfCreationView";

// Import transition components
import {
  PageTransition,
  TransitionDirection,
  useTransitionDirection,
} from "../shared/transitions";

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
  const stepChangeTimestamp = useRef(Date.now());

  // Define step position map for spatial navigation
  const stepPositionMap: Record<string, number> = {
    input: 0,
    results: 1,
    actions: 2,
    pdfCreation: 3,
  };

  // Use the transition direction hook to determine animation direction
  const { direction, previous } = useTransitionDirection({
    current: currentStep,
    positionMap: stepPositionMap,
  });

  // Synchronisiere Search-Steps mit NavigationContext
  useEffect(() => {
    if (currentStep !== currentSearchStep) {
      navigateToSearchStep(currentStep);
    }

    // Update timestamp when step changes to ensure animations reset properly
    if (previous !== currentStep) {
      stepChangeTimestamp.current = Date.now();
    }
  }, [currentStep, currentSearchStep, navigateToSearchStep, previous]);

  // Enhanced transition parameters based on step position
  const getTransitionParams = (step: string) => {
    const baseParams = {
      transitionKey: `search-${step}-${stepChangeTimestamp.current}`,
      direction,
      isActive: true,
    };

    // Customize transition based on step
    switch (step) {
      case "input":
        return {
          ...baseParams,
          duration: 0.5, // slightly longer for the main search screen
          distance: 100, // more dramatic slide for the main transition
        };
      case "pdfCreation":
        return {
          ...baseParams,
          duration: 0.4,
          distance: 80, // more noticeable for the final step
        };
      default:
        return {
          ...baseParams,
          duration: 0.35,
          distance: 60,
        };
    }
  };

  return (
    <Container>
      {/* Use AnimatePresence to handle component mounting/unmounting */}
      <AnimatePresence mode="wait">
        {/* Search Input Step */}
        {currentStep === "input" && (
          <PageTransition {...getTransitionParams("input")}>
            <SearchInput />
          </PageTransition>
        )}

        {/* Search Results Step */}
        {currentStep === "results" && (
          <PageTransition {...getTransitionParams("results")}>
            <SearchResults />
          </PageTransition>
        )}

        {/* Selection Actions Step */}
        {currentStep === "actions" && (
          <PageTransition {...getTransitionParams("actions")}>
            <SelectionActions />
          </PageTransition>
        )}

        {/* PDF Creation Step */}
        {currentStep === "pdfCreation" && (
          <PageTransition {...getTransitionParams("pdfCreation")}>
            <PdfCreationView />
          </PageTransition>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Ensure content is vertically centered */
  width: 100%;
  height: 100%;
  background-color: transparent; /* Vom übergeordneten Element übernehmen */
  overflow: hidden; /* Changed from overflow-y: auto to prevent animation issues */
  position: relative; /* Added to ensure proper stacking of animated elements */
`;

// Exportiere den Wrapper, der den Provider enthält
export default SearchSectionWrapper;
