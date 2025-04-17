import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { SearchFilter } from "../../services/searchService";

const SearchFilterButtons: React.FC = () => {
  const { filter, setFilter } = useSearch();

  // Handler für den Filter-Wechsel
  const handleFilterChange = (newFilter: SearchFilter) => {
    // Wenn der gleiche Filter angeklickt wird, dann zurücksetzen auf "all"
    if (newFilter === filter) {
      setFilter("all");
    } else {
      setFilter(newFilter);
    }
  };

  return (
    <Container>
      <ButtonsContainer>
        <FilterButton
          isActive={filter === "text"}
          onClick={() => handleFilterChange("text")}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonIcon>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 14H16V16H8V14ZM8 10H16V12H8V10Z"
                fill="currentColor"
              />
            </svg>
          </ButtonIcon>
          Nur Text finden
        </FilterButton>

        <FilterButton
          isActive={filter === "objects"}
          onClick={() => handleFilterChange("objects")}
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonIcon>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z"
                fill="currentColor"
              />
            </svg>
          </ButtonIcon>
          Nur Objekte finden
        </FilterButton>
      </ButtonsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

interface FilterButtonProps {
  isActive: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.primary + "30"
      : props.theme.colors.background};
  border: 1px solid
    ${(props) =>
      props.isActive ? props.theme.colors.primary : props.theme.colors.divider};
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.primary
      : props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover {
    border-color: ${(props) =>
      props.isActive
        ? props.theme.colors.primary
        : props.theme.colors.text.primary};
    background-color: ${(props) =>
      props.isActive
        ? props.theme.colors.primary + "30"
        : props.theme.colors.background};
    color: ${(props) =>
      props.isActive
        ? props.theme.colors.primary
        : props.theme.colors.text.primary};
  }
`;

const ButtonIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.spacing.sm};
`;

export default SearchFilterButtons;
