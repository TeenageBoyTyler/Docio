import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

export interface DropdownOption {
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

export interface DropdownProps {
  /**
   * Array of options for the dropdown
   */
  options: DropdownOption[];

  /**
   * Current selected value
   */
  value?: string | number;

  /**
   * Callback when value changes
   */
  onChange?: (value: string | number) => void;

  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;

  /**
   * Label text displayed above the dropdown
   */
  label?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Helper text displayed below the dropdown
   */
  helperText?: string;

  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the dropdown should take the full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Size of the dropdown
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

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
 * Dropdown component for selecting from a list of options
 */
const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  size = "medium",
  className,
  id,
  name,
}) => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    DropdownOption | undefined
  >(options.find((option) => option.value === value));

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if we're showing an error
  const showError = error !== undefined && error !== false;
  const errorMessage = typeof error === "string" ? error : "";

  // Update selected option when value prop changes
  useEffect(() => {
    const option = options.find((option) => option.value === value);
    setSelectedOption(option);
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    setIsOpen(false);

    if (onChange) {
      onChange(option.value);
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

  return (
    <Container className={className} $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}

      <DropdownContainer
        ref={dropdownRef}
        $size={size}
        $error={showError}
        $disabled={disabled}
        $isOpen={isOpen}
      >
        <DropdownHeader onClick={toggleDropdown} $hasValue={!!selectedOption}>
          <SelectedText>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectedText>
          <DropdownArrow />
        </DropdownHeader>

        {isOpen && (
          <OptionsContainer $size={size}>
            {options.map((option) => (
              <OptionItem
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                $isSelected={selectedOption?.value === option.value}
                $isDisabled={option.disabled}
                $size={size}
              >
                {option.label}
              </OptionItem>
            ))}

            {options.length === 0 && (
              <EmptyOption $size={size}>No options available</EmptyOption>
            )}
          </OptionsContainer>
        )}
      </DropdownContainer>

      {/* Hidden select element for form submission */}
      <HiddenSelect
        id={id}
        name={name}
        value={selectedOption?.value || ""}
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

const DropdownContainer = styled.div<{
  $size: "small" | "medium" | "large";
  $error: boolean;
  $disabled: boolean;
  $isOpen: boolean;
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

const DropdownHeader = styled.div<{ $hasValue: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  cursor: pointer;
  color: ${(props) =>
    props.$hasValue
      ? props.theme.colors.text.primary
      : props.theme.colors.text.disabled};
`;

const SelectedText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
    if (props.$isSelected) return props.theme.colors.primary;
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

export default Dropdown;
