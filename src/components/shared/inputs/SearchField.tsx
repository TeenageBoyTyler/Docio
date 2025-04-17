import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import TextField, { TextFieldProps } from "./TextField";

export interface SearchFieldProps
  extends Omit<TextFieldProps, "startIcon" | "endIcon"> {
  /**
   * Callback for search action
   */
  onSearch?: (value: string) => void;

  /**
   * Callback for clearing the search input
   */
  onClear?: () => void;

  /**
   * Whether to show filter toggle button
   * @default false
   */
  showFilterButton?: boolean;

  /**
   * Callback when filter button is clicked
   */
  onFilterClick?: () => void;

  /**
   * Number of active filters
   * @default 0
   */
  activeFilters?: number;

  /**
   * Whether the search is currently loading
   * @default false
   */
  isLoading?: boolean;
}

/**
 * SearchField component for search functionality with filter options
 */
const SearchField: React.FC<SearchFieldProps> = ({
  onSearch,
  onClear,
  showFilterButton = false,
  onFilterClick,
  activeFilters = 0,
  isLoading = false,
  ...props
}) => {
  // Local state for controlled component behavior
  const [inputValue, setInputValue] = useState<string>(
    (props.value as string) || ""
  );

  // Ref for the input element to allow focus control
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when props value changes
  useEffect(() => {
    if (props.value !== undefined) {
      setInputValue(props.value as string);
    }
  }, [props.value]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Handle key down events (Enter for search)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(inputValue);
    }

    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setInputValue("");

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (onClear) {
      onClear();
    }
  };

  // Search icon component
  const SearchIcon = () => (
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
  );

  // Clear icon component
  const ClearIcon = () => (
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
  );

  // Filter icon component
  const FilterIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 6H17M10 12H14M9 18H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Loading spinner component
  const LoadingIcon = () => (
    <StyledSpinner viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="60 20"
        className="spinner-circle"
      />
    </StyledSpinner>
  );

  // Generate end icons based on state
  const renderEndIcons = () => {
    const icons = [];

    // Show clear button if there's input text
    if (inputValue) {
      icons.push(
        <IconButton key="clear" onClick={handleClear} aria-label="Clear search">
          <ClearIcon />
        </IconButton>
      );
    }

    // Show loading spinner when loading
    if (isLoading) {
      icons.push(
        <LoadingIconWrapper key="loading">
          <LoadingIcon />
        </LoadingIconWrapper>
      );
    }

    // Show filter button if enabled
    if (showFilterButton) {
      icons.push(
        <FilterButton
          key="filter"
          onClick={onFilterClick}
          aria-label="Show filters"
          $hasActiveFilters={activeFilters > 0}
        >
          <FilterIcon />
          {activeFilters > 0 && <FilterCount>{activeFilters}</FilterCount>}
        </FilterButton>
      );
    }

    return icons.length > 0 ? (
      <EndIconsContainer>{icons}</EndIconsContainer>
    ) : null;
  };

  // Wichtige Änderung: Wir verwenden den übergebenen type aus props
  // anstatt ihn immer auf "search" zu setzen
  return (
    <TextField
      {...props}
      ref={inputRef}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      startIcon={<SearchIcon />}
      endIcon={renderEndIcons()}
      variant="outlined"
    />
  );
};

// Styled components
const EndIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition-property: color, background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FilterButton = styled(IconButton)<{ $hasActiveFilters: boolean }>`
  position: relative;
  color: ${(props) =>
    props.$hasActiveFilters
      ? props.theme.colors.primary
      : props.theme.colors.text.secondary};

  &:hover {
    color: ${(props) =>
      props.$hasActiveFilters
        ? props.theme.colors.primary
        : props.theme.colors.text.primary};
  }
`;

const FilterCount = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  min-width: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: #000;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 10px;
`;

const LoadingIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
`;

const StyledSpinner = styled.svg`
  width: 20px;
  height: 20px;
  color: inherit;

  .spinner-circle {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      transform-origin: center;
    }
    100% {
      transform: rotate(360deg);
      transform-origin: center;
    }
  }
`;

export default SearchField;
