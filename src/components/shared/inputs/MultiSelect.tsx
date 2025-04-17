import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

export interface MultiSelectOption {
  /**
   * Unique value for the option
   */
  value: string | number;

  /**
   * Display label for the option
   */
  label: string;

  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /**
   * Array of options for the MultiSelect
   */
  options: MultiSelectOption[];

  /**
   * Array of selected values
   */
  value?: (string | number)[];

  /**
   * Callback when selection changes
   */
  onChange?: (value: (string | number)[]) => void;

  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;

  /**
   * Label text displayed above the MultiSelect
   */
  label?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Helper text displayed below the MultiSelect
   */
  helperText?: string;

  /**
   * Whether the MultiSelect is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the MultiSelect should take the full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Size of the MultiSelect
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Maximum number of tags to display before showing "+X more"
   * @default 3
   */
  maxDisplayedTags?: number;

  /**
   * Custom class name for the component
   */
  className?: string;

  /**
   * Custom ID for the select element
   */
  id?: string;

  /**
   * Name attribute for the hidden select element
   */
  name?: string;
}

/**
 * MultiSelect component for selecting multiple items from a list
 */
const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  label,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  size = "medium",
  maxDisplayedTags = 3,
  className,
  id,
  name,
}) => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<MultiSelectOption[]>(
    options.filter((option) => value.includes(option.value))
  );

  // Refs
  const multiSelectRef = useRef<HTMLDivElement>(null);

  // Update selected options when value prop changes
  useEffect(() => {
    setSelectedOptions(
      options.filter((option) => value.includes(option.value))
    );
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        multiSelectRef.current &&
        !multiSelectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if we're showing an error
  const showError = error !== undefined && error !== false;
  const errorMessage = typeof error === "string" ? error : "";

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  // Handle option selection/deselection
  const handleOptionToggle = (option: MultiSelectOption) => {
    if (option.disabled) return;

    const isOptionSelected = selectedOptions.some(
      (selected) => selected.value === option.value
    );

    let updatedOptions;
    let updatedValues;

    if (isOptionSelected) {
      // Remove option if already selected
      updatedOptions = selectedOptions.filter(
        (selected) => selected.value !== option.value
      );
      updatedValues = updatedOptions.map((option) => option.value);
    } else {
      // Add option if not already selected
      updatedOptions = [...selectedOptions, option];
      updatedValues = updatedOptions.map((option) => option.value);
    }

    setSelectedOptions(updatedOptions);

    if (onChange) {
      onChange(updatedValues);
    }
  };

  // Remove a selected item (from the tag list)
  const handleRemoveTag = (value: string | number) => {
    if (disabled) return;

    const updatedOptions = selectedOptions.filter(
      (option) => option.value !== value
    );
    const updatedValues = updatedOptions.map((option) => option.value);

    setSelectedOptions(updatedOptions);

    if (onChange) {
      onChange(updatedValues);
    }
  };

  // Clear all selected options
  const handleClearAll = () => {
    if (disabled) return;

    setSelectedOptions([]);

    if (onChange) {
      onChange([]);
    }
  };

  // Dropdown arrow icon
  const DropdownArrow = () => (
    <ArrowIcon $isOpen={isOpen}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10L12 15L17 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </ArrowIcon>
  );

  // Close icon for tags
  const CloseIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Determine which tags to display
  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const hasMoreTags = selectedOptions.length > maxDisplayedTags;
  const additionalTagsCount = selectedOptions.length - maxDisplayedTags;

  return (
    <Container className={className} $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}

      <MultiSelectContainer
        ref={multiSelectRef}
        $size={size}
        $error={showError}
        $disabled={disabled}
        $isOpen={isOpen}
        $hasValue={selectedOptions.length > 0}
      >
        <MultiSelectHeader onClick={toggleDropdown}>
          {selectedOptions.length === 0 ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            <TagsContainer>
              {displayedTags.map((option) => (
                <Tag
                  key={option.value}
                  $size={size}
                  $disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(option.value);
                  }}
                >
                  {option.label}
                  {!disabled && <CloseIcon />}
                </Tag>
              ))}

              {hasMoreTags && (
                <MoreTagsIndicator $size={size}>
                  +{additionalTagsCount} more
                </MoreTagsIndicator>
              )}
            </TagsContainer>
          )}

          <ActionContainer>
            {selectedOptions.length > 0 && !disabled && (
              <ClearButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                aria-label="Clear all selected options"
              >
                <CloseIcon />
              </ClearButton>
            )}
            <DropdownArrow />
          </ActionContainer>
        </MultiSelectHeader>

        {isOpen && (
          <OptionsContainer $size={size}>
            {options.map((option) => {
              const isSelected = selectedOptions.some(
                (selected) => selected.value === option.value
              );

              return (
                <OptionItem
                  key={option.value}
                  onClick={() => handleOptionToggle(option)}
                  $isSelected={isSelected}
                  $isDisabled={option.disabled}
                  $size={size}
                >
                  <Checkbox
                    $isChecked={isSelected}
                    $isDisabled={option.disabled}
                  />
                  <OptionLabel>{option.label}</OptionLabel>
                </OptionItem>
              );
            })}

            {options.length === 0 && (
              <EmptyOption $size={size}>No options available</EmptyOption>
            )}
          </OptionsContainer>
        )}
      </MultiSelectContainer>

      {/* Hidden select element for form submission */}
      <HiddenSelect
        id={id}
        name={name}
        multiple
        value={value}
        disabled={disabled}
        aria-hidden="true"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </HiddenSelect>

      {(helperText || errorMessage) && (
        <HelperText $error={showError}>{errorMessage || helperText}</HelperText>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  margin-bottom: ${(props) => props.theme.spacing.md};
  position: relative;
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const MultiSelectContainer = styled.div<{
  $size: "small" | "medium" | "large";
  $error: boolean;
  $disabled: boolean;
  $isOpen: boolean;
  $hasValue: boolean;
}>`
  position: relative;
  width: 100%;
  background-color: rgba(45, 45, 45, 0.7);
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 2px solid
    ${(props) => {
      if (props.$error) return props.theme.colors.error;
      if (props.$isOpen) return props.theme.colors.primary;
      return "transparent"; // Transparent border in normal state
    }};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  min-height: ${(props) => {
    switch (props.$size) {
      case "small":
        return "32px";
      case "large":
        return "48px";
      default:
        return "40px";
    }
  }};

  /* Separate transitions for only color properties */
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:hover {
    background-color: ${(props) =>
      props.$disabled ? "rgba(45, 45, 45, 0.7)" : "rgba(50, 50, 50, 0.8)"};
    border-color: ${(props) => {
      if (props.$disabled)
        return props.$error ? props.theme.colors.error : "transparent";
      if (props.$error) return props.theme.colors.error;
      if (props.$isOpen) return props.theme.colors.primary;
      return props.theme.colors.text.disabled;
    }};
  }

  &:focus-within {
    background-color: rgba(38, 38, 38, 0.9); // Dunklerer Hintergrund im Fokus
    border-color: ${(props) => {
      if (props.$error) return props.theme.colors.error;
      return props.theme.colors.primary;
    }};
  }
`;

const MultiSelectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  cursor: pointer;
  min-height: inherit;
`;

const Placeholder = styled.span`
  color: ${(props) => props.theme.colors.text.disabled};
  font-size: ${(props) => props.theme.typography.fontSize.md};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.xs};
  flex: 1;
  overflow: hidden;
`;

const Tag = styled.div<{
  $size: "small" | "medium" | "large";
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      default:
        return `2px ${props.theme.spacing.sm}`;
    }
  }};
  background-color: ${(props) => `${props.theme.colors.primary}30`};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.typography.fontSize.xs;
      case "large":
        return props.theme.typography.fontSize.md;
      default:
        return props.theme.typography.fontSize.sm;
    }
  }};
  color: ${(props) => props.theme.colors.primary};
  white-space: nowrap;

  svg {
    cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};

    &:hover {
      color: ${(props) => !props.$disabled && props.theme.colors.text.primary};
    }
  }
`;

const MoreTagsIndicator = styled.div<{
  $size: "small" | "medium" | "large";
}>`
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      default:
        return `2px ${props.theme.spacing.sm}`;
    }
  }};
  font-size: ${(props) => {
    switch (props.$size) {
      case "small":
        return props.theme.typography.fontSize.xs;
      case "large":
        return props.theme.typography.fontSize.md;
      default:
        return props.theme.typography.fontSize.sm;
    }
  }};
  color: ${(props) => props.theme.colors.text.secondary};
  white-space: nowrap;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  border-radius: 50%;
  padding: ${(props) => props.theme.spacing.xs};
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

const ArrowIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.secondary};
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

const OptionsContainer = styled.div<{
  $size: "small" | "medium" | "large";
}>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: ${(props) => props.theme.zIndex.dropdown};
  max-height: 300px;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 2px solid ${(props) => props.theme.colors.divider};
  margin-top: ${(props) => props.theme.spacing.xs};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.15s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OptionItem = styled.div<{
  $isSelected: boolean;
  $isDisabled: boolean | undefined;
  $size: "small" | "medium" | "large";
}>`
  display: flex;
  align-items: center;
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.md} ${props.theme.spacing.lg}`;
      default:
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
    }
  }};
  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
  background-color: ${(props) =>
    props.$isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  color: ${(props) => {
    if (props.$isDisabled) return props.theme.colors.text.disabled;
    return props.theme.colors.text.primary;
  }};
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  font-size: ${(props) => props.theme.typography.fontSize.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      !props.$isDisabled &&
      (props.$isSelected
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(255, 255, 255, 0.05)")};
  }
`;

const Checkbox = styled.div<{
  $isChecked: boolean;
  $isDisabled: boolean | undefined;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 2px solid
    ${(props) =>
      props.$isChecked
        ? props.theme.colors.primary
        : props.theme.colors.divider};
  background-color: ${(props) =>
    props.$isChecked ? props.theme.colors.primary : "transparent"};
  transition-property: background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  ${(props) =>
    props.$isChecked &&
    `
    &:after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background-color: #000;
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }
  `}
`;

const OptionLabel = styled.span`
  flex: 1;
`;

const EmptyOption = styled.div<{
  $size: "small" | "medium" | "large";
}>`
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
      case "large":
        return `${props.theme.spacing.md} ${props.theme.spacing.lg}`;
      default:
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
    }
  }};
  color: ${(props) => props.theme.colors.text.disabled};
  font-style: italic;
  text-align: center;
`;

const HelperText = styled.span<{ $error: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  margin-top: ${(props) => props.theme.spacing.xs};
  color: ${(props) =>
    props.$error
      ? props.theme.colors.error
      : props.theme.colors.text.secondary};
`;

const HiddenSelect = styled.select`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default MultiSelect;
