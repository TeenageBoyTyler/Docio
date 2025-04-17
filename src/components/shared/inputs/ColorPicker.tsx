import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface ColorOption {
  /**
   * Unique identifier for the color
   */
  id: string;

  /**
   * Color value in hex format (e.g., "#4285F4")
   */
  value: string;

  /**
   * Optional display label for the color
   */
  label?: string;
}

export interface ColorPickerProps {
  /**
   * Callback when color is selected
   */
  onSelectColor: (color: string) => void;

  /**
   * Callback when color picker is canceled
   */
  onCancel?: () => void;

  /**
   * Array of color options
   * @default Standard color palette
   */
  colors?: ColorOption[];

  /**
   * Label text displayed above the color picker
   */
  label?: string;

  /**
   * Helper text displayed below the color picker
   */
  helperText?: string;

  /**
   * Error state or error message
   */
  error?: boolean | string;

  /**
   * Size of the color options
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the color picker should take the full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * ColorPicker component for selecting from a grid of color options
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  onSelectColor,
  onCancel,
  colors,
  label = "Select a color:",
  helperText,
  error,
  size = "medium",
  disabled = false,
  fullWidth = false,
  className,
}) => {
  // Default color palette if none provided
  const defaultColors: ColorOption[] = [
    { id: "blue", value: "#4285F4" },
    { id: "green", value: "#0F9D58" },
    { id: "red", value: "#DB4437" },
    { id: "yellow", value: "#F4B400" },
    { id: "purple", value: "#AB47BC" },
    { id: "teal", value: "#009688" },
    { id: "orange", value: "#FF5722" },
    { id: "pink", value: "#E91E63" },
  ];

  // Use provided colors or defaults
  const colorOptions = colors || defaultColors;

  // Determine if we're showing an error
  const showError = error !== undefined && error !== false;
  const errorMessage = typeof error === "string" ? error : "";

  // Handle color selection
  const handleColorSelect = (colorValue: string) => {
    if (!disabled) {
      onSelectColor(colorValue);
    }
  };

  // Determine color option size based on size prop
  const getColorSize = () => {
    switch (size) {
      case "small":
        return 32;
      case "large":
        return 48;
      default:
        return 40;
    }
  };

  return (
    <Container
      className={className}
      $fullWidth={fullWidth}
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {label && <Label>{label}</Label>}

      <ColorsGrid $size={size}>
        {colorOptions.map((color) => (
          <ColorOption
            key={color.id}
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            $color={color.value}
            $size={getColorSize()}
            $disabled={disabled}
            onClick={() => handleColorSelect(color.value)}
            disabled={disabled}
            type="button"
            aria-label={color.label || `Color ${color.id}`}
            title={color.label || `Color ${color.id}`}
          />
        ))}
      </ColorsGrid>

      {onCancel && (
        <CancelButton onClick={onCancel} disabled={disabled} type="button">
          Cancel
        </CancelButton>
      )}

      {(helperText || errorMessage) && (
        <HelperText $error={showError}>{errorMessage || helperText}</HelperText>
      )}
    </Container>
  );
};

// Styled components
const Container = styled.div<{ $fullWidth: boolean }>`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  margin-bottom: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.divider};
`;

const Label = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ColorsGrid = styled.div<{ $size: "small" | "medium" | "large" }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ColorOption = styled.button<{
  $color: string;
  $disabled: boolean;
  $size: number;
}>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  border: 2px solid transparent;
  transition: all ${(props) => props.theme.transitions.short};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  padding: 0;

  &:hover {
    border-color: ${(props) => !props.$disabled && "white"};
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all ${(props) => props.theme.transitions.short};
  display: block;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
    background-color: ${(props) => props.theme.colors.divider};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelperText = styled.span<{ $error: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  margin-top: ${(props) => props.theme.spacing.xs};
  color: ${(props) =>
    props.$error
      ? props.theme.colors.error
      : props.theme.colors.text.secondary};
`;

export default ColorPicker;
